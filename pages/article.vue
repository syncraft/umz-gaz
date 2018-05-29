<template>
  <div v-if="$store.getters.page" class="container pb-5">
    <div v-if="root.path === '/media' && $store.getters.page.depth > 1" class="mb-4">
      <div class="row">
        <div class="col d-flex align-items-center text-muted small">
          <span class="pr-4">
            <span class="far fa-fw fa-clock mr-1"></span>
            <span>{{ date }}</span>
          </span>

          <span v-if="source">
            <span class="fas fa-fw fa-external-link-alt mr-1"></span>
            <a :href="source.url">{{ source.name }}</a>
          </span>
        </div>

        <div class="col d-flex align-items-center justify-content-end">
          <v-social
            :title="$store.getters.page.title"
            :url="$store.state.url + $store.getters.page.path"
            :image="image">
          </v-social>
        </div>
      </div>
    </div>

    <v-content
      class="v-content"
      :content="$store.getters.page.content || ''"
      @contextmenu.native="$parent.$emit('contextmenu', { event: $event })"
    />
  </div>
</template>

<script>
import * as moment from 'moment';
import * as url from 'url';
import VContent from '~/components/v-content';
import VSocial from '~/components/v-social';

export default {
  components: {
    VContent,
    VSocial
  },

  props: {
    manager: { type: Boolean, default: false }
  },

  computed: {
    root() {
      if (this.$store.getters.page) {
        return this.$store.state.pages.find(page => page.id === this.$store.getters.page.breadcrumbs[0]);
      }
    },

    date() {
      return moment(this.$store.getters.page.datePublished).format('DD.MM.YYYY');
    },

    source() {
      if (this.$store.getters.page.source) {
        return {
          url: this.$store.getters.page.source,
          name: url.parse(this.$store.getters.page.source).hostname
        };
      }
    },

    image() {
      if (this.$store.getters.page.image) {
        const attachment = this.$store.getters.page.attachments.find(value => value.id === this.$store.getters.page.image);
        
        if (attachment) {
          return attachment.url;
        }
      }
    }
  },

  async fetch({ app }) {
    await app.$prefetch();
  }
}
</script>

<style class="scss" scoped>
.v-content {
  min-height: 20rem;
}
</style>