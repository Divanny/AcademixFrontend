import { createRouter, createWebHashHistory } from "vue-router";
// import { useToast } from "vue-toastification";
// import toastProperties from './utilities/toastProperties.js'
import Login from "./views/LoginView";
import NotFound from "./views/NotFound";
import Home from "./views/HomeView";
import Pensum from "./views/Estudiante/PensumView.vue";
import HistorialAcademico from "./views/Estudiante/HistorialAcademicoView.vue";
import MisSolicitudesSoporte from "./views/Estudiante/MisSolicitudesSoporte.vue";
import SeleccionAsignaturas from "./views/Estudiante/SeleccionAsignaturasView.vue";
import GestionarPerfiles from "./views/Administrador/GestionarPerfilesView.vue";
import GestionarUsuarios from "./views/Administrador/GestionarUsuariosView.vue";
import GestionarPensum from "./views/Administrador/GestionarPensumView.vue";
import GestionarAreas from "./views/Administrador/GestionarAreasView.vue";
import GestionarCarreras from "./views/Administrador/GestionarCarrerasView.vue";
import BandejaSolicitudesSoporte from "./views/Administrador/BandejaSolicitudesSoporte.vue";
import Asignaturas from "./views/Administrador/AdministrarAsignaturas.vue";
import GestionarSecciones from "./views/Administrador/GestionarSecciones.vue";

import PublicacionCalificaciones from "./views/Maestro/PublicacionCalificaciones.vue";
import Ranking from "./views/Estudiante/RankingView.vue";

import api from "./utilities/api";
import store from "./store";

import NProgress from "nprogress";

const routes = [
  {
    path: "/Login",
    name: "Login",
    component: Login,
    iconClass: "",
    showOnLayout: false,
  },
  {
    path: "/Perfil",
    name: "Mi Perfil",
    component: NotFound,
    iconClass: "",
    showOnLayout: false,
  },
  {
    path: "/",
    name: "Inicio",
    component: Home,
    iconClass: "fas fa-home",
    showOnLayout: true,
  },
  {
    path: "/Pensum",
    name: "Pensum",
    component: Pensum,
    iconClass: "fas fa-book",
    showOnLayout: true,
  },
  {
    path: "/HistorialAcademico",
    component: HistorialAcademico,
    name: "Historial Academico",
    iconClass: "far fa-list-alt",
    showOnLayout: true,
  },
  {
    path: "/SeleccionAsignaturas",
    component: SeleccionAsignaturas,
    name: "Selección de Asignaturas",
    iconClass: "far fa-list-alt",
    showOnLayout: true,
  },
  {
    path: "/Publicacion/:idSeccion",
    component: PublicacionCalificaciones,
    name: "Publicación de Calificaciones",
    iconClass: "fas fa-edit",
    showOnLayout: true,
    props: true,
  },

  {
    path: "/GestionarUsuarios",
    name: "Gestionar Usuarios",
    component: GestionarUsuarios,
    iconClass: "fas fa-user-cog",
    showOnLayout: true,
  },
  {
    path: "/GestionarPerfiles",
    name: "Gestionar Perfiles",
    component: GestionarPerfiles,
    iconClass: "fas fa-users-cog",
    showOnLayout: true,
  },
  {
    path: "/GestionarAreas",
    name: "Gestionar Areas",
    component: GestionarAreas,

    iconClass: "fas fa-building",

    showOnLayout: true,
  },

  {
    path: "/GestionarCarreras",
    name: "Gestionar Carreras",
    component: GestionarCarreras,
    iconClass: "fas fa-graduation-cap",
    showOnLayout: true,
  },

  {
    path: "/GestionarPensum",
    name: "Gestionar Pensum",
    component: GestionarPensum,
    iconClass: "fas fa-graduation-cap",
    showOnLayout: true,
  },
  { path: "/:pathMatch(.*)*", name: "404", component: NotFound },

  {
    path: "/GestionarAsignaturas",
    name: "Gestionar Asignaturas",
    component: Asignaturas,
    iconClass: "fas fa-edit",
    showOnLayout: true,
  },
  {
    path: "/GestionarSecciones",
    name: "Gestionar Secciones",
    component: GestionarSecciones,
    iconClass: "fas fa-clone",
    showOnLayout: true,
  },
  {
    path: "/MisSolicitudesSoporte",
    name: "Mis Solicitudes",
    component: MisSolicitudesSoporte,
    iconClass: "fas fa-inbox",
    showOnLayout: true,
  },
  {
    path: "/BandejaSolicitudesSoporte",
    name: "Bandeja de Solicitudes",
    component: BandejaSolicitudesSoporte,
    iconClass: "fas fa-inbox",
    showOnLayout: true,
  },
  {
    path: "/Ranking",
    name: "Ranking de Estudiantes",
    component: Ranking,
    iconClass: "fas fa-trophy",
    showOnLayout: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  NProgress.remove();
  let authenticated = await isAuthenticated(to);
  document.title = "Academix - " + to.name;

  if (!authenticated && to.name != "Login") {
    document.title = "Academix — Iniciar sesión";
    return { name: "Login" };
  }

  if (authenticated && !hasAccess(to)) {
    return { name: "404" };
  }

  NProgress.configure({ parent: ".content-wrapper" });
});

function hasAccess(to) {
  const toName = to.name;
  const userViews = store.getters.getUserViews;

  const hasAccess = userViews.some(
    (view) => view.Vista == toName || toName == "404"
  );

  if (hasAccess) {
    return true;
  } else {
    return false;
  }
}

async function isAuthenticated() {
  if (localStorage.getItem("token") != null) {
    try {
      const response = await api.get("/api/Account/GetUserData");
      if (response.data.usuario.idUsuario) {
        return true;
      } else {
        localStorage.removeItem("token");
        return false;
      }
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}

export default router;
