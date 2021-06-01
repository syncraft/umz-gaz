<template>
  <div class="v-engine-detail d-flex py-3">
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-4">
          <v-attachment-slider
            v-if="image"
            :images="image"
          />
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
import VAttachmentSlider from '~/components/v-attachment-slider';

export default {
  components: {
    VAttachment,
    VAttachmentSlider
  },

  props: {
    image: { type: String | Array, default: '' },
    info: { type: String, default: '' },
    type: { type: String, default: '' },
    ecology: {type: String, default: '' },
    life: { type: String, default: '' },
    power: { type: String, default: '' }
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

  .info, .type {
    font-size: 1.3rem;
  }

  .ecology, .life, .power {
    font-size: 1.2rem;
    font-family: "geometriamedium", Arial, FreeSans, sans-serif;
    color: #005693;
    white-space: nowrap;
  }

  .unit {
    font-size: 0.6rem;
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
      font-size: 0.7rem;
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
      font-size: 0.7rem;
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
      font-size: 0.8rem;
      margin-top: 0.85rem;
    }
  }
}
</style>