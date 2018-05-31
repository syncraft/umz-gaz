<template>
  <transition name="fade">
    <div
      v-if="opened"
      class="v-context-menu small"
      :style="style"
      v-click-outside="close"
    >
      <button
        v-for="item in menu"
        :key="item.title"
        @click="item.click(); close()"
        :disabled="item.disabled"
      >
        {{ item.title }}
      </button>
    </div>
  </transition>
</template>

<script>
import ClickOutside from '~/directives/ClickOutside';

export default {
  directives: {
    ClickOutside
  },

  data() {
    return {
      opened: false,
      menu: [],
      position: {}
    }
  },

  computed: {
    style() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`
      };
    }
  },

  methods: {
    open({ menu, position }) {
      this.opened = true;
      this.menu = menu;
      this.position = position;
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.$emit('close');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.v-context-menu {
  top: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  background-color: white;
  border: 1px solid #ebebeb;
  color: black;

  button {
    display: block;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    user-select: none;
    outline-style: none;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: theme-color('gray-300');
    }
  }
}
</style>