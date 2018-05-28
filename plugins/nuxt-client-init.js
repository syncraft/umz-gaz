export default async (context) => {
  if (context.store._actions && context.store._actions.nuxtClientInit) {
    try {
      await context.store.dispatch('nuxtClientInit', context);
    } catch (error) {
      throw error;
    }
  }
}