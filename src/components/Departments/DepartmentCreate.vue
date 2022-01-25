<template>

  <Dialog @update:visible="closeDialog" :visible="true" :modal="true" :style="{width: '450px'}" header="Yeni Departman Oluştur"
          class="p-fluid">

    <form class="p-fluid" @submit.prevent="createDepartment(!v$.$invalid)">
      <div class="p-field">
        <label for="Definition">Departman Adı*</label>
        <Dropdown v-model="v$.Definition.$model" :options="Departments" optionValue="Definition" optionLabel="Definition"
                  :class="{'p-invalid':v$.Definition.$invalid && submitted}"/>
        <small class="p-error" v-if="(v$.Definition.$invalid && submitted)">Rol Boş Bırakılamaz.</small>
      </div>
    </form>
    <template #footer>
      <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="closeDialog"/>
      <Button label="Kaydet" icon="pi pi-check" class="p-button-text" @click="createDepartment"/>
    </template>
  </Dialog>
</template>

<script>
import {ref,reactive} from "vue";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import UsersService from "../../service/users.service";

export default {
  props:{
    closeDialog:{
      type:Function,
      required:true
    }
  },

  setup(props){
    const submitted =ref(false)
    const state = reactive({
      Definition:'',

    })
    //const submitted=ref(false)

    const Departments=ref([
      {Definition:'Üretim', Id:'1'},
      {Definition:'Kalite', Id:'2'},
      {Definition:'Planlama', Id:'3'},
      {Definition:'Satış', Id:'4'},
      {Definition:'Pazarlama', Id:'5'},
    ])

    const rules= {
      Definition:{required},

    }
    const v$ = useVuelidate(rules,state)



    const createDepartment= (isFormValid)=>{
      submitted.value=true
      if(!isFormValid){
        return
      }

      UsersService.addDepartment(state).then(response =>{
        if (response.data.Success)
          props.closeDialog(true)
      })
    }
    return{
      state,createDepartment,v$,Departments,submitted
    }
  }


}
</script>

<style scoped>

</style>