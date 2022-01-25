<template>
<Card class="col-12 mb-3 cardColor2 border-round"  >

  <template #header>
    <h5 class="text-center my-4">İLGİLİ DEPARTMAN BİLGİLERİ</h5>
  </template>
  <template #content>
    <div>
<!--      <div  v-if="(v$.DepartmentId.$invalid && submitted  )" class="p-error mb-2">İlgili Departman Bilgisi Boş Bırakılamaz.</div>-->
      </div>
      <div class="grid">
        <div v-for="category of departmentList" :key="category.Definition" class="col-4 p-field-checkbox">
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
import AuthService from "@/service/auth.service";
export default {
  props:['departments', 'status', 'submitted','UserId'],

  setup(props){
    onMounted(()=>{
      UsersService.getDepartment().then(response =>{
        categoriesDepartment.value=response.Payload;
        if(props.status>0){
          UsersService.getUser(props.UserId).then(response => {
            userInfo.value = response.data.Payload;
            departmentList.value = categoriesDepartment.value.filter(department=> department.Id !=userInfo.value.DepartmentId)
          })
        }
        else{
          UsersService.getUser(AuthService.getUserId()).then(response =>{
            userInfo.value=response.data.Payload;
            departmentList.value = categoriesDepartment.value.filter(department=> department.Id !=userInfo.value.DepartmentId)
          })
        }



      })


  })

    const userInfo=ref()
    const selectedCategoriesDepartment=ref()
    const {departments}=toRefs(props)
    const categoriesDepartment=ref([ ])
    const departmentList = ref();

    return{
      selectedCategoriesDepartment,categoriesDepartment,departmentValue:departments,userInfo,departmentList
    }
  }
}
</script>

<style scoped>

</style>