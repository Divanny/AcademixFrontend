<template>
  <div class="card">
    <DataTable
      v-model:expandedRowGroups="expandedRowGroups"
      :value="periodosAsignaturas"
      tableStyle="min-width: 50rem"
      expandableRowGroups
      rowGroupMode="subheader"
      groupRowsBy="descripcionTrimestre"
      sortMode="single"
      sortField="descripcionTrimestre"
      :sortOrder="1"
      :filters="filters"
    >
      <template #header>
        <div
          class="flex flex-wrap gap-2 align-items-center justify-content-between"
        >
          <h4 class="m-0"></h4>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Buscar..."
            />
          </span>
        </div>
      </template>
      <template #groupheader="slotProps">
        <span class="vertical-align-middle ml-2 font-bold line-height-3">{{
          slotProps.data.descripcionTrimestre
        }}</span>
      </template>
      <Column field="descripcionTrimestre" header="Representative"></Column>
      <Column
        field="codigoAsignatura"
        header="Código"
        style="width: 20%"
      ></Column>
      <Column
        field="descripcion"
        header="Asignatura"
        style="width: 20%"
      ></Column>
      <Column field="prerrequisito" header="Prerrequisito" style="width: 20%">
        <template #body="slotProps">{{
          dividirPrerrequisito(slotProps.data.prerrequisito)
        }}</template>
      </Column>
      <Column field="estado" header="Estado" style="width: 20%">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.estado"
            :severity="getSeverity(slotProps.data.estado)"
          />
        </template>
      </Column>
      <Column field="fechaAprobada" header="Fecha Cursada" style="width: 20%"
        ><template #body="slotProps">
          {{ convertirFecha(slotProps.data.fechaAprobada) }}
        </template></Column
      >
      <Column field="literal" header="Literal" style="width: 20%"></Column>
      <template #groupfooter="slotProps">
        <div class="flex justify-content-end font-bold w-full">
          Total Asignaturas:
          {{ calculateCustomerTotal(slotProps.data.descripcionTrimestre) }}
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { CustomerService } from "@/service/CustomerService";
import toastProperties from "@/utilities/toastProperties";
import api from "@/utilities/api";
import { FilterMatchMode } from "primevue/api";
import moment from "moment";
onMounted(() => {
  // CustomerService.getHistorialAcademico().then(
  //   (data) => (periodosAsignaturas.value = data)
  // );
  // console.log(periodosAsignaturas);
  cargarHistorial();
});

const periodosAsignaturas = ref();
const expandedRowGroups = ref();

const convertirFecha = (fecha) => {
  // Parsear la fecha en formato ISO 8601
  const fechaISO = moment(fecha).toISOString();

  // Formatear la fecha en el nuevo formato "23/6/2023"
  const fechaFormateada = moment(fechaISO).format("D/M/YYYY");

  // Devolver la fecha formateada
  return fechaFormateada;
};
const calculateCustomerTotal = (descripcionTrimestre) => {
  let total = 0;

  if (periodosAsignaturas.value) {
    for (let asignatura of periodosAsignaturas.value) {
      if (asignatura.descripcionTrimestre === descripcionTrimestre) {
        total++;
      }
    }
  }

  return total;
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const getSeverity = (estado) => {
  switch (estado) {
    case "Reprobada":
      return "danger";

    case "Aprobada":
      return "success";

    case "No Cursada":
      return "info";
  }
};

const cargarHistorial = async () => {
  const response = await api.get("api/HistoricoAcademico");
  if (response.data) {
    console.log(response.data);
    periodosAsignaturas.value = response.data;
    console.log(periodosAsignaturas);
  } else {
    this.toast.error(
      "Error al cargar las El Historial Academico",
      toastProperties
    );
  }
};
const dividirPrerrequisito = (listaPrerrequisitos) => {
  console.log(listaPrerrequisitos);
  return listaPrerrequisitos.join();
};
</script>
