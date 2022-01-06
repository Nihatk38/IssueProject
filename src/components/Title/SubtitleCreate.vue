<template>
  <Dialog @update:visible="closeDialog" :visible="true" :modal="true" :style="{width: '450px'}" header="Yeni Konu Oluştur"
          class="p-fluid">
    <div class="field">
      <label for="DepartmentId">Departman*</label>
      <Dropdown v-model="DepartmentId" :options="resultDepartment" optionValue="Id" optionLabel="Definition" :disabled="selectedValue !=null"/>
    </div>

    <div class="field">
      <label for="Title">Konu*</label>
      <Dropdown v-model="state.TitleId" :options="resultTitle" optionValue="Id" optionLabel="Subject" :disabled="selectedValue !=null"/>
      <small v-if="(v$.TitleId.$invalid && submitted)" class="p-error">Konu Boş Bırakılamaz.</small>
    </div>

    <div class="field">
      <label>Alt Konu Başlığı</label>
      <Textarea v-model="state.Subject"
                class="inputfield w-full" cols="50" rows="3"></Textarea>
      <small v-if="(v$.Subject.$invalid && submitted)" class="p-error">Alt Konu Başlığı Boş Bırakılamaz.</small>
    </div>

    <Button :label="operation ==1 ?'Kaydet' : 'Güncelle'" icon="pi pi-check" class="p-button-success p-button-outlined mb-2" @click="saveTitle"/>
    <Button label="İptal" icon="pi pi-times" class="p-button-danger p-button-outlined" @click="closeDialog"/>

  </Dialog>
</template>

<script>
import { onMounted, ref, watch} from "vue";

import IssuesService from "@/service/issueService";
import UsersService from "@/service/users.service";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import {useToast} from "primevue/usetoast";

export default {
  props: {
    selectedValue:{
      type:Object
    },
    closeDialog: {
      type: Function,
      required: true
    },
    operation: {
      type: Number,
      required: true
    },
    subtitleId: {
      type: Number,
      required: true
    },
    close:{
      type:Boolean,
    },
    clicked:{
      type:Boolean
    }
  },
  name: "SubtitleCreate",
  setup(props) {
    const state = ref({
      Id:props.selectedValue == null ? '': props.selectedValue.Id,
      TitleId:props.selectedValue == null ? '': props.selectedValue.TitleId,
      Subject:props.selectedValue == null ? '': props.selectedValue.Subject
    })
    const DepartmentId = ref(props.selectedValue == null ? '': props.selectedValue.DepartmentId)
    const resultTitle = ref([])
    const resultDepartment = ref(null)
    const toast = useToast()
    const submitted = ref(false)
    const rules = ref({
      Subject:{required},
      TitleId:{required}
    })
    const v$=useVuelidate(rules,state)

    onMounted(async () => {

      await UsersService.getDepartmentList().then(response => {
        resultDepartment.value = response.Payload
      })
    })
    watch(() => DepartmentId.value,(DepartmentId) =>{
        IssuesService.getTitleInfoByDepartmentId(DepartmentId).then(response =>{
          resultTitle.value = response.data.Payload
        })
    })
    if(props.clicked){
      IssuesService.getTitleInfoByDepartmentId(DepartmentId.value).then(response =>{
        resultTitle.value = response.data.Payload
      })
    }

    const saveTitle = () => {
      submitted.value=true;
      v$.value.$validate()
      if(!v$.value.$error) {
        if (props.operation === 1) {
          let changeSubtitleInfo = {
            Id:state.value.TitleId,
            SubTitle:state.value.Subject
          }
          IssuesService.addSubtitle(changeSubtitleInfo).then(response => {
            if (response.data.Success)
              props.closeDialog(true)
            toast.add({severity:'success',detail:'Başarılı',summary:'Alt Konu Eklendi',life:4000})
          })
        } else {
          IssuesService.updateSubtitle(state.value).then(response => {
            if (response.data.Success) {
              props.closeDialog(true)
            }
          })
        }
      }else{
        toast.add({severity:'error',detail:'Başarısız',summary:'Lütfen Zorunlu Alanları Doldurun',life:4000})
      }
    }
    return {
      state,
      saveTitle,
      resultTitle,
      resultDepartment,
      DepartmentId,
      v$,
      submitted
    }
  }
}
</script>

<style scoped>

</style>