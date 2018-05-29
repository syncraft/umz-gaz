<template>
  <section class="container pb-5" @contextmenu="$parent.$emit('contextmenu', { event: $event })">
    <v-slide-carousel :slides="slides"></v-slide-carousel>

    <div class="mt-6">
      <div class="row description mb-3 mb-md-5">
        <div class="col-12 col-md-5 d-flex flex-column justify-content-start align-items-center align-items-md-end mb-3 mb-md-0">
          <div class="title">
            Двигатели
          </div>

          <div class="title-small">
            к автомобилям ГАЗ
          </div>
        </div>

        <div class="col-0 col-md-2 d-none d-md-flex justify-content-center">
          <div class="delimiter"></div>
        </div>

        <div class="col-12 col-md-5">
          <div class="intro mb-5 mb-lg-0">
            {{ enginesGazContent }}
          </div>
        </div>
      </div>

      <v-engine-list :pages="enginesGaz"></v-engine-list>
    </div>

    <hr class="my-5">

    <div class="mt-5">
      <div class="row description mb-3 mb-md-5">
        <div class="col-12 col-md-5 d-flex flex-column justify-content-start align-items-center align-items-md-end mb-3 mb-md-0">
          <div class="title">
            Двигатели
          </div>

          <div class="title-small">
            к автомобилям УАЗ
          </div>
        </div>

        <div class="col-0 col-md-2 d-none d-md-flex justify-content-center">
          <div class="delimiter"></div>
        </div>

        <div class="col-12 col-md-5">
          <div class="intro mb-5 mb-lg-0">
            {{ enginesUazContent }}
          </div>
        </div>
      </div>

      <v-engine-list :pages="enginesUaz"></v-engine-list>
    </div>

    <v-slide name="7.jpg">
      <h1 class="font-weight-bold mb-5">
        Ульяновский
        <br>
        моторный завод
      </h1>

      <h4 class="font-weight-bold">
        Высокий уровень
        <br>
        качества продукции
      </h4>

      <h6>
        Сегодня «УМЗ» - одно из ведущих российских
        <br>
        предприятий по производству автомобильных двигателей.
        <br>
        Входит в крупнейший машиностроительный холдинг «Группу ГАЗ». 
        <br>
        Производит 10 моделей и 80 модификаций двигателей и более 1500 наименований запчастей к ним
      </h6>
    </v-slide>
    
    <h5 class="mt-6 mb-4">Новости</h5>
    <v-news-list :pages="media" fixed></v-news-list>

    <v-content v-if="$store.getters.page && $store.getters.page.content" :content="$store.getters.page.content"/>
  </section>
</template>

<script>
import VContent from '~/components/v-content';
import VEngineList from '~/components/v-engine-list';
import VNewsList from '~/components/v-news-list';
import VSlide from '~/components/v-slide';
import VSlideCarousel from '~/components/v-slide-carousel';

export default {
  components: {
    VContent,
    VEngineList,
    VNewsList,
    VSlide,
    VSlideCarousel
  },

  data: () => ({
    slides: [
      { attachment: '1.jpg', title: 'Продукция', description: 'Бензиновые и газобензиновые автомобильные двигатели «Евро-4» и «Евро-5»' },
      { attachment: '2.jpg', title: 'Качество', description: 'Система менеджмента качества соответствует международному стандарту ISO 9001:2008' },
      { attachment: '3.jpg', title: 'Производство', description: 'Предприятие полного цикла: от разработки до выпуска готовой продукции' },
      { attachment: '4.jpg', title: 'Развитие', description: 'Современное оборудование, высокая точность измерений, контроль качества - 100%' },
      { attachment: '5.jpg', title: 'Модернизация', description: 'Изменениями охвачено 100% производственных площадей' },
      { attachment: '6.jpg', title: 'Технологии', description: 'Универсальный комплекс по механообработке' }
    ]
  }),

  computed: {
    enginesGazContent() {
      const page = this.$store.state.pages.find(page => page.path === '/catalog/autoengine-gaz');

      if (page) {
        return page.content;
      }
    },

    enginesUazContent() {
      const page = this.$store.state.pages.find(page => page.path === '/catalog/autoengine-uaz');

      if (page) {
        return page.content;
      }
    },

    enginesGaz() {
      return this.$store.state.pages
        .filter(page => RegExp(`/catalog/autoengine-gaz/.+`).test(page.path))
        .sort((a, b) => a.order - b.order);
    },

    enginesUaz() {
      return this.$store.state.pages
        .filter(page => RegExp(`/catalog/autoengine-uaz/.+`).test(page.path))
        .sort((a, b) => a.order - b.order);
    },

    media() {
      return this.$store.state.pages
        .filter(page => RegExp(`/media/.+`).test(page.path) && page.depth === 3)
        .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    }
  },

  async fetch({ app, store }) {
    await app.$prefetch();
    
    store.commit('updatePages', {
      pages: await store.dispatch('searchPages', {
        path: '/catalog/autoengine-gaz.*'
      })
    });

    store.commit('updatePages', {
      pages: await store.dispatch('searchPages', {
        path: '/catalog/autoengine-uaz.*'
      })
    });

    store.commit('updatePages', {
      pages: await store.dispatch('searchPages', {
        path: '/media/.+',
        sort: 'datePublished',
        order: 'desc',
        depth: 3,
        limit: 6
      })
    });
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.description {
  .title {
    font-family: "geometriabold", Arial, FreeSans, sans-serif;
    font-size: 2.5rem;      
    text-transform: uppercase;
    height: 3rem;
    line-height: 3rem;
  }

  .title-small {
    font-family: "geometriabold", Arial, FreeSans, sans-serif;
    font-size: 1.2rem;
  }

  .delimiter {
    background-color: theme-color("primary");
    width: 2px;
    height: 100%;
  }
}
</style>