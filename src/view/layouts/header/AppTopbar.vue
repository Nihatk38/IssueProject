<template>
  <div class="layout-topbar grid">
    <div class="col-8">
      <router-link to="/" class="layout-topbar-logo">
        <img
            alt="logo"
            class="h-4rem w-8rem "
            src="@/assets/images/logo.png"
            style="object-fit: contain; object-position: center"
        />
      </router-link>
    </div>

    <div class="col-offset-1">
           <p>{{ userInfo.FullName }}-{{ userInfo.RoleName }}</p>

    </div>

    <div class="col-offset-1 ">
      <router-link @click="logOut" to="/login">
        <Button class="p-button-secondary p-button-outlined  ">
          <i class="pi pi-fw pi-sign-out"></i>
        </Button>
      </router-link>

    </div>

  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import UsersService from "@/service/users.service";
import AuthService from "@/service/auth.service";

export default {
  methods: {
    onMenuToggle(event) {
      this.$emit('menu-toggle', event);
    },
    logOut(){
      localStorage.removeItem('token')
    }
  },
  setup() {
    const userInfo = ref([])

    onMounted(() => {
      UsersService.getUser(AuthService.getUserId()).then(response => {
        userInfo.value = response.data.Payload

      })


    })

    return {userInfo}
  },


}
</script>