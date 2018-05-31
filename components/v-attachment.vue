<template>
  <a
    v-if="attachment && thumbnail && link"
    :href="attachment.url"
    class="d-block"
  >
    <img :src="url_thumbnail">
  </a>

  <img
    v-else-if="attachment && thumbnail"
    :src="url_thumbnail"
  >

  <video
    v-else-if="attachment && video"
    controls
  >
    <source
      :src="attachment.url"
      type="video/mp4"
    >
    Онлайн просмотр видео не подерживается вашим браузером.
    <a
      v-if="link"
      :href="attachment.url"
    >
      Скачать
    </a>.
  </video>

  <a
    v-else-if="attachment && link && image"
    :href="attachment.url"
    class="d-block"
  >
    <img :src="attachment.url">
  </a>

  <a
    v-else-if="attachment && link"
    :href="attachment.url"
  >
    <template v-if="$slots.default"><slot/></template>
    <template v-else>{{ attachment.name.split('.').slice(0, -1).join('.') }}</template>
  </a>

  <img
    v-else-if="attachment && image"
    :src="attachment.url"
  >

  <span v-else-if="attachment">
    <template v-if="$slots.default"><slot/></template>
    <template v-else>{{ attachment.name.split('.').slice(0, -1).join('.') }}</template>
  </span>
</template>

<script>
export default {
  props: {
    id: { required: true, type: String },
    link: { default: true, type: Boolean },
    thumbnail: { default: true, type: [ Boolean, Object ] }
  },

  computed: {
    attachment() {
      if (this.$store.getters.page) {
        return this.$store.getters.page.attachments.find(value => value.id === this.id);
      }
    },

    image() {
      if (this.attachment) {
        return (
          this.attachment.type === 'image/jpeg' ||
          this.attachment.type === 'image/png' ||
          this.attachment.type === 'image/gif'
        );
      }
    },

    video() {
      if (this.attachment) {
        return (
          this.attachment.type === 'video/mp4'
        );
      }
    },

    url_thumbnail() {
      if (this.thumbnail && (this.thumbnail.width || this.thumbnail.height)) {
        let query = '?';

        if (this.thumbnail.width) {
          query += `width=${this.thumbnail.width}`;
        }

        if (this.thumbnail.height) {
          if (this.thumbnail.width) {
            query += '&';
          }
          
          query += `height=${this.thumbnail.height}`;
        }

        return `${this.attachment.url_thumbnail}${query}`;
      } else {
        return this.attachment.url_thumbnail;
      }
    }
  }  
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: auto;
}

img {
  display: block;
  width: 100%;
}
</style>