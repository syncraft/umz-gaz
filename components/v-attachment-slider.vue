<template>
  <div>
    <Carousel
      :per-page="1"
      :mouse-drag="false"
      :autoplay="true"
      :autoplay-timeout=4000
      :loop="true"
      pagination-color="#bbb"
      pagination-active-color="#777"
      pagination-position="bottom-overlay"
      :pagination-padding=5
    >
      <Slide
        v-for="image in images_url"
        :key="image"
      >
        <a :href="image">
          <img :src="image + '.thumbnail.png?width=500&height=500'">
        </a>
      </Slide>
    </Carousel>
  </div>
</template>

<script>
  import { Carousel, Slide } from '@jambonn/vue-concise-carousel';
  import '@jambonn/vue-concise-carousel/dist/vue-concise-carousel.css'

  export default {
    components: {
      Carousel,
      Slide
    },

    props: {
      images: { required: true, type: String | Array, default: () => [] }
    },

    computed: {
      images_url() {
        if (this.$store.getters.page) {
          if (this.images instanceof Array) {
            return this.images
              .map(image => this.$store.getters.page.attachments.find(({ id }) => id === image))
              .map(({ url }) => url)
          } else {
            return [this.$store.getters.page.attachments.find(({ id }) => id === this.images).url]
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  a {
    display: block;
    outline: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }
</style>