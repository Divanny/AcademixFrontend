<template>
  <div class="card">
    <DataTable :value="RankingEstudiantes" tableStyle="min-width: 50rem" :paginator="true" :rows="10" :filters="filters"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 50, 100]"
      currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} estudiantes">
      <template #header>
        <div class="flex justify-content-between">
          <div></div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" class="p-inputtext-sm" placeholder="Buscar estudiante" />
          </span>
        </div>
      </template>
      <Column field="Posicion" sortable header="Posición" style="width: 20px">
        <template #body={data}>
          <div class="w-100 text-center">
            <div v-if="data.Posicion == 1"><img src="@/assets/medal1.png" style="width: 30px; height: 30px"/></div>
            <div v-else-if="data.Posicion == 2"><img src="@/assets/medal2.png" style="width: 30px; height: 30px"/></div>
            <div v-else-if="data.Posicion == 3"><img src="@/assets/medal3.png" style="width: 30px; height: 30px"/></div>
            <div v-else>{{ data.Posicion }}</div>
          </div>
        </template>
      </Column>
      <Column field="NombreCompleto" header="Nombre completo"></Column>
      <Column field="Identificacion" header="Identificación"></Column>
      <Column field="Area" header="Area"></Column>
      <Column field="Carrera" header="Carrera"></Column>
      <Column field="Pensum" header="Pensum"></Column>
      <Column field="IndiceGeneral" sortable header="Indice General">
        <template #body={data}>
          {{ (data.IndiceGeneral > 0) ? Number.parseFloat(data.IndiceGeneral).toFixed(2) : ""}}
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
      Usuarios: [],
      RankingEstudiantes: [],
    };
  },
  mounted() {
    this.loadRanking();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadRanking() {
      const response = await api.get('api/Ranking');
      if (response.data) {
        this.Usuarios = response.data;
        console.log(this.Usuarios);
        this.RankingEstudiantes = this.Usuarios.map(x => ({
          Posicion: this.Usuarios.indexOf(x) + 1,
          NombreCompleto: x.Nombres + " " + x.Apellidos,
          Area: x.InfoEstudiante.Area,
          Carrera: x.InfoEstudiante.Carrera,
          Pensum: x.InfoEstudiante.Pensum,
          Identificacion: x.IdentificacionEstudiante,
          IndiceGeneral: x.InfoEstudiante.IndiceGeneral,
        }));
      }
      else {
        this.toast.error("Error al cargar los estudiantes", toastProperties);
      }
    },
  },
}
</script>

<style>
.p-datatable td,
th {
  padding: 0.5rem !important
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