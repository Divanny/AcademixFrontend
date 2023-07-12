<template>
  <div class="card">
    <DataTable editMode="cell" :value="Estudiantes" tableClass="editable-cells-table" @cell-edit-complete="onEditCalificacion" tableStyle="min-width: 50rem" :paginator="true" :rows="10" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 30]"
      currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} estudiantes">
      <template #empty> No se han encontrado estudiantes. </template>
      <template #header>
        <div class="flex justify-content-between">
          <div>
            <Button size="small" class="p-button-sm border-teal-800" icon="pi pi-save" severity="secondary" outlined
            @click="savePublicacion()"></Button>
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" class="p-inputtext-sm" placeholder="Buscar estudiante" />
          </span>
        </div>
      </template>
      <Column field="idEstudiante" header="#" sortable>
        <template #body="{ data }">
          {{ Estudiantes.indexOf(data) + 1}}
        </template>
      </Column>
      <Column field="NombreCompleto" header="Nombre completo"></Column>
      <Column field="Identificacion" header="Identificación"></Column>
      <Column field="Area" header="Area"></Column>
      <Column field="Carrera" header="Carrera"></Column>
      <Column field="Pensum" header="Pensum"></Column>
      <Column field="Calificacion" style="width: 10%" editable sortable header="Calificacion">
        <template #body="{ data }">
            {{ data.Calificacion }}
        </template>
        <template #editor="{ data }">
          <InputText v-model="data.Calificacion" autofocus class="p-inputtext-sm"/>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
import api from '@/utilities/api'
import { useToast } from "vue-toastification";
import toastProperties from '@/utilities/toastProperties';
import { FilterMatchMode } from "primevue/api";

export default {
  setup() {
    const toast = useToast();
    return { toast }
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      loading: false,
      Estudiantes: [],
    };
  },
  mounted() {
    this.loadEstudiantes();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadEstudiantes() {
      const response = await api.get(`api/SeccionAsignatura/ListadoEstudianteMaestro/${this.$route.params.idSeccion}`);
      if (response.data) {
        const result = response.data
        this.Estudiantes = result.map(x => ({
          NombreCompleto: x.infoUsuario.Nombres + " " + x.infoUsuario.Apellidos,
          Identificacion: "identificacion",
          Area: x.infoUsuario.InfoEstudiante.Area,
          Carrera: x.infoUsuario.InfoEstudiante.Carrera,
          Pensum: x.infoUsuario.InfoEstudiante.Pensum,
          Calificacion: x.calificacion,
          idListadoEstudiante: x.idListadoEstudiante
        }));
        console.log(this.Estudiantes);
      }
      else {
        this.toast.error("Error al cargar los estudiantes", toastProperties);
      }
    },
    onEditCalificacion(event) {
      console.log(event);
      let { data, newValue } = event;
      console.log(data, newValue)
      this.Estudiantes[this.Estudiantes.indexOf(data)].Calificacion = newValue;
    },
    async savePublicacion() {
      const publicacionModel = this.Estudiantes.map(x => ({
        idListadoEstudiante: x.idListadoEstudiante,
        Calificacion: x.Calificacion,
      }));

      console.log(publicacionModel);

      const response = await api.post('api/Publicacion', publicacionModel);
      if (response.data.Success) {
        this.loadEstudiantes();
        this.toast.success(response.data.Message, toastProperties);
      }
      else {
        this.toast.warning(response.data.Message, toastProperties);
      }
    },
  },
}
</script>

<style scoped>
.p-datatable td,
th {
  padding: 1rem !important
}

.rounded-datatable .p-datatable {
  border-radius: 10px;
  overflow: hidden;
}

.rounded-datatable .p-datatable .p-datatable-tbody>tr {
  border-radius: 10px;
}

.rounded-datatable .p-datatable .p-datatable-tbody>tr>td {
  border-radius: 0;
}

.rounded-datatable .p-datatable .p-datatable-tbody>tr:last-child>td:first-child {
  border-bottom-left-radius: 10px;
}

.rounded-datatable .p-datatable .p-datatable-tbody>tr:last-child>td:last-child {
  border-bottom-right-radius: 10px;
}

.RequestMessage p {
  margin-bottom: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>