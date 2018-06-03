<template>
  <button
    v-if="show"
    @click="scroll()"
  >
    <span class="fa-stack">
      <i
        class="fas fa-fw fa-circle fa-stack-2x text-white"
      />
      <i class="far fa-fw fa-circle fa-stack-2x"/>
      <i
        class="fas fa-fw fa-angle-up fa-stack-1x"
        style="font-size: 1.6rem;"
      />
    </span>
  </button>
</template>

<script>
export default {
  data: () => ({
    show: false
  }),

  methods: {
    scroll() {
      window.scrollTo(0, 0);
    },

    handler() {
      this.show = window.pageYOffset > 400;
    }
  },

  created() {
    this.handler();
    window.addEventListener('scroll', this.handler);
  },

  destroyed() {
    window.removeEventListener('scroll', this.handler);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

button {
  position: fixed;
  right: 2rem;
  bottom: 1.5rem;
  color: theme-color('dark');
  opacity: 0.2;
  z-index: 999;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  user-select: none;
  outline: 0;
  font-size: 1.1rem;
  transition: opacity 0.3s;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>