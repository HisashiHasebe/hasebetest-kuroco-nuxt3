<template>
  <form @submit.prevent="login">
    <p v-if="loginStatus !== null" :style="{ color: resultMessageColor }">
      {{ resultMessage }}
    </p>
    <input v-model="email" name="email" type="email" placeholder="email" />
    <input
      v-model="password"
      name="password"
      type="password"
      placeholder="password"
    />
    <button type="submit">Login</button>
    <div>
      <nuxt-link to="/news"> news list </nuxt-link>
    </div>
  </form>
</template>

<script setup>
import { useStore } from "~/stores/index";
const store = useStore();
const config = useRuntimeConfig();

const email = ref("");
const password = ref("");

const loginStatus = ref(null);
const resultMessage = ref(null);
let resultMessageColor = computed(() => {
  switch (loginStatus.value) {
    case "success":
      return "green";
    case "failure":
      return "red";
    default:
      return "";
  }
});

async function login() {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    };
    await fetch("/rcms-api/13/login", {
      method: "POST",
      body: JSON.stringify(payload),
      baseURL: config.public.apiBase,
      credentials: "include",
    });
    await store.login(payload);
    loginStatus.value = "success";
    resultMessage.value = "Login successful";
  } catch (e) {
    console.log(e);
    loginStatus.value = "failure";
    resultMessage.value = "Login failed";
  }
}
</script>
