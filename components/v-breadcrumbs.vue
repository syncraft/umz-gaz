<template>
  <section class="v-breadcrumbs">
    <div class="container">
      <ul class="breadcrumb text-muted m-0 py-2">
        <li class="breadcrumb-item">
          <router-link class="text-muted" to="/">{{ home.title }}</router-link>
        </li>

        <template v-if="last.path !== '/'">
          <li class="breadcrumb-item" v-for="(page, index) in pages" v-if="page" :key="page.id">
            <template v-if="index < (pages.length - 1)">
              <router-link class="text-muted" :to="page.path">{{ page.title }}</router-link>
            </template>

            <template v-else>
              <span>{{ page.title }}</span>
            </template>
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  props: {  
    pages: {
      required: true,
      type: Array
    },
    home: {
      required: true,
      type: Object
    }
  },

  computed: {
    last() {
      return this.pages[this.pages.length - 1];
    }
  }
}
</script>

<style lang="scss" scoped>
.v-breadcrumbs {
  padding-top: 3.4rem;

  .breadcrumb {
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    float: none;
    display: block;

    .breadcrumb-item {
      white-space: nowrap;
      float: none;
      display: inline-block;
    }
  }
}
</style>