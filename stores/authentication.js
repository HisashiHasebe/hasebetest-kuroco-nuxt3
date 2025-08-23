import { defineStore } from 'pinia';

export const useStore = defineStore('authentication', {
  state: () => ({
    profile: null,
  }),
  actions: {
    setProfile(profile) {
      this.profile = profile;
    },
    updateLocalStorage(payload) {
      Object.entries(payload).forEach(([key, val]) => {
        if (val === null || val === false) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });
    },
    async login(payload) {
      const { grant_token } = await $fetch("/rcms-api/1/login", {
          method: "POST",
          baseURL: useRuntimeConfig().public.apiBase,
          credentials: "include",
          body: payload,
      });
      const { access_token } = await $fetch("/rcms-api/1/token", {
          method: "POST",
          baseURL: useRuntimeConfig().public.apiBase,
          credentials: "include",
          body: { grant_token: grant_token },
      });
      this.setProfile(profileRes)
      this.updateLocalStorage({ authenticated: true })
    },
    async logout() {
      try {
        await $fetch("/rcms-api/1/logout", {
          method: "POST",
          baseURL: useRuntimeConfig().public.apiBase,
          credentials: "include",
        });
      } catch {
        /** No Process */
        /** When it returns errors, it consider that logout is complete and ignore this process. */
      }
      this.setProfile(null);
      this.updateLocalStorage({ authenticated: false });

      window.location.href = "/login";
    },
    async restoreLoginState() {
      const authenticated = JSON.parse(localStorage.getItem('authenticated'))

      if (!authenticated) {
        throw new Error("need to login");
      }
      this.setProfile({}) // store dummy object.
    },
  },
  getters: {
    authenticated: (state) => state.profile !== null,
  },
});