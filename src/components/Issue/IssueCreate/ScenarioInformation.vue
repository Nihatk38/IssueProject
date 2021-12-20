<template>

  <Card class="mb-3 cardColor1 border-round">

    <template #title>
      <h5 class="text-center">SENARYO BİLGİLERİ</h5>
    </template>

    <template #content>
      <div class="formgrid grid">
        <div class="field col-12 md:col-4">
          <label>Departman</label>
          <InputText v-model="userInfo.DepartmentName" :disabled="true" class="inputfield w-full"></InputText>
        </div>
        <div class="field col-12 md:col-4">
          <label>Kullanıcı</label>
          <InputText v-model="userInfo.FullName" :disabled="true" class="inputfield w-full"></InputText>
        </div>

        <div class="field col-12 md:col-4">
          <label>Görevi</label>
          <InputText v-model="userInfo.RoleName" :disabled="true" class="inputfield w-full"></InputText>
        </div>
        <div class="field col-12">
          <label>Konu</label>
          <InputText v-model="v$.Title.$model" :class="{'p-invalid':v$.Title.$invalid && submitted}"
                     class="inputfield w-full"
                     :disabled="status > '0'"></InputText>
          <small v-if="(v$.Title.$invalid && submitted)" class="p-error">Konu Boş Bırakılmaz.</small>
        </div>
        <div class="field col-12">
          <label>Alt Konu Başlığı</label>
          <InputText v-model="v$.Subtitle.$model" :class="{'p-invalid':v$.Subtitle.$invalid && submitted}"
                     class="inputfield w-full"
                     :disabled="status > '0'"></InputText>
          <small v-if="(v$.Subtitle.$invalid && submitted)" class="p-error">Alt Konu Başlığı Boş Bırakılamaz.</small>
        </div>
      </div>
    </template>
  </Card>

  <Card class="mb-3 cardColor2 border-round">
    <template #title>
      <h5 style="text-align:center">KAPSAM BİLGİLERİ</h5>
    </template>

    <template #content>
      <div class="formgrid grid">
        <div class="field col-12">
          <label>Kısa Açıklama</label>
          <Textarea v-model="v$.Summary.$model" :class="{'p-invalid':v$.Summary.$invalid && submitted}"
                    class="inputfield w-full" cols="50" rows="3"></Textarea>
          <small v-if="(v$.Summary.$invalid && submitted)" class="p-error">Kısa Açıklama Boş Bırakılamaz.</small>
        </div>
        <div class="field col-12">
          <label>Aktörler</label>
          <div v-for="category of categoriesRoles" :key="category.Id" class="p-field-checkbox mb-1">
            <Checkbox :id="category.Id" v-model="scenariosValue.IssueRoleInfos" :value="category"
                      name="category"/>
            <label :for="category.Id" class="ml-2"> {{ category.Definition }}</label>
          </div>
        </div>
      </div>

    </template>
  </Card>
</template>

<script>
import {toRefs, ref, onMounted} from "vue";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import UsersService from "../../../service/users.service";
import AuthService from "../../../service/auth.service";

export default {
  props: ['scenarios', 'submitted', "status"],
  setup(props) {
    const {scenarios} = toRefs(props)
    const userInfo = ref('')
    const categoriesRoles = ref([])
    const selectedCategoriesRoles = ref(null)
    const selectedWorkArea = ref([])

    const worksAreas = ref[{WorkArea: "550", id: 1}, {WorkArea: "552", id: 2}]


    const state = ref({})
    const rules = {
      DepartmentId: {required},
      Title: {required},
      Subtitle: {required},
      WorkArea: {required},
      Summary: {required},
      FullName: {required},
      Task: {required},
      Actors: {required},
    }

    const work = (() => {
      scenarios.value.WorkArea = selectedWorkArea.value.join()
    })

    const v$ = useVuelidate(rules, scenarios)

    onMounted(() => {
      UsersService.getRole().then(response => {
        categoriesRoles.value = response.Payload
      })
      UsersService.getUser(AuthService.getUserId()).then(r => {
        userInfo.value = r.data.Payload
      })
    })

    return {
      selectedCategoriesRoles,
      state,
      categoriesRoles,
      scenariosValue: scenarios,
      v$,
      userInfo,
      worksAreas,
      selectedWorkArea,
      work
    }
  }
}
</script>

<style>


</style>