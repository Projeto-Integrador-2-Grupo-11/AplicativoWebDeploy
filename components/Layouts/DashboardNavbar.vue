<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top border-bottom navbar-expand"
    :class="{'bg-purple navbar-dark': type === 'default'}"
  >
    <ul class="navbar-nav align-items-center ml-md-auto">
      <base-dropdown menu-on-right
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link pr-0">
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <div class="media align-items-center">
                  <span class="avatar avatar-sm rounded-circle">
                    <img alt="Image placeholder" src="user_avatar.jpeg">
                  </span>
            <div class="media-body ml-2 d-none d-lg-block">
              <!-- <span class="mb-0 text-sm  font-weight-bold">{{userProfile.name}}</span> -->
            </div>
          </div>
        </a>

        <template>

          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Bem-vindo!</h6>
          </div>
          <!-- <a @click="goProfile()" class="dropdown-item">
            <i class="ni ni-single-02"></i>
            <span>Perfil</span>
          </a> -->
          <div class="dropdown-divider"></div>
          <a @click="logOut()" class="dropdown-item">
            <i class="ni ni-user-run"></i>
            <span>Sair</span>
          </a>

        </template>
      </base-dropdown>
    </ul>
  </base-nav>
</template>

<script>
  import { CollapseTransition } from 'vue2-transitions';
  import BaseNav from '@/components/Navbar/BaseNav.vue';
  import BaseDropdown from '@/components/Buttons/BaseDropdown.vue';
  import Modal from '@/components/Modal.vue';

  export default {
    components: {
      CollapseTransition,
      BaseNav,
      Modal,
      BaseDropdown
    },
    props: {
      type: {
        type: String,
        default: 'default', // default|light
        description: 'Look of the dashboard navbar. Default (Green) or light (gray)'
      }
    },
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      }
    },
    data() {
      return {
        activeNotifications: false,
        showMenu: false,
        searchModalVisible: false,
        searchQuery: ''
      };
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      logOut(){
        this.$store.dispatch('modules/user/logOut')
        .then(() => {
           redirect('/login');
        });
      }
    }
  };
</script>
