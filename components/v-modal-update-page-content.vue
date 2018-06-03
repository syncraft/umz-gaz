<template>
  <v-modal
    v-if="opened && $store.getters.page"
    @close="close()"
    size="large"
  >
    <div slot="header">Изменение содержимого страницы</div>
    <div>
      <div class="card h-100 small">
        <div class="card-header">
          Содержимое
        </div>
        
        <div class="card-body">
          <textarea
            class="form-control form-control-sm"
            rows="15"
            v-model="form.content"
          />
        </div>
      </div>

      <div
        class="card h-100 small mt-3 attachments"
        v-if="attachmentsSorted.length > 0"
      >
        <div class="card-header">
          Вложения
        </div>
        
        <div
          class="card-body"
          style="overflow-x: auto;"
        >
          <div class="row flex-nowrap">
            <div
              class="col-6 col-lg-4 col-xl-3"
              v-for="attachment in attachmentsSorted"
              :key="attachment.id"
            >
              <div
                class="card"
                :class="{ 'border-primary': $store.getters.page.image === attachment.id }"
                draggable="true"
                @dragstart="dragAttachmentStart($event, attachment)"
                @contextmenu.prevent="$emit('contextmenu', { event: $event, attachment })"
              >
                <div class="card-header">
                  <div class="title small">
                    <div>{{ attachment.name }}</div>
                    <div class="small">{{ attachment.id }}</div>
                  </div>
                </div>
                <img
                  class="card-img-bottom"
                  :src="attachment.url_thumbnail"
                  :alt="attachment.name"
                  @click="download(attachment)"
                  draggable="false"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div
      class="w-100 text-right"
      slot="footer"
    >
      <input
        ref="upload"
        class="d-none"
        type="file"
        @change="uploadAttachments($event)"
        multiple
      >

      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="$refs.upload.click()"
      >
        Вложить
      </button>

      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="updatePage()"
      >
        Сохранить
      </button>
    </div>
  </v-modal>
</template>

<script>
import VModal from '~/components/v-modal';

export default {
  components: {
    VModal
  },
  
  data() {
    return {
      opened: false,
      form: { content: '' }
    };
  },

  computed: {
    attachmentsSorted() {
      if (this.$store.getters.page) {
        return this.$store.getters.page.attachments.slice().sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      } else {
        return [];
      }
    }
  },

  methods: {
    open() {
      this.opened = true;
      this.form.content = this.$store.getters.page.content;
      this.$emit('open');
    },

    close() {
      this.opened = false;
      this.$emit('close');
    },

    download(attachment) {
      window.open(attachment.url);
    },

    dragAttachmentStart(event, attachment) {
      event.dataTransfer.setData('text', `<v-attachment id="${attachment.id}" class="my-4" />`);
    },

    async updatePage() {
      try {
        await this.$store.dispatch('updatePages', {
          pages: [
            {
              ...this.$store.getters.page,
              ...this.form
            }
          ]
        });
      } catch (error) {
        this.$emit('error', error);
      }

      this.close();
    },

    async uploadAttachments(event) {
      if (event.target.files) {
        try {
          await this.$store.dispatch('uploadAttachments', { files: event.target.files, page: this.$store.getters.page });
        } catch (error) {
          this.$emit('error', error);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
  border: none;
}

button {
  cursor: pointer;
  width: 7rem;
  margin-left: 1rem;
}

.attachments {
  .card {
    .title {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
    }

    .card-img-bottom {
      width: 100%;
      height: 10rem;
      object-fit: cover;
      cursor: pointer;
    }
  }
}
</style>