<template>
  <div>
    <header>
      <v-menu
        :manager="$store.state.manager"
        :pages="$store.getters.menu"
        @contextmenu="contextMenuPage($event)"
      />

      <transition
        name="slide"
        mode="out-in"
      >
        <div v-if="$store.getters.page && $store.getters.page.path !== '/'">
          <v-breadcrumbs
            :home="$store.state.pages.find(page => page.path === '/')"
            :pages="$store.getters.breadcrumbs"
          />

          <v-submenu
            class="mb-5"
            :pages="$store.getters.submenu"
            :root="$store.state.pages.find(page => page.id === $store.getters.page.breadcrumbs[0])"
            @contextmenu="contextMenuPage($event)"
          />
        </div>
      </transition>

      <div
        v-if="$store.getters.page && $store.getters.page.breadcrumbs.length > 2"
        class="container"
      >
        <h4 class="m-0 mb-5 umz-font-bold umz-font-wide">{{ $store.getters.page.title || '' }}</h4>
      </div>
    </header>

    <main style="margin-bottom: 250px;">
      <transition name="fade">
        <nuxt
          class="nuxt"
          :manager="$store.state.manager"
          @contextmenu="contextMenuPageContent($event)"
          @contextmenupage="contextMenuPage($event)"
        />
      </transition>
    </main>
    
    <v-footer
      :manager="$store.state.manager"
      :pages="$store.getters.menu"
      @login="login()"
      @logout="logout()"
    />
    
    <no-ssr>
      <v-scroll-top/>
    </no-ssr>

    <v-context-menu ref="contextMenu" />
    <v-modal-create-page ref="modalCreatePage" />
    <v-modal-delete-page ref="modalDeletePage" />
    <v-modal-update-page ref="modalUpdatePage" />
    <v-modal-update-page-content
      ref="modalUpdatePageContent"
      @contextmenu="contextMenuAttachment($event)"
    />
    <v-modal-delete-attachment ref="modalDeleteAttachment" />
    <v-modal-login ref="modalLogin" />
    <v-modal-logout ref="modalLogout" />
  </div>
</template>

<script>
import VContextMenu from '~/components/v-context-menu';
import VMenu from '~/components/v-menu';
import VBreadcrumbs from '~/components/v-breadcrumbs';
import VSubmenu from '~/components/v-submenu';
import VFooter from '~/components/v-footer';
import VModalCreatePage from '~/components/v-modal-create-page';
import VModalDeletePage from '~/components/v-modal-delete-page';
import VModalUpdatePage from '~/components/v-modal-update-page';
import VModalUpdatePageContent from '~/components/v-modal-update-page-content';
import VModalDeleteAttachment from '~/components/v-modal-delete-attachment';
import VModalLogin from '~/components/v-modal-login';
import VModalLogout from '~/components/v-modal-logout';
import VScrollTop from '~/components/v-scroll-top';

export default {
  components: {
    VContextMenu,
    VMenu,
    VBreadcrumbs,
    VSubmenu,
    VFooter,
    VModalCreatePage,
    VModalDeletePage,
    VModalUpdatePage,
    VModalUpdatePageContent,
    VModalDeleteAttachment,
    VModalLogin,
    VModalLogout,
    VScrollTop
  },

  head() {
    return {
      title: this.$store.getters.page ? this.$store.getters.page.title : ''
    }
  },

  methods: {
    login() {
      this.$refs.modalLogin.open();
    },

    logout() {
      this.$refs.modalLogout.open();
    },

    contextMenuPage({ event, id, parent }) {
      if (this.$store.state.manager) {
        event.preventDefault();

        this.$refs.contextMenu.open({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          menu: [
            {
              title: 'Добавить страницу',
              click: () => this.$refs.modalCreatePage.open({ parent })
            },
            ...id ? [
              {
                title: 'Изменить страницу',
                click: () => this.$refs.modalUpdatePage.open({ id })
              },
              {
                title: 'Удалить страницу',
                click: () => this.$refs.modalDeletePage.open({ id })
              }
            ] : []
          ]
        });
      }
    },

    contextMenuPageContent({ event }) {
      if (this.$store.state.manager) {
        event.preventDefault();
        
        this.$refs.contextMenu.open({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          menu: [
            {
              title: 'Изменить содержимое',
              click: () => this.$refs.modalUpdatePageContent.open()
            }
          ]
        });
      }
    },

    contextMenuAttachment({ event, attachment }) {
      if (this.$store.state.manager) {
        event.preventDefault();
        
        this.$refs.contextMenu.open({
          position: {
            x: event.clientX,
            y: event.clientY,
          },
          menu: [
            {
              click: () => window.open(attachment.url),
              title: 'Скачать вложение'
            },
            {
              click: () => this.$refs.modalDeleteAttachment.open({ attachment }),
              title: 'Удалить вложение'
            },
            {
              click: () => this.$store.dispatch('updatePages', { pages: [ { ...this.$store.getters.page, image: attachment.id } ] }),
              title: 'Использовать как изображение страницы'
            }
          ]
        });
      }
    }
  },

  watch: {
    '$store.getters.page': function(value) {
      if (!value) {
        this.$router.replace('/');
      }
    }
  }
}
</script>

<style lang="scss">
.nuxt {
  ul {
    padding-left: 20px;

    li {
      margin-bottom: 7px;
    }

    li:last-child {
      margin-bottom: 0px;
    }
  }

  table {
    thead {
      th {
        text-align: left;
        background-color: #005693;
        color: #fff;
        font-weight: normal;
      }
    }
  }
}
</style>