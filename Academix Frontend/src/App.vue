<template>
  <body class="hold-transition sidebar-mini layout-fixed" style="height: 1px">
    <div class="wrapper">
      <Preloader></Preloader>
      <Navbar v-if="this.$route.path !== '/Login'"></Navbar>
      <Sidebar v-if="this.$route.path !== '/Login'"></Sidebar>

      <div class="content-wrapper" v-if="this.$route.path == '/'">
        <section class="content progressBar">
          <div class="container-fluid p-2">
            <div class="rounded">
              <router-view />
            </div>
          </div>
        </section>
      </div>
      <div class="content-wrapper" v-else-if="this.$route.path !== '/Login'">
        <section class="content progressBar">
          <div class="container-fluid p-2">
            <div class="p-3 m-1 bg-white rounded">
              <router-view />
            </div>
          </div>
        </section>
      </div>

      <section class="content progressBar login-content" v-else>
        <div class="container-fluid p-2">
          <router-view />
        </div>
      </section>

      <Footer v-if="this.$route.path !== '/Login'"></Footer>
      <ControlSidebar v-if="this.$route.path !== '/Login'"></ControlSidebar>
    </div>
  </body>
</template>

<script>
import "../node_modules/admin-lte/plugins/select2-bootstrap4-theme/select2-bootstrap4.min.css";
import "../node_modules/admin-lte/plugins/select2/css/select2.min.css";

import Navbar from "./layout/NavbarComponent.vue";
import Sidebar from "./layout/SidebarComponent.vue";
import Footer from "./layout/FooterComponent.vue";
import ControlSidebar from "./layout/ControlSidebar.vue";
import Preloader from "./layout/PreLoader.vue";
export default {
  name: "App",
  components: {
    Preloader,
    Navbar,
    Sidebar,
    Footer,
    ControlSidebar
  },
};
</script>

<style>
* {
  font-family: "Poppins", sans-serif;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px lightgray;
  border-radius: 8px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #139694;
  border-radius: 8px;
  cursor: pointer;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #18bebc;
}

html {
  font-size: 13.5px;
}

.content {
  max-height: 100% !important;
}

.p-component {
  font-family: "Poppins", sans-serif !important;
}

:root {
  --primary-color: #139694;
}

#nprogress .bar {
  background: #139694 !important;
}
</style>
