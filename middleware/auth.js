import { useStore } from '~/stores/authentication';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useStore();
  
  // Define public paths that don't require authentication (add any login pages that don't require authentication)
  const publicPaths = ['/login'];
  
  // Allow access if the current path is public
  if (publicPaths.some(path => to.path.startsWith(path))) {
    return;
  }
  
  const now = Date.now();
  const lastRedirectTime = parseInt(sessionStorage.getItem('lastRedirectTime') || '0');
  const isRedirectLoop = now - lastRedirectTime < 2000; // Less than 2 seconds between redirects
  
  if (!store.authenticated) {
    try {
      if (isRedirectLoop) {
        window.location.href = '/login';
        return;
      }
      
      await store.restoreLoginState();
    } catch (err) {
      sessionStorage.setItem('lastRedirectTime', now.toString());
      
      window.location.href = '/login';
      return;
    }
  }
});

export const authFetch = (url, config) => {
  const store = useStore();

  return $fetch(url, {
    ...config,
    headers: {
      ...(config.headers || {}), // Preserve existing headers
      'X-RCMS-API-ACCESS-TOKEN': store.token, // Add the token
    },
  });
};
