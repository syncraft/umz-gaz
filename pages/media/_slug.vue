<template>
  <div class="container pb-5">
    {{ pages.length }}
    <v-news-list
      @contextmenu="$parent.$emit('contextmenupage', $event)"
      @more="fetchMediaMore()"
      :pages="pages"
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

  computed: {
    pages() {
      return this.$store.getters.children
        .filter(page => RegExp(`/media/.+`).test(page.path) && page.depth === 3)
        .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    }
  },

  async fetch({ store, params }) {
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
    }
  }
}
</script>