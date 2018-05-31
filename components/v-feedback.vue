<template>
  <div class="v-feedback text-white bg-primary py-6">
    <div class="wrapper">
      <div class="container">
        <h2 class="umz-font-bold mb-4">НАПИШИТЕ НАМ</h2>

        <form @submit.prevent="submit">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <input
                  type="text"
                  placeholder="ФИО*"
                  v-model="form.name"
                >
              </div>

              <div class="form-group">
                <input
                  type="text"
                  placeholder="Компания"
                  v-model="form.company"
                >
              </div>

              <div class="form-group">
                <input
                  type="tel"
                  placeholder="Телефон*"
                  autocomplete="tel"
                  v-model="form.phone"
                  v-mask="'+7 (###) ###-##-##'"
                >
              </div>

              <div class="form-group">
                <input
                  type="email"
                  placeholder="E-mail*"
                  autocomplete="email"
                  v-model="form.email"
                >
              </div>
            </div>

            <div class="col-12 col-md-6 d-flex flex-column justify-content-between">
              <div class="form-group d-flex flex-column h-50">
                <textarea
                  placeholder="Сообщение*"
                  style="flex-grow: 1;"
                  rows="5"
                  v-model="form.message"
                />
              </div>
        
              <div>
                <div class="form-check">
                  <label class="form-check-label">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      v-model="form.check"
                    >
                    Я соглашаюсь с <nuxt-link to="/">политикой в отношении обработки данных</nuxt-link>
                  </label>
                </div>

                <div class="form-group">
                  <input
                    class="umz-font-bold"
                    type="submit"
                    value="ОТПРАВИТЬ"
                    :disabled="!validate"
                  >
                </div>
              </div>
            </div>
          </div>
        </form>

        <transition name="fade">
          <div
            v-if="complete"
            class="complete mt-6 umz-font-bold text-center h3"
          >
            Спасибо! Ваше обращение будет рассмотрено.
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask';

export default {
  directives: {
    mask
  },

  data: () => ({
    form: {},
    complete: false
  }),

  computed: {
    validate() {
      return (
        this.form.name &&
        this.form.phone &&
        this.form.email &&
        this.form.message &&
        this.form.check
      );
    }
  },

  mounted() {
    this.reset();
  },

  methods: {
    reset() {
      this.form = {
        name: '',
        company: '',
        phone: '',
        email: '',
        message: '',
        check: false
      };
    },
    
    async submit() {
      this.$emit('submit', { form: this.form });
      this.reset();
      this.showComplete();
      setTimeout(this.hideComplete, 5000);
    },

    showComplete() {
      this.complete = true;
    },

    hideComplete() {
      this.complete = false;
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/variables";

.v-feedback {
  transition: all linear 0.1s;

  .form-group {
    margin-bottom: 0rem;
    padding-top: 2rem;

    input[type=text], input[type=tel], input[type=email], textarea {
      background-color: transparent;
      border: none;
      border-bottom: 2px solid rgba(255,255,255,0.5);
      width: 100%;
      font-size: 1rem;
      line-height: 2rem;
      color: white;
      padding: 1rem 1.5rem;
      outline: none;
  
      &::placeholder {
        color: rgba(255,255,255,0.5);
      }
  
      &::-webkit-input-placeholder {
        color: rgba(255,255,255,0.5);
      }
  
      &::-moz-placeholder {
        color: rgba(255,255,255,0.5);
      }
  
      &:-ms-input-placeholder {
        color: rgba(255,255,255,0.5);
      }
    }

    input[type=submit] {
      background-color: transparent;
      border: 0;
      outline: none;
      font-size: 1rem;
      color: white;
      width: 100%;
      letter-spacing: 0.1rem;
      font-size: 0.8rem;
      border-radius: 22px;
      border: 2px solid #fff;
      padding: 0.5rem 1.2rem;
      transition: all linear 0.1s;

      &:hover {
        background-color: #fff;
        color: #1a212d;
        cursor: pointer;
      }

      &:disabled {
        opacity: 0.1;

        &:hover {
          background-color: inherit;
          cursor: inherit;
          color: inherit;
        }
      }
    }

    textarea {
      resize: none;
      line-height: 1.3rem;
    }
  }

  .form-check {
    margin-bottom: 1rem;
    padding-top: 5rem;

    a {
      color: white;
      text-decoration: underline;
    }

    input[type=checkbox], label {
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>