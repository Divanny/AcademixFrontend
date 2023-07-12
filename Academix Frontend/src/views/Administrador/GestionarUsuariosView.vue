<template>
  <div class="rounded-datatable">
    <DataTable ref="dt" v-model:filters="filters" :value="Usuarios" resizableColumns columnResizeMode="fit" removableSort
      paginator :rows="10" dataKey="id" :loading="loading" class="p-datatable-sm">
      <template #empty> No se han encontrado usuarios. </template>
      <template #header>
        <div class="flex justify-content-between">
          <div>
            <Button class="p-button-sm" style="margin: 0px 5px" label="Exportar" outlined severity="secondary"
              @click="showNewUsuario()" color="#334">
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
      <Column field="idUsuario" header="#" sortable></Column>
      <Column field="NombreUsuario" header="Usuario" sortable />
      <Column field="CorreoElectronico" header="Correo electrónico" sortable />
      <Column header="Nombre" sortable>
        <template #body="{ data }">
          {{ data.Nombres + " " + data.Apellidos }}
        </template>
      </Column>
      <Column field="Perfil" header="Perfil" sortable />
      <Column header="Activo" sortable>
        <template #body="{ data }">
          <Tag :severity="getSeverity(data.idEstado)" :value="data.Estado"></Tag>
        </template>
      </Column>
      <Column field="UltimoIngreso" header="Ult. Ingreso" sortable>
        <template #body="{ data }">
          {{
            new Date(data.UltimoIngreso).toLocaleDateString("es-DO", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })
          }}
          {{
            new Date(data.UltimoIngreso).toLocaleTimeString("es-DO", {
              format: "HH:mm:ss",
            })
          }}
        </template>
      </Column>
      <Column styleClass="col-icon" :expander="true" style="width: 5rem">
        <template #body="{ data }">
          <Button class="" size="small" text plain @click="showEditUsuario(data)" severity="primary" icon="pi pi-user-edit"></Button>
        </template>
      </Column>
    </DataTable>
    <Dialog class="userForm" v-model:visible="userForm"
      :header="editingUser ? 'Editar usuario: ' + modelUser.NombreUsuario : 'Nuevo usuario'"
      style="width: 90vw; max-width: 800px;" maximizable modal>
      <div class="dialogContent">
        <TabView v-model:activeIndex="activePanel">
          <TabPanel class="p-0 py-6">
            <template #header>
              <i class="fas fa-user mr-2"></i>
              <span>Información del Usuario</span>
            </template>
            <div class="d-flex justify-content-between flex-wrap" style="margin: 0px 10px">
              <div class="flex flex-column gap-2 p-2" style="width: 30%">
                <label class="font-bold" for="nombreUsuario">Nombre del usuario:</label>
                <InputText id="nombreUsuario" class="p-inputtext-sm" v-model="modelUser.NombreUsuario"
                  :class="Errors.NombreUsuario ? 'p-invalid' : ''" aria-describedby="username-help" />
                <small class="text-danger bold" v-if="Errors.NombreUsuario">{{ Errors.NombreUsuario }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="nombres">Nombres:</label>
                <InputText id="nombres" class="p-inputtext-sm" v-model="modelUser.Nombres"
                  :class="Errors.Nombres ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.Nombres">{{ Errors.Nombres }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="apellidos">Apellidos:</label>
                <InputText id="apellidos" class="p-inputtext-sm" v-model="modelUser.Apellidos"
                  :class="Errors.Apellidos ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.Apellidos">{{ Errors.Apellidos }}</small>
              </div>
            </div>
            <div class="d-flex justify-content-between" style="margin: 0px 10px">
              <div class="flex flex-column gap-2 p-2" style="width: 40%">
                <label class="font-bold" for="correo">Correo electrónico:</label>
                <InputText type="email" id="correo" class="p-inputtext-sm" v-model="modelUser.CorreoElectronico"
                  :class="Errors.CorreoElectronico ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.CorreoElectronico">{{ Errors.CorreoElectronico }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 30%">
                <label class="font-bold" for="contrasena">Contraseña:</label>
                <InputText type="password" class="p-inputtext-sm" id="contrasena" v-model="modelUser.Password"
                  :class="Errors.Password ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.Password">{{ Errors.Password }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 30%">
                <label class="font-bold" for="telefono">Teléfono:</label>
                <InputText id="telefono" class="p-inputtext-sm" v-model="modelUser.Telefono"
                  :class="Errors.Telefono ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.Telefono">{{ Errors.Telefono }}</small>
              </div>
            </div>
            <div class="d-flex justify-content-start" style="margin: 0px 10px">
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="perfil">Perfil:</label>
                <Dropdown v-model="modelUser.idPerfil" id="perfil" :options="Perfiles" optionLabel="Nombre"
                  optionValue="idPerfil" class="p-inputtext-sm" placeholder="Seleccione un perfil"
                  :class="Errors.idPerfil ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.idPerfil">{{ Errors.idPerfil }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="estado">Estado:</label>
                <Dropdown v-model="modelUser.idEstado" id="estado" :options="EstadosUsuarios" optionLabel="Nombre"
                  optionValue="idEstado" class="p-inputtext-sm" placeholder="Seleccione un estado"
                  :class="Errors.idEstado ? 'p-invalid' : ''">
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                      <Tag :severity="getSeverity(slotProps.value)"
                        :value="(EstadosUsuarios.filter(item => item.idEstado == slotProps.value))[0].Nombre"></Tag>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex align-items-center">
                      <Tag :severity="getSeverity(slotProps.option.idEstado)" :value="slotProps.option.Nombre"></Tag>
                    </div>
                  </template>
                </Dropdown>
                <small class="text-danger bold" v-if="Errors.idEstado">{{ Errors.idEstado }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2 px-4" v-if="modelUser.idPerfil == 2 || modelUser.idPerfil == 3"
                style="width: 30%">
                <label class="font-bold" for="button">&nbsp;</label>
                <Button id="button" size="small" @click="activePanel = 1" severity="secondary" roundeds
                  icon="pi pi-arrow-right" iconPos="right" label="Siguiente" />
              </div>
              <div class="flex flex-column gap-2 p-2 px-4" v-else style="width: 30%">
                <label class="font-bold" for="button">&nbsp;</label>
                <Button id="button" size="small" @click="saveUser(modelUser)" severity="secondary" roundeds
                  icon="pi pi-save" iconPos="right" label="Guardar" />
              </div>
            </div>
          </TabPanel>
          <TabPanel class="p-0 py-6" v-if="modelUser.idPerfil == 7">
            <template #header>
              <i class="fas fa-chalkboard-teacher mr-2"></i>
              <span>Información del Profesor</span>
            </template>
            <div class="d-flex justify-content-start flex-wrap" style="margin: 0px 10px">
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="carrera">Area:</label>
                <Dropdown v-model="modelUser.InfoMaestro.idArea" id="carrera" :options="Areas"
                  optionLabel="nombre" optionValue="idArea" class="p-inputtext-sm" placeholder="Seleccione un área"
                  :class="Errors.idArea ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.idArea">{{ Errors.idArea }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="credenciales">Credenciales:</label>
                <InputText type="text" id="credenciales" class="p-inputtext-sm" v-model="modelUser.InfoMaestro.credencial"
                  :class="Errors.credencial ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.credencial">{{ Errors.credencial }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2 px-4" style="width: 30%">
                <label class="font-bold" for="button">&nbsp;</label>
                <Button id="button" size="small" @click="saveUser(modelUser)" severity="secondary" roundeds
                  icon="pi pi-save" iconPos="right" label="Guardar" />
              </div>
            </div>
          </TabPanel>
          <TabPanel class="p-0 py-6" v-if="modelUser.idPerfil == 3">
            <template #header>
              <i class="fas fa-user-graduate mr-2"></i>
              <span>Información del Estudiante</span>
            </template>
            <div class="d-flex justify-content-start flex-wrap" style="margin: 0px 10px">
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="carrera">Carrera:</label>
                <Dropdown v-model="modelUser.InfoEstudiante.idCarrera" id="carrera" :options="Carreras"
                  optionLabel="nombre" optionValue="idCarrera" class="p-inputtext-sm" placeholder="Seleccione una carrera"
                  :class="Errors.idCarrera ? 'p-invalid' : ''" />
                <small class="text-danger bold" v-if="Errors.idCarrera">{{ Errors.idCarrera
                }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2" style="width: 35%">
                <label class="font-bold" for="pensum">Pensum:</label>
                <Dropdown v-model="modelUser.InfoEstudiante.idPensum" id="pensum" v-bind:disabled="!modelUser.InfoEstudiante.idCarrera"
                  :options="Pensum.filter(x => x.idCarrera == modelUser.InfoEstudiante.idCarrera)" optionLabel="nombrePensum"
                  optionValue="idPensum" class="p-inputtext-sm" placeholder="Seleccione un pensum"
                  :class="Errors.idPensum ? 'p-invalid' : ''" emptyMessage="No existen pensum" />
                <small class="text-danger bold" v-if="Errors.idPensum">{{ Errors.idPensum
                }}</small>
              </div>
              <div class="flex flex-column gap-2 p-2 px-4" style="width: 30%">
                <label class="font-bold" for="button">&nbsp;</label>
                <Button id="button" size="small" @click="saveUser(modelUser)" severity="secondary" roundeds
                  icon="pi pi-save" iconPos="right" label="Guardar" />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </Dialog>
  </div>
</template>

<script>
import api from "@/utilities/api";
import { useToast } from "vue-toastification";
import toastProperties from "@/utilities/toastProperties";
import { FilterMatchMode } from "primevue/api";

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
      Usuarios: [],
      Perfiles: [],
      Loading: false,
      userForm: false,
      editingUser: false,
      modelUser: {
        NombreUsuario: "",
        Nombres: "",
        Apellidos: "",
        CorreoElectronico: "",
        Password: "",
        Telefono: "",
        idPerfil: 0,
        idEstado: 0,
        InfoEstudiante: {
          idCarrera: 0,
          idPensum: 0,
        },
        InfoMaestro: {}
      },
      EstadosUsuarios: [],
      activePanel: 0,
      Errors: [],
      Carreras: [],
      Pensum: [],
    };
  },
  mounted() {
    this.Loading = true;
    this.loadUsuarios();
    this.loadPerfiles();
    this.loadEstados();
    this.pageLoaded = true;
    this.Loading = false;
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async loadUsuarios() {
      const response = await api.get("/api/Usuarios");
      if (response.data) {
        console.log(response.data);
        this.Usuarios = response.data;
      } else {
        this.toast.error("Error al cargar las vistas", toastProperties);
      }
    },
    async loadPerfiles() {
      const response = await api.get("/api/Perfiles");
      if (response.data) {
        this.Perfiles = response.data;
      } else {
        this.toast.error("Error al cargar los perfiles", toastProperties);
      }
    },
    async loadEstados() {
      const response = await api.get("/api/Usuarios/GetEstadosUsuarios")
      if (response.data) {
        this.EstadosUsuarios = response.data;
      }
      else {
        this.toast.error("Error al cargar los estados", toastProperties);
      }
    },
    async loadCarreras() {
      const response = await api.get("/api/Carreras")
      if (response.data) {
        this.Carreras = response.data;
      }
      else {
        this.toast.error("Error al cargar las carreras", toastProperties);
      }
    },
    async loadPensum() {
      const response = await api.get("/api/Pensum")
      if (response.data) {
        this.Pensum = response.data;
      }
      else {
        this.toast.error("Error al cargar los pensum", toastProperties);
      }
    },
    async loadAreas() {
      const response = await api.get("/api/Areas")
      if (response.data) {
        this.Areas = response.data;
      }
      else {
        this.toast.error("Error al cargar las áreas", toastProperties);
      }
    },
    getSeverity(idEstado) {
      if (idEstado == 1) {
        return "success";
      }
      if (idEstado == 2) {
        return "warning";
      }
    },
    showNewUsuario() {
      this.loadCarreras();
      this.loadPensum();
      this.loadAreas();
      this.userForm = true;
      this.modelUser = {
        NombreUsuario: "",
        Nombres: "",
        Apellidos: "",
        CorreoElectronico: "",
        Password: "",
        Telefono: "",
        idPerfil: 0,
        idEstado: 0,
        InfoEstudiante: {
          idCarrera: 0,
          idPensum: 0,
        },
        InfoMaestro: {}
      };
      this.editingUser = false;
    },
    showEditUsuario(model) {
      this.loadCarreras();
      this.loadPensum();
      this.loadAreas();
      this.modelUser = model;
      this.userForm = true;
      this.editingUser = true;
    },
    async saveUser(model) {
      let response;
      if (this.editingUser) {
        console.log("Editing", model);
        response = await api.put('/api/Usuarios?idUsuario=' + model.idUsuario, model);
      }
      else {
        console.log("Creating", model);
        response = await api.post('/api/Usuarios', model);
      }

      console.log(response);

      if (response.data.Success) {
        this.modelUser = {};
        this.Error = [];
        this.userForm = false;
        this.loadUsuarios();
        this.toast.success(response.data.Message, toastProperties);
      }
      else {
        this.Errors = response.data.Data;
        this.toast.warning(response.data.Message, toastProperties);
      }
    }
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

.userForm .p-tabview-panels {
  padding: 10px 0 0 0 !important;
}

.userForm .p-inputtext {
  font-family: 'Poppins', sans-serif !important;
}

.userForm .p-tabview-nav-link {
  padding: 0.7rem !important;
}</style>