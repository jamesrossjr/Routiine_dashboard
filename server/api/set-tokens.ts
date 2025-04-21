let pipedriveToken = ''

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  pipedriveToken = body.token
  return { status: 'ok' }
})

export function getPipedriveToken() {
  return pipedriveToken
}
