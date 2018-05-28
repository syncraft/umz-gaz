<template>
  <v-modal v-if="opened" @close="close()">
    <div slot="header">Выход из режима администрирования</div>

    <div>
      Функции редактирования страниц станут недоступны
    </div>
    
    <div slot="footer">
      <button class="btn btn-primary" @click="logout()">Выйти</button>
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
      opened: false
    }
  },

  methods: {
    open() {
      this.opened = true;
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.$emit('close');
    },

    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$emit('success');
      } catch(error) {
        this.$emit('error', error);
      } finally {
        this.close();
      }
    }
  }
}
</script>