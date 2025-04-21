// server/api/deals.ts
import { getPipedriveToken } from './set-tokens'

export default defineEventHandler(async () => {
  const token = getPipedriveToken()
  if (!token) throw createError({ statusCode: 401, message: 'Pipedrive token not set' })

  const res = await fetch(`https://api.pipedrive.com/v1/deals?api_token=${token}`)
  const data = await res.json()
  return data.data
})
