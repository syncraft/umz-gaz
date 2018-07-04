<template>
  <footer class="text-white small">
    <div class="container py-5">
      <div class="row">
        <div class="col-2 col-md-1 align-self-center">
          <nuxt-link
            to="/"
            class="d-flex justify-content-start"
          >
            <img
              class="d-block"
              height="20"
              src="@/assets/images/logo.png"
              alt="logo"
            >
          </nuxt-link>
        </div>

        <div class="col-4 d-none d-md-block align-self-center">
          Производство бензиновых, газобензиновых автомобильных двигателей и запасных частей к ним
        </div>

        <div class="col">
          <div class="row no-gutters h-100">
            <div
              v-for="page in pages"
              :key="page.id"
              class="col-6 col-lg-4 my-1"
            >
              <nuxt-link
                class="item"
                :to="page.path"
              >
                {{ page.title }}
              </nuxt-link>
            </div>
          </div>
        </div>

        <div class="col-0 col-md-1 d-none d-md-block align-self-center text-right">
          <a
            class="fab fa-github text-white"
            href="https://github.com/syncraft/umz-gaz.ru"
          />
        </div>
      </div>

      <hr class="my-4 my-md-5">

      <div class="row">
        <div class="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-start">
          <a
            v-if="manager"
            class="login text-muted text-center mb-3 mb-md-0"
            @click="$emit('logout')"
          >
            Выйти из режима администрирования
          </a>

          <a
            v-else
            class="login text-muted text-center mb-3 mb-md-0"
            @click="$emit('login')"
          >
            Войти в режим администрирования
          </a>
        </div>

        <div class="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end">
          <div class="text-muted">
            2006 - {{ new Date().getFullYear() }} ©
            <a
              class="text-muted"
              href="https://umz-gaz.ru"
            >
              Ульяновский моторный завод
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    manager: { default: false, type: Boolean },
    pages: { required: true, type: Array }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background-color: theme-color("dark");

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  hr {
    width: 100%;
    border-bottom: 1px solid #414345;
  }

  .item {
    font-family: $umz-font-medium;
    font-size: 0.70rem;
    color: theme-color('white');
    text-transform: uppercase;
    letter-spacing: 0.9px;
  }

  a.login {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .fa-github {
    font-size: 1.8rem;
    text-decoration: none;
  }
}
</style>