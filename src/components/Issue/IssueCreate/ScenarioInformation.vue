<template>

  <Card class="col-12 mb-3 cardColor1" style="border-radius: 0.8rem">

    <template #title>
      <h6 style="text-align: center">SENARYO BİLGİLERİ</h6>
    </template>

    <template #content>

      <div class="p-grid">
        <div class="p-col-3  ">
          <label class="center ">Departman </label>
        </div>
        <div class="p-col-9 p-fluid">

          <InputText v-model="userInfo.DepartmentName" :disabled="true" class="p-inputtext-sm inputColor"
          ></InputText>

        </div>
      </div>

      <div class="p-grid">
        <div class="p-col-3">
          <label class="center ">Kullanıcı </label>
        </div>
        <div class="p-col-9 p-fluid">
          <InputText v-model="userInfo.FullName" :disabled="true" class="p-inputtext-sm inputColor"></InputText>

        </div>
      </div>

      <div class="p-grid">
        <div class="p-col-3">
          <label class="center ">Görevi </label>
        </div>
        <div class="p-col-9 p-fluid">
          <InputText v-model="userInfo.RoleName" :disabled="true" class="p-inputtext-sm inputColor"></InputText>

        </div>
      </div>

      <div class="p-grid">
        <div class="p-col-3">
          <label class="center ">Konu </label>
        </div>
        <div class="p-col-9 p-fluid">
          <InputText v-model="v$.Title.$model" :class="{'p-invalid':v$.Title.$invalid && submitted}"
                     class="p-inputtext-sm inputColor"></InputText>
          <small v-if="(v$.Title.$invalid && submitted)" class="p-error">Konu Boş Bırakılmaz.</small>

        </div>
      </div>

      <div class="p-grid">
        <div class="p-col-3">
          <label class="center ">Alt Konu Başlığı </label>
        </div>
        <div class="p-col-9 p-fluid">
          <InputText v-model="v$.Subtitle.$model" :class="{'p-invalid':v$.Subtitle.$invalid && submitted}"
                     class="p-inputtext-sm inputColor"></InputText>
          <small v-if="(v$.Subtitle.$invalid && submitted)" class="p-error">Alt Konu Başlığı Boş Bırakılamaz.</small>
        </div>
      </div>

      <div class="p-grid">
        <div class="p-col-3">
          <label class="center ">Üretim Yeri </label>
        </div>
        <!--        <div class="p-col-9 p-fluid">
                  <div class="p-field-checkbox">
                    <Checkbox id="WorkArea" name="WorkArea" value="550" v-model="userValue.WorkArea" />
                    <label for="WorkArea">Kayseri Organize</label>
                  </div>
                  <div class="p-field-checkbox">
                    <Checkbox id="WorkArea" name="WorkArea" value="552" v-model="userValue.WorkArea" />
                    <label for="WorkArea">İncesu Organize</label>
                  </div>

                </div>-->

        <InputText v-model="scenariosValue.WorkArea"/>

        <!--        <p>workarea:{{ selectedWorkArea }}</p>
                <div class="p-col-9 p-fluid">
                  <div class="p-field-checkbox">
                    <Checkbox v-model="selectedWorkArea" :value="550" name="userValue.WorkArea" @click="work"/>
                    <label for="WorkArea">Kayseri Organize</label>
                  </div>
                  <div class="p-field-checkbox">
                    <Checkbox v-model="selectedWorkArea" :value="552" name="userValue.WorkArea" @click="work"/>
                    <label for="WorkArea">İncesu Organize</label>
                  </div>
                </div>-->

        <!--
                <div v-for="category of categories" :key="category.key" class="p-field-checkbox">
                  <Checkbox :id="category.key" name="category" :value="category" v-model="userValue.WorkArea" :disabled="category.key === 'R'"/>
                  <label :for="category.key">{{category.name}}</label>
                </div>
        -->

      </div>

    </template>
  </Card>
  <Card class="col-12 mb-3 cardColor2" style="border-radius: 0.8rem">
    <template #header>
      <h6 style="text-align:center">KAPSAM BİLGİLERİ</h6>
    </template>
    <template #content>
      <div class="p-grid">
        <div class="p-col-3  ">
          <label class="center ">Kısa Açıklama </label>
        </div>
        <div class="p-col-9 p-fluid ">
          <Textarea v-model="v$.Summary.$model" :class="{'p-invalid':v$.Summary.$invalid && submitted}"
                    class="p-inputtext-sm inputColor2" cols="50" rows="3"></Textarea>
          <small v-if="(v$.Summary.$invalid && submitted)" class="p-error">Kısa Açıklama Boş Bırakılamaz.</small>
        </div>
      </div>


      <div class="p-grid">
        <div class="p-col-3">
          <label class="center">Aktörler </label>
        </div>
        <div class="p-col-9 p-fluid">
          <div v-for="category of categoriesRoles" :key="category.Definition" class="p-field-checkbox">
            <Checkbox :id="category.Definition" v-model="scenariosValue.IssueRoleInfos" :value="category"
                      name="category"/>
            <label :for="category.Id"> {{ category.Definition }}</label>
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
import {useToast} from 'primevue/usetoast';
import apiService from "../../../service/apiService";

export default {
  props: ['scenarios', 'submitted'],
  setup(props) {
    const toast = useToast();
    const {scenarios} = toRefs(props)
    const userInfo = ref('')

    const categoriesRoles = ref([])
    onMounted(() => {
      UsersService.getRole().then(response => {
        categoriesRoles.value = response.Payload
      })
      UsersService.getUser(AuthService.getUserId()).then(r => {
        userInfo.value = r.data.Payload
      })
    })
    const selectedCategoriesRoles = ref(null)

    const selectedWorkArea = ref([])

    /*  const work=computed(()=>{return scenarios.value.WorkArea == selectedWorkArea.value.join()}
      )*/

    const categories = ref([
      {name: '550', key: '1'},
      {name: '552', key: '2'},

    ]);

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


    /*const onFill=()=>{
      user.value.Summary="asd",

      user.value.WorkArea=550,
          user.value.IssueRoleInfos=[{Id:3, Definition:"Personel"}],
          user.value.Subtitle="asd",
      user.value.Title="asd"    }*/


    const work = (() => {
      scenarios.value.WorkArea = selectedWorkArea.value.join()
    })

    const onUpload = () => {
      apiService.post(`api/issue/demo`)
      toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
    }
    const v$ = useVuelidate(rules, scenarios)
    return {
      selectedCategoriesRoles,
      state,
      categoriesRoles,
      scenariosValue: scenarios,
      v$,
      userInfo,
      onUpload,
      worksAreas,
      categories,
      selectedWorkArea,
      work
    }
  }
}
</script>

<style>
.cardColor1 {
  background-color: #D3E4CD;
}

.inputColor {
  background-color: #e9efe8
}


.cardColor2 {
  background-color: #99A799;
}

.inputColor2 {
  background-color: #aab0aa;

}


.cardColor3 {
  background-color: #F2DDC1;
}


.cardColor4 {
  background-color: #E2C2B9;
}


</style>