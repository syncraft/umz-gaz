<template>
  <div class="container pb-5">
    <v-news-list
      :pages="pages"
      @contextmenu="$parent.$emit('contextmenupage', $event)"
    />
  </div>
</template>

<script>
import VNewsList from '~/components/v-news-list';

export default {
  components: {
    VNewsList
  },

  computed: {
    pages() {
      return this.$store.getters.children.filter(page => page.depth === 3);
    }
  },

  async fetch({ store }) {
    await store.dispatch('fetchPageChildren', { path: store.state.path });
  }
}
</script>