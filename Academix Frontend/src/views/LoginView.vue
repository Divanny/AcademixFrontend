<template>
  <div class="login-container content">
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6" style="max-width: 400px;">
      <div class="text-center mb-5">
        <img src="../assets/academix.png" alt="Image" height="100" class="mb-3" />
        <div class="text-900 text-3xl font-medium mb-3">Iniciar sesión</div>
      </div>

      <form @submit.prevent="iniciarSesion">
        <div>
          <label for="email1" class="block text-900 font-medium mb-2">Usuario</label>
          <InputText v-model="credentials.userName" type="text" placeholder="Nombre de usuario" class="w-full mb-4" />

          <label for="password1" class="block text-900 font-medium mb-2">Contraseña</label>
          <div class="password-input-wrapper">
            <Password v-model="credentials.password" :feedback="false" :toggleMask="true" placeholder="Contraseña"
              class="w-100 mb-3" />
          </div>

          <div class="flex align-items-center justify-content-end mb-5">
            <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
              @click="dialogResetPassword = true">¿Has olvidado la
              contraseña?</a>
          </div>

          <Button style="background-color: rgb(19, 152, 150); border: 0" :loading="loading" label="Iniciar sesión"
            icon="pi pi-user" class="w-full" type="submit"></Button>
        </div>
      </form>
    </div>
  </div>

  <Dialog v-model:visible="dialogResetPassword" modal header="Reiniciar contraseña" :style="{ maxWidth: '400px' }">
    <label class="block text-900 font-medium mb-3">
      <i class="fas fa-info-circle mr-2"/>Introduce tu <strong>nombre de usuario</strong> para poder restablecer tu contraseña.
    </label>
          <InputText v-model="credentials.userName" type="text" placeholder="Nombre de usuario" class="w-full" />
    <template #footer>
      <div class="d-flex justify-content-between">
        <Button label="Cancelar" size="small" severity="secondary" icon="pi pi-times" text />
        <Button :loading="loading" style="background-color: rgb(19, 152, 150); border: 0" iconPos="right" label="Siguiente" size="small" icon="fas fa-arrow-right" @click="validateUser()" autofocus />
      </div>
    </template>
  </Dialog>

  <Dialog v-model:visible="dialogConfirmMail" modal header="Confirmar correo electrónico" :style="{ maxWidth: '400px' }">
    <label class="block text-900 font-medium mb-3">
      <i class="fas fa-info-circle mr-2"/>Confirma tu dirección de correo electrónico para cambiar tu contraseña: <strong>{{ userMail }}</strong>
    </label>
          <InputText v-model="confirmUserMail" type="text" placeholder="Correo electrónico" class="w-full" />
    <template #footer>
      <div class="d-flex justify-content-between">
        <Button label="Cancelar" size="small" severity="secondary" icon="pi pi-times" text />
        <Button :loading="loading" style="background-color: rgb(19, 152, 150); border: 0" label="Reiniciar" size="small" icon="pi pi-check" @click="changePassword()" autofocus />
      </div>
    </template>
  </Dialog>
</template>

<script>
import router from '@/router'
import { useToast } from "vue-toastification";
import toastProperties from '@/utilities/toastProperties';
import api from '@/utilities/api';
import { mapActions } from 'vuex';

export default {
  setup() {
    const toast = useToast();
    return { toast }
  },
  mounted() {
    document.body.classList.add('login-body');
  },
  beforeUnmount() {
    document.body.classList.remove('login-body');
  },
  data() {
    return {
      credentials: {
        userName: "",
        password: "",
      },
      loading: false,
      dialogResetPassword: false,
      dialogConfirmMail: false,
      userMail: false,
      confirmUserMail: "",
    };
  },
  methods: {
    ...mapActions(['fetchUser']),
    async iniciarSesion() {
      if ((this.credentials.userName == "" || this.credentials.userName == null) || (this.credentials.password == "" || this.credentials.password == null)) {
        this.toast.warning("Todos los campos son requeridos");
      }
      else {
        this.loading = true;
        const response = await api.post('/api/Account/LogIn', this.credentials);
        if (response.data.Success) {
          this.loading = false;
          const token = response.data.Token;
          localStorage.setItem("token", token);

          this.fetchUser();

          this.toast.success(response.data.Message, toastProperties);
          router.push('/');
        }
        else {
          this.loading = false;
          this.toast.warning(response.data.Message, toastProperties);
        }
      }
    },
    async changePassword() {
      if ((this.confirmUserMail == "" || this.confirmUserMail == null) ) {
        this.toast.warning("Debe especificar el correo electrónico de verificación");
      }
      else {
        this.loading = true;
        const response = await api.put(`/api/Account/ChangePassword?NombreUsuario=${this.credentials.userName}&CorreoElectronico=${this.confirmUserMail}`);

        if (response.data.Success) {
          this.loading = false;
          this.dialogResetPassword = false;
          this.dialogConfirmMail = false;
          this.toast.success(response.data.Message, toastProperties);
        }
        else {
          this.loading = false;
          this.toast.warning(response.data.Message, toastProperties);
        }
      }
    },
    async validateUser() {
      if ((this.credentials.userName == "" || this.credentials.userName == null) ) {
        this.toast.warning("Debe especificar el usuario");
      }
      else {
        this.loading = true;
        const response = await api.get(`/api/Account/ValidateUser?NombreUsuario=${this.credentials.userName}`);
        console.log(response);
        if (response.data.Success) {
          this.loading = false;
          this.dialogResetPassword = false;
          this.dialogConfirmMail = true;
          this.userMail = response.data.Data.MaskedMail;
        }
        else {
          this.loading = false;
          this.toast.warning(response.data.Message, toastProperties);
        }
      }
    }
  },
};
</script>

<style>
.login-content {
  background: linear-gradient(335deg,
      hsl(180deg 77% 15%) 0%,
      hsl(180deg 42% 22%) 16%,
      hsl(179deg 29% 29%) 39%,
      hsl(179deg 21% 34%) 58%,
      hsl(179deg 16% 40%) 71%,
      hsl(178deg 12% 46%) 80%,
      hsl(178deg 10% 52%) 87%,
      hsl(177deg 10% 59%) 92%,
      hsl(176deg 9% 65%) 97%,
      hsl(175deg 8% 71%) 100%);
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-body {
  overflow: hidden;
}

.p-password-input {
  width: 100%;
}

.p-password .p-icon:hover {
  cursor: pointer;
}</style>
