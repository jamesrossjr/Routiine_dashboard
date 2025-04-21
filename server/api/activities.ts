// server/api/activities.ts
import { getPipedriveToken } from './set-tokens'

export default defineEventHandler(async () => {
  const token = getPipedriveToken()
  if (!token) throw createError({ statusCode: 401, message: 'Token not set' })

  const res = await fetch(`https://api.pipedrive.com/v1/activities?api_token=${token}`)
  const json = await res.json()
  return json.data
})
