<template>
  <DataTable
    :value="asignaturasSeleccionadas"
    class="p-datatable-sm selectedSubjects border-round table-borderless"
    p-datatable-wrapper="h-0"
    :rowHover="false"
    tableClass="rounded"
    tableStyle="border-radius: 20px"
  >
    <Column field="codigo" header="Código"></Column>
    <Column field="seccion" header="Sección"></Column>
    <Column field="asignatura" header="Asignatura"></Column>
    <Column field="creditos" header="Cr."></Column>
    <Column field="profesor" header="Profesor"></Column>
    <Column field="Lunes" header="Lun."></Column>
    <Column field="Martes" header="Mar."></Column>
    <Column field="Miercoles" header="Mie."></Column>
    <Column field="Jueves" header="Jue."></Column>
    <Column field="Viernes" header="Vie."></Column>
    <Column field="Sabado" header="Sáb."></Column>
    <Column field="calificacion" header="Calif"></Column>
  </DataTable>
</template>

<script setup>
// if (this.estudianteDashboardModel.AsignaturasSeleccionadas != null) {
//           this.asignaturasSeleccionadas = this.estudianteDashboardModel.AsignaturasSeleccionadas.map(x => ({
//             codigo: "AS004",
//             seccion: x.codigoSeccion,
//             asignatura: x.Asignatura,
//             creditos: 3,
//             profesor: x.Maestro,
//             detalleSeccion: x.detalleSeccion,
//             calificacion: 95,
//             calificacionLiteral: "A",
//           }));

//           console.log(this.estudianteDashboardModel.AsignaturasSeleccionadas);

//           this.estudianteDashboardModel.AsignaturasSeleccionadas.map(x => {
//               x.detalleSeccion.map(y => {
//                 this.asignaturasSeleccionadas[this.estudianteDashboardModel.AsignaturasSeleccionadas.indexOf(x)][y.Dia] = ${(y.horaDesde).substr(0, 5)}-${(y.horaHasta).substr(0, 5)};
//               });
//             }
//           )
//         }
</script>
