<template>

  <Dialog @update:visible="closeDialog" :visible="true" :modal="true" :style="{width:'800px'}" class="p-fluid"
          header="Red Sebebi">

    <form class="p-fluid" @submit.prevent="rejectButton(!v$.$invalid)">
      <div class="p-field">
      <Textarea id="Precondition" v-model="v$.Description.$model"
                :class="{'p-invalid':v$.Description.$invalid && submitted}"/>
        <small class="p-error" v-if="(v$.Description.$invalid && submitted)">Açıklama Boş Bırakılamaz.</small>


      </div>
      <div class="grid ">
        <div class="col-12 grid mt-1">
          <div class="col-offset-6 col-3 ">
            <Button class="p-button-danger p-button-outlined col" icon="pi pi-times" label="İptal"
                    @click="closeDialog"/>
          </div>
          <div class="col-3 ">
            <Button class="p-button-success p-button-outlined" icon="pi pi-check" label="Gönder"
                    type="Submit"/>
          </div>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script>
import {ref} from "vue";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import useVuelidate from "@vuelidate/core";

import IssuesService from "@/service/issueService";
import router from "@/router";
import {required} from "@vuelidate/validators";

export default {
  props: {
    closeDialog: {
      type: Function,
      required: true
    },
    data: {
      required: true,
      type: Number
    }

  },

  name: "IssueRejectDialog",
  setup(props) {

    const toast = useToast()
    const confirm = useConfirm()
    const submitted = ref(false)

    const confirmModel = ref({
      IssueId: '',
      Description: ''
    })

    const rules = {
      Description: {required},
    }

    const v$ = useVuelidate(rules, confirmModel)


    const rejectButton = (isFormValid) => {

      submitted.value = true;

      if (!isFormValid) {
        return
      }
      confirmModel.value.IssueId = props.data;
      confirm.require({
        message: "Talebi reddetmek istediğinizden emin misiniz?",
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


    return {submitted, confirmModel, rejectButton, v$}


  }
}
</script>

<style scoped>

</style>