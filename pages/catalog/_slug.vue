<template>
  <div class="container pb-5">
    <v-content
      class="v-content"
      v-if="$store.getters.page"
      :content="$store.getters.page.content || ''"
      @contextmenu.prevent.native="$parent.$emit('contextmenu', { event: $event })"
    />

    <v-engine-list
      class="mt-6"
      :pages="$store.getters.children"
      @contextmenu="$parent.$emit('contextmenu', $event)"
    />
  </div>
</template>

<script>
import VContent from '~/components/v-content';
import VEngineList from '~/components/v-engine-list';

export default {
  components: {
    VContent,
    VEngineList
  },

  async fetch({ store }) {
    await store.dispatch('fetchPageChildren', { path: store.state.path });
  }
}
</script>

<style lang="scss" scoped>
.v-content {
  min-height: 1rem;
}
</style>