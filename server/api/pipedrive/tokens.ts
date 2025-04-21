// File: /server/api/pipedrive/tokens.ts
import { defineEventHandler, readBody, getCookie, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  if (event.method === 'POST') {
    const body = await readBody(event)
    const token = body.token?.trim()

    if (!token) {
      return { error: 'Missing token' }
    }

    // Store token (cookie-based for now)
    setCookie(event, 'pipedrive_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    return { status: 'success' }
  }

  if (event.method === 'GET') {
    const token = getCookie(event, 'pipedrive_token')
    return { token }
  }
  
  async function saveToken() {
    try {
      const res = await $fetch('/api/pipedrive/tokens', {
        method: 'POST',
        body: { token: state.token }
      })
      console.log('Token save response:', res)
      saved.value = true
    } catch (err) {
      console.error('Token save failed:', err)
    }
  }

  return { error: 'Unsupported method' }
})
