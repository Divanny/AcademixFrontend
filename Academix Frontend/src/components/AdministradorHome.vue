<template>
  <div class="container-fluid p-4 bg-white rounded">
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Estudiantes</span>
              <div class="text-900 font-medium text-xl">{{ administradorDashboardModel.CantidadEstudiantes }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
              style="width: 2.5rem; height: 2.5rem">
              <i class="fas fa-user-graduate text-blue-500 text-xl"></i>
            </div>
          </div>
          <router-link :to="{ name: 'Gestionar Usuarios' }">
            <Button class="w-100 mb-2 justify-content-center py-1 bg-blue-100 text-blue-500" text
              plain>Administrar</Button>
          </router-link>

        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Profesores</span>
              <div class="text-900 font-medium text-xl">{{ administradorDashboardModel.CantidadMaestros }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
              style="width: 2.5rem; height: 2.5rem">
              <i class="pi pi-users text-orange-500 text-xl"></i>
            </div>
          </div>
          <router-link :to="{ name: 'Gestionar Usuarios' }">
            <Button class="w-100 mb-2 justify-content-center py-1 bg-orange-100 text-orange-500" text plain
              severity="warning">Administrar</Button>
          </router-link>

        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Asignaturas</span>
              <div class="text-900 font-medium text-xl">{{ administradorDashboardModel.CantidadAsignaturas }}</div>
            </div>
            <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style="width: 2.5rem; height: 2.5rem">
              <i class="fas fa-book text-cyan-500 text-xl"></i>
            </div>
          </div>
          <router-link to="/AdministrarAsignaturas">
            <Button class="w-100 mb-2 justify-content-center py-1 bg-cyan-100 text-cyan-500" text plain
              severity="cyan">Administrar</Button>
          </router-link>
        </div>
      </div>
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card shadow-2 p-3 border-round">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">Solicitudes de Soporte</span>
              <div class="text-900 font-medium text-xl">{{ administradorDashboardModel.CantidadSolicitudSoporte }} no
                leídas
              </div>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
              style="width: 2.5rem; height: 2.5rem">
              <i class="fas fa-headset text-purple-500 text-xl"></i>
            </div>
          </div>
          <Button class="w-100 mb-2 justify-content-center py-1 bg-purple-100 text-purple-500" text plain
            severity="help">Administrar</Button>
        </div>
      </div>
    </div>
    <div class="d-flex flex-wrap" v-if="estudiantesPorCarrera.chartData.labels != null && soportesPorMes.chartData.labels != null" >
      <div class="col-lg-6 col-md-6 col-sm-12 p-3">
        <Chart id="estudiantesPorCarrera" :type="estudiantesPorCarrera.chartType" :data="estudiantesPorCarrera.chartData"
          :options="estudiantesPorCarrera.chartOptions" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 p-3">
        <Chart id="soportesPorMes" type="line" :data="soportesPorMes.chartData" :options="soportesPorMes.chartOptions" />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utilities/api";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";

export default {
  name: "AdministradorHome",
  props: {},
  setup() {
    const toast = useToast();
    return { toast }
  },
  data() {
    return {
      administradorDashboardModel: {},
      soportesPorMes: {
        chartData: {
          labels: [],
          datasets: [
            {
              label: "Cantidad de Solicitudes de Soporte",
              data: [],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgb(54, 162, 235)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        chartOptions: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      },
      estudiantesPorCarrera: {
        chartType: "bar",
        chartData: {
          labels: [],
          datasets: [
            {
              label: "Número de Estudiantes",
              data: [],
              backgroundColor: [
                "rgba(255, 159, 64, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: [
                "rgb(255, 159, 64)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
              ],
              borderWidth: 1,
            },
          ],
        },
        chartOptions: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      },
    };
  },
  created() {
    this.loadDashboard();
  },
  methods: {
    async loadDashboard() {
      const response = await api.get("/api/Dashboard/Administrador");
      if (response.data) {
        this.administradorDashboardModel = response.data;

        this.estudiantesPorCarrera.chartData.labels = this.administradorDashboardModel.GraficaNumeroEstudiantes
          .filter(element => element.CantidadEstudiantes !== 0)
          .map(element => element.Carrera);

        this.estudiantesPorCarrera.chartData.datasets[0].data = this.administradorDashboardModel.GraficaNumeroEstudiantes
          .filter(element => element.CantidadEstudiantes !== 0)
          .map(element => element.CantidadEstudiantes);

        this.soportesPorMes.chartData.labels = this.administradorDashboardModel.GraficaSolicitudesSoporte
          .filter(element => element.CantidadSolicitudes !== 0)
          .map(element => element.Mes);

        this.soportesPorMes.chartData.datasets[0].data = this.administradorDashboardModel.GraficaSolicitudesSoporte
          .filter(element => element.CantidadSolicitudes !== 0)
          .map(element => element.CantidadSolicitudes);

      }
      else {
        this.toast.error("Error al cargar la información", toastProperties)
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
