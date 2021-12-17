<template>


  <h5 style="text-align: center">KAYIT OLUŞTURMA SAYFASI</h5>
  <scenario-information
      :scenarios="IssueInfo"
      :submitted="submitted"
  ></scenario-information>

  <precondition
      :precondition-list="IssueInfo.IssuePreconditionInfos"
  ></precondition>


  <stream-list
      :IssueActivityInfos="IssueInfo.IssueActivitiyInfos"
  ></stream-list>

  <notes
      :note-list="IssueInfo.IssueNoteInfos"

  ></notes>

  <relevant-departments
      :departments="IssueInfo.IssueRelevantDepartmentInfos"

  ></relevant-departments>

  <div>
    <FileUpload :maxFileSize="1000000" :multiple="true" :url="'http://10.0.0.206:12/api/Issue/upload'"
                accept="image/*" name="IssueAttachmentInfos[]" @upload="onUpload">
      <template #empty>
        <p>Dosyaları yüklemek için buraya sürükleyip bırakın..</p>
      </template>
    </FileUpload>
  </div>

  <div v-if="status==='calisiyor'" class="mt-2">
    <Button class="col-4 col-offset-4 p-button-success p-button-outlined " label="Kaydet ve Onayla"
            @click="saveAndConfirm"/>
  </div>


  <div v-else-if="status==='BimOnayBekleme'||status==='BimOnay'||status==='DepartmanOnay'||status==='YazanAmirOnay'"
       class="mt-2">
    <Button class="col-4 p-button-danger " label="Reddet" @click="rejectIssue"/>

    <Dialog v-model:visible="openRejectDialog" :modal="true" :style="{width:'800px', }" class="p-fluid"
            header="Red Sebebi">
      <div class="p-field">
        <Textarea id="Precondition" v-model="newDescription"/>
      </div>
      <template #footer>
        <Button class="p-button-danger p-button-outlined" icon="pi pi-times" label="İptal" @click="closeDialog"/>
        <Button class="p-button-success p-button-outlined" icon="pi pi-check" label="Gönder" @click="rejectButton"/>
      </template>
    </Dialog>
    <Button class="col-4 col-offset-4 p-button-success" label="Onayla" @click="answerIssue"/>
  </div>

  <div v-else class="mt-2">
    <Button class="col-4 p-button-success p-button-outlined" label="Kaydet" @click="save"/>
    <Button class="col-4 col-offset-4 p-button-success p-button-outlined " label="Kaydet ve Onayla"
            @click="saveAndConfirm"/>
  </div>

</template>

<script>

import ScenarioInformation from "./IssueCreate/ScenarioInformation";
import RelevantDepartments from "./IssueCreate/RelevantDepartments";
import Precondition from "./IssueCreate/Precondition";
import Notes from "./IssueCreate/Notes";
import {onMounted, ref} from "vue";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";
import StreamList from "./IssueCreate/StreamList";
import IssuesService from "../../service/issueService";
import {useConfirm} from "primevue/useconfirm";
import {usePrimeVue} from "primevue/config";
import router from "../../router";

export default {
  props: ['data', 'status'],
  components: {Precondition, RelevantDepartments, ScenarioInformation, Notes, StreamList},
  setup(props) {
    const newDescription = ref('')
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
    const rules = {
      IssueInfo: {required}
    }
    const toast = useToast()
    const confirm = useConfirm()

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
    ResetValue();


    const v$ = useVuelidate(rules, IssueInfo.value)

    const changeToTurkish = () => {
      const primevue = usePrimeVue();
      primevue.config.locale.choose = 'Resim Seç'
      primevue.config.locale.upload = 'Yükle'
      primevue.config.locale.cancel = 'İptal'
    }
    onMounted(() => {
      changeToTurkish()
    })


    const onUpload = (e) => {
      IssueInfo.value.IssueAttachmentInfos = e.files.map((f) => {
        return {
          FileName: f.name,
        }
      })
      //urlUpload.value= 'http://10.0.0.204:5001/api/Issue/add';

    }

    /*const stream =(data) =>{
      console.log("dataa",JSON.stringify(data))
      IssueInfo.value.IssueActivitiyInfos=data
      console.log("infoss",IssueInfo.value)
    }*/
    const saveAndConfirm = () => {
      IssueInfo.value.IsSaveWithConfirm = true
      save()
    }
    const save = () => {
      submitted.value = true;
      v$.value.$validate()
      if (v$.value.$error) {
        IssueInfo.value.IssueRelevantDepartmentInfos = IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId.map((m) => {
          return {
            DepartmentId: m.Id
          }
        })
        console.log("IssueInfo.value ", IssueInfo.value);
  
        IssueInfo.value.IssueRoleInfos = IssueInfo.value.IssueRoleInfos.map((m) => {
          return {
            RoleId: m.Id
          }
        })
        console.log("IssueInfo.value", IssueInfo.value);
        IssuesService.addIssue(IssueInfo.value)
            .then(response => {
              if (response.data.Success) {
                ResetValue();
                toast.add({severity: 'success', summary: 'Başarılı', detail: 'İş Kaydı Oluşturuldu', life: 3000});
                console.log("IssueInfo.value", IssueInfo.value);
              } else {
                toast.add({severity: 'error', summary: 'Hata', detail: 'İş Kaydı Oluşturulamadı', life: 3000});
              }
            }).catch(e => {
          console.log(e)
        })
      }
      router.push("/issueList")
    }

    if (props.data > 0) {
      showButton.value = true
      IssuesService.getSelectedIssue(props.data).then(response => {
        if (response.data.Success) {
          console.log("response.data.Payload", response.data)
          IssueInfo.value = response.data.Payload

          /* IssueInfo.value.IssueRelevantDepartmentInfos.DepartmentId = response.data.Payload.IssueRelevantDepartmentInfos.map(f => {
             return {
               Definition: f.Department.Definition,
               Id: f.DepartmentId
             }
           })*/
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

    const rejectIssue = () => {
      openRejectDialog.value = true
    }

    const closeDialog = () => {
      openRejectDialog.value = false

    }

    const answerIssue = () => {
      confirmModel.value.IssueId = props.data;
      confirm.require({
        message: "Projeyi onaylamak istediğinizden emin misiniz?",
        header: "Onay Ver",
        icon: "pi pi- exclamation-triangle",
        accept: () => {
          IssuesService.IssueConfirm(confirmModel.value).then(response => {
            console.log("response 3", response)
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

    const rejectButton = () => {
      confirmModel.value.IssueId = props.data;
      confirmModel.value.Description = newDescription.value;
      confirm.require({
        message: "Projeyi reddetmek istediğinizden emin misiniz?",
        header: "Onay Ver",
        icon: "pi pi- exclamation-triangle",
        accept: () => {
          IssuesService.rejectIssue(confirmModel.value).then(response => {
            if (response.Success) {
              toast.add({severity: 'success', summary: 'Onaylandı', detail: 'Başarılı', life: 3000});
              router.push("/issueList")
            } else {
              toast.add({severity: 'error', summary: response.Information, detail: 'Başarısız', life: 3000});
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
      urlUpload,
      onUpload,
      IssueFile,
      showButton,
      answerIssue,
      rejectButton,
      submitted,
      openRejectDialog,
      rejectIssue,
      closeDialog,
      confirmModel,
      newDescription,
      saveAndConfirm
    }
  }
}
</script>