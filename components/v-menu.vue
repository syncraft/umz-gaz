<template>
  <div>
    <nav class="fixed-top" @contextmenu="$emit('contextmenu', { event: $event })">
      <div class="container">
        <div class="logo">
          <nuxt-link to="/">
            <img class="d-block" src="@/assets/images/logo.png">
          </nuxt-link>
        </div>

        <div class="toggler">
          <button @click="show = !show">
            <span class="fas fa-bars"></span>
          </button>
        </div>

        <transition-group :class="{ show }" name="list" tag="ul">
          <li
            v-for="page in pages"
            v-if="(!manager && !page.disabled) || manager"
            :key="page.id"
            :class="{ disabled: page.disabled }"
            @contextmenu.stop="$emit('contextmenu', { event: $event, id: page.id })"
          >
            <nuxt-link :to="page.path" @click.native="close()">
              {{ page.title }}
            </nuxt-link>
          </li>
        </transition-group>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    manager: {
      default: false,
      type: Boolean
    },    
    pages: {
      required: true,
      type: Array
    }
  },

  data() {
    return {
      show: false
    }
  },

  methods: {
    open() {
      this.show = true;
    },

    close() {
      this.show = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

nav {
  color: theme-color('white');
  background-color: theme-color('dark');
  border-bottom: 1px solid rgba(theme-color('black'), 0.1);
  opacity: 0.95;
  padding: 0.6rem 0;
  z-index: 2;

  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .logo {
      img {
        height: 1.3rem;
      }
    }

    .toggler {
      button {
        font-size: 1.3rem;
        background-color: transparent;
        border: 0;
        color: inherit;
        padding: 0;
        outline: none;

        &:hover {
          cursor: pointer;
        }
      }
    }

    ul {
      display: none;
      flex-basis: 100%;
      flex-grow: 1;
      align-items: center;
      list-style: none;
      padding: 0.5rem 0 0 0;
      margin: 0.7rem 0 0 0;
      border-top: 1px solid theme-color('gray-700');

      &.show {
        display: block;
      }
      
      li {
        a {
          display: block;
          padding: 0.5rem 0;
          color: inherit;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          font-size: 0.8rem;
          letter-spacing: 0.88px;
          text-transform: uppercase;
          font-family: $umz-font-medium;
          user-select: none;
        }

        &.disabled {
          text-decoration: line-through;
        }
      }
    }
  }
}

@include media-breakpoint-up(md) {
  nav {
    .container {
      .toggler {
        display: none;
      }

      ul {
        border: 0;
        margin: 0;
        padding: 0;
        flex-basis: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-left: 3rem;

        &.show {
          display: flex;
        }
      }
    }
  }
}
</style>