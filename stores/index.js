import { authFetch } from "@/composables/fetch";
import { defineStore } from "pinia";
const config = useRuntimeConfig();

export const useStore = defineStore("authentication", {
  state: () => ({
    profile: null,
    access_token: "",
  }),
  actions: {
    updateLocalStorage(payload) {
      Object.entries(payload).forEach(([key, val]) => {
        localStorage.setItem(key, val);
      });
    },
    async login(payload) {
      const { grant_token } = await $fetch("/rcms-api/13/login", {
        method: "POST",
        baseURL: config.public.apiBase,
        credentials: "include",
        body: payload,
      });
      const { access_token } = await $fetch("/rcms-api/13/token", {
        method: "POST",
        baseURL: config.public.apiBase,
        credentials: "include",
        body: { grant_token: grant_token },
      });
      this.updateLocalStorage({ rcmsApiAccessToken: access_token.value });
      this.access_token = access_token.value;
      const profileRes = await authFetch("/rcms-api/13/profile", {
        baseURL: config.public.apiBase,
      });

      this.setProfile(profileRes);
    },
    setProfile(profile) {
      this.profile = profile;
    },

    async logout() {
      try {
        await authFetch("/rcms-api/13/logout", {
          method: "POST",
          baseURL: config.public.apiBase,
          credentials: "include",
        });
      } catch {
        /** No Process */
        /** When it returns errors, it consider that logout is complete and ignore this process. */
      }
      this.setProfile(null);
      this.updateLocalStorage({ authenticated: false });

      navigateTo("/login/test_login4");
    },

    async restoreLoginState() {
      const rcmsApiAccessToken = localStorage.getItem("rcmsApiAccessToken");
      const authenticated =
        typeof rcmsApiAccessToken === "string" && rcmsApiAccessToken.length > 0;
      if (!authenticated) {
        await this.logout();
        throw new Error("need to login");
      }
      try {
        this.access_token = rcmsApiAccessToken;
        const profileRes = await authFetch("/rcms-api/13/profile", {
          baseURL: config.public.apiBase,
        });
        this.setProfile(profileRes);
      } catch {
        await this.logout();
        throw new Error("need to login");
      }
    },
  },
  getters: {
    authenticated: (state) => state.profile !== null,
    token: (state) => state.access_token,
  },
});
