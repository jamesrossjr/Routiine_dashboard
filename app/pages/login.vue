<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const login = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    await navigateTo('/')
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-16 space-y-4">
    <h1 class="text-xl font-semibold">Login to Routiine</h1>
    <UInput v-model="email" placeholder="Email" />
    <UInput v-model="password" type="password" placeholder="Password" />
    <UButton label="Login" block @click="login" />
    <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
  </div>
</template>
