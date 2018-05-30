<template>
  <div class="v-slide-carousel">
    <transition-group tag="div" name="fade" mode="out-in" class="wrapper">
      <div v-for="key in [page]" :key="key">
        <v-slide class="position-absolute" :name="slide.attachment" :position="index % 2 === 0 ? 'right' : 'left'">
          <h1 class="font-weight-bold mb-5">{{ slide.title.toUpperCase() }}</h1>
          <h4 class="font-weight-bold">{{ slide.description }}</h4>
        </v-slide>
      </div>
    </transition-group>
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