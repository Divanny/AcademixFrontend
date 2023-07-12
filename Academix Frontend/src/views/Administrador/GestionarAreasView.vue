<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt"
        :value="listaAreas"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Areas"
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
                @click="crearArea"
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

        <Column field="nombre" header="Nombre Area" sortable></Column>
        <Column field="descripcion" header="Descripción" sortable></Column>
        <Column field="Encargado" header="Encargado" sortable> </Column>
        <Column
          field="CantCarreras"
          header="No. de Carreras"
          sortable
          :bodyStyle="{ 'text-align': 'center' }"
        ></Column>

        <Column
          field="esActivo"
          header="Estado"
          sortable
          filterMatchMode="equals"
          :bodyStyle="{ 'text-align': 'center' }"
        >
          <template #body="{ data }">
            <Tag
              :value="getAreaEstado(data.esActivo)"
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
              @click="editarArea(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="areaDialog"
      :style="{ width: '450px' }"
      header="Datos del Área"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="nombre">Nombre del Área</label>
        <InputText
          id="nombre"
          v-model.trim="area.nombre"
          required="true"
          autofocus
          :class="{ 'p-invalid': enviado && !area.nombre }"
        />
        <small class="p-error" v-if="enviado && !area.nombre"
          >El nombre del área es requerido.</small
        >
      </div>

      <div class="field">
        <label for="descripcion">Descripción</label>
        <InputText
          id="Codigo Asignatura"
          v-model.trim="area.descripcion"
          required="true"
          autofocus
          :class="{ 'p-invalid': enviado && !area.descripcion }"
        />
        <small class="p-error" v-if="enviado && !area.descripcion"
          >La descripción es requerido.</small
        >
      </div>

      <div class="field">
        <label for="Encargado">Encargado</label>
        <Dropdown
          id="area"
          v-model="area.idEncargado"
          :options="listaEncargados"
          optionLabel="nombre"
          placeholder="Selecciona un Encargado"
          :class="{ 'p-invalid': enviado && !area.idEncargado }"
        >
        </Dropdown
        ><small class="p-error" v-if="enviado && !area.idEncargado"
          >El Encargado es requerida.</small
        >
      </div>

      <div class="field">
        <label for="Actividad" class="mb-3">Estado</label>
        <Dropdown
          v-model="area.esActivo"
          :options="estaActivo"
          optionLabel="label"
          placeholder="Seleccionar Estado"
          required="true"
          :class="{ 'p-invalid': enviado && !area.esActivo }"
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

        <small class="p-error" v-if="enviado && !area.esActivo"
          >El Estado es requerido.</small
        >
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="cerrarDialog"
        />
        <Button label="Guardar" icon="pi pi-check" text @click="guardarArea" />
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
      listaAreas: [],
      listaMaestros: [],
      listaEncargados: [],
      listaUsuarios: [],
      editandoArea: false,
      area: {},
      areaDialog: false,
      enviado: false,

      estaActivo: [
        { label: "Activo", value: true },
        { label: "Inactivo", value: false },
      ],
    };
  },

  mounted() {
    this.cargarAreas();
    this.cargarEncargado();
    this.cargarUsuarios();
  },
  methods: {
    async cargarAreas() {
      const response = await api.get("api/Areas");
      if (response.data) {
        this.listaAreas = response.data;
      } else {
        this.toast.error("Error al cargar las areas", toastProperties);
      }
    },
    async cargarEncargado() {
      const response = await api.get("api/Maestros");
      if (response.data) {
        this.listaMaestros = response.data;
      } else {
        this.toast.error("Error al cargar las carreras", toastProperties);
      }
    },
    async cargarUsuarios() {
      const response = await api.get("api/Usuarios");
      if (response.data) {
        this.listaUsuarios = response.data;
        this.listaEncargados = await this.llenarListaEncargados(
          this.listaMaestros,
          this.listaUsuarios
        );
      } else {
        this.toast.error("Error al cargar las carreras", toastProperties);
      }
    },
    async guardarArea() {
      this.enviado = true;

      if (
        this.area.nombre &&
        this.area.descripcion &&
        this.area.idEncargado &&
        this.area.esActivo
      ) {
        this.area.esActivo = this.area.esActivo.value;
        this.area.idEncargado = this.area.idEncargado.idEncargado;
        if (this.editandoArea !== true) {
          try {
            await api.post("/api/Areas", this.area).then((response) => {
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
          console.log(this.area.idArea);
          try {
            await api
              .put(`/api/Areas?idArea=${this.area.idArea}`, this.area)

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
        this.areaDialog = false;
        this.area = {};

        await this.cargarAreas();
      } else {
        console.log("Error: campos obligatorios no introducidos");
      }
    },
    llenarListaEncargados(listaMaestros, listaUsuarios) {
      const listaEncargados = [];

      listaMaestros.forEach((maestro) => {
        const usuario = listaUsuarios.find(
          (usuario) => usuario.idUsuario === maestro.idUsuario
        );
        if (usuario) {
          listaEncargados.push({
            nombre: `${usuario.Nombres} ${usuario.Apellidos}`,
            idEncargado: maestro.idMaestro,
          });
        }
      });

      return listaEncargados;
    },
    crearArea() {
      this.area = {};
      this.enviado = false;

      this.editandoArea = false;
      this.areaDialog = true;
    },
    cerrarDialog() {
      this.areaDialog = false;
      this.enviado = false;
    },
    editarArea(editArea) {
      this.area = {};
      this.areaDialog = true;

      (this.editandoArea = true), (this.area = editArea);

      this.area.esActivo = this.estaActivo.find(
        (element) => element.value === editArea.esActivo
      );
      this.area.idEncargado = this.listaEncargados.find(
        (element) => element.idEncargado === editArea.idEncargado
      );
      this.areaDialog = true;
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
    getAreaEstado(estado) {
      switch (estado) {
        case true:
          return "Activa";

        case false:
          return "Inactiva";

        default:
          return "Activa";
      }
    },
  },
};
</script>
