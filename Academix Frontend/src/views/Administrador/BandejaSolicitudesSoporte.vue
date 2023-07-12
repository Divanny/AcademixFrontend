<template>
  <div>
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :value="MisSolicitudes"
      resizableColumns
      columnResizeMode="fit"
      removableSort
      paginator
      :rows="10"
      dataKey="idSolicitud"
      :loading="loading"
      class="p-datatable-sm"
    >
      <template #empty> No se han encontrado solicitudes. </template>
      <template #header>
        <div class="flex justify-content-between">
          <div></div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              class="p-inputtext-sm"
              placeholder="Buscar..."
            />
          </span>
        </div>
      </template>
      <Column field="idSolicitud" header="#" sortable></Column>
      <Column field="Usuario" header="Usuario"></Column>
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
      <Column
        field="FechaUltimoEstatus"
        header="Fecha de Ult. Estatus"
        sortable
      >
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
      <Column field="AsignadoA" header="Asignado a"></Column>
      <Column styleClass="col-icon" :expander="true" style="width: 5rem">
        <template #body="{ data }">
          <Button
            class=""
            size="small"
            text
            plain
            @click="Asignar(data)"
            severity="secondary"
            icon="fas fa-eye"
          ></Button>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="solicitudDialog"
      :style="{ width: '40vw' }"
      :header="`Revisar solicitud de  ${modelSolicitud.Usuario}`"
      :modal="true"
      class="p-fluid"
    >
      <div>
        <label for="descripcion">Solicitud del usuario:</label>
        <Editor
          readonly
          v-model="modelSolicitud.Mensaje"
          editorStyle="height: 320px"
        >
          <template v-slot:toolbar>
            <span class="ql-formats"> </span>
          </template>
        </Editor>
      </div>
      <div class="mt-2">
        <label for="descripcion">Respuesta:</label>
        <Editor v-model="modelSolicitud.Respuesta" editorStyle="height: 320px">
          <template v-slot:toolbar>
            <span class="ql-formats">
              <button
                v-tooltip.bottom="'Bold'"
                class="ql-bold"
                v-if="!detailsForm"
              ></button>
              <button
                v-tooltip.bottom="'Italic'"
                class="ql-italic"
                v-if="!detailsForm"
              ></button>
              <button
                v-tooltip.bottom="'Underline'"
                class="ql-underline"
                v-if="!detailsForm"
              ></button>
            </span>
          </template>
        </Editor>
      </div>
      <template #footer>
        <div class="d-flex w-100 justify-content-end">
          <Button
            label="Finalizar"
            size="small"
            class="m-0"
            :disabled="modelSolicitud.idSolicitud == null"
            data-toggle="tooltip"
            data-placement="top"
            :title="
              modelSolicitud.idSolicitud == null
                ? 'Debe guardar la solicitud antes de enviarla'
                : 'Enviar solicitud'
            "
            icon="fas fa-check"
            severity="info"
            outlined
            @click="Finalizar(modelSolicitud)"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import api from "@/utilities/api";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";
import { FilterMatchMode } from "primevue/api";
import { mapState } from "vuex";

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  computed: {
    ...mapState(["userData"]),
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      MisSolicitudes: [],
      loading: false,
      solicitudDialog: false,
      modelSolicitud: {
        Mensaje: "",
      },
    };
  },
  mounted() {
    this.loadSolicitudes();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadSolicitudes() {
      const response = await api.get(
        "api/SolicitudesSoporte/GetBandejaSolicitudes"
      );
      if (response.data) {
        this.MisSolicitudes = response.data;
        console.log(this.MisSolicitudes);
      } else {
        this.toast.error("Error al cargar sus solicitudes", toastProperties);
      }
    },
    async Asignar(data) {
      if (data.idAsignadoA == this.userData.idUsuario) {
        this.solicitudDialog = true;
        this.modelSolicitud = data;
      } else {
        const response = await api.put(
          "/api/SolicitudesSoporte/Asignar?idSolicitud=" + data.idSolicitud
        );
        if (response.data.Success) {
          this.loadSolicitudes();
          this.solicitudDialog = true;
          this.modelSolicitud = data;
          this.toast.success(response.data.Message, toastProperties);
        } else {
          this.toast.warning(response.data.Message, toastProperties);
        }
      }
    },
    async Finalizar(data) {
      const response = await api.put(
        `/api/SolicitudesSoporte/CambiarEstatus?idSolicitud=${data.idSolicitud}&idEstatus=2&Mensaje=${data.Respuesta}`
      );

      if (response.data.Success) {
        this.loadSolicitudes();
        this.solicitudDialog = false;
        this.modelSolicitud = {
          Mensaje: "",
        };
        this.toast.success(response.data.Message, toastProperties);
      } else {
        this.toast.warning(response.data.Message, toastProperties);
      }
    },
  },
};
</script>

<style>
.p-datatable td,
th {
  padding: 0.5rem !important;
}

.rounded-datatable .p-datatable {
  border-radius: 10px;
  overflow: hidden;
}

.rounded-datatable .p-datatable .p-datatable-tbody > tr {
  border-radius: 10px;
}

.rounded-datatable .p-datatable .p-datatable-tbody > tr > td {
  border-radius: 0;
}

.rounded-datatable
  .p-datatable
  .p-datatable-tbody
  > tr:last-child
  > td:first-child {
  border-bottom-left-radius: 10px;
}

.rounded-datatable
  .p-datatable
  .p-datatable-tbody
  > tr:last-child
  > td:last-child {
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
