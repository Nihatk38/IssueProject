<template>
<Card class="col-12 mb-3 cardColor2" style="border-radius: 0.8rem">
  <template #header>
    <h5 class="text-center my-4">İLGİLİ DEPARTMAN BİLGİLERİ</h5>
  </template>
  <template #content>
    <div>
      <div  v-if="(v$.DepartmentId.$invalid && submitted  )" class="p-error mb-2">İlgili Departman Bilgisi Boş Bırakılamaz.</div>
      </div>
      <div class="grid">
        <div v-for="category of categoriesDepartment" :key="category.Definition" class="col-4 p-field-checkbox">
          <Checkbox :id="category.Definition" name="category" :value="category"
                    v-model="departmentValue.DepartmentId" :disabled="status >0 && status <9"/>
          <label :for="category.key"> {{category.Definition}}</label>
        </div>



    </div>
  </template>


</Card>
</template>

<script>
import {onMounted, ref, toRefs} from "vue";
import UsersService from "../../../service/users.service";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
export default {
  props:['departments', 'status', 'submitted'],

  setup(props){
    onMounted(()=>{
      UsersService.getDepartment().then(response =>{
        categoriesDepartment.value=response.Payload
      })
    })
    const rules ={
      DepartmentId:{required}
    }


    const selectedCategoriesDepartment=ref()
    const {departments}=toRefs(props)
    const categoriesDepartment=ref([ ])
    const v$ = useVuelidate(rules,departments)
    return{
      selectedCategoriesDepartment,categoriesDepartment,departmentValue:departments,v$
    }
  }
}
</script>

<style scoped>

</style>