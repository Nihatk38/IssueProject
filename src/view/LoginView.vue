<template>
  <div class="flex justify-content-center align-items-center "
       style="height: 100%; min-height: 100vh">

    <div class="card flex flex-column align-items-center">
      <img
          alt="logo"
          class="h-6rem w-12rem -mt-8 mb-4"
          src="@/assets/images/logo.png"
          style="object-fit: contain; object-position: center"
      />
      <div class="grid">

        <div class="col-12">
          <div style="margin-bottom: 0.5rem">
            <label for="UserId">Sicil No</label>
          </div>
          <InputText class="w-full" id="UserId" v-model="userInfo.UserId" type="text"/>
          <small v-if="v$.UserId.$error" class="p-error">Kullanıcı Adı Boş Bırakılamaz.</small>
        </div>

        <div class="col-12">
          <div style="margin-bottom: 0.5rem">
            <label for="Password">Şifre</label>&nbsp;
          </div>

          <InputText class="w-full" id="Password" v-model="userInfo.Password" :type="passwordFieldType"
          @keypress.enter="login"/>
          <small v-if="v$.Password.$error" class="p-error">Şifre Boş Bırakılamaz.</small>
        </div>

        <Button class="col-4 col-offset-4" type="submit" @click="login" label="Giriş Yap"></Button>
      </div>
    </div>

  </div>
</template>

<script>

import {computed, reactive, ref} from "vue";
import AuthService from "@/service/auth.service";
import router from "@/router";

import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {useToast} from "primevue/usetoast";

export default {
  name: "LoginView",
  setup() {
    const toast = useToast();
    const userInfo = reactive({
      UserId: '',
      Password: ''
    })
    const rules = {
      UserId: {required},
      Password: {required}
    }

    const v$ = useVuelidate(rules, userInfo)
    const userName = ref("");
    const hidePassword = ref(true);
    const password = ref("");

    const passwordFieldIcon = computed(() => hidePassword.value ? "pi pi-eye" : "pi pi-eye-slash");
    const passwordFieldType = computed(() => hidePassword.value ? "Password" : "text");

    const login = () => {

      v$.value.$validate()
      if (!v$.value.$error) {
        AuthService.loginPost(userInfo).then(response => {
          if (response.Success) {
            toast.add({severity: 'success', summary: 'Başarılı', detail: 'Giriş Yapıldı', life: 3000});
            return router.push("/issueList")
          }
          toast.add({severity: 'error', summary: 'Hata', detail: response.Information, life: 3000});

        });
      }

    }

    return {
      v$,
      userInfo,
      rules,
      userName,
      hidePassword,
      password,
      passwordFieldIcon,
      passwordFieldType,
      login
    }

  }
}
</script>

<style scoped>

</style>