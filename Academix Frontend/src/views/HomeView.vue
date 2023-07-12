<template>
  <EstudianteHome v-if="userData.idPerfil == PerfilesEnum.Estudiante"/>
  <AdministradorHome v-if="userData.idPerfil == PerfilesEnum.Administrador"/>
  <ProfesorHome v-if="userData.idPerfil == PerfilesEnum.Profesor"/>

</template>

<script>
import EstudianteHome from '@/components/EstudianteHome.vue'
import AdministradorHome from '@/components/AdministradorHome.vue'
import ProfesorHome from '@/components/ProfesorHome.vue'
import perfilesEnum from '@/utilities/perfilesEnum'
import { mapState } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    EstudianteHome,
    AdministradorHome,
    ProfesorHome
  },
  data() {
    return {
      PerfilesEnum: {},
    };
  },
  computed: {
    ...mapState(['userData'])
  },
  mounted() {
    this.PerfilesEnum = perfilesEnum;
  },
}
</script>
