<template>
  <div class="v-slide">
    <div class="image" :style="style">
      <div class="description">
        <div class="container h-100">
          <div class="h-100 d-flex align-items-sm-center mt-7 mt-sm-0" :class="classes">
            <div class="block">
              <slot></slot>
            </div>
          </div>      
        </div>    
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String },
    name: { type: String },
    position: { default: 'left', type: String }
  },

  computed: {
    attachment() {
      if (this.name) {
        return this.$store.getters.page.attachments.find(value => value.name === this.name);
      } else if (this.id) {
        return this.$store.getters.page.attachments.find(value => value.id === this.id);
      } else {
        return [];
      }
    },

    style() {
      if (this.attachment) {
        return {
          backgroundImage: `url(${this.attachment.url})`
        };
      } else {
        return {};
      }
    },

    classes() {
      return {
        'justify-content-start': this.position === 'left',
        'justify-content-end': this.position === 'right'
      };
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.v-slide {
  width: 100%;
  height: 100vh;

  .image {
    width: 100vw;
    height: 100vh;
    max-width: 100%;
    position: absolute;
    left: 0;
    background-position: 50%;
    background-size: cover;
    overflow: hidden;
  
    .description {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      text-shadow: 0 0 5px #000;
      color: white;
      
      .block {
        width: 100%;
        text-align: center;
  
        h1 { font-size: $h1-font-size / 1.4; }
        h2 { font-size: $h2-font-size / 1.4; }
        h3 { font-size: $h3-font-size / 1.4; }
        h4 { font-size: $h4-font-size / 1.4; }
        h5 { font-size: $h5-font-size / 1.4; }
        h6 { font-size: $h6-font-size / 1.4; }
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .v-slide {
    .image {
      .description {
        .block {
          width: 50%;
          text-align: left;
  
          h1 { font-size: $h1-font-size * 1.4; }
          h2 { font-size: $h2-font-size; }
          h3 { font-size: $h3-font-size; }
          h4 { font-size: $h4-font-size; }
          h5 { font-size: $h5-font-size; }
          h6 { font-size: $h6-font-size; }
        }
      }
    }    
  }
}
</style>