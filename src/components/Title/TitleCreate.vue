<template>
  <Dialog :visible="true" :modal="true" :style="{width: '450px'}" header="Yeni Konu Oluştur"
          class="p-fluid">
    <div class="field">
      <label for="DepartmentId">Departman*</label>
      <Dropdown v-model="DepartmentId" :options="resultDepartment" optionValue="Id" optionLabel="Definition"/>
    </div>

    <div class="field">
      <label for="Title">Title*</label>
      <Dropdown v-model="state.Id" :options="resultTitle" optionValue="Id" optionLabel="Subject"/>
    </div>

    <div class="field">
      <label>Alt Konu Başlığı</label>
      <Textarea v-model="state.Subtitle"
                class="inputfield w-full" cols="50" rows="3"></Textarea>
    </div>

    <Button label="Kaydet" icon="pi pi-check" class="p-button-success p-button-outlined mb-2" @click="saveTitle"/>
    <Button label="İptal" icon="pi pi-times" class="p-button-danger p-button-outlined" @click="closeDialog"/>

  </Dialog>
</template>

<script>
import {onMounted, ref, watch} from "vue";

import IssuesService from "@/service/issueService";
import UsersService from "@/service/users.service";


export default {
  props: {
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
  },
  name: "TitleCreate",
  setup(props) {
    const state = ref({
      Id:'',
      Subtitle:''
    })
    const DepartmentId = ref('')
    const resultTitle = ref([])
    const resultDepartment = ref(null)


    onMounted(async () => {

      await UsersService.getDepartmentList().then(response => {
        resultDepartment.value = response.Payload
        console.log("resultDepartment",resultDepartment.value)
      })
    })
    watch(() => DepartmentId.value,(DepartmentId) =>{
        IssuesService.getTitleInfoByDepartmentId(DepartmentId).then(response =>{
          resultTitle.value = response.data.Payload
          console.log("result",resultTitle.value)
        })
    })

    const saveTitle = () => {
      if (props.operation === 1) {
        IssuesService.addTitle(state.value).then(response => {

          if (response.data.Success)
            props.closeDialog(true)
        })
      } else {
        IssuesService.updateTitle(state.value).then(response => {
          if (response.data.Success) {
            props.closeDialog(true)
          }
        })
      }
    }
    return {
      state,
      saveTitle,
      resultTitle,
      resultDepartment,
      DepartmentId
    }
  }
}
</script>

<style scoped>

</style>