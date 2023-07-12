<template>
  <div></div>
  <!--cambia-->

  <!-- ASIGNATURAS PARA SELECCIONAR -->
  <div class="card">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="AsignaturasREADY"
      dataKey="Codigo"
      :filters="filters"
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
              @click="crearSeccion"
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
              placeholder="Buscar Secciones"
            />
          </span>
        </div>
      </template>
      <Column expander style="width: 0rem" />
      <Column field="Nombre" header="Asignaturas Disponibles"></Column>
      <Column style="width: 63%" />

      <template #expansion="slotProps">
        <div class="p-1">
          <DataTable
            :value="slotProps.data.Secciones"
            showGridlines
            tableStyle="min-width: 50rem"
            tableClass="rounded"
            p-datatable-wrapper="h-0"
            class="p-datatable-sm selectedSubjects border-round table-borderless"
          >
            <Column field="codigo" header="Codigo"></Column>
            <Column field="seccion" header="Sección"></Column>
            <Column field="creditos" header="Creditos"></Column>
            <Column field="profesor" header="Maestro"></Column>
            <Column field="Aula" header="Aula"></Column>
            <Column field="Modalidad" header="Modalidad"></Column>
            <Column field="Lunes" header="Lun."></Column>
            <Column field="Martes" header="Mar."></Column>
            <Column field="Miercoles" header="Mie."></Column>
            <Column field="Jueves" header="Jue."></Column>
            <Column field="Viernes" header="Vie."></Column>
            <Column field="Sabado" header="Sáb."></Column>
            <Column header="Seleccion" :bodyStyle="{ 'text-align': 'center' }">
              <template #body="{ data }">
                <Button
                  icon="pi pi-pencil"
                  rounded
                  outlined
                  aria-label="Filter"
                  @click="editarSeccion(data.idSecciom)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
  <!-- DIALOG DE CREACION  -->
  <Dialog
    v-model:visible="seccionesDialog"
    :style="{ width: '450px' }"
    header="Datos de Secciones"
    :modal="true"
    class="p-fluid"
    style="width: 90vw; max-width: 800px"
    maximizable
  >
    <div class="dialogContent">
      <TabView v-model:activeIndex="activePanel">
        <TabPanel class="p-0 py-6">
          <template #header>
            <i class="fas fa-window-restore"></i>
            <span>Crear Seccion</span>
          </template>

          <div
            class="d-flex justify-content-between flex-wrap"
            style="margin: 0px 10px"
          >
            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="codSeccion">Codigo Seccion</label>

              <InputNumber
                id="codSeccion"
                required="true"
                v-model="seccionMod.codigoSeccion"
                :class="{ 'p-invalid': enviado && !seccionMod.codigoSeccion }"
                mode="decimal"
                :max="40"
              /><small
                class="p-error"
                v-if="enviado && !seccionMod.capacidadMax"
                >El Codigo es requerido.</small
              >
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="Maestro"
                >Seleccionar Maestro:</label
              >
              <Dropdown
                id="Maestro"
                v-model="seccionMod.idMaestro"
                :options="listaEncargados"
                filter
                optionLabel="nombre"
                placeholder="Selecciona un Maestro"
                class="w-full md:w-14rem"
              /><small class="p-error" v-if="enviado && !seccionMod.idMaestro"
                >El Maestro es requerida.</small
              >
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="Asignatura"
                >Seleccionar Asignatura:</label
              >
              <Dropdown
                id="Asignatura"
                v-model="seccionMod.idAsignatura"
                :options="listaAsignaturas"
                filter
                optionLabel="NombreAsignatura"
                placeholder="Selecciona una Asignatura"
                class="w-full md:w-14rem"
              /><small
                class="p-error"
                v-if="enviado && !seccionMod.idAsignatura"
                >La Asignatura es requerida.</small
              >
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="Modalidad"
                >Seleccionar Modalidad:</label
              >
              <Dropdown
                id="Modalidad"
                v-model="seccionMod.idModalidad"
                :options="Modalidad"
                optionLabel="name"
                placeholder="Selecciona una Modalidad"
                class="w-full md:w-14rem"
              >
              </Dropdown>
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label for="Creditos">Capacidad Maxima</label>
              <InputNumber
                id="Creditos"
                required="true"
                v-model="seccionMod.capacidadMax"
                :class="{ 'p-invalid': enviado && !seccionMod.capacidadMax }"
                mode="decimal"
                :max="40"
              /><small
                class="p-error"
                v-if="enviado && !seccionMod.capacidadMax"
                >La Capacidad Maxima es requerida.</small
              >
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label for="Actividad" class="mb-3">Estado</label>
              <Dropdown
                v-model="seccionMod.esActivo"
                :options="estaActivo"
                optionLabel="label"
                placeholder="Seleccionar Estado"
                required="true"
                :class="{ 'p-invalid': enviado && !seccionMod.esActivo }"
                class="w-full md:w-14rem"
              >
                <template #value="slotProps">
                  <div
                    v-if="
                      slotProps.value !== null && slotProps.value !== undefined
                    "
                  >
                    <Tag
                      :value="slotProps.value.label"
                      :severity="getEstadoColor(slotProps.value.value)"
                    />
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template> </Dropdown
              ><small class="p-error" v-if="enviado && !seccionMod.esActivo"
                >La Estado es requerida.</small
              >
            </div>

            <div class="flex flex-column gap-2 p-2" style="width: 100%">
              <label class="font-bold" for="Descripcion">Descripción</label>
              <Textarea
                id="Descripcion"
                class="p-inputtext-sm"
                v-model="seccionMod.descripcion"
                autoResize
                rows="5"
              /><small class="p-error" v-if="enviado && !seccionMod.descripcion"
                >La Descripción es requerida.</small
              >
            </div>
          </div>
        </TabPanel>

        <TabPanel class="p-0 py-6" v-if="seccionMod.idModalidad.value !== 4">
          <template #header>
            <i class="fasr fa-window"></i>
            <span>Asignar Horario</span>
          </template>

          <div class="d-flex justify-content-between flex-wrap">
            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="Dia">Seleccionar Dia:</label>
              <Dropdown
                id="Dia"
                v-model="horariosCreados.idDia"
                :options="Dias"
                optionLabel="Dia"
                placeholder="Selecciona un Dia"
                class="w-full md:w-14rem"
              >
              </Dropdown>
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="HoraDesde">Hora Inicio:</label>
              <Dropdown
                id="HoraDesde"
                v-model="horariosCreados.horaDesde"
                :options="Horas"
                optionLabel="name"
                placeholder="Selecciona una Hora"
                class="w-full md:w-14rem"
              >
              </Dropdown>
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="HoraHasta">Hora Cierre:</label>
              <Dropdown
                id="HoraHasta"
                v-model="horariosCreados.horaHasta"
                :options="Horas"
                optionLabel="name"
                placeholder="Selecciona una Hora"
                class="w-full md:w-14rem"
              >
              </Dropdown>
            </div>

            <div class="flex flex-column gap-2 p-2">
              <label class="font-bold" for="Aula">Seleccionar Aula:</label>
              <Dropdown
                id="Aula"
                v-model="horariosCreados.idAula"
                :options="listaAula"
                filter
                optionLabel="nombre"
                placeholder="Selecciona un Aula"
                class="w-full md:w-14rem"
              />
            </div>
          </div>
          <br />
          <Button
            label="Agregar"
            style="border: 1px solid rgb(0, 88, 70)"
            text
            @click="agregarHorarioSeccion"
          />

          <div class="flex flex-column gap-2 p-2" style="width: 100%">
            <DataTable
              :value="seccionMod.detalleSeccion"
              tableStyle="min-width: srem"
            >
              <!-- <Column field="Modalidad" header="Modalidad"></Column> -->
              <Column field="Dia" header="Dia"></Column>
              <Column field="horaDesde" header="Desde"></Column>
              <Column field="horaHasta" header="Hasta"></Column>
              <Column header="Acciones"
                ><template #body="slotProps">
                  <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    aria-label="Filter"
                    @click="borrarSeccionTabla(slotProps.index)"
                  /> </template
              ></Column>
            </DataTable>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />

      <Button
        label="Continuar"
        icon="pi pi-check"
        text
        @click="cambiarTab"
        v-if="activePanel === 0 && seccionMod.idModalidad.value !== 4"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        text
        @click="guardarSeccion"
        v-if="activePanel === 0 && seccionMod.idModalidad.value === 4"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        text
        @click="guardarSeccion"
        v-if="activePanel === 1"
      />
    </template>
  </Dialog>
</template>

<script>
import { ref } from "vue";

import api from "@/utilities/api";

import { useToast } from "vue-toastification";
import { FilterMatchMode } from "primevue/api";
import toastProperties from "@/utilities/toastProperties";

export default {
  setup() {
    const toast = useToast();

    const expandedRows = ref([]);
    return { toast, expandedRows };
  },
  data() {
    return {
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      seccionMod: {
        idSeccion: 0,
        codigoSeccion: 0,
        descripcion: "",
        idModalidad: 0,
        capacidadMax: 0,
        idAsignatura: 0,
        idMaestro: 0,
        esActivo: true,
        detalleSeccion: [
          // {
          //   idSeccionHorario: 0,
          //   idSecciom: 0,
          //   idAula: 0,
          //   idDia: 0,
          //   horaDesde: "",
          //   horaHasta: "",
          // },
        ],
      },
      seccionesDialog: false,
      enviado: false,
      editandoSeccion: false,
      listaAsignaturas: [],
      listaCarreras: [],
      listaAula: [],
      activePanel: 0,
      prueba: [],
      listaEncargados: [],
      SeccionesApi: [],
      listaMaestros: [],
      listaUsuarios: [],
      AsignaturasGrouped: {},
      AsignaturasREADY: [],
      rowSelectionMode: "multiple",
      horario: [],
      horariosCreados: {
        idSeccionHorario: 0,
        idSecciom: 0,
        idAula: 0,
        idDia: 0,
        horaDesde: "",
        horaHasta: "",
      },
      Horas: [
        { name: "7:00AM", value: "07:00:00" },
        { name: "8:00AM", value: "08:00:00" },
        { name: "9:00AM", value: "09:00:00" },
        { name: "10:00AM", value: "10:00:00" },
        { name: "11:00AM", value: "11:00:00" },
        { name: "12:00PM", value: "12:00:00" },
        { name: "1:00PM", value: "13:00:00" },
        { name: "2:00PM", value: "14:00:00" },
        { name: "3:00PM", value: "15:00:00" },
        { name: "4:00PM", value: "16:00:00" },
        { name: "5:00PM", value: "17:00:00" },
        { name: "6:00PM", value: "18:00:00" },
        { name: "7:00PM", value: "19:00:00" },
        { name: "8:00PM", value: "20:00:00" },
        { name: "9:00PM", value: "21:00:00" },
        { name: "10:00PM", value: "22:00:00" },
      ],
      Dias: [
        { Dia: "Lunes", idDia: 1 },
        { Dia: "Martes", idDia: 2 },
        { Dia: "Miercoles", idDia: 3 },
        { Dia: "Jueves", idDia: 4 },
        { Dia: "Viernes", idDia: 5 },
        { Dia: "Sabado", idDia: 6 },
      ],
      estaActivo: [
        { label: "Activo", value: true },
        { label: "Inactivo", value: false },
      ],
      Modalidad: [
        { name: "Asignatura Presencial", value: 1 },
        { name: "Asignatura Virtual", value: 2 },
        { name: "Asignatura Asincronica", value: 4 },
      ],
      estudianteDashboardModel: {
        InfoEstudiante: {},
        InfoUsuario: {},

        PeriodoDesde: "",
        PeriodoHasta: "",
        PeriodoAño: "",
      },
    };
  },
  mounted() {
    this.cargarMaestros();
    this.cargarUsuarios();
    this.group();
    this.cargarAsignaturas();
    this.cargarAulas();
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    async cargarDatos() {
      this.seccionMod.idMaestro = this.listaEncargados.find(
        (x) => x.idMaestro === this.seccionMod.idMaestro
      );
      this.seccionMod.idModalidad = this.Modalidad.find(
        (x) => x.value === this.seccionMod.idModalidad
      );
      this.seccionMod.idAsignatura = this.listaAsignaturas.find(
        (x) => x.idAsignatura === this.seccionMod.idAsignatura
      );
      this.seccionMod.esActivo = this.estaActivo.find(
        (x) => x.value === this.seccionMod.esActivo
      );
    },
    async editarSeccion(idSeccion) {
      this.seccionMod = {};
      this.seccionMod = await this.SeccionesApi.find(
        (x) => x.idSeccion === idSeccion
      );

      await this.cargarDatos();

      this.editandoSeccion = true;
      this.seccionesDialog = true;
    },
    borrarSeccionTabla(index) {
      this.seccionMod.detalleSeccion.splice(index, 1);
    },
    agregarHorarioSeccion() {
      if (
        this.horariosCreados.idAula &&
        this.horariosCreados.idDia &&
        this.horariosCreados.horaDesde &&
        this.horariosCreados.horaHasta &&
        this.seccionMod.idModalidad
      ) {
        this.horariosCreados.idAula = this.horariosCreados.idAula.idAula;
        this.horariosCreados.Dia = this.horariosCreados.idDia.Dia;
        this.horariosCreados.idDia = this.horariosCreados.idDia.idDia;
        this.horariosCreados.idSecciom = this.seccionMod.idSeccion;
        this.horariosCreados.horaDesde = this.horariosCreados.horaDesde.value;
        this.horariosCreados.horaHasta = this.horariosCreados.horaHasta.value;
        this.seccionMod.detalleSeccion.push(this.horariosCreados);
        this.horariosCreados = {
          idSeccionHorario: 0,
          idSecciom: 0,
          idAula: 0,
          idDia: 0,
          horaDesde: "",
          horaHasta: "",
        };
      }
    },
    crearSeccion() {
      /* this.asignatura = {}; */
      this.enviado = false;
      this.seccionesDialog = true;
      this.editandoSeccion = false;
    },
    cambiarTab() {
      if (
        this.seccionMod.idMaestro &&
        this.seccionMod.idModalidad &&
        this.seccionMod.capacidadMax &&
        this.seccionMod.esActivo &&
        this.seccionMod.idAsignatura &&
        this.seccionMod.descripcion
      ) {
        this.activePanel = 1;
      }
    },
    hideDialog() {
      this.enviado = false;
      this.activePanel = 0;
      this.seccionMod = {
        idSeccion: 0,
        codigoSeccion: 0,
        descripcion: "",
        idModalidad: { value: 0 },
        capacidadMax: 0,
        idAsignatura: 0,
        idMaestro: 0,
        esActivo: true,
        detalleSeccion: [],
      };

      this.horariosCreados = [];
      this.seccionesDialog = false;
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
    async cargarUsuarios() {
      const response = await api.get("api/Usuarios");
      if (response.data) {
        this.listaUsuarios = response.data;
        this.listaEncargados = this.llenarListaEncargados(
          this.listaMaestros,
          this.listaUsuarios
        );
      } else {
        this.toast.error("Error al cargar las carreras", toastProperties);
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
            idMaestro: maestro.idMaestro,
          });
        }
      });

      return listaEncargados;
    },
    async cargarAsignaturas() {
      const response = await api.get("api/Asignaturas");
      if (response.data) {
        this.listaAsignaturas = response.data;
      } else {
        this.toast.error("Error al cargar las carreras", toastProperties);
      }
    },
    async cargarAulas() {
      const response = await api.get("api/Aula");
      if (response.data) {
        this.listaAula = response.data;
      } else {
        this.toast.error("Error al cargar las aulas", toastProperties);
      }
    },
    async cargarMaestros() {
      const response = await api.get("api/Maestros");
      if (response.data) {
        this.listaMaestros = response.data;
      } else {
        this.toast.error("Error al cargar los Maestros", toastProperties);
      }
    },
    async group() {
      const response = await api.get("api/SeccionAsignatura");
      this.AsignaturasREADY = [];
      this.AsignaturasGrouped = [];
      if (response.data) {
        let seccionesAsignatura = response.data;
        this.SeccionesApi = response.data;
        let eachSeccion = [];
        if (seccionesAsignatura != null) {
          eachSeccion = seccionesAsignatura.map((x) => ({
            codigo: x.codigoAsignatura,
            seccion: x.codigoSeccion,
            asignatura: x.Asignatura,
            creditos: x.creditos,
            profesor: x.Maestro,
            detalleSeccion: x.detalleSeccion,
            calificacion: 95,
            calificacionLiteral: "A",
            Modalidad: x.Modalidad,
          }));

          seccionesAsignatura.map((x) => {
            x.detalleSeccion.map((y) => {
              eachSeccion[seccionesAsignatura.indexOf(x)][
                y.Dia
              ] = `${y.horaDesde.substr(0, 5)}-${y.horaHasta.substr(0, 5)}`;

              eachSeccion[seccionesAsignatura.indexOf(x)]["idSecciom"] =
                y.idSecciom;

              eachSeccion[seccionesAsignatura.indexOf(x)]["Aula"] = y.Aula;
            });
          });

          eachSeccion.forEach((x) => {
            if (this.AsignaturasGrouped[x.codigo] != null) {
              this.AsignaturasGrouped[x.codigo].Codigo = x.codigo;
              this.AsignaturasGrouped[x.codigo].Nombre = x.asignatura;
              this.AsignaturasGrouped[x.codigo].Secciones.push(x);
            } else {
              this.AsignaturasGrouped[x.codigo] = {
                Codigo: {},
                Nombre: {},
                Secciones: [],
              };

              this.AsignaturasGrouped[x.codigo].Codigo = x.codigo;
              this.AsignaturasGrouped[x.codigo].Nombre = x.asignatura;
              this.AsignaturasGrouped[x.codigo].Secciones.push(x);
            }
          });

          for (let clave in this.AsignaturasGrouped) {
            this.AsignaturasREADY.push(this.AsignaturasGrouped[clave]);
          }
        }
      }
    },
    async guardarSeccion() {
      this.enviado = true;

      if (
        this.seccionMod.idModalidad &&
        this.seccionMod.idMaestro &&
        this.seccionMod.idModalidad &&
        this.seccionMod.capacidadMax &&
        this.seccionMod.esActivo &&
        this.seccionMod.idAsignatura &&
        this.seccionMod.descripcion
      ) {
        this.seccionMod.idModalidad = this.seccionMod.idModalidad.value;

        this.seccionMod.idAsignatura =
          this.seccionMod.idAsignatura.idAsignatura;

        this.seccionMod.idMaestro = this.seccionMod.idMaestro.idMaestro;

        this.seccionMod.esActivo = this.seccionMod.esActivo.value;
        if (this.editandoSeccion !== true) {
          console.log(this.seccionMod);
          try {
            await api
              .post("/api/SeccionAsignatura", this.seccionMod)
              .then((response) => {
                if (response.data.Success) {
                  this.toast.success(
                    response.data.Message,
                    this.$store.state.defaultToastOptions
                  );
                  this.hideDialog();
                } else {
                  this.toast.warning(
                    response.data.Message,
                    this.$store.state.defaultToastOptions
                  );

                  this.cargarDatos();
                }
              });

            await this.group();
          } catch (error) {
            this.toast.error(
              "Error 500. Error al realizar la operación.",
              this.$store.state.defaultToastOptions
            );
            this.hideDialog();
          }
        } else {
          try {
            await api
              .put(
                `/api/SeccionAsignatura?idSeccion=${this.seccionMod.idSeccion}`,
                this.seccionMod
              )

              .then((response) => {
                if (response.data.Success) {
                  this.toast.success(
                    response.data.Message,
                    this.$store.state.defaultToastOptions
                  );
                  this.hideDialog();
                } else {
                  this.toast.warning(
                    response.data.Message,
                    this.$store.state.defaultToastOptions
                  );

                  this.cargarDatos();
                }
              });
            await this.group();
          } catch (error) {
            this.toast.error(
              "Error 500. Error al realizar la operación.",
              this.$store.state.defaultToastOptions
            );
            this.hideDialog();
          }
        }
      } else {
        console.log("Error: campos obligatorios no introducidos");
      }
    },
  },
};
</script>
