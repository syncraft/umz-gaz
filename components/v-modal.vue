<template>
  <div class="modal">
    <div
      class="modal-dialog"
      :class="{ 'modal-lg': size === 'large', 'modal-sm': size === 'small' }"
    >
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header"/>
          <button
            class="close"
            @click="$emit('close')"
          >
            <span class="fas fa-times fa-xs"/>
          </button>
        </div>

        <div class="modal-body">
          <slot/>
        </div>
        
        <div class="modal-footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from '~/directives/ClickOutside';

export default {
  directives: {
    ClickOutside
  },

  props: {
    size: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);

  .modal-dialog {
    .modal-header {
      .close {
        user-select: none;
        outline-style: none;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .modal-footer {
      justify-content: flex-start;
    }
  }
}
</style>