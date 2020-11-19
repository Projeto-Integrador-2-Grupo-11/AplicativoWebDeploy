<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">
       <sidebar-item
          :link="{
            name: 'Quantitativos',
            icon: 'ni ni-shop text-primary',
            path: '/dashboard'
          }">
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Gráficos',
            icon: 'ni ni-chart-pie-35 text-info',
            path: '/charts'
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Relatório',
            icon: 'ni ni-single-copy-04 text-red',
            path: '/reports'
          }">
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.name === 'alternative' ? 'light': 'default'"></dashboard-navbar>
      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';

  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '~/components/Layouts/DashboardNavbar.vue';
  import ContentFooter from '~/components/Layouts/ContentFooter.vue';
  import Content from '~/components/Layouts/Content.vue';
  import Sidebar from '~/components/SidebarPlugin/Sidebar';
  import Notifications from '~/components/NotificationsPlugin/Notifications';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      Content,
      Sidebar,
      Notifications
    },
    methods: {
      initScrollbar() {
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          initScrollbar('scrollbar-inner');
        }
      }
    },
    mounted() {
      this.initScrollbar()
    }
  };
</script>
<style lang="scss">
</style>
