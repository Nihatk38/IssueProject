<template>

  <Dialog :visible="true" :modal="true" :style="{width: '450px'}" header="Yeni Departman Oluştur"
          class="p-fluid">

    <form class="p-fluid" @submit.prevent="handleSubmit(!v$.$invalid)">



      <div class="p-field">
        <label for="Definition">Departman Adı*</label>
        <Dropdown v-model="state.Definition" :options="Departments" optionValue="Definition" optionLabel="Definition"/>
        <small class="p-error" v-if="v$.Definition.$error">Rol Boş Bırakılamaz.</small>
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



    const createDepartment= ()=>{

     UsersService.addDepartment(state).then(response =>{
       if (response.data.Success)
         props.closeDialog(true)
     })


    }
    return{
      state,createDepartment,v$,Departments
    }
  }


}
</script>

<style scoped>

</style>