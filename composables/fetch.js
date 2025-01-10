import { useStore } from "@/stores/index";

export const authFetch = (url, config) => {
  const store = useStore();

  return $fetch(url, {
    ...config,
    headers: { "X-RCMS-API-ACCESS-TOKEN": store.token },
  });
};
