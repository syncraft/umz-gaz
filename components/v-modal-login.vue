<template>
  <v-modal v-if="opened" @close="close()">
    <div slot="header">Вход в режим администрирования</div>
    
    <form id="v-modal-login" @submit.prevent>
      <div class="form-group">
        <label class="text-muted">Имя пользователя</label>
        <input type="text" class="form-control form-control-sm" autocomplete="username" v-model="form.username" @input="error = false">
      </div>
      
      <div class="form-group">
        <label class="text-muted">Пароль</label>
        <input type="password" class="form-control form-control-sm" autocomplete="current-password" v-model="form.password" @input="error = false">
      </div>

      <transition name="fade">
        <div v-if="error" class="alert alert-danger" role="alert">
          Неправильное имя пользователя или пароль
        </div>
      </transition>
    </form>
    
    <div slot="footer">
      <button type="submit" form="v-modal-login" class="btn btn-primary" @click="login()">Войти</button>
    </div>
  </v-modal>
</template>

<script>
import VModal from '~/components/v-modal';

export default {
  components: {
    VModal
  },

  data() {
    return {
      opened: false,
      error: false,
      form: {}
    }
  },

  methods: {
    clear() {
      this.form = {
        username: '',
        password: ''
      }
    },

    open() {
      this.opened = true;
      this.clear();
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.clear();
      this.$emit('close');
    },

    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.form.username,
          password: this.form.password
        });
        
        this.$emit('success');
        this.close();
      } catch(error) {
        this.$emit('error', error);
        this.error = true;
        setTimeout(() => this.error = false, 5000);
      }
    }
  }
}
</script>