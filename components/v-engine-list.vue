<template>
  <div class="v-engine-list">
    <transition-group
      class="row"
      name="list"
      tag="div"
    >
      <div
        class="engine col-6 col-md-4 col-lg-3 mb-4 mb-md-5"
        v-for="page in pages"
        :key="page.id"
        @contextmenu.stop="$emit('contextmenu', { event: $event, id: page.id, parent: $store.getters.page.id })"
      >
        <router-link
          :to="page.path"
          class="d-block"
          draggable="false"
        >
          <div
            v-if="image(page)"
            class="image"
            :style="{ backgroundImage: `url('${image(page)}.thumbnail.png?width=500&height=500')` }"
          />

          <div class="title mt-3">{{ page.title }}</div>
        </router-link>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    pages: { type: Array, required: true }
  },

  data: () => ({
    draggableId: ''
  }),

  computed: {
    draggable() {
      return this.pages.find(value => value.id === this.draggableId);
    }
  },

  methods: {
    image(page) {
      if (page.image) {
        const attachment = page.attachments.find(value => value.id === page.image);
        
        if (attachment) {
          return attachment.url;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.v-engine-list {
  min-height: 10rem;

  .engine {
    a {
      color: inherit;
      text-decoration: none;
    }

    .image {
      width: 100%;
      height: 150px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      will-change: filter transform;
      transition: all 0.1s linear;
    }

    .title {
      font-size: 0.9rem;
      font-family: "geometriamedium", Arial, FreeSans, sans-serif;
      text-align: center;
    }

    &:hover {
      a {
        color: theme-color("primary");
      }

      .image {
        transform: scale(1.03);
      }
    }
  }
}

@include media-breakpoint-up(sm) {
  .v-engine-list {
    .engine {
      .image {
        height: 200px;
      }
    }
  }
}
</style>