export default function(context, inject) {
  inject('prefetch', async function() {
    await this.store.dispatch('fetchPage', { path: this.context.route.path });
    this.store.commit('updatePath', { path: this.context.route.path });
  
    if (this.store.getters.page) {
      if (this.store.getters.page.redirect) {
        this.context.redirect(this.store.getters.page.redirect);
        await this.store.dispatch('fetchPage', { path: this.store.getters.page.redirect });
        this.store.commit('updatePath', { path: this.context.route.path });
      }
  
      await this.store.dispatch('fetchSubmenu');
    } else {
      this.context.error({ statusCode: 404, message: 'Page not found'});
    }
  });
}