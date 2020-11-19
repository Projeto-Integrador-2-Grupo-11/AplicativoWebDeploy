<template>
  <div>
    <!-- Page content -->
    <div class="container py-7 py-lg-8 pt-lg-9">
      <!-- Table -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card bg-secondary border-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <b>Cadastro</b>
              </div>
              <form role="form">
                <base-input alternative
                            class="mb-3"
                            prepend-icon="ni ni-box-2"
                            placeholder="ID da Máquina"
                            v-model="model.machineId">
                </base-input>

                <base-input alternative
                            class="mb-3"
                            prepend-icon="ni ni-single-02"
                            placeholder="Nome"
                            v-model="model.name">
                </base-input>

                <base-input alternative
                            class="mb-3"
                            prepend-icon="ni ni-email-83"
                            placeholder="E-mail"
                            v-model="model.email">
                </base-input>

                <base-input alternative
                            class="mb-3"
                            prepend-icon="ni ni-lock-circle-open"
                            placeholder="Senha"
                            type="password"
                            v-model="model.password">
                </base-input>
                <div class="text-center">
                  <button @click="registerFirebase" type="button" class="btn btn-primary mt-4">Cadastrar</button>
                </div>
              </form>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-6">
              <nuxt-link to="/login" class="text-light"><small>Já tem uma conta? Faça Login</small></nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseInput from '~/components/Inputs/BaseInput.vue';

export default {
  layout: 'AuthLayout',
  name: 'register',
  components:{
    BaseInput
  },
  data() {
    return {
      model: {
        machineId: '',
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
      registerFirebase(e) {
        const usersRef = this.$firestore.collection('users').doc(this.model.machineId);

      usersRef.get()
        .then(doc => {
          if (!doc.exists) {
            this.$store.dispatch(
              'modules/user/registerWithEmailAndPassword', 
              this.model
            );
          } else {
            alert("Já existe uma conta cadastrada para o ID informado!");
          }
        })
        .catch(err => {
          console.log('Error', err);
        });
      }
    }
};
</script>
<style></style>
