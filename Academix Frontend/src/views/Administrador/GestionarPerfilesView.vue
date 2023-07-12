<template>
  <div class="rounded-datatable">
    <DataTable ref="dt" v-model:filters="filters" :value="Perfiles" resizableColumns columnResizeMode="fit" removableSort
      paginator :rows="10" dataKey="id" :loading="loading" class="p-datatable-sm">
      <template #empty> No se han encontrado perfiles. </template>
      <template #header>
        <div class="flex justify-content-between">
          <div>
            <Button class="p-button-sm" style="margin: 0px 5px" label="Exportar" outlined severity="secondary"
              @click="newProfile()" color="#334">
              <span class="pi pi-plus p-button-icon"></span>
              <span class="p-button-label">&nbsp;</span>
            </Button>
            <Button class="p-button-sm border-green-800" style="margin: 0px 5px" label="Exportar" outlined
              severity="success" @click="exportCSV($event)">
              <span class="far fa-file-excel p-button-icon p-button-icon-left text-green-800"></span>
              <span class="p-button-label text-green-800">Exportar</span>
            </Button>
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" class="p-inputtext-sm" placeholder="Buscar..." />
          </span>
        </div>
      </template>
      <Column field="idPerfil" header="#" sortable></Column>
      <Column field="Nombre" header="Nombre" sortable style="width: 20%" />
      <Column field="Descripcion" header="Descripcion" sortable style="width: 60%" />
      <Column field="CantPermisos" header="Cant. Permisos" sortable class="text-center">
        <template #body="{ data }">
          <Badge :value="data.CantPermisos" style="background-color: rgb(19, 119, 117); color: rgb(255, 255, 255);" />
        </template>
      </Column>
      <Column field="PorDefecto" header="Por Defecto" sortable class="text-center">
        <template #body="{ data }">
          <i className="pi pi-check" v-if="data.PorDefecto" />
        </template>
      </Column>
      <Column styleClass="col-icon" :expander="true" frozen class="text-center p-0" style="padding: 0 !important">
        <template #header>
          <div class="w-100 text-center">
            <span>Acciones</span>
          </div>
        </template>
        <template #body="{ data }">
          <!-- <Button class="" size="small" text plain @click="showDetails(data.idPerfil)" severity="secondary" icon="fas fa-edit"></Button>
          <Button class="" size="small" text plain @click="deleteProfile(data.idPerfil)" severity="danger" icon="far fa-trash-alt"></Button> -->
          <Button severity="secondary" plain text @click="showDetails(data.idPerfil)" class="btn-outline p-1 mx-1">
            <span class="fas fa-edit p-button-icon"></span>
          </Button>
          <Button severity="danger" plain text @click="confirmDelete($event, data.idPerfil)" class="btn-outline p-1 mx-1">
            <span class="far fa-trash-alt p-button-icon"></span>
          </Button>
        </template>
      </Column>
      <Dialog v-model:visible="perfilDetailsVisible" header="Editar perfil" :style="{ width: '60vw' }" maximizable modal>
        <div class="dialogContent">
          <div class="d-flex justify-content-between" style="margin: 0px 10px;">
            <div class="flex flex-column gap-2 p-2" style="width: 70%">
              <label class="font-bold" for="nombre">Nombre del perfil:</label>
              <InputText id="nombre" class="p-inputtext-sm" v-model="actualDetails.Nombre"
                aria-describedby="username-help" />
            </div>
            <div class="d-flex flex-column gap-2 p-2">
              <label class="font-bold" for="PorDefecto">Por defecto:</label>
              <InputSwitch id="PorDefecto" v-model="actualDetails.PorDefecto" />
            </div>
          </div>

          <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
            <label class="font-bold" for="descripcion">Descripción del perfil:</label>
            <Textarea id="nombre" class="p-inputtext-sm" v-model="actualDetails.Descripcion" autoResize rows="5" />
          </div>

          <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
            <label class="font-bold" for="Permisos">Permisos:</label>

            <PickList id="Permisos" class="p-picklist-sm" v-model="vistasDisponibles" :showSourceControls="false"
              :showTargetControls="false" :dataKey="idVista">
              <template #sourceheader> Disponibles </template>
              <template #targetheader> Seleccionados </template>
              <template #item="slotProps">
                <div class="flex flex-wrap align-items-center">
                  <div class="flex-1 flex flex-column">
                    <span class="picklistName">{{ slotProps.item.Vista }}</span>
                    <div class="flex align-items-center">
                      <span class="picklistURL">{{ slotProps.item.URL }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </PickList>
          </div>
        </div>


        <template #footer>
          <Button label="Guardar" icon="pi pi-save" @click="saveEditingProfile(actualDetails, vistasDisponibles[1])" />
        </template>
      </Dialog>

      <Dialog v-model:visible="perfilNewVisible" header="Nuevo perfil" :style="{ width: '60vw' }" maximizable modal>
        <div class="dialogContent">
          <div class="d-flex justify-content-between" style="margin: 0px 10px;">
            <div class="flex flex-column gap-2 p-2" style="width: 70%">
              <label class="font-bold" for="nombre">Nombre del perfil:</label>
              <InputText id="nombre" v-model="actualNew.Nombre" aria-describedby="username-help" />
            </div>
            <div class="d-flex flex-column gap-2 p-2">
              <label class="font-bold" for="PorDefecto">Por defecto:</label>
              <InputSwitch id="PorDefecto" v-model="actualNew.PorDefecto" />
            </div>
          </div>

          <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
            <label class="font-bold" for="descripcion">Descripción del perfil:</label>
            <Textarea id="nombre" v-model="actualNew.Descripcion" autoResize rows="5" />
          </div>

          <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
            <label class="font-bold" for="Permisos">Permisos:</label>

            <PickList id="Permisos" v-model="vistasDisponibles" :showSourceControls="false" :showTargetControls="false"
              :dataKey="idVista">
              <template #sourceheader> Disponibles </template>
              <template #targetheader> Seleccionados </template>
              <template #item="slotProps">
                <div class="flex flex-wrap align-items-center">
                  <div class="flex-1 flex flex-column">
                    <span class="picklistName">{{ slotProps.item.Vista }}</span>
                    <div class="flex align-items-center">
                      <span class="picklistURL">{{ slotProps.item.URL }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </PickList>
          </div>
        </div>

        <template #footer>
          <Button label="Guardar" icon="pi pi-save" @click="saveNewProfile(actualNew, vistasDisponibles[1])" />
        </template>
      </Dialog>
    </DataTable>
    <ConfirmPopup />
  </div>
</template>

<script>
import api from '@/utilities/api'
import { useToast } from "vue-toastification";
import { useConfirm } from "primevue/useconfirm";
import toastProperties from '@/utilities/toastProperties';
import { FilterMatchMode } from 'primevue/api';

export default {
  setup() {
    const toast = useToast();
    const confirm = useConfirm();
    return { toast, confirm }
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      Perfiles: [],
      Loading: false,
      perfilDetailsVisible: false,
      perfilNewVisible: false,
      vistasDisponibles: [],
      Vistas: [],
      actualDetails: {},
      actualNew: {},
      vistasAsignadas: [],
      vistasSeleccionadas: [],
      sinGuardar: false,
    };
  },
  watch: {
    actualDetails: {
      handler(newVal) {
        // Comprueba si los objetos dentro del array perfiles son diferentes a los objetos dentro de actualDetails
        const perfilesDiferentes = this.Perfiles.filter(perfil => {
          for (let key in newVal) {
            if (Object.prototype.hasOwnProperty.call(newVal, key)) {
              for (let subKey in newVal[key]) {
                if (Object.prototype.hasOwnProperty.call(newVal[key], subKey)) {
                  if (JSON.stringify(perfil) === JSON.stringify(newVal[key][subKey])) {
                    return false;
                  }
                }
              }
            }
          }
          return true;
        });
        if (perfilesDiferentes.length === this.Perfiles.length) {
          this.sinGuardar = true;
        } else {
          this.sinGuardar = false;
        }
      },
      deep: true
    }
  },
  mounted() {
    this.Loading = true;
    this.loadPerfiles();
    this.loadVistas();
    this.pageLoaded = true;
    this.Loading = false;
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadPerfiles() {
      const response = await api.get('api/Perfiles');
      if (response.data) {
        this.Perfiles = response.data;
      }
      else {
        this.toast.error("Error al cargar los perfiles", toastProperties);
      }
    },
    async loadVistas() {
      const response = await api.get('api/Perfiles/GetVistas');
      if (response.data) {
        this.Vistas = response.data;
      }
      else {
        this.toast.error("Error al cargar las vistas", toastProperties);
      }
    },
    showDetails(idPerfil) {
      const model = this.Perfiles.find(item => item.idPerfil === idPerfil);
      this.actualDetails = model;

      if (model.Vistas != null) {
        this.vistasDisponibles[0] = model.Vistas.filter(x => x.Permiso == false);
        this.vistasDisponibles[1] = model.Vistas.filter(x => x.Permiso == true);
      }

      Object.assign(this.actualDetails, model);
      this.perfilDetailsVisible = true;
    },
    newProfile() {
      this.vistasDisponibles[0] = this.Vistas;
      this.vistasDisponibles[1] = [];

      this.perfilNewVisible = true;
    },
    saveEditingProfile(model, vistas) {
      this.Loading = true;

      if (vistas.length == 0) {
        model.Vistas = null;
      }
      else {
        for (let i = 0; i < vistas.length; i++) {
          vistas[i].Permiso = true;
        }

        model.Vistas = vistas;
      }

      console.log(model);

      try {
        api.put('/api/Perfiles?idPerfil=' + model.idPerfil, model)
          .then(response => {
            console.log(response);
            if (response.data.Success) {
              this.sinGuardar = false;
              this.toast.success(response.data.Message, toastProperties);
              this.loadPerfiles();
            }
            else {
              console.log(response.data);
              this.toast.warning(response.data.Message, toastProperties);
            }
          })
      }

      catch (error) {
        this.loading = false;
        console.log(error);
        this.toast.error("Error 500. Error al realizar la operación.", toastProperties);
      }

      this.Loading = false;
      this.perfilDetailsVisible = false;
    },
    async saveNewProfile(model, vistas) {
      this.Loading = true;

      for (let i = 0; i < vistas.length; i++) {
        vistas[i].Permiso = true;
      }

      model.Vistas = vistas;
      console.log(model);

      try {
        const response = await api.post('/api/Perfiles', model);
        console.log(response);
        if (response.data.Success) {
          this.toast.success(response.data.Message, toastProperties);
        }
        else {
          console.log(response.data);
          this.toast.warning(response.data.Message, toastProperties);
        }
      }

      catch (error) {
        this.Loading = false;
        console.log(error);
        this.toast.error("Error 500. Error al realizar la operación.", toastProperties);
      }

      this.Loading = false;
      this.perfilNewVisible = false;
      this.loadPerfiles();
    },
    confirmDelete(event, idPerfil) {
      this.confirm.require({
        target: event.currentTarget,
        message: '¿Está seguro que desea eliminar este perfil?',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        rejectClass: 'p-button-secondary p-button-text',
        acceptIcon: "far fa-trash-alt",
        rejectIcon: "far fa-times-circle",
        acceptLabel: "Eliminar",
        rejectLabel: "No", 
        accept: () => {
          this.deleteProfile(idPerfil);
        }
      });
    },
    async deleteProfile(idPerfil) {
      api.delete('/api/Perfiles?idPerfil=' + idPerfil)
        .then(response => {
          console.log(response);
          if (response.data.Success) {
            this.sinGuardar = false;
            this.loadPerfiles();
            this.toast.success(response.data.Message, toastProperties);
          }
          else {
            console.log(response.data);
            this.toast.warning(response.data.Message, toastProperties);
          }
        })
    }
  }
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

.picklistName {
  font-size: 14px;
}

.picklistURL {
  color: #a7a7a7;
  font-size: small;
}
</style>