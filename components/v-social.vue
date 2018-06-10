<template>
  <div class="v-social">
    <ul class="list-inline list-unstyled p-0 m-0">
      <li class="list-inline-item">
        <a
          class="fab fa-fw fa-vk text-white bg-primary"
          :href="vk"
        />
      </li>

      <li class="list-inline-item">
        <a
          class="fab fa-fw fa-facebook-f text-white bg-primary"
          :href="fb"
        />
      </li>

      <li class="list-inline-item">
        <a
          class="fab fa-fw fa-odnoklassniki text-white bg-primary"
          :href="ok"
        />
      </li>

      <li class="list-inline-item">
        <a
          class="fab fa-fw fa-twitter text-white bg-primary"
          :href="twitter"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    url: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, default: '' }
  },

  computed: {
    vk() {
      return `https://vk.com/share.php?url=${this.url}&title=${this.title}${this.image ? `&image=${this.image}` : ''}`;
    },

    fb() {
      return `https://www.facebook.com/sharer.php?&u=${this.url}&title=${this.title}${this.image ? `&picture=${this.image}` : ''}`;
    },

    ok() {
      return `https://connect.ok.ru/offer?url=${this.url}&title=${this.title}${this.image ? `&imageUrl=${this.image}` : ''}`;
    },

    twitter() {
      return `https://twitter.com/intent/tweet?text=${this.title}&url=${this.url}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.v-social {
  display: inline-block;

  .fab {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.8rem;
    width: 1.5rem;
    height: 1.5rem;
    text-decoration: none;
    border-radius: 50%;
  }

  li {
    margin: 0 0.1rem;
    padding: 0;
  }
}
</style>