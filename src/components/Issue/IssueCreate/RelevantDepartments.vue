<template>
<Card class="col-12 mb-3 cardColor2" style="border-radius: 0.8rem">
  <template #header>
    <h6 style="text-align: center"> İLGİLİ DEPARTMAN BİLGİLERİ</h6>
  </template>
  <template #content>
    <div>
      </div>
      <div class="grid">
        <div v-for="category of categoriesDepartment" :key="category.Definition" class="col-4 p-field-checkbox">
          <Checkbox :id="category.Definition" name="category" :value="category"
                    v-model="departmentValue.DepartmentId"/>
          <label :for="category.key"> {{category.Definition}}</label>
        </div>



    </div>
  </template>


</Card>
</template>

<script>
import {onMounted, ref, toRefs} from "vue";
import UsersService from "../../../service/users.service";
export default {
  props:['departments'],
  setup(props){
    onMounted(()=>{
      UsersService.getDepartment().then(response =>{
        categoriesDepartment.value=response.Payload
      })
    })
    const selectedCategoriesDepartment=ref()
    const {departments}=toRefs(props)
    const categoriesDepartment=ref([ ])

    return{
      selectedCategoriesDepartment,categoriesDepartment,departmentValue:departments,
    }
  }
}
</script>

<style scoped>

</style>