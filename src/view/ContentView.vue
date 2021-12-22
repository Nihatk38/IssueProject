<template>
  <div >
    <AppTopBar @menu-toggle="onMenuToggle"/>
<!--    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu v-if="this.$route.path!='/login'" :model="menu" @menuitem-click="onMenuItemClick"/>
    </div>-->

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view/>
      </div>
      <AppFooter/>
    </div>


    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
    </transition>
  </div>
</template>

<script>

import AppTopBar from '@/view/layouts/header/AppTopbar.vue';
//import AppMenu from '@/view/layouts/main/AppMenu.vue';
import AppFooter from '@/view/layouts/footer/AppFooter.vue';

export default {
  name: "ContentView",
  components: {AppTopBar, AppFooter,},
  data() {
    return {
      layoutMode: 'static',
      layoutColorMode: 'light',
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        {
          items: [

            {
              label: 'Konuları Listele', icon: 'pi pi-fw pi-list', to: '/issueList',

            },

            {
              label: 'Departman Listesi', icon: 'pi pi-fw pi-list', to: '/departmentList',

            },
            {
              label: 'Kullanıcılar', icon: 'pi pi-fw pi-users', to: '/users'
            },
            {
              label: 'Çıkış Yap', icon: 'pi pi-fw pi-sign-out', to: '/login',
              command: () => {
                this.logOut();
              }


            }
          ]
        },

      ]
    }
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    }
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    logOut() {
      localStorage.removeItem('token');
    },
    onMenuToggle() {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === 'overlay') {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === 'static') {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
    onLayoutColorChange(layoutColorMode) {
      this.layoutColorMode = layoutColorMode;
    },
    addClass(element, className) {
      if (element.classList)
        element.classList.add(className);
      else
        element.className += ' ' + className;
    },
    removeClass(element, className) {
      if (element.classList)
        element.classList.remove(className);
      else
        element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === 'static')
          return !this.staticMenuInactive;
        else if (this.layoutMode === 'overlay')
          return this.overlayMenuActive;
      }

      return true;
    }
  },
  computed: {
    containerClass() {
      return ['layout-wrapper', {
        'layout-overlay': this.layoutMode === 'overlay',
        'layout-static': this.layoutMode === 'static',
        'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
        'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
        'layout-mobile-sidebar-active': this.mobileMenuActive,
        'p-input-filled': this.$primevue.config.inputStyle === 'filled',
        'p-ripple-disabled': this.$primevue.config.ripple === false,
        'layout-theme-light': this.$appState.theme.startsWith('saga')
      }];
    },
    /* logo() {
         return (this.layoutColorMode === 'dark') ? "images/logo-turkuvaz.png" : "images/logo-turkuvaz.png";
     }*/
  },
  beforeUpdate() {
    if (this.mobileMenuActive)
      this.addClass(document.body, 'body-overflow-hidden');
    else
      this.removeClass(document.body, 'body-overflow-hidden');
  }
}
</script>

<style lang="scss">
@import '../assets/styles/App';
</style>
