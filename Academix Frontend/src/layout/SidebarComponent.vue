<template>
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4 sideBarStyle fixed">
    <!-- Brand Logo -->
    <a href="#" class="brand-link" style="padding: 1.22rem 0.5rem !important">
      <img src="../assets/academixWhite.png" alt="CGRD" class="brand-image img-circle elevation-1 mx-2"
        style="opacity: 0.9" />
      <span class="brand-text font-weight-normal" style="font-size: 1.2rem">Academix</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
                 with font-awesome or any other icon font library -->
          <!-- <li class="nav-item menu-open">
              <a href="#" class="nav-link active">
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <a href="./index.html" class="nav-link active">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Dashboard v1</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="./index2.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Dashboard v2</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="./index3.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Dashboard v3</p>
                  </a>
                </li>
              </ul>
            </li> -->
          <!-- <li class="nav-item">
              <a href="pages/widgets.html" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>
                  Widgets
                  <span class="right badge badge-danger">New</span>
                </p>
              </a>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-copy"></i>
                <p>
                  Layout Options
                  <i class="fas fa-angle-left right"></i>
                  <span class="badge badge-info right">6</span>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <a href="pages/layout/top-nav.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Top Navigation</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/top-nav-sidebar.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Top Navigation + Sidebar</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/boxed.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Boxed</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/fixed-sidebar.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Fixed Sidebar</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/fixed-sidebar-custom.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Fixed Sidebar <small>+ Custom Area</small></p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/fixed-topnav.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Fixed Navbar</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/fixed-footer.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Fixed Footer</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/layout/collapsed-sidebar.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Collapsed Sidebar</p>
                  </a>
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-chart-pie"></i>
                <p>
                  Charts
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <a href="pages/charts/chartjs.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>ChartJS</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/charts/flot.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Flot</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/charts/inline.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Inline</p>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="pages/charts/uplot.html" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>uPlot</p>
                  </a>
                </li>
              </ul>
            </li> -->

          <!-- <li class="nav-header">EXAMPLES</li> -->
          <li class="nav-item active" v-for="vista in userViews.filter(x => x.Principal == true)" :key="vista.URL">
            <router-link :to="{
              name: vista.Vista
            }" :class="{
  'nav-link': true,
  active: $route.name === vista.Vista,
}">
              <i :class="'nav-icon ' + vista.Icon"></i>
              <p>
                {{ vista.Vista }}
              </p>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    return {
      userViews: [],
    };
  },
  created() {
    this.store.dispatch('fetchUser');
  },
  watch: {
    '$store.getters.getUserViews'(views) {
      this.userViews = views;
    },
  },
};
</script>

<style>
.sideBarStyle {
  background-color: #314c53 !important;
  color: white !important;
}

.sideBarStyle .nav-item .active {
  background-color: white !important;
  color: #137775 !important;
}
</style>
