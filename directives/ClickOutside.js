export default {
  bind: (element, binding) => {
    const callback = binding.value;

    function handler(event) {
      if (event.target !== element && !element.contains(event.target)) {
        callback && callback(event);
      }
    }

    document.addEventListener('click', handler);
    document.addEventListener('touchstart', handler);
    element.__clickOutsideHandler__ = handler;
  },
  unbind: (element) => {
    document.removeEventListener('click', element.__clickOutsideHandler__);
    document.removeEventListener('touchstart', element.__clickOutsideHandler__);
  }
};