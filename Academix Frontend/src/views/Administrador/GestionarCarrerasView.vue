<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt"
        :value="Carreras"
        v-model:selection="selectedProducts"
        dataKey="idCarrera"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} carreras"
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
                @click="crearCarrera"
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
                placeholder="Buscar carrera"
              />
            </span>
          </div>
        </template>

        <Column style="width: 1%"></Column>
        <Column field="nombre" header="Carrera" sortable></Column>
        <Column field="descripcion" header="Descripción" sortable></Column>
        <Column field="Area" header="Area" sortable></Column>
        <Column
          field="duracionTrimestres"
          header="Trimestres"
          sortable
          :bodyStyle="{ 'text-align': 'center' }"
        ></Column>
        <Column
          field="CantEstudiantes"
          header="Estudiantes"
          sortable
          :bodyStyle="{ 'text-align': 'center' }"
        >
        </Column>
        <Column
          field="CantAsignaturas"
          header="Asignaturas"
          sortable
          :bodyStyle="{ 'text-align': 'center' }"
        >
        </Column>
        <Column
          field="creditos"
          header="Creditos"
          sortable
          :bodyStyle="{ 'text-align': 'center' }"
        >
        </Column>
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
              @click="editarCarrera(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="carreraDialog"
      :style="{ width: '450px' }"
      header="Detalles Carrera"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="nombre">Nombre</label>
        <InputText
          id="nombre"
          v-model.trim="carrera.nombre"
          required="true"
          autofocus
          :class="{ 'p-invalid': enviado && !carrera.nombre }"
        />
        <small class="p-error" v-if="enviado && !carrera.nombre"
          >El nombre es requerido.</small
        >
      </div>
      <div class="field">
        <label for="descripcion">Descripción</label>
        <Textarea
          id="descripcion"
          v-model="carrera.descripcion"
          required="true"
          rows="3"
          cols="20"
          :class="{ 'p-invalid': enviado && !carrera.descripcion }"
        /><small class="p-error" v-if="enviado && !carrera.descripcion"
          >La descripción es requerida.</small
        >
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="Areas" class="mb-3">Area Academica</label>
          <Dropdown
            id="idArea"
            v-model="carrera.idArea"
            :options="Areas"
            optionLabel="nombre"
            placeholder="Seleccionar Area"
            required="true"
            :class="{ 'p-invalid': enviado && !carrera.idArea }"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.idArea">
                <Tag
                  :value="slotProps.value.nombre"
                  :severity="getAreaColor(slotProps.value.nombre)"
                />
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template> </Dropdown
          ><small class="p-error" v-if="enviado && !carrera.idArea"
            >El Area es requerida.</small
          >
        </div>
        <div class="field col">
          <label for="Actividad" class="mb-3">Estado</label>
          <Dropdown
            v-model="carrera.esActivo"
            :options="estaActivo"
            optionLabel="label"
            placeholder="Seleccionar Estado"
            required="true"
            :class="{ 'p-invalid': enviado && carrera.esActivo }"
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
          <small class="p-error" v-if="enviado && !carrera.esActivo"
            >El Estado es requerido.</small
          >
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="duracionTrimestres">Trimestres</label>
          <InputNumber
            id="duracionTrimestres"
            v-model="carrera.duracionTrimestres"
            integeronly
            :class="{ 'p-invalid': enviado && !carrera.duracionTrimestres }"
          /><small class="p-error" v-if="enviado && !carrera.duracionTrimestres"
            >La cantidad de trimestres es requerida.</small
          >
        </div>
        <div class="field col">
          <label for="creditos">Creditos</label>
          <InputNumber
            id="creditos"
            v-model="carrera.creditos"
            integeronly
            :class="{ 'p-invalid': enviado && !carrera.creditos }"
          /><small class="p-error" v-if="enviado && !carrera.creditos"
            >La cantidad máxima de creditos es requerida.</small
          >
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="cerrarDialog"
        />
        <Button label="Crear" icon="pi pi-check" text @click="guardarCarrera" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";
import api from "@/utilities/api";
onMounted(() => {
  cargarCarreras();
  cargarAreas();
});

const toast = useToast();
const store = useStore();
const dt = ref();
const carrera = ref();
const editandoCarrera = ref();
const Carreras = ref([]);
const Areas = ref([]);
const carreraDialog = ref(false);
const enviado = ref(false);
const estaActivo = ref([
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const crearCarrera = () => {
  carrera.value = {};

  editandoCarrera.value = false;
  enviado.value = false;
  carreraDialog.value = true;
};
const cerrarDialog = () => {
  carreraDialog.value = false;
  enviado.value = false;
};
const editarCarrera = (carreraEdit) => {
  carrera.value = {};
  editandoCarrera.value = true;
  carrera.value = carreraEdit;
  carrera.value.idArea = Areas.value.filter(
    (element) => element.idArea === carreraEdit.idArea
  );
  console.log(carrera.value.idArea);
  carrera.value.esActivo = estaActivo.value.find(
    (element) => element.value === carreraEdit.esActivo
  );
  console.log(carrera.value.esActivo);
  carreraDialog.value = true;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const getAreaColor = (status) => {
  switch (status) {
    case "INSTOCK":
      return "success";

    case "LOWSTOCK":
      return "warning";

    case "OUTOFSTOCK":
      return "danger";

    default:
      return "success";
  }
};
const cargarCarreras = async () => {
  const response = await api.get("api/Carreras");
  if (response.data) {
    console.log(response.data);
    Carreras.value = response.data;
  } else {
    this.toast.error("Error al cargar las carreras", toastProperties);
  }
};
const cargarAreas = async () => {
  const response = await api.get("api/Areas");
  if (response.data) {
    console.log(response.data);
    Areas.value = response.data;
  } else {
    this.toast.error("Error al cargar las areas", toastProperties);
  }
};
const getCarreraEstado = (estado) => {
  switch (estado) {
    case true:
      return "Activa";

    case false:
      return "Inactiva";

    default:
      return "Activa";
  }
};
const getEstadoColor = (estado) => {
  switch (estado) {
    case true:
      return "success";

    case false:
      return "danger";

    default:
      return "success";
  }
};
const guardarCarrera = async () => {
  enviado.value = true;

  if (
    carrera.value.nombre &&
    carrera.value.nombre.length > 0 &&
    carrera.value.descripcion &&
    carrera.value.descripcion.length > 0 &&
    carrera.value.idArea &&
    carrera.value.esActivo &&
    carrera.value.duracionTrimestres &&
    carrera.value.creditos
  ) {
    carrera.value.idArea = carrera.value.idArea.idArea;
    carrera.value.esActivo = carrera.value.esActivo.value;
    if (editandoCarrera.value !== true) {
      try {
        await api.post("/api/Carreras", carrera.value).then((response) => {
          if (response.data.Success) {
            toast.success(
              response.data.Message,
              store.state.defaultToastOptions
            );
          } else {
            toast.warning(
              response.data.Message,
              store.state.defaultToastOptions
            );
          }
        });
      } catch (error) {
        toast.error(
          "Error 500. Error al realizar la operación.",
          store.state.defaultToastOptions
        );
      }
    } else {
      try {
        await api
          .put(
            `/api/Carreras?idCarrera=${carrera.value.idCarrera}`,
            carrera.value
          )
          .then((response) => {
            if (response.data.Success) {
              toast.success(
                response.data.Message,
                store.state.defaultToastOptions
              );
            } else {
              toast.warning(
                response.data.Message,
                store.state.defaultToastOptions
              );
            }
          });
      } catch (error) {
        toast.error(
          "Error 500. Error al realizar la operación.",
          store.state.defaultToastOptions
        );
      }
    }
    carreraDialog.value = false;
    carrera.value = {};

    await cargarCarreras();
  } else {
    console.log("Error: campos obligatorios no introducidos");
  }
};
</script>
