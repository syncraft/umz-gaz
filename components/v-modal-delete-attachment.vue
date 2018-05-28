<template>
  <transition name="fade">
    <v-modal v-if="opened" @close="close()">
      <div slot="header">Удаление вложения</div>
      <div>
        Вы хотите удалить вложение «<b>{{ attachment.name }}</b>»?
      </div>
      <div slot="footer">
        <button class="btn btn-primary" @click="deleteAttachment()">Удалить</button>
      </div>
    </v-modal>
  </transition>
</template>

<script>
import VModal from '~/components/v-modal';

export default {
  components: {
    VModal
  },

  data() {
    return {
      attachment: {},
      opened: false
    }
  },

  methods: {
    open({ attachment }) {
      this.opened = true;
      this.attachment = attachment;
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.$emit('close');
    },

    async deleteAttachment() {
      this.close();
      
      try {      
        await this.$store.dispatch('deleteAttachments', { attachments: [ this.attachment ] });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>