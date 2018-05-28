<template>
  <div class="v-engine-detail d-flex py-5">
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-4">
          <v-attachment v-if="image" class="image img-fluid mx-auto mx-sm-0 d-block pb-5 pb-sm-0 px-5 px-sm-0" :id="image"></v-attachment>
        </div>

        <div class="col-12 col-sm-8 d-flex flex-column justify-content-around">
          <div class="text-center text-sm-left mb-5 mb-sm-0">
            <div class="info">{{ info }}</div>
            <div class="info">{{ type }}</div>
          </div>

          <div>
            <div class="row">
              <div class="col-4">
                <div class="ecology">{{ ecology }}</div>
                <div class="small">ЭКОЛОГИЯ</div>
              </div>

              <div class="col-4">
                <div class="life d-flex">
                  <div>{{ life }}</div>
                  <div class="unit">ТЫС. КМ</div>
                </div>
                <div class="small">РЕСУРС</div>
              </div>

              <div class="col-4">
                <div class="power d-flex">
                  <div>{{ power }}</div>
                  <div class="unit">Л. С.</div>
                </div>
                <div class="small">МОЩНОСТЬ</div>
              </div>
            </div>
          </div>
        </div>
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

  props: {
    image: { type: String },
    info: { type: String },
    type: { type: String },
    ecology: {type: String },
    life: { type: String },
    power: { type: String }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables";

.v-engine-detail {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background-color: white;
  font-family: "geometriamedium", Arial, FreeSans, sans-serif;

  .image {
    filter: drop-shadow(0px 0px 10px #777);
  }

  .info, .type {
    font-size: 1.0rem;
  }

  .ecology, .life, .power {
    font-size: 1.2rem;
    font-family: "geometriamedium", Arial, FreeSans, sans-serif;
    color: #005693;
    white-space: nowrap;
  }

  .unit {
    font-size: 0.5rem;
    margin-top: 0.3rem;
    padding-left: 0.3rem;
  }
}

@include media-breakpoint-up(sm) {
  .v-engine-detail {
    .ecology, .life, .power {
      font-size: 1.5rem;
    }

    .unit {
      font-size: 0.5rem;
      margin-top: 0.45rem;
    }
  }
}

@include media-breakpoint-up(md) {
  .v-engine-detail {
    .ecology, .life, .power {
      font-size: 2.0rem;
    }

    .unit {
      font-size: 0.6rem;
      margin-top: 0.6rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  .v-engine-detail {
    .ecology, .life, .power {
      font-size: 2.5rem;
    }

    .unit {
      font-size: 0.6rem;
      margin-top: 0.85rem;
    }
  }
}
</style>