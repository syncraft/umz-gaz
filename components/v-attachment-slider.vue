<template>
  <div>
    <Carousel
      :per-page="1"
      :mouse-drag="false"
      :autoplay="true"
      :autoplay-timeout=8000
      :loop="true"
      pagination-color="#bbb"
      pagination-active-color="#777"
      pagination-position="bottom-overlay"
      :pagination-padding=5
    >
      <Slide
        v-for="{url, name, id} in images_attachments"
        :key="id"
      >
        <a :href="url">
          <img :src="url + '.thumbnail.jpg?width=500&height=500'">
          <h1>{{ name.split('.').slice(0, -1).join('.') }}</h1>
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
      images_attachments() {
        if (this.$store.getters.page) {
          if (this.images instanceof Array) {
            return this.images
              .map(image => this.$store.getters.page.attachments.find(({ id }) => id === image))
          } else {
            return [this.$store.getters.page.attachments.find(({ id }) => id === this.images)]
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
    position: relative;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  h1 {
    display: block;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.8rem;
    font-weight: normal;
    font-family: "geometrialight", Arial, FreeSans, sans-serif;
    color: black;
    text-align: left;
    margin: 0;
    padding: 0 0 4px 0;
    white-space: nowrap;
    text-shadow:
        0.09rem 0 white,
        0 0.09rem white,
        -0.09rem 0 white,
        0 -0.09rem white;
  }
</style>