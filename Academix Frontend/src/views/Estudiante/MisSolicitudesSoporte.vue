<template>
  <div>
    <DataTable ref="dt" v-model:filters="filters" :value="MisSolicitudes" resizableColumns columnResizeMode="fit"
      removableSort paginator :rows="10" dataKey="idSolicitud" :loading="loading" class="p-datatable-sm">
      <template #empty> No se han encontrado solicitudes. </template>
      <template #header>
        <div class="flex justify-content-between">
          <div>
            <Button class="p-button-sm" size="small" style="margin: 0px 5px" label="Exportar" outlined
              severity="secondary" @click="showNewSolicitud()" color="#334">
              <span class="pi pi-plus p-button-icon"></span>
              <span class="p-button-label">&nbsp;</span>
            </Button>
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" class="p-inputtext-sm" placeholder="Buscar..." />
          </span>
        </div>
      </template>
      <Column field="idSolicitud" header="#" sortable></Column>
      <Column field="FechaSolicitud" header="Fecha de Solicitud" sortable>
        <template #body="{ data }">
          {{
            new Date(data.FechaSolicitud).toLocaleDateString("es-DO", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })
          }}
          {{
            new Date(data.FechaSolicitud).toLocaleTimeString("es-DO", {
              format: "HH:mm:ss",
            })
          }}
        </template>
      </Column>
      <Column field="Mensaje" header="Solicitud">
        <template #body="{ data }">
          <div v-html="data.Mensaje" class="RequestMessage"></div>
        </template>
      </Column>
      <Column header="Estatus de Solicitud" sortable>
        <template #body="{ data }">
          <Tag :severity="data.Severity" :value="data.Estatus"></Tag>
        </template>
      </Column>
      <Column field="FechaUltimoEstatus" header="Fecha de Ult. Estatus" sortable>
        <template #body="{ data }">
          {{
            new Date(data.FechaUltimoEstatus).toLocaleDateString("es-DO", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })
          }}
          {{
            new Date(data.FechaUltimoEstatus).toLocaleTimeString("es-DO", {
              format: "HH:mm:ss",
            })
          }}
        </template>
      </Column>
      <Column field="Respuesta" header="Respuesta">
        <template #body="{ data }">
          <div v-html="data.Respuesta" class="RequestMessage"></div>
        </template>
      </Column>
      <Column styleClass="col-icon" :expander="true" style="width: 5rem">
        <template #body="{ data }">
          <Button class="" size="small" text plain @click="showEditSolicitud(data)" severity="secondary"
            :icon="data.Estatus == 'Pendiente a Enviar' ? 'fas fa-edit' : 'fas fa-eye'"></Button>
        </template>
      </Column>
    </DataTable>
    <Dialog v-model:visible="solicitudDialog" :style="{ width: '40vw' }"
      :header="(detailsForm ? 'Detalles de solicitud' : (editingForm ? 'Editar solicitud' : 'Nueva solicitud de soporte'))"
      :modal="true" class="p-fluid">
      <div>
        <label for="descripcion">Mensaje:</label>
        <Editor :readonly="detailsForm" v-model="modelSolicitud.Mensaje" editorStyle="height: 320px">
          <template v-slot:toolbar>
            <span class="ql-formats">
              <button v-tooltip.bottom="'Bold'" class="ql-bold" v-if="!detailsForm"></button>
              <button v-tooltip.bottom="'Italic'" class="ql-italic" v-if="!detailsForm"></button>
              <button v-tooltip.bottom="'Underline'" class="ql-underline" v-if="!detailsForm"></button>
            </span>
          </template>
        </Editor>
      </div>
      <div class="mt-2" v-if="modelSolicitud.Respuesta != '' && modelSolicitud.Respuesta != null">
        <label for="descripcion">Respuesta:</label>
        <Editor disabled readonly v-model="modelSolicitud.Respuesta" editorStyle="height: 320px">
          <template v-slot:toolbar>
            <span class="ql-formats">
              <button v-tooltip.bottom="'Bold'" class="ql-bold" v-if="!detailsForm"></button>
              <button v-tooltip.bottom="'Italic'" class="ql-italic" v-if="!detailsForm"></button>
              <button v-tooltip.bottom="'Underline'" class="ql-underline" v-if="!detailsForm"></button>
            </span>
          </template>
        </Editor>
      </div>
      <template #footer>
        <div v-if="!detailsForm" class="d-flex w-100 justify-content-between">
          <Button size="small" class="p-button-sm border-teal-800" icon="pi pi-save" severity="secondary" outlined
            @click="saveSolicitud()">
            <span class="pi pi-save p-button-icon p-button-icon-left text-teal-800"></span>
            <span class="p-button-label text-teal-800">Guardar</span>
          </Button>
          <Button label="Enviar" size="small" class="m-0" :disabled="modelSolicitud.idSolicitud == null"
            data-toggle="tooltip" data-placement="top"
            :title="modelSolicitud.idSolicitud == null ? 'Debe guardar la solicitud antes de enviarla' : 'Enviar solicitud'"
            icon="pi pi-send" severity="info" outlined @click="sendSolicitud()" />
        </div>
      </template>
    </Dialog>
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
      MisSolicitudes: [],
      loading: false,
      solicitudDialog: false,
      editingForm: false,
      detailsForm: false,
      modelSolicitud: {
        Mensaje: "",
      }
    };
  },
  mounted() {
    this.loadMisSolicitudes();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadMisSolicitudes() {
      const response = await api.get('api/SolicitudesSoporte/GetMisSolicitudes');
      if (response.data) {
        this.MisSolicitudes = response.data;
        console.log(this.MisSolicitudes);
      }
      else {
        this.toast.error("Error al cargar sus solicitudes", toastProperties);
      }
    },
    showNewSolicitud() {
      this.editingForm = false;
      this.detailsForm = false;
      this.modelSolicitud = {
        Mensaje: "",
      };
      this.solicitudDialog = true;
    },
    showEditSolicitud(data) {
      console.log(data);
      this.modelSolicitud = data;
      this.solicitudDialog = true;
      if (data.idEstatus != 1) {
        this.showDetailsSolicitud(data)
      } else { this.editingForm = true; this.detailsForm = false; }
    },
    showDetailsSolicitud(data) {
      this.detailsForm = true;
      this.editingForm = false;
      this.modelSolicitud = data;
      this.solicitudDialog = true;
    },
    async saveSolicitud() {
      if (this.editingForm) {
        const response = await api.put(`api/SolicitudSoporte?idSolicitud=${this.modelSolicitud.idSolicitud}`, this.modelSolicitud);
        if (response.data.Success) {
          this.loadMisSolicitudes();
          this.toast.success(response.data.Message, toastProperties);
        }
        else {
          this.toast.warning(response.data.Message, toastProperties);
        }
      }
      else {
        const response = await api.post('api/SolicitudSoporte', this.modelSolicitud);
        if (response.data.Success) {
          this.loadMisSolicitudes();
          this.modelSolicitud = response.data.Data;
          this.toast.success(response.data.Message, toastProperties);
        }
        else {
          this.toast.warning(response.data.Message, toastProperties);
        }
      }
    },
    async sendSolicitud() {
      const response = await api.put(`/api/SolicitudesSoporte/Enviar?idSolicitud=${this.modelSolicitud.idSolicitud}`);
      if (response.data.Success) {
        this.loadMisSolicitudes();
        this.solicitudDialog = false;
        this.modelSolicitud = {
          Mensaje: ""
        };
        this.toast.success(response.data.Message, toastProperties);
      }
      else {
        this.toast.warning(response.data.Message, toastProperties);
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