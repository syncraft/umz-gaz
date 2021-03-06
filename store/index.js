import Vuex from 'vuex';

export default function() {
  return new Vuex.Store({
    actions: {
      async nuxtServerInit({ dispatch }) {
        await dispatch('fetchMenu');
      },

      async nuxtClientInit({ commit }) {
        this.$socket.on('createPages', ({ data, error }) => {
          if (!error) {
            commit('updatePages', { pages: data });
          }
        });
    
        this.$socket.on('deletePages', ({ data, error }) => {
          if (!error) {
            commit('deletePages', { pages: data });
          }
        });
    
        this.$socket.on('updatePages', ({ data, error }) => {
          if (!error) {
            commit('updatePages', { pages: data });
          }
        });
      },

      fetchMenu({ commit, dispatch }) {
        return new Promise(async (resolve, reject) => {
          try {
            const pages = await dispatch('searchPages', { depth: 1, projection: '-content' });
            commit('updatePages', { pages });
            resolve(pages);
          } catch (error) {
            reject(error);
          }
        });
      },

      fetchSubmenu({ commit, dispatch }, { parent }) {
        return new Promise(async (resolve, reject) => {
          try {
            const pages = await dispatch('searchPages', { parent, projection: '-content' });
            commit('updatePages', { pages });
            resolve(pages);
          } catch (error) {
            reject(error);
          }
        });
      },

      fetchPage({ commit, dispatch }, { path }) {
        return new Promise(async (resolve, reject) => {
          try {
            const pages = await dispatch('searchPages', { path });

            if (pages.length > 0) {
              commit('updatePages', { pages });
              resolve(pages[0]);
            } else {
              resolve();
            }
          } catch (error) {
            reject(error);
          }
        });
      },

      searchPages(_, conditions) {
        return new Promise((resolve, reject) => {
          this.$socket.emit('searchPages', conditions, ({ data, error }) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          });
        });
      },

      createPages({ commit, state }, { pages }) {
        const token = state.token;

        return new Promise((resolve, reject) => {
          this.$socket.emit('createPages', { token, pages }, ({ data, error }) => {
            if (error) {
              reject(error);
            } else {
              commit('updatePages', { pages: data });
              resolve(data);
            }
          });
        });
      },

      deletePages({ commit, state }, { pages }) {
        const token = state.token;

        return new Promise((resolve, reject) => {
          this.$socket.emit('deletePages', { token, pages }, ({ data, error }) => {
            if (error) {
              reject(error);
            } else {
              commit('deletePages', { pages: data });
              resolve(data);
            }
          });
        });
      },

      updatePages({ commit, state }, { pages }) {
        const token = state.token;

        return new Promise((resolve, reject) => {
          this.$socket.emit('updatePages', { token, pages }, ({ data, error }) => {
            if (error) {
              reject(error);
            } else {
              commit('updatePages', { pages: data });
              resolve(data);
            }
          });
        });
      },

      uploadAttachments({ commit, state }, { files, page }) {
        const token = state.token;
        
        const uploadData = (file, offset, length, id) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const blob = file.slice(offset, length);
            reader.readAsArrayBuffer(blob);

            reader.onload = (event) => {
              if (event.target.readyState === FileReader.DONE) {
                this.$socket.emit('uploadAttachmentData', { token, id, data: event.target.result }, ({ error }) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve();
                  }
                });
              }
            };
          });
        }

        return new Promise((resolve, reject) => {
          try {
            for (const file of files) {
              const name = file.name;
              const size = file.size;
              const type = file.type;

              this.$socket.emit('uploadAttachment', { token, name, size, type, page: page.id }, async ({ id, error }) => {
                if (error) {
                  reject(error);
                } else {
                  const CHUNK_SIZE = 1024 * 128;

                  for (let offset = 0; offset < size; offset += CHUNK_SIZE) {
                    let end = offset + CHUNK_SIZE;

                    if (end > size) {
                      end = size;
                    }

                    await uploadData(file, offset, end, id);
                  }

                  this.$socket.emit('uploadAttachmentDone', { token, id }, ({ data, error }) => {
                    if (error) {
                      reject(error);
                    } else {
                      commit('updatePages', { pages: data });
                      resolve(data);
                    }
                  });
                }
              });
            }
          } catch (error) {
            reject(error);
          }
        });
      },

      deleteAttachments({ commit, state }, { attachments }) {
        const token = state.token;

        return new Promise((resolve, reject) => {
          this.$socket.emit('deleteAttachments', { token, attachments }, ({ data, error }) => {
            if (error) {
              reject(error);
            } else {
              commit('updatePages', { pages: data });
              resolve(data);
            }
          });
        });        
      },

      sendEmail(_, { form }) {
        return new Promise((resolve, reject) => {
          this.$socket.emit('sendEmail', { form }, ({ error }) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      },

      login({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
          this.$socket.emit('login', { username, password }, ({ token, error }) => {
            if (error) {
              reject(error);
            } else {
              commit('setToken', { token });
              commit('enableManager');
              resolve(token);
            }
          });
        });
      },

      logout({ commit, state }) {
        const token = state.token;

        return new Promise((resolve, reject) => {
          this.$socket.emit('logout', { token }, ({ error }) => {
            commit('setToken', { token: '' });
            commit('disableManager');

            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }
    },

    getters: {
      page(state) {
        return state.pages.find(page => page.path === state.route.path);
      },

      children(state) {
        return state.pages
          .filter(page => RegExp(`${state.route.path}/.+`).test(page.path))
          .sort((a, b) => a.order - b.order);
      },

      menu(state) {
        return state.pages
          .filter(page => !page.parent && page.path !== '/')
          .sort((a, b) => a.order - b.order);
      },

      submenu(state, getters) {
        if (getters.page && getters.page.breadcrumbs.length > 0) {
          return state.pages
            .filter(page => page.parent === getters.page.breadcrumbs[0])
            .sort((a, b) => a.order - b.order);
        } else {
          return [];
        }
      },

      breadcrumbs(state, getters) {
        if (getters.page && getters.page.breadcrumbs) {
          return getters.page.breadcrumbs.map(breadcrumb => {
            return state.pages.find(page => page.id === breadcrumb)
          });
        } else {
          return [];
        }
      }
    },

    mutations: {
      updatePages(state, { pages }) {
        pages.forEach((page) => {
          const index = state.pages.findIndex(value => value.id === page.id);

          if (index >= 0) {
            state.pages.splice(index, 1, { ...state.pages[index], ...page })
          } else {
            state.pages.splice(-1, 0, page);
          }
        });
      },

      deletePages: (state, { pages }) => {
        const deletePage = (page) => {
          const index = state.pages.findIndex(value => value.id === page.id);
          state.pages.splice(index, 1);
          state.pages.forEach(value => value.parent === page.id && deletePage(value));
        }

        for (let page of pages) {
          deletePage(page);
        }
      },

      setToken: (state, { token }) => {
        state.token = token;
      },

      enableManager: (state) => {
        state.manager = true;
      },

      disableManager: (state) => {
        state.manager = false;
      }
    },

    state: {
      manager: false,
      token: {},
      pages: [],
      url: process.env.URL
    }
  });
}