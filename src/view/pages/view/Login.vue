<template>

  <div id="app">
    <div id="login">

      <div id="form">
        <form @submit.prevent="handleSubmit">
          <div class="p-field">
            <label for="UserId">Kullanıcı Adı</label>
            <InputText id="UserId" v-model="userInfo.UserId" type="text"/>
            <small v-if="v$.UserId.$error" class="p-error">Kullanıcı Adı Boş Bırakılamaz.</small>
          </div>

          <div class="p-field">
            <div style="margin-bottom: 0.5rem">
              <label for="Password">Şifre</label>&nbsp;
              <i :class="[passwordFieldIcon]" class="fas" @click="hidePassword = !hidePassword"></i>
            </div>

            <InputText id="Password" v-model="userInfo.Password" :type="passwordFieldType"/>
            <small v-if="v$.Password.$error" class="p-error">Şifre Boş Bırakılamaz.</small>
          </div>

          <button type="submit" @click="login(userInfo)"
          >Giriş Yap
          </button>

        </form>
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

    const login = (user) => {

      console.log(user);
      v$.value.$validate()
      if (!v$.value.$error) {
        AuthService.loginPost(user).then(response => {
          console.log("responsee", response);

          if (response.Success) {
            toast.add({severity: 'success', summary: 'Başarılı', detail: 'Giriş Yapıldı', life: 3000});
            return router.push("/issueList")
          }
          console.log("responsee", response);
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

<style>
div#form {
  box-sizing: border-box;
  font-family: Verdana, sans-serif;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  width: 100%;

}

div#app {
  width: 100%;
  height: 100%;
}

div#app div#login {
  align-items: center;

  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

div#app div#login div#description {
  background-color: #ffffff;
  width: 280px;
  padding: 35px;
}

div#app div#login div#description h1,
div#app div#login div#description p {
  margin: 0;
}

div#app div#login div#description p {
  font-size: 0.8em;
  color: #95a5a6;
  margin-top: 10px;
}

div#app div#login div#form {
  background-color: #34495e;
  border-radius: 5px;
  box-shadow: 0px 0px 30px 0px #666;
  color: #ecf0f1;
  width: 600px;
  height: 400px;
  padding: 35px;
}

div#app div#login div#form label,
div#app div#login div#form input {
  outline: none;
  width: 100%;
}

div#app div#login div#form label {
  color: #95a5a6;
  font-size: 0.8em;
}

div#app div#login div#form input {
  background-color: transparent;
  color: #ecf0f1;
  font-size: 1em;
  margin-bottom: 20px;
}

div#app div#login div#form ::placeholder {
  color: #ecf0f1;
  opacity: 1;
}

div#app div#login div#form button {
  background-color: #ffffff;
  cursor: pointer;
  border: none;
  padding: 10px;
  transition: background-color 0.2s ease-in-out;
  width: 40%;
}

div#app div#login div#form button:hover {
  background-color: #eeeeee;
}

@media screen and (max-width: 600px) {
  div#app div#login {
    align-items: unset;
    background-color: unset;
    display: unset;
    justify-content: unset;
  }

  div#app div#login div#description {
    margin: 0 auto;
    max-width: 350px;
    width: 100%;
  }

  div#app div#login div#form {
    border-radius: unset;
    box-shadow: unset;
    width: 100%;
  }

  div#app div#login div#form form {
    margin: 0 auto;
    max-width: 280px;
    width: 100%;
  }
}
</style>