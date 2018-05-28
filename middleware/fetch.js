export default async function ({ store, route, error, redirect }) {
  await store.dispatch('fetchPage', { path: route.path });
  store.commit('updatePath', { path: route.path });

  if (store.getters.page) {
    if (store.getters.page.redirect) {
      redirect(store.getters.page.redirect);
      await store.dispatch('fetchPage', { path: store.getters.page.redirect });
      store.commit('updatePath', { path: route.path });
    }

    await store.dispatch('fetchSubmenu');
  } else {
    error({ statusCode: 404, message: 'Page not found'});
  }
}