export default function(context, inject) {
  inject('prefetch', async function() {
    let page = await this.store.dispatch('fetchPage', { path: this.context.route.path });
  
    if (page) {
      if (page.redirect) {
        this.context.redirect(page.redirect);
        page = await this.store.dispatch('fetchPage', { path: page.redirect });
      }

      await this.store.dispatch('fetchSubmenu', { parent: page.breadcrumbs[0] });
    } else {
      this.context.error({ statusCode: 404, message: 'Page not found'});
    }
  });
}