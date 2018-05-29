<template>
  <div>
    <section class="v-submenu">
      <div class="container">
        <h3 class="py-5 m-0 umz-font-bold umz-font-wide">{{ root.title }}</h3>

        <div class="row no-gutters umz-font-bold umz-font-wide" @contextmenu="$emit('contextmenu', { event: $event, parent: root.id })">
          <div class="col-12 col-sm-auto text-nowrap" v-if="!root.redirect" @contextmenu.stop="$emit('contextmenu', { event: $event, id: root.id, parent: root.id })">
            <nuxt-link :to="root.path" :class="{ disabled: root.disabled }" active-class="active" exact>
              {{ (root.titleSubmenu || root.title).toUpperCase() }}
            </nuxt-link>
          </div>

          <div
            class="col-12 col-sm-auto text-nowrap"
            v-for="page in pages"
            :key="page.id"
            @contextmenu.stop="$emit('contextmenu', { event: $event, id: page.id, parent: root.id })"
          >
            <nuxt-link :to="page.path" :class="{ disabled: page.disabled }" active-class="active" draggable="false">
              {{ (page.titleSubmenu || page.title).toUpperCase() }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {  
    pages: {
      required: true,
      type: Array
    },
    root: {
      required: true,
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.v-submenu {
  .row {
    position: relative;
    z-index: 1;
    font-size: 0.6rem;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background-color: theme-color('gray-300');
      content: '';
      z-index: -1;
      box-shadow: 0px 1px 0px 0px rgba(theme-color('white'), 0.5);
    }

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 1px;
      background-color: theme-color('gray-300');
      content: '';
      z-index: -1;
      box-shadow: 0px 1px 0px 0px rgba(theme-color('white'), 0.5);
    }

    a {
      position: relative;
      display: block;
      color: theme-color('dark');
      text-decoration: none;
      padding: 10px;
      user-select: none;

      &.active {
        color: theme-color('white');
        background-color: theme-color('primary');

        &::after {
          position: absolute;
          top: 100%;
          left: 0;
          content: '';
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 10px 14px 0 0;
          border-color: theme-color('primary') transparent transparent transparent;
        }
      }

      &.disabled {
        text-decoration: line-through;
      }
    }
  }
}
</style>