<template>
  <div class="layout-topbar">
    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
      <i class="pi pi-bars"></i>
    </button>
    <router-link to="/" class="layout-topbar-logo">
      <img
          alt="logo"
          class="h-4rem w-8rem "
          src="@/assets/images/logo.png"
          style="object-fit: contain; object-position: center"
      />
    </router-link>


    <div class="col-offset-8">
      <p>{{ userInfo.FullName }}-{{ userInfo.RoleName }}</p>
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