<template>
  <div class="container pb-5">
    <v-news-list
      @contextmenu="$parent.$emit('contextmenupage', $event)"
      @more="fetchMediaMore()"
      :pages="$store.getters.children.filter(page => page.depth === 3).sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))"
    />
  </div>
</template>

<script>
import VNewsList from '~/components/v-news-list';

export default {
  components: {
    VNewsList
  },

  data: () => ({
    skip: 6
  }),

  async fetch({ app, store, params }) {
    await app.$prefetch();

    store.commit('updatePages', {
      pages: await store.dispatch('searchPages', {
        path: `/media/${params.slug || ''}.+`,
        sort: 'datePublished',
        order: 'desc',
        depth: 3,
        limit: 6
      })
    });
  },

  methods: {
    async fetchMediaMore() {
      this.$nuxt.$loading.start();
      
      this.$store.commit('updatePages', {
        pages: await this.$store.dispatch('searchPages', {
          path: `/media/${this.$route.params.slug || ''}.+`,
          sort: 'datePublished',
          order: 'desc',
          depth: 3,
          limit: 3,
          skip: this.skip
        })
      });

      this.skip += 3;
      this.$nuxt.$loading.finish();
    }
  }
}
</script>