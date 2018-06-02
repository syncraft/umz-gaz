<template>
  <div class="row">
    <div
      class="col-6 col-sm-4 col-lg-3 d-flex"
      v-for="attachment in attachments"
      :key="attachment.id"
    >      
      <div class="card w-100">
        <a :href="attachment.url">
          <v-attachment
            class="card-img-top"
            :id="attachment.id"
            :link="false"
            :thumbnail="{ width: 300, height: 300 }"
          />
          <div
            class="card-body text-center"
            v-if="attachment.name"
          >
            {{ attachment.name.split('.').slice(0, -1).join('.') }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import VAttachment from '~/components/v-attachment';

export default {
  components: {
    VAttachment
  },

  computed: {
    attachments() {
      return this.$store.getters.page.attachments
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.card {
  display: block;
  margin-bottom: 2rem;
  transition: border 0.2s linear;

  a {
    display: block;
    color: inherit;
    overflow: hidden;
  }

  .card-body {
    font-size: 0.9rem;
  }

  .card-img-top {
    width: 100%;
    height: 10rem;
    object-fit: cover;
    overflow: hidden;
    object-position: top center;
    transition: transform 0.2s linear;
  }

  &:hover {
    background-color: theme-color("light");

    .card-img-top {
      transform: scale(1.03);
    }
  }
}

@include media-breakpoint-up(lg) {
  .card {
    .card-img-top {
      height: 15rem;
    }
  }
}
</style>