<template>
  <v-modal v-if="opened" @close="close()">
    <div slot="header">Удаление страницы</div>
    <div>
      Вы хотите удалить страницу «<b>{{ page.title }}</b>»?
    </div>
    <div slot="footer">
      <button class="btn btn-primary" @click="deletePage()">Удалить</button>
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
      id: ''
    }
  },

  computed: {
    page() {
      return this.$store.state.pages.find(value => value.id === this.id);
    }
  },

  methods: {
    open({ id }) {
      this.opened = true;
      this.id = id;
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.$emit('close');
    },

    async deletePage() {
      this.close();
      
      try {
        await this.$store.dispatch('deletePages', { pages: [ this.page ] });
        this.$emit('success');
      } catch (error) {
        console.error(error);
        this.$emit('error', error);
      }
    }
  }
}
</script>