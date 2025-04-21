import { getPipedriveToken } from './set-tokens'

export default defineEventHandler(async () => {
  const token = getPipedriveToken()
  if (!token) throw createError({ statusCode: 401, message: 'Pipedrive token not set' })

  const res = await fetch(`https://api.pipedrive.com/v1/notes?api_token=${token}`)
  const json = await res.json()
  return json.data // This will be an array of notes with `content` fields
})
