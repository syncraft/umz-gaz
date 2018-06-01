<template>
  <div class="v-slide-carousel">
    <div class="wrapper">
      <transition
        name="fade"
        mode="in-out"
      >
        <component :is="component"/>
      </transition>
    </div>
  </div>
</template>

<script>
import VSlide from '~/components/v-slide';

export default {
  components: {
    VSlide
  },

  props: {
    slides: { type: Array, required: true }
  },

  data: () => ({
    page: 0,
    timer: 0
  }),

  computed: {
    index() {
      return Math.abs(this.page) % this.slides.length;
    },

    slide() {
      return this.slides[this.index];
    },

    component() {
      return {
        components: {
          VSlide
        },
        template: `
          <v-slide
            class="position-absolute"
            name="${ this.slide.attachment }"
            position="${ this.index % 2 === 0 ? 'right' : 'left' }"
          >
            <h1 class="font-weight-bold mb-5">${ this.slide.title.toUpperCase() }</h1>
            <h4 class="font-weight-bold">${ this.slide.description }</h4>
          </v-slide>
        `
      };
    }
  },

  mounted() {
    window.setInterval(() => this.next(), 5000);
  },

  methods: {
    next() {
      this.page++;
    },

    previous() {
      this.page--;
    },
  }
}
</script>

<style lang="scss" scoped>
.v-slide-carousel {
  height: 100vh;

  .wrapper {
    width: 100vw;
    max-width: 100%;
    height: 100vh;
    overflow: hidden;
    left: 0;
    position: absolute;
  }
}
</style>