<template>
  <label>Asignaturas Seleccionadas</label>
  <div class="card">
    <DataTable
      :value="asignaturasSeleccionadas"
      class="p-datatable-sm selectedSubjects border-round table-borderless"
      p-datatable-wrapper="h-0"
      showGridlines
      tableStyle="min-width: 50rem"
      :rowHover="false"
      tableClass="rounded"
    >
      <Column field="codigo" header="Código"></Column>
      <Column field="seccion" header="Sección"></Column>
      <Column field="asignatura" header="Asignatura"></Column>
      <Column field="creditos" header="Cr."></Column>
      <Column field="profesor" header="Profesor"></Column>
      <Column field="Aula" header="Aula"></Column>
      <Column field="Lunes" header="Lun."></Column>
      <Column field="Martes" header="Mar."></Column>
      <Column field="Miercoles" header="Mie."></Column>
      <Column field="Jueves" header="Jue."></Column>
      <Column field="Viernes" header="Vie."></Column>
      <Column field="Sabado" header="Sáb."></Column>
      <Column header="Acción">
        <template #body="{ data }">
          <Button
            @click="eliminarSeleccion(data.idListadoEstudiante)"
            icon="pi pi-trash"
            class="p-button-danger"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- ASIGNATURAS PARA SELECCIONAR -->
  <div class="card">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="AsignaturasREADY"
      dataKey="Codigo"
      :filters="filters"
    >
      <Column expander style="width: 0rem" />
      <Column field="Nombre" header="Asignaturas Disponibles"></Column>
      <Column style="width: 63%" />
      <Column field="" header=""
        ><template #header>
          <div
            class="flex flex-wrap gap-2 align-items-center justify-content-between"
          >
            <h4 class="m-0"></h4>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Buscar..."
              />
            </span>
          </div> </template
      ></Column>

      <template #expansion="slotProps">
        <div class="p-1">
          <DataTable
            :value="slotProps.data.Secciones"
            showGridlines
            tableStyle="min-width: 50rem"
            tableClass="rounded"
            p-datatable-wrapper="h-0"
            class="p-datatable-sm selectedSubjects border-round table-borderless"
          >
            <Column field="codigo" header="Codigo"></Column>
            <Column field="seccion" header="Sección"></Column>
            <Column field="creditos" header="Creditos"></Column>
            <Column field="profesor" header="Maestro"></Column>
            <Column field="Aula" header="Aula"></Column>
            <Column field="Modalidad" header="Modalidad"></Column>
            <Column field="Lunes" header="Lun."></Column>
            <Column field="Martes" header="Mar."></Column>
            <Column field="Miercoles" header="Mie."></Column>
            <Column field="Jueves" header="Jue."></Column>
            <Column field="Viernes" header="Vie."></Column>
            <Column field="Sabado" header="Sáb."></Column>
            <Column header="Seleccion" :bodyStyle="{ 'text-align': 'center' }">
              <template #body="{ data }">
                <Button
                  icon="pi pi-check"
                  rounded
                  outlined
                  aria-label="Filter"
                  @click="seleccionarAsignatura(data.idSecciom)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import { ref } from "vue";

import api from "@/utilities/api";

import { useToast } from "vue-toastification";
import { FilterMatchMode } from "primevue/api";

export default {
  setup() {
    const toast = useToast();

    const expandedRows = ref([]);
    return { toast, expandedRows };
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },

      rowSelectionMode: "multiple",
      seccionesdefault: [],

      estudianteDashboardModel: {
        InfoEstudiante: {},
        InfoUsuario: {},
        AsignaturasSeleccionadas: [
          {
            detalleSeccion: [],
          },
        ],
        PeriodoDesde: "",
        PeriodoHasta: "",
        PeriodoAño: "",
      },
      asignaturasSeleccionadas: [],
      AsignaturasGrouped: {},

      AsignaturasREADY: [],
    };
  },
  mounted() {
    this.cargarSeleccion();
    this.group();
  },
  methods: {
    async seleccionarAsignatura(asignatura) {
      console.log(asignatura);
      try {
        await api
          .post("api/ListadoEstudiantes", { idSeccion: asignatura })
          .then((response) => {
            if (response.data.Success) {
              this.toast.success(
                response.data.Message,
                this.$store.state.defaultToastOptions
              );
              this.cargarSeleccion();
            } else {
              this.toast.warning(
                response.data.Message,
                this.$store.state.defaultToastOptions
              );
            }
          });
      } catch (error) {
        this.toast.error(
          "Error 500. Error al realizar la operación.",
          this.$store.state.defaultToastOptions
        );
      }
    },
    async cargarSeleccion() {
      const response = await api.get("/api/Dashboard/Estudiantes");
      if (response.data) {
        this.estudianteDashboardModel = response.data;
        this.seccionesdefault = response.data;
        if (this.estudianteDashboardModel.AsignaturasSeleccionadas != null) {
          this.asignaturasSeleccionadas =
            this.estudianteDashboardModel.AsignaturasSeleccionadas.map((x) => ({
              codigo: x.codigoAsignatura,
              seccion: x.codigoSeccion,
              idListadoEstudiante: x.idListadoEstudiante,
              asignatura: x.Asignatura,
              creditos: x.creditos,
              profesor: x.Maestro,
              detalleSeccion: x.detalleSeccion,

              calificacionLiteral: "A",
            }));

          this.estudianteDashboardModel.AsignaturasSeleccionadas.map((x) => {
            x.detalleSeccion.map((y) => {
              this.asignaturasSeleccionadas[
                this.estudianteDashboardModel.AsignaturasSeleccionadas.indexOf(
                  x
                )
              ][y.Dia] = `${y.horaDesde.substr(0, 5)}-${y.horaHasta.substr(
                0,
                5
              )}`;

              this.asignaturasSeleccionadas[
                this.estudianteDashboardModel.AsignaturasSeleccionadas.indexOf(
                  x
                )
              ]["Aula"] = y.Aula;
            });
          });
        }
      }
    },
    async eliminarSeleccion(id) {
      console.log(id);
      try {
        await api
          .delete(`api/ListadoEstudiantes?idListadoEstudiante=${id}`)
          .then((response) => {
            if (response.data.Success) {
              this.toast.success(
                response.data.Message,
                this.$store.state.defaultToastOptions
              );
              this.cargarSeleccion();
            } else {
              this.toast.warning(
                response.data.Message,
                this.$store.state.defaultToastOptions
              );
            }
          });
      } catch (error) {
        this.toast.error(
          "Error 500. Error al realizar la operación.",
          this.$store.state.defaultToastOptions
        );
      }
    },
    async group() {
      const response = await api.get("api/SeccionAsignatura");
      if (response.data) {
        let seccionesAsignatura = response.data;
        let eachSeccion = [];
        if (seccionesAsignatura != null) {
          eachSeccion = seccionesAsignatura.map((x) => ({
            codigo: x.codigoAsignatura,
            idListadoEstudiante: x.idListadoEstudiante,
            seccion: x.codigoSeccion,
            asignatura: x.Asignatura,
            creditos: x.creditos,
            profesor: x.Maestro,
            detalleSeccion: x.detalleSeccion,
            calificacion: 95,
            calificacionLiteral: "A",
            Modalidad: x.Modalidad,
          }));

          seccionesAsignatura.map((x) => {
            x.detalleSeccion.map((y) => {
              eachSeccion[seccionesAsignatura.indexOf(x)][
                y.Dia
              ] = `${y.horaDesde.substr(0, 5)}-${y.horaHasta.substr(0, 5)}`;

              eachSeccion[seccionesAsignatura.indexOf(x)]["idSecciom"] =
                y.idSecciom;

              eachSeccion[seccionesAsignatura.indexOf(x)]["Aula"] = y.Aula;
            });
          });

          eachSeccion.forEach((x) => {
            if (this.AsignaturasGrouped[x.codigo] != null) {
              this.AsignaturasGrouped[x.codigo].Codigo = x.codigo;
              this.AsignaturasGrouped[x.codigo].Nombre = x.asignatura;
              this.AsignaturasGrouped[x.codigo].Secciones.push(x);
            } else {
              this.AsignaturasGrouped[x.codigo] = {
                Codigo: {},
                Nombre: {},
                Secciones: [],
              };

              this.AsignaturasGrouped[x.codigo].Codigo = x.codigo;
              this.AsignaturasGrouped[x.codigo].Nombre = x.asignatura;
              this.AsignaturasGrouped[x.codigo].Secciones.push(x);
            }
          });

          for (let clave in this.AsignaturasGrouped) {
            this.AsignaturasREADY.push(this.AsignaturasGrouped[clave]);
          }
        }
      }
    },
  },
};
</script>
