<template>
  <div>
    <!-- Page content -->
    <div class="container py-7 py-lg-8 pt-lg-9">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <b>Login</b>
              </div>
              <form role="form">
                <base-input alternative
                            class="mb-3"
                            prepend-icon="ni ni-email-83"
                            placeholder="E-mail"
                            v-model="model.email">
                </base-input>

                <base-input alternative
                            class="mb-3"
                            prepend-icon="ni ni-lock-circle-open"
                            type="password"
                            placeholder="Senha"
                            v-model="model.password">
                </base-input>
                <div class="text-center">
                  <base-button  @click="loginFirebase()" type="primary" class="my-4">Login</base-button>
                </div>
              </form>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-6">
              <nuxt-link to="/dashboard" class="text-light"><small>Esqueceu a senha?</small></nuxt-link>
            </div>
            <div class="col-6 text-right">
              <nuxt-link to="/register" class="text-light"><small>Criar uma nova conta</small></nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseInput from '~/components/Inputs/BaseInput.vue';
import BaseButton from '~/components/Buttons/BaseButton.vue';

  export default {
    layout: 'AuthLayout',
    components:{
      BaseInput,
      BaseButton
    },
    data() {
      return {
        model: {
          email: '',
          password: ''
        }
      };
    },
    methods: {
      loginFirebase(e) {
        this.$store.dispatch('modules/user/logInWithEmailAndPassword', this.model);
      }
    },
  };
</script>
