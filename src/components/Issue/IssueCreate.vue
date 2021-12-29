<template>
  <Dropdown class="p-dropdown mb-2" v-if="status==='9' " v-model="versionInfo" :options="resultVersion" optionValue="Id"
            optionLabel="VersionNo" placeholder="Önceki Revizyonları İncele"/>

  <scenario-information
      :scenarios="IssueInfo"
      :submitted="submitted"
      :status="status"
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
      :status="status"
  ></precondition>


  <activity-list
      :IssueActivityInfos="IssueInfo.IssueActivitiyInfos"
      :status="status"
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
      :status="status"
  ></notes>

  <relevant-departments
      :departments="IssueInfo.IssueRelevantDepartmentInfos"
      :status="status"
      :submitted="submitted"
  ></relevant-departments>

  <div class="card cardColor1">
    <!--    <div v-if="IssueInfo.IssueAttachmentInfos.length>0"
             class=" card mb-2  ">
          <div class="border-1 border-20 ">
            <div class="ml-4">
              Dosya Adı
            </div>
          </div>
        <div v-for="file in IssueInfo.IssueAttachmentInfos" :key="file.UniqueName">
          {{file.FileName}}
        </div>
        </div>-->

    <FileUpload :disabled="status>0 && status<9" :maxFileSize="1000000" :multiple="true"
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

    <div v-if="status === '1' || status === '2' || status === '3' || status === '4'" class="col-10 grid ">
      <div class="col-offset-8 col-2 p-fluid">
        <Button v-if="nameData != tokenInfo && status>0" class="w-full p-button-success" label="Onayla"
                @click="answerIssue"/>
      </div>
      <div class="col-2 p-fluid">
        <Button v-if="nameData != tokenInfo && status>0" class="w-full p-button-danger "
                label="Reddet"
                @click="rejectIssue"/>
      </div>
    </div>

    <div v-else class="col-10 grid">
      <div class="col-offset-8 col-2 p-fluid">
        <Button class="w-full p-button-success " label="Kaydet" @click="save"/>
      </div>

      <div class="col-2 p-fluid">
        <Button class="w-full p-button-success p-button-outlined " label="Kaydet & Onayla"
                @click="saveAndConfirm"/>
      </div>
    </div>
  </div>

  <issue-reject-dialog
      v-if="openRejectDialog"
      :close-dialog="closeRejectDialog"
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

export default {
  props: ['data', 'status', 'nameData', 'comingName', 'comingDepartment', 'comingRole'],
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
    const versionInfo = ref('');
    const resultVersion = ref({});
    const arrayErrors = ref([]);

    const fileUpload = ref(null)

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

    ResetValue();
    IssuesService.getVersionInfo(props.data).then(response => {
      resultVersion.value = response.data.Payload
    })
    const back = () => {
      router.push("/issueList")
    }
    const v$ = useVuelidate(rules, computed(() => IssueInfo.value))
    const tokenInfo = ref(AuthService.getFromTokenFullName());

    const onUpload = (e) => {

      console.log(fileUpload.value);
      let formData = new FormData();

      e.files.forEach((file) =>
          formData.append('files', file)
      );

      issueService.uploadFile(formData)
          .then((response) => {
                if (!response.data.Success)
                  toast.add({
                    severity: 'error',
                    summary: 'Başarısız',
                    detail: 'Dosya Yüklenemedi Lütfen Yüklemek İstediğiniz Dosyayı Kontrol Edin! ',
                    life: 5000
                  });

                toast.add({severity: 'success', summary: 'Başarılı', detail: 'Dosya Eklendi ', life: 5000});
                IssueInfo.value.IssueAttachmentInfos = response.data.Payload;

                fileUpload.value.clear();
              }
          );

      /*
       if(e.xhr.responseText == "MUKERRERKAYIT")
         toast.add({severity: 'info', summary: 'Başarısız', detail: 'Bu Dosya isminden Daha Önceden Kayıt Tespit Edildi.Lütfen Başka Bir Dosya Ekleyin Veya Dosya İsmini Değiştirin!', life: 5000});
       else if (e.xhr.responseText == "ONAY"){
         toast.add({severity: 'success', summary: 'Başarılı', detail: 'Dosya Eklendi', life: 3000});
         IssueInfo.value.IssueAttachmentInfos = e.files.map((f) => {
           return {
             FileName: f.name,
           }
         })
       }else if(e.xhr.responseText == "BASARISIZ"){
         toast.add({severity: 'error', summary: 'Başarısız', detail: 'Dosya Yüklenemedi Lütfen Yüklemek İstediğiniz Dosyayı Kontrol Edin! ', life: 5000});
       }
       */
    }

    const saveAndConfirm = () => {
      IssueInfo.value.IsSaveWithConfirm = true
      save()
    }

    const save = () => {
      submitted.value = true;
      v$.value.$validate()
      arrayErrors.value.length = (v$.value.$errors.length)
      console.log("v$ yeri", v$.value)
      if (!v$.value.$error) {
        if (IssueInfo.value.IssueRelevantDepartmentInfos.length != null && IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId) {
          IssueInfo.value.IssueRelevantDepartmentInfos = IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId.map((m) => {
            return {
              DepartmentId: m.Id
            }
          })

        }
        if (IssueInfo.value.IssueRoleInfos.length > 0) {
          IssueInfo.value.IssueRoleInfos = IssueInfo.value.IssueRoleInfos.map((m) => {
            return {
              RoleId: m.Id
            }
          })
        }

        IssuesService.addIssue(IssueInfo.value)
            .then(response => {
              if (response.data.Success) {
                ResetValue();

                toast.add({severity: 'success', summary: 'Başarılı', detail: 'İş Kaydı Oluşturuldu', life: 3000});

              } else {
                toast.add({
                  severity: 'error',
                  summary: 'Hata',
                  detail: 'Beklenmedik Bir Hata Oluştu.Lütfen Daha Sonra Tekrar Deneyin.',
                  life: 3000
                });
              }
            }).catch(e => {
          console.log(e)
        })
        router.push("/issueList")
      } else {
        window.scrollTo(0, 0);
        IssueInfo.value.IsSaveWithConfirm = false
        toast.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'İş Kaydı Oluşturulamadı.Lütfen Zorunlu Alanları Doldurun.',
          life: 3000
        });
      }

    }

    if (props.data > 0) {
      showButton.value = true
      IssuesService.getSelectedIssue(props.data).then(response => {
        if (response.data.Success) {

          IssueInfo.value = response.data.Payload
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
      })
    }
    watch(() => versionInfo.value, (value) => {
      console.log("selected version", value)
      IssuesService.getSelectedIssue(value).then(response => {
        if (response.data.Success) {
          IssueInfo.value = response.data.Payload

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
      })
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
              toast.add({severity: 'success', summary: 'Onaylandı', detail: 'Başarılı', life: 3000});
              router.push("/issueList")

            } else {
              toast.add({severity: 'error', summary: response.Information, detail: 'Başarısız', life: 5000});
            }
          })
        },
        reject: () => {
          toast.add({severity: 'warn', summary: 'Onaylanamadı', detail: 'Başarısız', life: 3000});
        }
      })
    }


    return {
      IssueInfo,
      v$,
      save,
      rootPath,
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
      back, tokenInfo, arrayErrors
      , rules
    }
  }
}
</script>