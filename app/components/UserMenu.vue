<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useColorMode } from '@vueuse/core'

const appConfig = useAppConfig()
const supabase = useSupabaseClient()
const user = useSupabaseUser() // this is a ref<User | null>

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const colorMode = useColorMode() as unknown as {
  preference: 'light' | 'dark' | 'system';
  value: 'light' | 'dark';
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/login')
}


const items = computed<DropdownMenuItem[][]>(() => ([
  [{
    type: 'label',
    label: user.value?.email || 'Unknown User',
    avatar: {
      src: `https://ui-avatars.com/api/?name=${user.value?.email}&background=random`,
      alt: user.value?.email || 'User'
    }
  }],
  [{
    label: 'Profile',
    icon: 'i-lucide-user'
  }, {
    label: 'Billing',
    icon: 'i-lucide-credit-card'
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings'
  }],
  [{
    label: 'Appearance',
    icon: 'i-lucide-sun-moon',
    children: [
      {
        label: 'Light',
        icon: 'i-lucide-sun',
        type: 'checkbox',
        checked: colorMode.value === 'light',
        onSelect(e: Event) {
          e.preventDefault()
          colorMode.preference = 'light'
        }
      },
      {
        label: 'Dark',
        icon: 'i-lucide-moon',
        type: 'checkbox',
        checked: colorMode.value === 'dark',
        onSelect(e: Event) {
          e.preventDefault()
          colorMode.preference = 'dark'
        }
      }
    ]
  }],
  [{
    label: 'Log out',
    icon: 'i-lucide-log-out',
    click: handleLogout
  }]
]))
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', collisionPadding: 12 }"
  >
    <UButton
      ::label="user?.email || 'User'"
      :trailing-icon="'i-lucide-chevron-down'"
      color="neutral"
      variant="ghost"
      class="rounded-full"
    />
  </UDropdownMenu>
</template>