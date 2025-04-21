// File: /server/api/pipedrive/tokens.ts
import { defineEventHandler, readBody, getCookie, setCookie } from 'h3'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  if (event.method === 'POST') {
    const body = await readBody(event)
    const token = body.token?.trim()

    if (!token) {
      return { error: 'Missing token' }
    }

    // Store token in cookie (temporary)
    setCookie(event, 'pipedrive_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })

    return { status: 'success' }
  }

  if (event.method === 'GET') {
    const token = getCookie(event, 'pipedrive_token')
    return { token }
  }

  return { error: 'Unsupported method' }
})
