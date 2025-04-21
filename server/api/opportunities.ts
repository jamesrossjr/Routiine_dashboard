import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'pipedrive_token')
  if (!token) return []

  const url = `https://api.pipedrive.com/v1/deals?api_token=${token}`
  const response = await fetch(url)
  const json = await response.json()

  return json.data?.map((deal: any) => ({
    id: deal.id,
    account: deal.org_name || 'No Account',
    title: deal.title,
    description: deal.person_name || '',
    stage: deal.stage_id ? mapStage(deal.stage_id) : 'Unknown',
    value: deal.value || 0,
    status: deal.status,
  })) || []
})

function mapStage(id: number): string {
  return {
    1: 'Qualification',
    2: 'Proposal',
    3: 'Negotiation',
    4: 'Closed - Won',
    5: 'Closed - Lost'
  }[id] || 'Unknown'
}
