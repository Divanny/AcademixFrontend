<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt"
        :value="listaAsignaturas"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Asignaturas"
      >
        <template #header>
          <div class="flex justify-content-between">
            <div>
              <Button
                class="p-button-sm"
                style="margin: 0px 5px"
                label="Crear"
                icon="pi pi-plus"
                outlined
                severity="secondary"
                @click="crearAsignatura"
                color="#334"
              >
                <span class="pi pi-plus p-button-icon"></span>
                <span class="p-button-label">&nbsp;</span>
              </Button>
              <Button
                class="p-button-sm border-green-800"
                style="margin: 0px 5px"
                label="Descargar Listado"
                icon="pi pi-upload"
                outlined
                severity="success"
                @click="exportCSV($event)"
              >
                <span
                  class="far fa-file-excel p-button-icon p-button-icon-left text-green-800"
                ></span>
                <span class="p-button-label text-green-800">Exportar</span>
              </Button>
            </div>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                class="p-inputtext-sm"
                placeholder="Buscar asignatura"
              />
            </span>
          </div>
        </template>
        <Column style="width: 1%"></Column>
        <Column
          field="CodigoAsignatura"
          header="Codigo Asignatura"
          sortable
        ></Column>
        <Column
          field="NombreAsignatura"
          header="Nombre Asignatura"
          sortable
        ></Column>
        <Column field="Creditos" header="Creditos" sortable> </Column>
        <Column field="Carrera" header="Carrera" sortable></Column>
        <Column field="Area" header="Area Academica" sortable> </Column>
        <Column
          field="esActivo"
          header="Estado"
          sortable
          filterMatchMode="equals"
          :bodyStyle="{ 'text-align': 'center' }"
        >
          <template #body="{ data }">
            <Tag
              :value="getCarreraEstado(data.esActivo)"
              :severity="getEstadoColor(data.esActivo)"
            />
          </template>
        </Column>
        <Column :exportable="false" :bodyStyle="{ 'text-align': 'center' }">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editarAsignatura(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="asignaturaDialog"
      :style="{ width: '450px' }"
      header="Datos de Asignaturas"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="NombreAsignatura">Nombre</label>
        <InputText
          id="nombre"
          v-model.trim="asignatura.NombreAsignatura"
          required="true"
          autofocus
          :class="{ 'p-invalid': enviado && !asignatura.NombreAsignatura }"
        />
        <small class="p-error" v-if="enviado && !asignatura.NombreAsignatura"
          >Nombre es requerido.</small
        >
      </div>

      <div class="field">
        <label for="CodigoAsignatura">Codigo Asignatura</label>
        <InputText
          id="Codigo Asignatura"
          v-model.trim="asignatura.CodigoAsignatura"
          required="true"
          autofocus
          :class="{ 'p-invalid': enviado && !asignatura.CodigoAsignatura }"
        />
        <small class="p-error" v-if="enviado && !asignatura.CodigoAsignatura"
          >Codigo Asignatura es requerido.</small
        >
      </div>

      <div class="field">
        <label for="Area">Area</label>
        <Dropdown
          id="area"
          v-model="asignatura.idArea"
          :options="listaAreas"
          optionLabel="nombre"
          placeholder="Selecciona una area"
          :class="{
            'p-invalid': enviado && areaSeleccion,
          }"
        >
        </Dropdown
        ><small class="p-error" v-if="enviado && areaSeleccion"
          >El area es requerida.</small
        >
      </div>

      <div class="field">
        <label for="carrera" class="mb-3">Carrera</label>
        <Dropdown
          id="carrera"
          v-model="asignatura.idCarrera"
          :options="listaCarreras"
          optionLabel="nombre"
          placeholder="Seleccionar carrera"
          :class="{
            'p-invalid': enviado && areaSeleccion,
          }"
        >
        </Dropdown
        ><small class="p-error" v-if="enviado && areaSeleccion"
          >La carrera es requerido.</small
        >
      </div>

      <div class="field">
        <label for="Actividad" class="mb-3">Estado</label>
        <Dropdown
          v-model="asignatura.esActivo"
          :options="estaActivo"
          optionLabel="label"
          placeholder="Seleccionar Estado"
          required="true"
          :class="{ 'p-invalid': enviado && !asignatura.esActivo }"
        >
          <template #value="slotProps">
            <div
              v-if="slotProps.value !== null && slotProps.value !== undefined"
            >
              <Tag
                :value="slotProps.value.label"
                :severity="getEstadoColor(slotProps.value.value)"
              />
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Dropdown>
        <small class="p-error" v-if="enviado && !asignatura.esActivo"
          >El Estado es requerido.</small
        >
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="Creditos">Creditos</label>
          <InputNumber
            id="Creditos"
            required="true"
            v-model="asignatura.Creditos"
            :class="{ 'p-invalid': enviado && !asignatura.Creditos }"
            mode="decimal"
          /><small class="p-error" v-if="enviado && !asignatura.Creditos"
            >Los Creditos es requerido.</small
          >
        </div>
      </div>

      <!-- <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px">
        <label class="font-bold" for="Prerequisitos"
          >Asignar Prerequisito:</label
        >
        <div class="card flex justify-content-center">
          <MultiSelect
            v-model="asignatura.Dependencias"
            :options="materias"
            filter
            optionLabel="NombreAsignatura"
            placeholder="Selecciona Asignaturas como Prerequisitos"
            :maxSelectedLabels="3"
          />
        </div>
      </div> -->

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="cerrarDialog"
        />
        <Button
          label="Guardar"
          icon="pi pi-check"
          text
          @click="guardarAsignatura"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api";

import api from "@/utilities/api";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      listaAsignaturas: [],
      lista_id_prerrequisito: [],
      listaAreas: [],
      listaCarreras: [],
      asignatura: {},
      areaSeleccion: false,
      asignaturaDialog: false,
      enviado: false,
      editandoAsignatura: false,
      estaActivo: [
        { label: "Activo", value: true },
        { label: "Inactivo", value: false },
      ],

      asignaturasSeleccionadas: [],
      materias: [],
    };
  },

  mounted() {
    this.cargarAsignaturas();
    this.cargarAreas();
    this.cargarCarreras();
  },
  methods: {
    // createListaIdPrerrequisito() {
    //   this.lista_id_prerrequisito = [];
    //   for (let asig of this.asignatura.Dependencias) {
    //     const idPrerrequisito = asig.idAsignatura;
    //     const objPrerrequisito = { idPrerrequisito };
    //     this.lista_id_prerrequisito.push(objPrerrequisito);
    //   }
    // },
    async cargarAsignaturas() {
      const response = await api.get("api/Asignaturas");
      if (response.data) {
        this.listaAsignaturas = response.data;
        this.materias = response.data;
      } else {
        this.toast.error("Error al cargar las carreras", toastProperties);
      }
    },
    async cargarAreas() {
      const response = await api.get("api/Areas");
      if (response.data) {
        this.listaAreas = response.data;
        this.listaAreas.unshift({ idArea: null, nombre: "No Aplica" });
      } else {
        this.toast.error("Error al cargar las areas", toastProperties);
      }
    },
    async cargarCarreras() {
      const response = await api.get("api/Carreras");
      if (response.data) {
        // Asignar la respuesta al arreglo actualizado
        this.listaCarreras = response.data;
        this.listaCarreras.unshift({ idArea: null, nombre: "No Aplica" });
      } else {
        this.toast.error("Error al cargar las carreras", toastProperties);
      }
    },
    async guardarAsignatura() {
      this.enviado = true;

      if (
        this.asignatura.NombreAsignatura &&
        this.asignatura.CodigoAsignatura &&
        (this.asignatura.idArea || this.asignatura.idCarrera) &&
        this.asignatura.esActivo &&
        this.asignatura.Creditos >= 0
        // &&
        // this.asignatura.Dependencias !== this.asignatura.NombreAsignatura
      ) {
        this.asignatura.idArea !== null
          ? (this.asignatura.idArea = this.asignatura.idArea.idArea)
          : (this.asignatura.idArea = null);
        this.asignatura.idCarrera !== null
          ? (this.asignatura.idCarrera = this.asignatura.idCarrera.idCarrera)
          : (this.asignatura.idCarrera = null);
        this.asignatura.esActivo = this.asignatura.esActivo.value;

        // this.createListaIdPrerrequisito();
        // this.asignatura.Dependencias = this.lista_id_prerrequisito;

        console.log(this.lista_id_prerrequisito);

        if (this.editandoAsignatura !== true) {
          try {
            await api
              .post("/api/Asignaturas", this.asignatura)
              .then((response) => {
                if (response.data.Success) {
                  this.toast.success(
                    response.data.Message,
                    this.$store.state.defaultToastOptions
                  );
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
        } else {
          this.asignatura.Dependencias = [];
          try {
            await api
              .put(
                `/api/Asignaturas?idAsignatura=${this.asignatura.idAsignatura}`,
                this.asignatura
                /* `/api/Asignaturas?idPrerrequisito=${this.asignaturasSeleccionadas.idAsignatura}`,
                this.asignaturasSeleccionadas */
              )
              .then((response) => {
                if (response.data.Success) {
                  this.toast.success(
                    response.data.Message,
                    this.$store.state.defaultToastOptions
                  );
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
        }
        this.asignaturaDialog = false;
        this.asignatura = {};

        await this.cargarAsignaturas();
      } else {
        if (!this.asignatura.idCarrera && !this.asignatura.idArea) {
          this.areaSeleccion = true;
        } else {
          this.areaSeleccion = false;
        }
        console.log("Error: campos obligatorios no introducidos");
      }
    },
    crearAsignatura() {
      this.asignatura = { idArea: null, idCarrera: null };
      this.enviado = false;

      (this.editandoAsignatura = false), (this.asignaturaDialog = true);
    },
    cerrarDialog() {
      this.asignaturaDialog = false;
      this.enviado = false;
    },
    editarAsignatura(editAsignatura) {
      this.asignatura = {};
      this.asignaturaDialog = true;

      (this.editandoAsignatura = true), (this.asignatura = editAsignatura);
      this.asignatura.idArea = this.listaAreas.filter(
        (element) => element.idArea === editAsignatura.idArea
      );

      this.asignatura.esActivo = this.estaActivo.find(
        (element) => element.value === editAsignatura.esActivo
      );
      this.asignaturaDialog = true;
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    getEstadoColor(estado) {
      switch (estado) {
        case true:
          return "success";

        case false:
          return "danger";

        default:
          return "success";
      }
    },
    getCarreraEstado(estado) {
      switch (estado) {
        case true:
          return "Activa";

        case false:
          return "Inactiva";

        default:
          return "Activa";
      }
    },
    mandarPrerequisitos() {
      /* for(let asignaturas of this.) */
    },
  },
};
</script>
