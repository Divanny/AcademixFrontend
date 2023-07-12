<template>
  <div class="container-fluid h-100">
    <div class="d-flex flex-wrap justify-content-between">
      <div class="col-lg-4 col-sm-12">
        <div class="surface-card shadow-2 p-4 border-round m-1">
          <div class="text-center">
            <h5>Información general</h5>
            <Avatar :label="maestrosDashboardModel.InfoUsuario.Nombres[0]" class="my-3" shape="circle" size="xlarge"
              style="background-color: #137775; color: #ffffff" />
            <h6>{{ maestrosDashboardModel.InfoUsuario.Nombres }} {{ maestrosDashboardModel.InfoUsuario.Apellidos }}</h6>
            <hr />
            <div class="my-2">
              <b><i class="fas fa-chalkboard-teacher mr-2" />Matrícula:</b>
              <p>{{ maestrosDashboardModel.InfoMaestro.credencial }}</p>
            </div>
            <div class="my-2">
              <b><i class="fas fa-university mr-2" />Area académica:</b>
              <p>{{ maestrosDashboardModel.InfoMaestro.Area }}</p>
            </div>
            <div class="my-2">
              <b><i class="fas fa-envelope mr-2" />Correo institucional:</b>
              <p>{{ maestrosDashboardModel.InfoUsuario.CorreoElectronico }}</p>
            </div>
          </div>
          <div class="row"></div>
        </div>
      </div>
      <div class="col-lg-8 col-sm-12 h-100">
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-4" v-for="asignatura in asignaturas" :key="asignatura.id">
            <div class="surface-card shadow-2 p-3 border-round m-1" style="height: 100%">
              <div class="flex justify-content-between mb-3">
                <div style="width: 70%;">
                  <span class="block font-medium"
                    style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ asignatura.nombre }}</span>
                  <span class="block text-gray-400 text-200" style="font-size: smaller">Sección {{ asignatura.seccion
                  }}</span>
                </div>
                <div :class="[
                    'flex align-items-center justify-content-center',
                    'bg-' + asignatura.color + '-100',
                    'border-round', 'ml-2'
                  ]" style="width: 2.5rem; height: 2.5rem">
                  <i :class="[
                    asignatura.iconClass,
                    'text-' + asignatura.color + '-800',
                    'text-xl',
                  ]"></i>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center" style="height: calc(100% - 3rem)">
                <div>
                  <router-link :to="{ name: 'Publicación de Calificaciones', params: { idSeccion: asignatura.id } }">
                    <Button severity="secondary" class="btn-outline p-0" size="small" plain text>
                      <span class="far fa-eye p-button-icon m-2"></span>
                    </Button>
                  </router-link>
                </div>
                <span class="block text-500 font-small" style="font-size: x-small">{{ asignatura.cantidadEstudiantes }}
                  estudiantes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utilities/api";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";

export default {
  name: "ProfesorHome",
  props: {},
  setup() {
    const toast = useToast();
    return { toast }
  },
  data() {
    return {
      maestrosDashboardModel: {
        InfoMaestro: {},
        InfoUsuario: {
          Nombres: "",
        },
        Secciones: [],
      },
      asignaturas: [],
    };
  },
  mounted() {
    this.loadInfo();
  },
  methods: {
    async loadInfo() {
      const response = await api.get('api/Dashboard/Maestros');
      console.log(response);
      if (response.data) {
        this.maestrosDashboardModel = response.data;
        this.asignaturas = this.maestrosDashboardModel.Secciones.map(x => ({
          id: x.idSeccion,
          nombre: x.Asignatura,
          seccion: x.codigoSeccion,
          iconClass: "fas fa-book",
          color: "teal",
          cantidadEstudiantes: x.cantidadEstudiantes
        }
        ))
      } else {
        this.toast.error("No se pudo cargar la información del maestro", toastProperties);
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style></style>
