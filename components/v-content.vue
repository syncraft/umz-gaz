<template>
  <component :is="component" />
</template>

<script>
import VAttachment from '~/components/v-attachment';
import VAttachmentGallery from '~/components/v-attachment-gallery';
import VEngineDetail from '~/components/v-engine-detail';
import VFeedback from '~/components/v-feedback';

export default {
  props: {
    content: {
      required: true,
      type: String
    }
  },

  computed: {
    component() {
      return {
        name: 'v-content-component',
        template: `<article>${ this.content }</article>`,
        components: {
          VAttachment,
          VAttachmentGallery,
          VEngineDetail,
          VFeedback
        }
      };
    }
  }
}
</script>