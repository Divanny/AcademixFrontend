<template>
  <div class="container-fluid p-4 bg-white rounded">
    <Message v-if="tiempoDeSeleccion" severity="warn" class="m-0 mb-4">Proceso de <b>Selección</b> está disponible. Puedes
      acceder <b><router-link to="Selección de Asignaturas" style="color: var(--warning-color-text)">aquí.</router-link></b>
    </Message>
    <div class="d-flex flex-wrap justify-content-between">
      <div class="col-lg-8 col-sm-12">
        <div class="rounded h-100 p-2">
          <h5>Información general</h5>
          <div class="row">
            <div class="col-6 pr-3">
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="far fa-user mr-2" />Nombre:</b>
                {{ estudianteDashboardModel.InfoUsuario.Nombres }} {{ estudianteDashboardModel.InfoUsuario.Apellidos }}
              </div>
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="fas fa-envelope mr-2" />Correo:</b>
                {{ estudianteDashboardModel.InfoUsuario.CorreoElectronico }}
              </div>
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="far fa-id-card mr-2" />Identificación:</b> {{
                  estudianteDashboardModel.InfoUsuario.IdentificacionEstudiante }}
              </div>
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="fas fa-globe mr-2" />Nacionalidad:</b> Dominicana
              </div>
            </div>
            <div class="col-6 pl-3">
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="fas fa-graduation-cap mr-2" />Carrera:</b>
                {{ estudianteDashboardModel.InfoEstudiante.Carrera }}
              </div>
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="fas fa-list-alt mr-2" />Pensum:</b> {{ estudianteDashboardModel.InfoEstudiante.Pensum }}
              </div>
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="fas fa-check-circle mr-2" />Créditos aprobados:</b> {{ estudianteDashboardModel.InfoEstudiante.CreditosAprobados }} de {{ estudianteDashboardModel.InfoEstudiante.CreditosTotales }}
              </div>
              <div class="p-2 d-flex justify-content-between flex-wrap">
                <b><i class="fas fa-calendar mr-2" />Período actual:</b> {{ (estudianteDashboardModel.PeriodoDesde) ? estudianteDashboardModel.PeriodoDesde.toUpperCase() : "" }} - {{ (estudianteDashboardModel.PeriodoHasta) ? estudianteDashboardModel.PeriodoHasta.toUpperCase() : "" }} {{ (estudianteDashboardModel.PeriodoAño) ? estudianteDashboardModel.PeriodoAño.toUpperCase() : "" }}
              </div>
            </div>
          </div>
          <hr>
        </div>
      </div>
      <div class="col-lg-4 col-sm-12 h-100">
        <div class="d-flex">
          <div class="col-6 pl-0">
            <div class="bg-gray p-2 rounded">
              Índice General
              <h1>{{ Number.parseFloat(estudianteDashboardModel.InfoEstudiante.IndiceGeneral).toFixed(2) }}</h1>
            </div>
          </div>
          <div class="col-6 pr-0">
            <div class="bg-gray p-2 rounded">
              Índice Trimestral
              <h1>{{ Number.parseFloat(estudianteDashboardModel.InfoEstudiante.IndiceTrimestral).toFixed(2) }}</h1>
            </div>
          </div>
        </div>

        <div class="col-12 rounded my-2" style="background-color: #137775; color: #ffffff">
          Honor Académico
          <h1>{{ estudianteDashboardModel.InfoEstudiante.HonorAcademico }}</h1>
        </div>
      </div>
      <div class="d-flex flex-wrap justify-content-between align-items-center">
        <h5 class="my-3 mx-2">Asignaturas seleccionadas</h5>
        <div>
          <Button @click="downloadAsignaturasSeleccionadas()" severity="secondary" class="btn-outline p-0" size="small" plain text>
            <span class="pi pi-download p-button-icon m-2"></span>
          </Button>
        </div>
      </div>
    </div>
    <div id="printAsignaturasSeleccionadas">
      <DataTable :value="asignaturasSeleccionadas" class="p-datatable-sm selectedSubjects border-round table-borderless"
      p-datatable-wrapper="h-0" :rowHover="false" tableClass="rounded" tableStyle="border-radius: 20px">
      <Column field="codigo" header="Código"></Column>
      <Column field="seccion" header="Sección"></Column>
      <Column field="asignatura" header="Asignatura"></Column>
      <Column field="creditos" header="Cr."></Column>
      <Column field="profesor" header="Profesor"></Column>
      <Column field="Lunes" header="Lun."></Column>
      <Column field="Martes" header="Mar."></Column>
      <Column field="Miercoles" header="Mie."></Column>
      <Column field="Jueves" header="Jue."></Column>
      <Column field="Viernes" header="Vie."></Column>
      <Column field="Sabado" header="Sáb."></Column>
      <Column field="calificacion" header="Calif"></Column>
    </DataTable>
    </div>
  </div>
</template>

<script>
import api from "@/utilities/api";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";
import { useStore } from "vuex";

export default {
  name: "EstudianteHome",
  props: {},
  setup() {
    const toast = useToast();
    const store = useStore();
    return { toast, store }
  },
  data() {
    return {
      estudianteDashboardModel: {
        InfoEstudiante: {},
        InfoUsuario: {},
        AsignaturasSeleccionadas: [
          {
            detalleSeccion: [],
          }
        ],
        PeriodoDesde: "",
        PeriodoHasta: "",
        PeriodoAño: ""
      },
      asignaturasSeleccionadas: [],
      tiempoDeSeleccion: false,
    };
  },
  mounted() {
    this.loadDashboard();
  },
  methods: {
    async loadDashboard() {
      const response = await api.get("/api/Dashboard/Estudiantes");
      if (response.data) {
        console.log(response.data);
        this.estudianteDashboardModel = response.data;

        if (this.estudianteDashboardModel.AsignaturasSeleccionadas != null) {
          this.asignaturasSeleccionadas = this.estudianteDashboardModel.AsignaturasSeleccionadas.map(x => ({
            codigo: x.codigoAsignatura,
            seccion: x.codigoSeccion,
            asignatura: x.Asignatura,
            creditos: 3,
            profesor: x.Maestro,
            detalleSeccion: x.detalleSeccion,
            calificacion: (x.calificacion == 0) ? "" : x.calificacion,
            calificacionLiteral: x.calificacionLiteral,
          }));

          console.log(this.estudianteDashboardModel.AsignaturasSeleccionadas);

          this.estudianteDashboardModel.AsignaturasSeleccionadas.map(x => {
              x.detalleSeccion.map(y => {
                this.asignaturasSeleccionadas[this.estudianteDashboardModel.AsignaturasSeleccionadas.indexOf(x)][y.Dia] = `${(y.horaDesde).substr(0, 5)}-${(y.horaHasta).substr(0, 5)}`;
              });
            }
          )
        }

        console.log(this.asignaturasSeleccionadas);

        if (this.hasAccess("Selección de Asignaturas")) this.tiempoDeSeleccion = true;
      }
      else {
        this.toast.error("Error al cargar la información", toastProperties)
      }
    },
    hasAccess(to) {
      const userViews = this.store.getters.getUserViews;

      const hasAccess = userViews.some((view) => view.Vista == to);

      if (hasAccess) {
        return true;
      } else {
        return false;
      }
    },
    downloadAsignaturasSeleccionadas() {
      var mywindow = window.open('', 'PRINT');
      mywindow.document.write('<html><head><title>' + document.title  + '</title> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/primeflex@2.0.0/">');
      mywindow.document.write('</head><body >');
      mywindow.document.write('<h1>Asignaturas seleccionadas</h1>');
      mywindow.document.write(document.getElementById('printAsignaturasSeleccionadas').innerHTML);
      mywindow.document.write('</body></html>');

      mywindow.document.close(); // necessary for IE >= 10
      mywindow.focus(); // necessary for IE >= 10*/

      mywindow.print();
      mywindow.close();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.selectedSubjects .p-datatable-wrapper {
  height: auto !important;
}
</style>