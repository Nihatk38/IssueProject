<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="darkTheme ? 'images/logo-formSunger.jpeg' : 'images/logo-formSunger.jpeg'" />
		</router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
<div class="col-offset-8">
  <p class="pi pi-user col-offset-5 "></p>
  <p>{{ userInfo.FullName}}-{{userInfo.RoleName}}</p>

</div>
	</div>
</template>

<script>
import { onMounted,ref} from "vue";
import UsersService from "../../../service/users.service";
import AuthService from "../../../service/auth.service";
export default {
  computed: {
    darkTheme() {
      return this.$appState.theme.startsWith('saga');
    }
  },
  methods: {
    onMenuToggle(event) {
      this.$emit('menu-toggle', event);
    },},
  setup(){
    const userInfo=ref([])

   /* const onMenuToogle=(event)=>{
      this.$emit('menu-toggle', event);
    }*/
   /* const darkTheme=computed(()=>{
      return this.$appState.theme.startsWith('saga')
    })*/


    onMounted(()=>{
      UsersService.getUser(AuthService.getUserId()).then(response=>{
        userInfo.value=response.data.Payload

      })



    })

    return{userInfo}
  },


}
</script>