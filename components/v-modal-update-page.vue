<template>
  <v-modal
    v-if="opened"
    @close="close()"
  >
    <div slot="header">Изменение страницы</div>
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
        <label>Заголовок</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="form.title"
        >
      </div>

      <div
        v-if="page.depth < 3"
        class="form-group"
      >
        <label>Заголовок подменю</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="form.titleSubmenu"
        >
      </div>

      <div class="form-group">
        <label>Псевдоним</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="form.slug"
          :disabled="this.page.component === 'v-home'"
        >
      </div>

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

      <div class="form-group">
        <label>Переадресация</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="form.redirect"
          :disabled="this.page.path === '/'"
        >
      </div>

      <div class="form-group">
        <label>Позиция</label>
        <input
          type="text"
          class="form-control form-control-sm"
          v-model="form.order"
        >
      </div>
    </div>
    <div slot="footer">
      <button
        class="btn btn-primary"
        @click="updatePage()"
      >
        Сохранить
      </button>
    </div>
  </v-modal>
</template>

<script>
import * as moment from 'moment';
import VModal from '~/components/v-modal';

export default {
  components: {
    VModal
  },

  data() {
    return {
      opened: false,
      id: '',
      form: {}
    }
  },
  
  computed: {
    page() {
      return this.$store.state.pages.find(value => value.id === this.id);
    },

    pageParent() {
      return this.$store.state.pages.find(value => value.id === this.page.parent);
    }
  },

  methods: {
    clear() {
      this.form = {
        component: this.page.component,
        datePublished: moment(this.page.datePublished).format('YYYY-MM-DDTHH:mm:ss'),
        order: this.page.order,
        redirect: this.page.redirect,
        slug: this.pageParent && this.pageParent.component === 'v-news' ? this.page.slug.split('/').pop() : this.page.slug,
        source: this.page.source,
        title: this.page.title,
        titleSubmenu: this.page.titleSubmenu
      };
    },

    async open({ id }) {
      this.opened = true;
      this.id = id;
      this.$emit('open');
      this.clear();
    },

    close() {
      this.opened = false;
      this.$emit('close');
    },

    async updatePage() {
      this.close();

      try {
        await this.$store.dispatch('updatePages', {
          pages: [{
            ...this.page,
            ...this.form
          }]
        });
      } catch (error) {
        this.$emit('error', error);
      }
    }
  }
}
</script>