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
      :pages="$store.getters.children.filter(page => page.depth === 3)"
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

  async fetch({ app, route, store }) {
    await app.$prefetch();
    
    store.commit('updatePages', {
      pages: await store.dispatch('searchPages', {
        path: `/catalog/${route.params.slug || ''}.+`,
        sort: 'datePublished',
        order: 'desc',
        depth: 3
      })
    });
  }
}
</script>

<style lang="scss" scoped>
.v-content {
  min-height: 1rem;
}
</style>