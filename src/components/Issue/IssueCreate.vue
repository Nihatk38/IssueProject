<template>
    <div v-if="IssueInfo.Status >0 &&  resultVersion.length>1" class="p-3">
        <Dropdown class="dr-solid border-1 border-round text-center  p-dropdown-trigger mb-2 "
                  v-model="versionInfo" :options="resultVersion"  optionValue="Id" optionLabel="VersionNo" placeholder="Önceki Revizyonları İncele"/>
    </div>
<Dialog :content-style="' background-color: rgba(0, 0, 0, 0.1);'
 " :visible="IsLoading" :modal="true"   :show-header="false" >
  <p class="m-auto mt-2">Yükleniyor..</p>
  <div class="m-auto w-full">
    <ProgressSpinner  ></ProgressSpinner>
  </div>
</Dialog>
  <scenario-information
      :scenarios="IssueInfo"
      :submitted="submitted"
      :status="IssueInfo.Status"
      :data="data"
      :comingName="comingName"
      :comingDepartment="comingDepartment"
      :comingRole="comingRole"
  >
    <template v-slot:title>
      <small v-if="(v$.TitleId.$invalid && submitted)" class="p-error">Konu Boş Bırakılmaz.</small>
    </template>
    <template v-slot:summary>
      <small v-if="(v$.Summary.$invalid && submitted)" class="p-error">Kısa Açıklama Boş Bırakılamaz.</small>
    </template>
    <template v-slot:roleinfos>
      <small v-if="(v$.IssueRoleInfos.$invalid && submitted)" class="p-error">Aktörler Boş Bırakılamaz.</small>
    </template>

  </scenario-information>

  <precondition
      :precondition-list="IssueInfo.IssuePreconditionInfos"
      :status="IssueInfo.Status"
  ></precondition>


  <activity-list
      :IssueActivityInfos="IssueInfo.IssueActivitiyInfos"
      :status="IssueInfo.Status"
      :submitted="submitted"
  >
    <template v-slot:activitiyinfos>
      <div v-if="(v$.IssueActivitiyInfos.$invalid && submitted )" class="p-error mb-2">Temel Akış
        Boş Bırakılamaz.
      </div>
    </template>
  </activity-list>
  <notes
      :note-list="IssueInfo.IssueNoteInfos"
      :status="IssueInfo.Status"
  ></notes>

  <relevant-departments
      :departments="IssueInfo.IssueRelevantDepartmentInfos"
      :status="status"
      :submitted="submitted"
      :UserId="UserId"
  ></relevant-departments>

  <div class="card border-round cardColor1">
    <div v-if="IssueInfo.IssueAttachmentInfos.length>0"
         class=" card mb-2 border-round ">

      <div class=" border-1 border-200 p-3">
        <div class="border-bottom-1 border-500 mb-3 p-1">
          Dosya Adı
        </div>

        <div class="text-gray-500 mb-2 border-1 border-300 p-1 " v-for="file in IssueInfo.IssueAttachmentInfos" :key="file.UniqueName">
          <div class="p-fluid grid">
            <div class="col-11 ">
<!--          <span  v-if="data>0"><a target="_blank" :href="`file:///c://Project/Web/Resources/Files/${file.UniqueName}`">{{file.FileName}}</a></span>
          <span  v-else><a  target="_blank" :href="`file:///c://Project/Web/Resources/temp/${file.UniqueName}`">{{file.FileName}}</a></span>-->

              <span v-if="data>0"><a  target="_blank" :href="`https://kavramsal.formsunger.com.tr/Resources/Files/${file.UniqueName}`">{{file.FileName}}</a></span>
              <span v-else><a target="_blank" :href="`https://kavramsal.formsunger.com.tr/Resources/temp/${file.UniqueName}`">{{file.FileName}}</a></span>
            </div>
            <div class="col-1">
              <Button class=" w-5 text-white p-button p-button-danger text-center"
                      :disabled="(IssueInfo.Status>0 && IssueInfo.Status<9) || IsManager || nameData!=tokenInfo"
                      @click="deleteFile(file.UniqueName)">X</Button>
            </div>
          </div>

        </div>
      </div>

    </div>

    <FileUpload :disabled="IssueInfo.Status>0 && IssueInfo.Status<9" :maxFileSize="1000000" :multiple="true"
                :url="rootPath+'/api/Issue/upload'"
                name="IssueAttachmentInfos" :custom-upload="true" @uploader="onUpload"
                class="p-button-text"
                ref="fileUpload">
      <template #empty>
        <p>Dosyaları yüklemek için buraya sürükleyip bırakın..</p>
      </template>
    </FileUpload>
  </div>
  <div class="grid ">
    <div class="col-2 p-fluid">
      <router-link to="/issueList">
        <Button class="p-button-text  col-4 ml-2">
          <i class="pi pi-fw pi-backward mr-2"></i>Geri
        </Button>
      </router-link>
    </div>
    <div v-if="IssueInfo.Status === 1 || IssueInfo.Status === 2 || IssueInfo.Status === 3 || IssueInfo.Status === 4 " class="col-10 grid ">

        <div class="col-offset-8 col-2 p-fluid">
          <Button v-if=" CheckCommit === 'true'" class="w-full p-button-success" label="Onayla"
                  @click="answerIssue"/>
        </div>
        <div class="col-2 p-fluid">
          <Button v-if=" CheckCommit === 'true'" class="w-full p-button-danger "
                  label="Reddet"
                  @click="rejectIssue"/>
        </div>


    </div>

    <div v-else class="col-10 grid">

        <div class="col-offset-8 col-2 p-fluid" v-if="maxVersionNo == IssueInfo.VersionNo  || status == 0 || status ==null">
          <Button v-if=" (activeIndex != 1 && !IsManager) && (nameData == tokenInfo || data == null) "  class="w-full p-button-success " label="Kaydet" @click="save"/>
        </div>

        <div class="col-2 p-fluid" v-if="maxVersionNo == IssueInfo.VersionNo  || status == 0 || status ==null">
          <Button v-if=" (activeIndex != 1 && !IsManager) && (nameData == tokenInfo || data == null) "  class="w-full p-button-success p-button-outlined " label="Kaydet & Onayla"
                  @click="saveAndConfirm"/>
        </div>


    </div>
  </div>
  <issue-reject-dialog
      v-if="openRejectDialog"
      :close-dialog="closeRejectDialog"
      :close="openRejectDialog"
      :data="data">
  </issue-reject-dialog>

</template>

<script>

import {computed, ref, watch} from "vue";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";

import router from "@/router";

import ActivityList from "@/components/Issue/IssueCreate/ActivityList";
import ScenarioInformation from "./IssueCreate/ScenarioInformation";
import RelevantDepartments from "./IssueCreate/RelevantDepartments";
import Precondition from "./IssueCreate/Precondition";
import Notes from "./IssueCreate/Notes";
import IssueRejectDialog from "@/components/Issue/IssueCreate/IssueRejectDialog";
import AuthService from "@/service/auth.service";
import IssuesService from "@/service/issueService";
import issueService from "@/service/issueService";
import functions from "@/auxiliary/directive/functions";

export default {
  props: ['constStatus','data', 'nameData', 'comingName', 'comingDepartment', 'comingRole','activeIndex','CheckCommit','UserId','status'],
  components: {ActivityList, Precondition, RelevantDepartments, ScenarioInformation, Notes, IssueRejectDialog},
  setup(props) {
    const confirmModel = ref({
      IssueId: '',
      Description: ''
    })
    const openRejectDialog = ref(false)
    const submitted = ref(false)
    const IssueInfo = ref({})
    const IssueFile = ref(null)
    const urlUpload = ref('')
    const showButton = ref(false)
    const IsLoading = ref(false)
    const versionInfo = ref('');
    const resultVersion = ref({});
    const arrayErrors = ref([]);
    const token = AuthService.isAuth();
    const IsManager = ref(false);
    const IsVisible = ref(false);
    const fileUpload = ref(null)
    const maxVersionNo=ref(null)
    const rules = computed(() => {
      return {
        IssueRoleInfos: {required},
        Summary: {required},
        TitleId: {required},
        IssueActivitiyInfos: [{
          IssueActivityDetailInfos: [{
            Definition: {required},
            RoleId: {required}
          }]
        }]
      }
    })
    const toast = useToast()
    const confirm = useConfirm()
    const rootPath = computed(() => {
      return process.env.VUE_APP_API_URL
    })

    const ResetValue = () => {
      IssueInfo.value = {
        IssueNoteInfos: [],
        IssueRelevantDepartmentInfos: [],
        IssueAttachmentInfos: [],
        IssueActivitiyInfos: [],
        IssuePreconditionInfos: [],
        IssueRoleInfo: [],
        IsSaveWithConfirm: false
      }
    }
    const closeRejectDialog = () => {
      openRejectDialog.value = false
    }
    IsManager.value = token.IsManager;
    IsVisible.value = token.IsVisible;
    ResetValue();
      if(props.data !=null){
        IssuesService.getVersionInfo(props.data).then( response => {
          if(response.data.Payload == null){
            resultVersion.value =[{
              VersionNo:'Önceki Revizyon Bulunmamaktadır! '
            }]
            maxVersionNo.value =0
          }
          else{
            resultVersion.value =  response.data.Payload.map(f=>{
              return{
                Id :f.Id,
                VersionNo:'Version ' + f.VersionNo
              }
            })

            maxVersionNo.value = Math.max.apply(Math, response.data.Payload.map(function(o) { return o.VersionNo; }))
          }
        })
      }



    const back = () =>{
      router.push("/issueList")
    }
    const v$ = useVuelidate(rules, computed(()=>IssueInfo.value))
    const tokenInfo = ref(AuthService.getFromTokenFullName());

    const onUpload = (e) => {
      let formData = new FormData();
      e.files.forEach((file) =>
        formData.append('files',file)
      );

      issueService.uploadFile(formData)
      .then((response) =>
          {
              if (!response.data.Success)
                toast.add({severity: 'error', summary: 'Başarısız', detail: 'Dosya Yüklenemedi Lütfen Yüklemek İstediğiniz Dosyayı Kontrol Edin! ', life: 5000});

              toast.add({severity: 'success', summary: 'Başarılı', detail: 'Dosya Eklendi ', life: 5000});
              IssueInfo.value.IssueAttachmentInfos =  [...IssueInfo.value.IssueAttachmentInfos,...response.data.Payload];
            fileUpload.value.clear();
          }
      );
    }

    const saveAndConfirm = () => {
      IssueInfo.value.IsSaveWithConfirm = true
      save()
    }
    const deleteFile = (fileInfo) =>{

      IssuesService.deleteFile(fileInfo,props.data == null ? 0:props.data).then(response =>{
        if(response.data.Success){

          IssueInfo.value.IssueAttachmentInfos.splice(findIndexByIdContact(fileInfo),1)
          toast.add({severity:'warn',summary:'Başarılı',detail:'Dosya Silindi',life:3000})

        }else{
          toast.add({severity:'error',summary:'Başarısız',detail:'Dosya Silinemedi',life:3000})
        }
      })
    }
    const findIndexByIdContact = (fileInfo) => {
      let index = -1;
      for (let i = 0; i < IssueInfo.value.IssueAttachmentInfos.length; i++) {
        if (IssueInfo.value.IssueAttachmentInfos[i].UniqueName === fileInfo) {
          index = i;
          break;
        }
      }

      return index;
    };
    const save = () => {
      submitted.value = true;
      v$.value.$validate()
      arrayErrors.value.length = (v$.value.$errors.length)

      if (!v$.value.$error) {
        IsLoading.value=true;

        if(IssueInfo.value.IssueRelevantDepartmentInfos.length != null && IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId){
            IssueInfo.value.IssueRelevantDepartmentInfos = IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId.map((m) => {
              return {
                DepartmentId: m.Id,

              }
            })

        }
       if(IssueInfo.value.IssueRoleInfos.length>0){
         IssueInfo.value.IssueRoleInfos = IssueInfo.value.IssueRoleInfos.map((m) => {
           return {
             RoleId: m.Id
           }
         })
       }

         if(props.data>0){
           console.log(props.status)
           if(props.status == 9){
             IssuesService.revisionIssue(IssueInfo.value)
                 .then(response => {
                   if (response.data.Success) {
                     ResetValue();
                     setTimeout(()=>{
                       toast.add({severity: 'success', summary: 'Başarılı', detail: 'Yeni Revizyon Oluşturuldu', life: 3000});
                     },500)
                     router.push('/issueList')
                   } else {
                     setTimeout(()=>{
                       toast.add({severity: 'error', summary: 'Hata', detail: 'Beklenmedik Bir Hata Oluştu.Lütfen Daha Sonra Tekrar Deneyin.', life: 3000});
                     },500)
                   }
                 }).catch(e => {
               console.log(e)
             }).finally(()=> {
               IsLoading.value = false;
             })
           }else{
             console.log("update3",IssueInfo.value)
             IssuesService.updateIssue(IssueInfo.value)
                 .then(response => {
                   if (response.data.Success) {
                     ResetValue();
                     setTimeout(()=>{
                       toast.add({severity: 'success', summary: 'Başarılı', detail: 'İş Kaydı Güncellendi', life: 3000});
                     },500)
                     router.push('/issueList')
                   } else {
                     setTimeout(()=>{
                       toast.add({severity: 'error', summary: 'Hata', detail: 'Beklenmedik Bir Hata Oluştu.Lütfen Daha Sonra Tekrar Deneyin.', life: 3000});
                     },500)
                   }
                 }).catch(e => {
               console.log(e)
             }).finally(()=> {
               IsLoading.value = false;
             })
           }

         }
         else{
           IssuesService.addIssue(IssueInfo.value)
               .then(response => {
                 if (response.data.Success) {
                   ResetValue();
                   setTimeout(()=>{
                     toast.add({severity: 'success', summary: 'Başarılı', detail: 'İş Kaydı Oluşturuldu', life: 3000});

                   },500)
                   router.push('/issueList')

                 } else {
                   setTimeout(()=>{
                     toast.add({severity: 'error', summary: 'Hata', detail: 'Beklenmedik Bir Hata Oluştu.Lütfen Daha Sonra Tekrar Deneyin.', life: 3000});
                   },500)

                 }
               }).catch(e => {
             console.log(e)
           }).finally(()=> {
             IsLoading.value = false;
           })
         }

      }else {
        window.scrollTo(0, 0);
        IssueInfo.value.IsSaveWithConfirm = false
        toast.add({severity: 'error', summary: 'Hata', detail: 'İş Kaydı Oluşturulamadı.Lütfen Zorunlu Alanları Doldurun.', life: 3000});
      }

    }

    if (props.data > 0) {
      showButton.value = true
      IsLoading.value = true;
      IssuesService.getSelectedIssue(props.data).then(response => {
        if (response.data.Success) {

          IssueInfo.value = response.data.Payload


          console.log("ıssue",IssueInfo.value)
          IssueInfo.value.Status = functions.statusCheck(IssueInfo.value.Status)
           IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId = response.data.Payload.IssueRelevantDepartmentInfos.map(f => {
            return {
              Definition: f.Department.Definition,
              Id: f.DepartmentId,

            }
          })


              console.log("ıssue3",IssueInfo.value)
          IssueInfo.value.IssueRoleInfos = response.data.Payload.IssueRoleInfos.map(f => {
            return {
              Id: f.Role.Id,
              Definition: f.Role.Definition
            }
          })
        } else
          ResetValue();
      }).finally(()=>{
        IsLoading.value = false;
      })
    }
    watch(()=>versionInfo.value,(value)=>{
      if(value != null){
        IsLoading.value=true;
        IssuesService.getSelectedIssue(value).then(response => {
          if (response.data.Success) {
            IssueInfo.value = response.data.Payload

            IssueInfo.value.Status = functions.statusCheck(IssueInfo.value.Status)
            toast.add({severity: 'info',  detail: IssueInfo.value.VersionNo +' Numaralı Revizyon Bilgileri Getirildi.Lütfen Revizyon Bilgilerini İnceleyin.', life: 5000});
            IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId = response.data.Payload.IssueRelevantDepartmentInfos.map(f => {
              return {
                Definition: f.Department.Definition,
                Id: f.DepartmentId
              }
            })
            IssueInfo.value.IssueRoleInfos = response.data.Payload.IssueRoleInfos.map(f => {
              return {
                Id: f.Role.Id,
                Definition: f.Role.Definition
              }
            })
          } else
            ResetValue();
        }).finally(()=>{
          IsLoading.value = false;
        })
      }

    })
    const rejectIssue = () => {
      openRejectDialog.value = true
    }

    const closeDialog = () => {
      openRejectDialog.value = false

    }

    const answerIssue = () => {
      confirmModel.value.IssueId = props.data;
      confirm.require({
        message: "Talebi onaylamak istediğinizden emin misiniz?",
        header: "Onay Ver",
        icon: "pi pi- exclamation-triangle",
        accept: () => {
          IssuesService.IssueConfirm(confirmModel.value).then(response => {
            if (response.Success) {
              setTimeout(()=>{
                toast.add({severity: 'success', summary: 'Onaylandı', detail: 'Başarılı', life: 3000});
              },500)
            } else {
              setTimeout(()=>{
                toast.add({severity: 'error', summary: response.Information, detail: 'Başarısız', life: 5000});
              },500)

            }
          }).finally(()=>{
            IsLoading.value = false;
            router.push('/issueList')
          })
        },
        reject: () => {
          setTimeout(()=>{
            toast.add({severity: 'warn', summary: 'Onaylanamadı', detail: 'Başarısız', life: 3000});
          },400)

        }
      })
    }


    return {
      IssueInfo,
      v$,
      save,
      rootPath,
      fileUpload,
      urlUpload,
      onUpload,
      IssueFile,
      showButton,
      answerIssue,
      submitted,
      openRejectDialog,
      rejectIssue,
      closeDialog,
      confirmModel,
      versionInfo,
      resultVersion,
      closeRejectDialog,
      saveAndConfirm,
      back, tokenInfo, arrayErrors,
      rules,
      deleteFile,
      findIndexByIdContact,
      IsLoading,
      IsManager,
      IsVisible,
      maxVersionNo
    }
  }
}
</script>
<style scoped>
.dr-solid{
   border:1px solid darkorange;
    box-shadow: 2px 3px 5px rgba(0,0,0,.02), 0px 0px 2px rgba(0,0,0,.05), 0px 1px 4px rgba(0,0,0,.08);
}
</style>