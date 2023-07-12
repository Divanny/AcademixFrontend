<template>
  <div>
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h5><strong>{{ InfoEstudiante.Carrera }} - {{ InfoEstudiante.Pensum }}</strong></h5>
        <div>
          <Button @click="downloadPensum()" severity="secondary" class="btn-outline p-0" size="small" plain text>
            <span class="pi pi-download p-button-icon m-2"></span>
          </Button>
        </div>
      </div>
    <div class="card mb-3" v-for="trimestre in TrimestresAsignaturas" v-bind:key="trimestre.idTrimestre">
      <div class="p-2" style="background-color: #f8f9fa">
        <label>{{ trimestre.Trimestre }}</label>
      </div>
      <DataTable :value="trimestre.Asignaturas" class="p-datatable-sm">
        <Column field="CodigoAsignatura" header="Código">
          <template #body="{ data }">
            {{ (data.total != null) ? "" : data.CodigoAsignatura }}
          </template>
        </Column>
        <Column field="Creditos" header="Creditos">
          <template #body="{ data }">
            <strong v-if="data.total != null">
              {{ data.total }}
            </strong>
            <div v-else>
              {{ data.Creditos }}
            </div>
          </template>
        </Column>
        <Column field="NombreAsignatura" header="Nombre de Asignatura">
          <template #body="{ data }">
            {{ (data.total != null) ? "" : data.NombreAsignatura }}
          </template>
        </Column>
        <Column field="Prerrequisitos" header="Prerrequisitos">
          <template #body="{ data }">
            {{ (data.total != null) ? "" : (data.Dependencias != null) ? dividirPrerrequisito(data.Dependencias.map(x => x.CodigoAsignatura)) : "" }}
          </template>
        </Column>
      </DataTable>
      <Toast />
    </div>
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
      TrimestresAsignaturas: [],
      InfoEstudiante: {},
    };
  },
  mounted() {
    this.loadPensum();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadPensum() {
      const response = await api.get('api/Pensum/GetAsignaturasPensumEstudiante');
      if (response.data) {
        this.TrimestresAsignaturas = response.data;

        this.TrimestresAsignaturas.forEach( trimestre => {
          var totalCreditoTrimestre = 0;
          trimestre.Asignaturas.forEach(asignatura => {
            totalCreditoTrimestre += asignatura.Creditos;
          })
          trimestre.Asignaturas.push({ strong: true, total: totalCreditoTrimestre })
        });
        this.InfoEstudiante = this.$store.state.userData.InfoEstudiante;
        console.log(this.TrimestresAsignaturas);
      }
      else {
        this.toast.error("Error al cargar el pensum", toastProperties);
      }
    },
    dividirPrerrequisito(listaPrerrequisitos) {
      if (listaPrerrequisitos != null) return listaPrerrequisitos.join(', ');
    },
    downloadPensum() {
      window.print();
    },
  },
}
</script>