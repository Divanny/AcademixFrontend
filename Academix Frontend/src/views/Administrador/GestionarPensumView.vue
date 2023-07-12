<template>
  <div>
    <div class="card">
      <DataTable
        ref="dt"
        :value="Pensum"
        dataKey="idPensum"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Pensum"
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
                @click="crearPensum"
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
                placeholder="Buscar Pensum"
              />
            </span>
          </div>
        </template>

        <Column style="width: 1%"></Column>
        <Column field="nombrePensum" header="Pensum" sortable></Column>
        <Column field="Carrera" header="Carrera" sortable></Column>
        <Column field="descripcion" header="Descripción" sortable></Column>

        <Column
          field="CantAsignaturas"
          header="No. de Asignaturas"
          sortable
          filterMatchMode="equals"
          :bodyStyle="{ 'text-align': 'center' }"
        >
          <template #body="{ data }">
            <div v-if="data.CantAsignaturas !== 0">
              {{ data.CantAsignaturas }}
            </div>
            <div v-else>Aún no tiene asignaturas</div>
          </template>
        </Column>
        <Column
          field="limiteCreditoTrimestral"
          header="Max. Creditos"
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
              :value="getPensumEstado(data.esActivo)"
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
              @click="editarPensum(slotProps.data)"
            />
          </template>
        </Column>
        <Column :exportable="false" :bodyStyle="{ 'text-align': 'center' }">
          <template #body="slotProps">
            <Button
              icon="pi pi-plus"
              outlined
              rounded
              class="mr-2"
              @click="asignarMaterias(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- //CREAR PENSUM DIALOG -->
    <Dialog
      v-model:visible="pensumDialog"
      :style="{ width: '450px' }"
      header="Detalles Pensum"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="nombrePensum">Nombre del Pensum</label>
        <InputText
          id="nombrePensum"
          v-model.trim="pensum.nombrePensum"
          required="true"
          autofocus
          :class="{ 'p-invalid': enviado && !pensum.nombrePensum }"
        />
        <small class="p-error" v-if="enviado && !pensum.nombrePensum"
          >El nombre del pensum es requerido.</small
        >
      </div>
      <div class="field">
        <label for="idCarrera" class="mb-3">Carrera</label>
        <Dropdown
          id="idCarrera"
          v-model="pensum.idCarrera"
          :options="Carreras"
          optionLabel="nombre"
          placeholder="Seleccionar Carrera"
          required="true"
          :class="{ 'p-invalid': enviado && !pensum.idCarrera }"
        ></Dropdown
        ><small class="p-error" v-if="enviado && !pensum.idCarrera"
          >La carrera es requerida.</small
        >
      </div>
      <div class="field">
        <label for="descripcion">Descripción</label>
        <Textarea
          id="descripcion"
          v-model="pensum.descripcion"
          required="true"
          rows="3"
          cols="20"
          :class="{ 'p-invalid': enviado && !pensum.descripcion }"
        /><small class="p-error" v-if="enviado && !pensum.descripcion"
          >La descripción es requerida.</small
        >
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="Areas" class="mb-3">Area Academica</label>
          <Dropdown
            id="idArea"
            v-model="pensum.idArea"
            :options="Areas"
            optionLabel="nombre"
            placeholder="Seleccionar Area"
            required="true"
            :class="{ 'p-invalid': enviado && !pensum.idArea }"
          >
          </Dropdown
          ><small class="p-error" v-if="enviado && !pensum.idArea"
            >El Area es requerida.</small
          >
        </div>
        <div class="field col">
          <label for="Actividad" class="mb-3">Estado</label>
          <Dropdown
            v-model="pensum.esActivo"
            :options="estaActivo"
            optionLabel="label"
            placeholder="Seleccionar Estado"
            required="true"
            :class="{ 'p-invalid': enviado && pensum.esActivo }"
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
          <small class="p-error" v-if="enviado && !pensum.esActivo"
            >El Estado es requerido.</small
          >
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="Areas" class="mb-3">Max. Credit. Trimestrales</label>
          <InputNumber
            id="limiteCreditoTrimestral"
            v-model="pensum.limiteCreditoTrimestral"
            :class="{
              'p-invalid': enviado && !pensum.limiteCreditoTrimestral,
            }"
            inputId="withoutgrouping"
            :useGrouping="false"
            :min="12"
            :max="30"
          /><small
            class="p-error"
            v-if="enviado && !pensum.limiteCreditoTrimestral"
            >La cantidad máxima de creditos trimestrales requerida.</small
          >
        </div>
        <div class="field col">
          <label for="Actividad" class="mb-3">Año Pensum</label>
          <Dropdown
            v-model="pensum.anioPensum"
            :options="anioPensum"
            optionLabel="label"
            placeholder="Seleccionar Año"
            required="true"
            :class="{ 'p-invalid': enviado && pensum.anioPensum }"
          >
            <template #value="slotProps">
              <div
                v-if="slotProps.value !== null && slotProps.value !== undefined"
              >
                {{ slotProps.value.label }}
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
          </Dropdown>
          <small class="p-error" v-if="enviado && !pensum.anioPensum"
            >El año del pensum es requerido.</small
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
        <Button label="Crear" icon="pi pi-check" text @click="guardarPensum" />
      </template>
    </Dialog>
    <!-- //ASIGNAR MATERIAS AL PENSUM DIALOG -->
    <Dialog
      v-model:visible="aignaturasDialog"
      :style="{ width: '1200px' }"
      header="Agregar  Pensum"
      :modal="true"
      class="p-fluid"
    >
      <div class="formgrid grid">
        <div class="field col-9">
          <label for="Trimestre" class="mb-3">Trimestre</label>
          <Dropdown
            id="idTrimestre"
            v-model="pensum.idTrimestre"
            :options="Trimestres"
            optionLabel="descripcion"
            placeholder="Seleccionar Trimestre"
            required="true"
            :class="{ 'p-invalid': cargarAsig && !pensum.idTrimestre }"
          >
          </Dropdown
          ><small class="p-error" v-if="cargarAsig && !pensum.idTrimestre"
            >El Trimestre es requerido.</small
          >
        </div>

        <div class="field col-3">
          <label for="Trimestre" class="mb-5"> </label>
          <Button
            class="p-button-sm border-green-800"
            style="margin: 0px 5px"
            label="Buscar"
            icon="pi pi-search"
            outlined
            severity="success"
            @click="cargarAsignaturasPensum()"
          ></Button>
        </div>
      </div>
      <label class="mb-3">Asignaturas del Trimestre</label>
      <div class="card">
        <DataTable
          :paginator="true"
          :rows="10"
          :filters="filters2"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} las Asignaturas"
          :value="pensumAsignaturas"
          dataKey="idAsignatura"
          tableStyle="min-width: 50rem"
        >
          <template #header>
            <div class="flex justify-content-between">
              <div></div>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters2['global'].value"
                  class="p-inputtext-sm"
                  placeholder="Buscar Asignatura"
                />
              </span>
            </div>
          </template>
          <Column field="CodigoAsignatura" header="Codigo"></Column>
          <Column field="NombreAsignatura" header="Nombre"></Column>
          <Column field="Area" header="Prerrequisito"></Column>
          <Column field="Creditos" header="Creditos"></Column>
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
        </DataTable>
      </div>

      <label class="mb-3">Asignaturas </label>
      <div class="card">
        <DataTable
          v-model:selection="asignaturasSeleccionadas"
          :value="Asignaturas"
          tableStyle="min-width: 50rem"
          :paginator="true"
          :rows="10"
          :filters="filters3"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} Pensum"
        >
          <template #header>
            <div class="flex justify-content-between">
              <div></div>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters3['global'].value"
                  class="p-inputtext-sm"
                  placeholder="Buscar asignatura"
                />
              </span>
              <div>
                <Button
                  class="p-button-sm border-green-800"
                  style="margin: 0px 5px"
                  label="Agregar"
                  icon="fas fa-chevron-up"
                  outlined
                  severity="success"
                  @click="agregarAsignaturas()"
                ></Button>
              </div>
            </div>
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="CodigoAsignatura" header="Codigo"></Column>
          <Column field="NombreAsignatura" header="Nombre"></Column>
          <Column field="Area" header="Area"></Column>
          <Column field="Creditos" header="Creditos"></Column>
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
        </DataTable>
      </div>

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
          @click="guardarAsignaturasTrimestre()"
        />
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
  cargarPensum();
  cargarAreas();
  cargarCarreras();
  cargarAsignaturas();
  cargarTrimestres();
});
const asignaturasSeleccionadas = ref();
const toast = useToast();
const store = useStore();

const dt = ref();
const pensum = ref();
const editandoPensum = ref();
const Pensum = ref([]);
const Carreras = ref([]);
const Trimestres = ref([]);
const Asignaturas = ref();
const pensumAsignaturas = ref([]);
const Areas = ref([]);
const pensumDialog = ref(false);
const aignaturasDialog = ref(false);
const enviado = ref(false);
const cargarAsig = ref(false);

const estaActivo = ref([
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
]);
const anioPensum = ref([
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "2030", value: "2030" },
]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const filters2 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const filters3 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

/////////////////////////FUNCIONES///////////////////////////////////////////////////////////////
/////////////////////////FUNCIONES///////////////////////////////////////////////////////////////
/////////////////////////FUNCIONES///////////////////////////////////////////////////////////////
/////////////////////////FUNCIONES///////////////////////////////////////////////////////////////
const crearPensum = () => {
  pensum.value = {};

  editandoPensum.value = false;
  enviado.value = false;
  pensumDialog.value = true;
};
const asignarMaterias = (pensumEdit) => {
  pensum.value = {};
  pensum.value = pensumEdit;

  editandoPensum.value = false;
  enviado.value = false;
  aignaturasDialog.value = true;
};
const cerrarDialog = () => {
  pensumDialog.value = false;
  aignaturasDialog.value = false;
  enviado.value = false;
  cargarAsig.value = false;
  pensumAsignaturas.value = [];
};
const editarPensum = (pensumEdit) => {
  pensum.value = {};
  editandoPensum.value = true;
  pensum.value = pensumEdit;

  pensum.value.idCarrera = Carreras.value.filter(
    (element) => element.idCarrera === pensumEdit.idCarrera
  );
  console.log(pensum.value.idCarrera);
  pensum.value.idArea = Areas.value.filter(
    (element) => element.idArea === pensumEdit.idArea
  );
  console.log(pensum.value.idArea);
  pensum.value.esActivo = estaActivo.value.find(
    (element) => element.value === pensumEdit.esActivo
  );
  console.log(pensum.value.esActivo);
  pensum.value.anioPensum = anioPensum.value.find(
    (element) => element.value === pensumEdit.anioPensum
  );
  console.log(pensum.value.anioPensum);
  pensumDialog.value = true;
};
const exportCSV = () => {
  dt.value.exportCSV();
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
const cargarTrimestres = async () => {
  const response = await api.get("/api/Pensum/GetTrimestre");
  if (response.data) {
    console.log(response.data);
    Trimestres.value = response.data;
  } else {
    this.toast.error("Error al cargar las carreras", toastProperties);
  }
};
const cargarAsignaturasPensum = async () => {
  cargarAsig.value = true;
  if (pensum.value.idTrimestre && cargarAsig.value) {
    const response = await api.get(
      `api/Pensum/GetAsignaturasTrimestrePensum?idPensum=${pensum.value.idPensum}&idTrimestre=${pensum.value.idTrimestre.idTrimestre}`
    );
    if (response.data) {
      console.log(response.data);
      pensumAsignaturas.value = response.data?.[0]?.Asignaturas || [];

      console.log("hola");
      console.log(pensumAsignaturas.value);
    } else {
      this.toast.error(
        "Error al cargar las asignatura del Pensum",
        toastProperties
      );
    }

    asignaturasSeleccionadas.value = [];
  }
};
const agregarAsignaturas = () => {
  console.log(pensumAsignaturas.value, asignaturasSeleccionadas.value)
  asignaturasSeleccionadas.value.map(x => {
    pensumAsignaturas.value.push(x);
  })
}
const cargarPensum = async () => {
  const response = await api.get("api/Pensum");
  if (response.data) {
    console.log(response.data);
    Pensum.value = response.data;
  } else {
    this.toast.error("Error al cargar el Pensum", toastProperties);
  }
};
const cargarAsignaturas = async () => {
  const response = await api.get("/api/Asignaturas");
  if (response.data) {
    console.log(response.data);
    Asignaturas.value = response.data;
  } else {
    this.toast.error("Error al cargar las Asignaturas", toastProperties);
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
const getPensumEstado = (estado) => {
  switch (estado) {
    case true:
      return "Activa";

    case false:
      return "Inactiva";

    default:
      return "Activa";
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
const guardarPensum = async () => {
  enviado.value = true;

  if (
    pensum.value.nombrePensum &&
    pensum.value.nombrePensum.length > 0 &&
    pensum.value.descripcion &&
    pensum.value.descripcion.length > 0 &&
    pensum.value.idArea &&
    pensum.value.esActivo &&
    pensum.value.limiteCreditoTrimestral > 12 &&
    pensum.value.anioPensum &&
    pensum.value.limiteCreditoTrimestral
  ) {
    pensum.value.idArea = pensum.value.idArea.idArea;
    pensum.value.esActivo = pensum.value.esActivo.value;
    pensum.value.anioPensum = pensum.value.anioPensum.value;
    pensum.value.idCarrera = pensum.value.idCarrera.idCarrera;

    if (editandoPensum.value !== true) {
      try {
        await api.post("/api/Pensum", pensum.value).then((response) => {
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
          .put(`/api/Pensum?idPensum=${pensum.value.idPensum}`, pensum.value)
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
    pensumDialog.value = false;
    pensum.value = {};

    await cargarPensum();
  } else {
    console.log("Error: campos obligatorios no introducidos");
  }
};
const guardarAsignaturasTrimestre = async () => {
  if (
    pensum.value.idTrimestre &&
    cargarAsig.value &&
    asignaturasSeleccionadas
  ) {
    const idsAsignatura = pensumAsignaturas.value.map(
      (asignatura) => asignatura.idAsignatura
    );
    try {
      console.log(idsAsignatura);
      await api
        .post(
          `/api/Pensum/PostAsignaturaPensum?idPensum=${pensum.value.idPensum}&idTrimestre=${pensum.value.idTrimestre.idTrimestre}`,
          idsAsignatura
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
      asignaturasSeleccionadas.value = [];
      await cargarAsignaturasPensum();
      await cargarPensum();
    } catch (error) {
      toast.error(
        "Error 500. Error al realizar la operación.",
        store.state.defaultToastOptions
      );
    }
  }
};
</script>
