<template>
  <Card class="mb-3 cardColor1 border-round">

    <template #title>
      <h5 class="text-center">SENARYO BİLGİLERİ</h5>
    </template>

    <template #content>
      <div v-if="data == null">
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
        </div>
      </div>
        <div v-else>
          <div class="formgrid grid">
          <div class="field col-12 md:col-4">
            <label>Departman</label>
            <InputText v-model="comingInfo[0].FullName"  :disabled="true" class="inputfield w-full"> </InputText>
          </div>
          <div class="field col-12 md:col-4">
            <label>Kullanıcı</label>
            <InputText  v-model="comingInfo[0].DepartmentName"  :disabled="true" class="inputfield w-full">asdasd</InputText>
          </div>
          <div class="field col-12 md:col-4">
            <label>Görevi</label>
            <InputText  v-model="comingInfo[0].RoleName"  :disabled="true" class="inputfield w-full">asdasd</InputText>
          </div>
            </div>
        </div>
        <div class="field col-12">
          <label class="center ">Konu<span style="color: red">*</span> </label>
          <Dropdown v-model="scenariosValue.TitleId"
                    :options="resultTitle"
                    optionValue="Id"
                    optionLabel="Subject"
                    class="inputfield w-full"
                    :disabled="status >0 && status <9"
          />
          <slot name="title"></slot>
<!--          <small v-if="(v$.TitleId.$invalid && submitted)" class="p-error">Konu Boş Bırakılmaz.</small>-->
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
    </template>
  </Card>

  <Card class="mb-3 cardColor2 border-round">
    <template #title>
      <h5 style="text-align:center">KAPSAM BİLGİLERİ</h5>
    </template>

    <template #content>
      <div class="formgrid grid">
        <div class="field col-12">
          <label>Kısa Açıklama<span style="color: red">*</span></label>
          <Textarea v-model="scenariosValue.Summary"
                    class="inputfield w-full" cols="50" rows="3" :disabled="status >0 && status <9"></Textarea>
          <slot name="summary"></slot>
<!--          <small v-if="(v$.Summary.$invalid && submitted)" class="p-error">Kısa Açıklama Boş Bırakılamaz.</small>-->
        </div>
        <div class="field col-12">
          <label>Aktörler<span style="color: red">*</span></label>
          <div class="grid mt-2">
            <div v-for="category of categoriesRoles" :key="category.Id" class="col-2 p-field-checkbox mb-1">
              <Checkbox :id="category.Id" v-model="scenariosValue.IssueRoleInfos" :value="category"
                        name="category" :disabled="status >0 && status <9"/>
              <label :for="category.Id" class="ml-2"> {{ category.Definition }}</label>
            </div>
          </div>
          <slot name="roleinfos"></slot>
<!--          <small v-if="(v$.IssueRoleInfos.$invalid && submitted)" class="p-error">Aktörler Boş Bırakılamaz.</small>-->

        </div>
      </div>

    </template>
  </Card>

</template>

<script>
import {toRefs, ref, onMounted, watch} from "vue";
import UsersService from "../../../service/users.service";
import AuthService from "../../../service/auth.service";
import IssuesService from "../../../service/issueService";

export default {
  props: ['scenarios', 'submitted', "status","data","comingName",'comingDepartment','comingRole'],

  setup(props) {
    const {scenarios} = toRefs(props)
    const userInfo = ref('')
    const resultTitle=ref(null);
    const comingInfo = ref([]);
    const Title=ref('');
    const resultSubTitle=ref(null);
    const SubTitle=ref('');
    const categoriesRoles = ref([])
    const selectedCategoriesRoles = ref(null)
    const state = ref({})
    const TitleControl = ref(true);
    comingInfo.value.push({
      FullName:props.comingName,
      DepartmentName:props.comingDepartment,
      RoleName:props.comingRole,
    })
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


    watch(() => scenarios.value.TitleId,(titleId) =>{
      IssuesService.getSubTitleInfo(titleId).then(response =>{
        resultSubTitle.value = response.data.Payload
      })
    })
    watch(() =>SubTitle.value,(value) =>{
      scenarios.value.SubTitle = value;
    })


    return {
      selectedCategoriesRoles,
      state,
      categoriesRoles,
      scenariosValue: scenarios,
      userInfo,
      resultTitle,
      Title,
      resultSubTitle,
      SubTitle,
      TitleControl,
      comingInfo
    }
  }
}
</script>

<style>


</style>