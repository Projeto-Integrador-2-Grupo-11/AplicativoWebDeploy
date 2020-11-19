<template>
  <div :class="layoutClass" class="auth-layout">
    <base-nav
      v-model="showMenu"
      type="light"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main"
      expand="lg"
    >
      <div slot="brand" class="navbar-wrapper">
        <nuxt-link class="navbar-brand" to="/">
          <img src="/logo.svg" alt="Logo white">
        </nuxt-link>
      </div>

     <template>
       <div class="navbar-collapse-header">
         <div class="row">
           <div class="col-6 collapse-brand">
             <nuxt-link to="/">
               <img src="/logo.svg">
             </nuxt-link>
           </div>
           <div class="col-6 collapse-close">
             <button type="button" class="navbar-toggler" @click="showMenu = false">
               <span></span>
               <span></span>
             </button>
           </div>
         </div>
       </div>

       <!-- <ul class="navbar-nav mr-auto">
         <li class="nav-item">
           <nuxt-link to="/dashboard" class="nav-link">
             <span class="nav-link-inner--text">Dashboard</span>
           </nuxt-link>
         </li>
         <li class="nav-item">
           <nuxt-link to="/login" class="nav-link">
             <span class="nav-link-inner--text">Login</span>
           </nuxt-link>
         </li>
         <li class="nav-item">
           <nuxt-link to="/register" class="nav-link">
             <span class="nav-link-inner--text">Register</span>
           </nuxt-link>
         </li>
       </ul>
       <hr class="d-lg-none"> -->
     </template>
    </base-nav>

    <div class="main-content">
      <nuxt></nuxt>
    </div>
  </div>
</template>
<script>
  import BaseNav  from '~/components/Navbar/BaseNav.vue';

  export default {
    components: {
      BaseNav,
    },
    props: {
      backgroundColor: {
        type: String,
        default: 'black'
      }
    },
    data() {
      return {
        showMenu: false,
        menuTransitionDuration: 250,
        year: new Date().getFullYear(),
        pageClass: 'login-page',
      };
    },
    computed: {
      title() {
        return `${this.$route.name} Page`;
      },
      layoutClass() {
        let exceptions = ['index', 'home']
        if (!exceptions.includes(this.$route.name)) {
          return 'bg-default'
        } else {
          return ''
        }
      }
    },
    methods: {
      closeMenu() {
        document.body.classList.remove('nav-open');
        this.showMenu = false;
      },
    },
    watch: {
      '$route.path'() {
        if (this.showMenu) {
          this.closeMenu();
        }
      }
    }
  };
</script>
<style lang="scss">
  .auth-layout {
    min-height: 100vh;
  }
</style>
