import { useStore } from "~/stores/index";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore();
  console.log(store.authenticated);
  if (!store.authenticated) {
    try {
      console.log("restoreLoginState");
      await store.restoreLoginState();
    } catch (err) {
      return navigateTo("/login/test_login4");
    }
  }
});
