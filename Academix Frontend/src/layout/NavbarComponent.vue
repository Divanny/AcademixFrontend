<template>
  <!-- Navbar -->
  <nav navbar id="navbar" class="main-header navbar navbar-expand navbar-white navbar-light ">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button">
          <i class="fas fa-bars"></i>
        </a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <strong class="nav-link text-dark">{{ $route.name }}</strong>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <li class="nav-item d-flex">
        <Button class="m-2 p-link flex align-items-center p-2 text-color hover:surface-200 border-round"
          severity="secondary" plain text @click="ajustesDialog = true">
          <i class="pi pi-cog" style="font-size: 1.2rem"></i>
        </Button>
      </li>
      <li class="nav-item px-2">
        <button @click="profileClick"
          class="w-full p-link flex align-items-center p-1 px-3 text-color hover:surface-200 border-round">
          <Avatar :label="(userData.Nombres != undefined) ? userData.Nombres[0] : ''" class="mr-2" shape="circle"
            style="background-color:#137775; color: #ffffff" />
          <div class="flex flex-column align">
            <span class="font-bold">{{ getFirstLastName(userData.Nombres, userData.Apellidos) }}</span>
            <span class="text-sm">{{ userData.Perfil }}</span>
          </div>
        </button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        <Toast />
      </li>
    </ul>
    <Dialog v-model:visible="ajustesDialog" :style="{ width: '250px' }" header="Ajustes" :modal="true" class="p-fluid">
      <Button label="Cambiar contraseña" icon="fas fa-unlock-alt" outlined size="small" class="my-2"
        @click="ajustesDialog = false; cambioPassDialog = true;" />
      <router-link :to="{ name: 'Mis Solicitudes' }">
        <Button label="Solicitud de Soporte" icon="fas fa-question-circle" severity="secondary" outlined size="small"
          class="my-2" @click="ajustesDialog = false" />
      </router-link>
    </Dialog>

    <Dialog v-model:visible="cambioPassDialog" :style="{ width: '350px' }" header="Cambiar contraseña" :modal="true"
      class="p-fluid">
      <div class="mb-3">
        <label for="AntPassword" class="text-base">Contraseña anterior:</label>
        <Password id="AntPassword" v-model.trim="AntPassword" required="true" :feedback="false" :toggleMask="true" placeholder="Contraseña anterior"
              class="w-100 mb-3 p-inputtext-sm" />
      </div>
      <div class="my-3">
        <label for="NewPassword" class="text-base">Nueva contraseña:</label>
        <Password id="NewPassword" v-model.trim="NewPassword" required="true" :feedback="false" :toggleMask="true" placeholder="Nueva contraseña"
              class="w-100 mb-3 p-inputtext-sm" />
      </div>
      <div class="my-3">
        <label for="ConfirmPassword" class="text-base">Confirmar nueva contraseña:</label>
        <Password id="ConfirmPassword" v-model.trim="ConfirmPassword" required="true" :feedback="false" :toggleMask="true" placeholder="Confirmar nueva contraseña"
              class="w-100 mb-3 p-inputtext-sm" />
      </div>
      <Button label="Cambiar contraseña" icon="fas fa-unlock-alt" size="small" class="mt-2 bg-teal-800 border-teal-800"
        @click="changePassword(AntPassword, NewPassword, ConfirmPassword)" />
    </Dialog>
  </nav>
  <!-- /.navbar -->
</template>
  
  
<script setup>
import { ref, computed } from "vue";
import toastProperties from '@/utilities/toastProperties';

import router from '../router';
import api from "../utilities/api";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";

const toast = useToast();
const store = useStore();
const menu = ref();
const ajustesDialog = ref();
const cambioPassDialog = ref();
const AntPassword = ref();
const NewPassword = ref();
const ConfirmPassword = ref();

const items = ref([
  {
    label: 'Cerrar sesión',
    icon: 'pi pi-sign-out',
    command: () => {
      localStorage.removeItem('token');
      api.put('/api/Account/LogOff')
        .then(() => {
          router.push('/Login');
          toast.success('Ha cerrado sesión satisfactoriamente', toastProperties);
        })
        .catch((error) => {
          console.error('Error al cerrar sesión:', error);
          router.push('/Login');
        });
    }
  }
]);

const profileClick = (event) => {
  menu.value.toggle(event);
};

store.dispatch('fetchUser');

const userData = computed(() => store.getters.getUserData);

const getFirstLastName = (Nombres, Apellidos) => {
  if (Nombres != null && Apellidos != null) {
    let firstName = Nombres.split(" ");
    firstName = firstName[0];
    let lastName = Apellidos.split(" ");
    lastName = lastName[0];
    return firstName + " " + lastName;
  }
}

const changePassword = (AntPassword, NewPassword, ConfirmPassword) => {
  const cambioContraseñaModel = {
    AntPassword: AntPassword,
    NewPassword: NewPassword,
    ConfirmPassword: ConfirmPassword
  }
  api.put('api/Usuarios/ChangePassword', cambioContraseñaModel).then((response) => {
    console.log(response);
    if (response.data.Success) {
      toast.success(response.data.Message, toastProperties);
      cambioPassDialog.value = false;
    }
    else {
      toast.warning(response.data.Message, toastProperties);
    }
  })
}
</script>
<style></style>