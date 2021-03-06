<template>
  <div
    class="v-news-list"
    @contextmenu="$emit('contextmenu', { event: $event, parent: $store.getters.page.id })"
  >
    <div class="row">
      <div
        class="col-12 col-md-6 col-lg-4 mb-4"
        v-for="page in pages"
        :key="page.id"
        @contextmenu.stop="$emit('contextmenu', { event: $event, id: page.id, parent: $store.getters.page.id })"
      >
        <router-link
          :to="page.path"
          class="d-flex flex-column h-100"
        >
          <div class="image-container">
            <div
              class="image"
              :style="image(page) && { 'background-image': `url('${image(page)}')` }"
            />
          </div>

          <div style="flex-grow: 1;">
            <div class="row no-gutters">
              <div class="col-6">
                <div class="date py-2 text-white">
                  <div class="container">
                    <div class="row no-gutters">
                      <div class="col-4 d-flex flex-column align-items-center justify-content-center">
                        <div class="day umz-font-regular">
                          {{ day(page.datePublished) }}
                        </div>
                      </div>

                      <div class="col-8 pl-3 d-flex flex-column justify-content-around">
                        <div class="month umz-font-medium">
                          {{ month(page.datePublished) }}
                        </div>
                        
                        <div class="year umz-font-medium">
                          {{ year(page.datePublished) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>        
              </div>

              <div class="col-6 d-flex align-items-center">
                <div class="container">
                  <div class="category umz-font-medium text-dark text-nowrap">
                    {{ category(page).toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>

            <div class="title text-dark">
              <div class="container py-4">
                {{ page.title }}
              </div>
            </div>            
          </div>
        </router-link>
      </div>
    </div>

    <button
      v-if="!fixed"
      @click="$emit('more')"
      class="more"
    >
      Показать еще
    </button>
  </div>
</template>

<script>
import * as moment from 'moment';

export default {
  props: {
    pages: { type: Array, required: true },
    fixed: { type: Boolean, default: false }
  },

  methods: {
    image(page) {
      if (page.image) {
        const attachment = page.attachments.find(value => value.id === page.image);

        if (attachment) {
          return attachment.url;
        }
      }
    },

    day(date) {
      return moment(date).format('DD');
    },

    month(date) {
      const month = moment(date).locale('ru').format('MMMM');
      return month.charAt(0).toLocaleUpperCase() + month.slice(1);
    },

    year(date) {
      return moment(date).format('YYYY');
    },

    category(page) {
      if (page.parent) {
        const parent = this.$store.state.pages.find(value => value.id === page.parent);

        if (parent) {
          return parent.title;
        } else {
          return '';
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.v-news-list {
  min-height: 10rem;

  a {
    text-decoration: none;
    background-color: white;
    transition: all 0.1s linear;
    font-size: 0.88rem;

    .image-container {
      overflow: hidden;

      .image {
        width: 100%;
        height: 250px;
        transition: all 0.2s linear;
        background-size: cover;
        background-position: center;
        background-image: url('~/assets/images/no-image.jpg');
      }
    }
  
    .date {
      background-color: #252b33;
  
      .day {
        font-size: 2.4rem;
        line-height: 2.4rem;
      }
  
      .month, .year {
        font-size: 0.8rem;
      }
    }
  
    .category {
      font-size: 0.7rem;
      letter-spacing: 0.02rem;

      a {
        background-color: transparent;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &:hover {
      background-color: theme-color("light");

      .image {
        transform: scale(1.03);
      }
    }
  }

  button.more {
    display: block;
    width: 100%;
    background-color: transparent;
    border: none;
    font-size: 0.8rem;
    text-align: center;
    
    &:hover {
      cursor: pointer;
      background-color: #e6e6e6;
    }
  }
}
</style>