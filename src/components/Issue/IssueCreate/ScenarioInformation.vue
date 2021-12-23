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
          <label class="center ">Konu </label>
          <Dropdown v-model="v$.TitleId.$model"
                    :options="resultTitle"
                    optionValue="Id"
                    optionLabel="Subject"
                    :class="{'p-invalid':v$.TitleId.$invalid && submitted}"
                    class="inputfield w-full"
                    :disabled="status >0 && status <9"
          />
          <small v-if="(v$.TitleId.$invalid && submitted)" class="p-error">Konu Boş Bırakılmaz.</small>
        </div>

        <div class="field col-12">
          <label>Alt Konu Başlığı</label>
          <Dropdown v-model="scenariosValue.SubtitleId"
                    :options="resultSubTitle"
                    optionValue="Id"
                    optionLabel="SubTitle"
                    class="inputfield w-full"
                    :disabled="status >0 && status <9"
          />
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
                    class="inputfield w-full" cols="50" rows="3" :disabled="status >0 && status <9"></Textarea>
          <small v-if="(v$.Summary.$invalid && submitted)" class="p-error">Kısa Açıklama Boş Bırakılamaz.</small>
        </div>
        <div class="field col-12">
          <label>Aktörler</label>
          <div class="grid mt-2">
            <div v-for="category of categoriesRoles" :key="category.Id" class="col-2 p-field-checkbox mb-1">
              <Checkbox :id="category.Id" v-model="scenariosValue.IssueRoleInfos" :value="category"
                        name="category" :disabled="status >0 && status <9"/>
              <label :for="category.Id" class="ml-2"> {{ category.Definition }}</label>
            </div>
          </div>
          <small v-if="(v$.IssueRoleInfos.$invalid && submitted)" class="p-error">Aktörler Boş Bırakılamaz.</small>

        </div>
      </div>

    </template>
  </Card>

</template>

<script>
import {toRefs, ref, onMounted, watch} from "vue";
import useVuelidate from "@vuelidate/core";
import {required} from "@vuelidate/validators";
import UsersService from "../../../service/users.service";
import AuthService from "../../../service/auth.service";
import IssuesService from "../../../service/issueService";

export default {
  props: ['scenarios', 'submitted', "status","data"],

  setup(props) {
    const {scenarios} = toRefs(props)
    const userInfo = ref('')
    const resultTitle=ref(null);
    const Title=ref('');
    const resultSubTitle=ref(null);
    const SubTitle=ref('');
    const categoriesRoles = ref([])
    const selectedCategoriesRoles = ref(null)
    const state = ref({})
    const TitleControl = ref(true);
    onMounted(() => {
      UsersService.getRole().then(response => {
        categoriesRoles.value = response.Payload
      })
      UsersService.getUser(AuthService.getUserId()).then(r => {
        userInfo.value = r.data.Payload
      })
        if(props.data == null){
          IssuesService.getTitleInfo(TitleControl.value).then(response =>{
            resultTitle.value= response.data.Payload
          })
        }else{
          IssuesService.getTitleInfo(!TitleControl.value).then(response =>{
            resultTitle.value= response.data.Payload
          })
        }

    })

    const rules = {
      DepartmentId: {required},
      TitleId: {required},
      SubtitleId: {required},
      Summary: {required},


      IssueRoleInfos: {required},
    }

    watch(() => scenarios.value.TitleId,(titleId) =>{
      IssuesService.getSubTitleInfo(titleId).then(response =>{
        resultSubTitle.value = response.data.Payload
      })
    })
    watch(() =>SubTitle.value,(value) =>{
      scenarios.value.SubTitle = value;
    })

    const v$ = useVuelidate(rules, scenarios)

    return {
      selectedCategoriesRoles,
      state,
      categoriesRoles,
      scenariosValue: scenarios,
      v$,
      userInfo,
      resultTitle,
      Title,
      resultSubTitle,
      SubTitle,
      TitleControl
    }
  }
}
</script>

<style>


</style>