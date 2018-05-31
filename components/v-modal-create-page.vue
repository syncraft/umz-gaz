<template>
  <v-modal
    v-if="opened"
    @close="close()"
  >
    <div slot="header">Создание страницы</div>
    <div>
      <div
        class="form-group"
        v-if="pageParent"
      >
        <label class="text-muted">Родитель</label>
        <input
          type="text"
          class="form-control form-control-sm"
          :value="pageParent.title"
          disabled
        >
      </div>
      
      <div class="form-group">
        <label class="text-muted">Заголовок</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="form.title"
        >
      </div>
      
      <div class="form-group">
        <label class="text-muted">Псевдоним</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="slug"
        >
      </div>

      <div class="form-group">
        <label class="text-muted">Тип страницы</label>
        <select
          class="form-control form-control-sm"
          v-model="type"
        >
          <option value="article">Статья</option>
          <option value="event">Событие</option>
        </select>
      </div>
      
      <template v-if="type === 'event'">
        <div class="form-group">
          <label class="text-muted">Источник</label>
          <input
            type="text"
            class="form-control form-control-sm"
            v-model="form.source"
          >
        </div>

        <div class="form-group">
          <label class="text-muted">Дата публикации</label>
          <input
            type="datetime-local"
            class="form-control form-control-sm"
            v-model="form.datePublished"
          >
        </div>
      </template>
    </div>

    <div slot="footer">
      <button
        class="btn btn-primary"
        @click="createPage()"
      >
        Создать
      </button>
    </div>
  </v-modal>
</template>

<script>
import * as moment from 'moment';
import { slugify } from 'transliteration';
import VModal from '~/components/v-modal';

export default {
  components: {
    VModal
  },

  data() {
    return {
      opened: false,
      type: '',
      parent: '',
      form: {}
    }
  },

  computed: {
    pageParent() {
      return this.$store.state.pages.find(value => value.id === this.parent);
    },

    slug: {
      get() {
        if (this.form.slug) {
          return this.form.slug;
        } else {
          return slugify(this.form.title);
        }
      },

      set(value) {
        this.form.slug = value;
      }
    }
  },

  methods: {
    clear() {
      this.type = 'article';
      
      this.form = {
        component: 'v-article',
        datePublished: moment().format('YYYY-MM-DDTHH:mm:ss'),
        slug: '',
        source: '',
        title: ''
      };
    },

    open({ parent } = {}) {
      this.clear();
      this.opened = true;
      this.parent = parent;
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.$emit('close');
    },

    async createPage() {
      this.close();

      try {
        await this.$store.dispatch('createPages', {
          pages: [
            {
              ...this.form,
              ...this.parent ? { parent: this.parent } : {},
              ...this.type === 'event' ? {
                slug: `${moment(this.form.datePublished).format('YYYY/MM/DD')}/${this.form.slug || this.slug}`
              } : {
                slug: this.form.slug || this.slug
              }
            }
          ]
        });

        this.$emit('success');
      } catch (error) {
        this.$emit('error', error);
      }
    }
  }
}
</script>