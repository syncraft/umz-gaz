<template>
  <div>
    <v-content
      class="container v-content"
      v-if="$store.getters.page"
      :content="$store.getters.page.content || ''"
      @contextmenu.native="$parent.$emit('contextmenu', { event: $event })"
    />

    <v-feedback @submit="sendEmail($event)" />
  </div>
</template>

<script>
import VContent from '~/components/v-content';
import VFeedback from '~/components/v-feedback';

export default {
  components: {
    VContent,
    VFeedback
  },

  methods: {
    async sendEmail({ form }) {
      this.$store.dispatch('sendEmail', { form });
    }
  }
}
</script>