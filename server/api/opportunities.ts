import { defineEventHandler, getCookie } from 'h3'
import type { Opportunity } from '~/types'

// Don't use arrow functions for the main handler to avoid serialization issues
export default defineEventHandler(async function opportunitiesHandler(event) {
  console.log('[API] Opportunities endpoint called')
  const token = getCookie(event, 'pipedrive_token')

  if (!token) {
    console.warn('[Pipedrive] No API token found in cookies.')
    return []
  }

  console.log('[Pipedrive] Using Token:', token)

  try {
    // Fetch deals from Pipedrive API
    const url = `https://api.pipedrive.com/v1/deals?api_token=${token}`
    const response = await fetch(url)

    if (!response.ok) {
      console.error('[Pipedrive] API request failed:', response.status, response.statusText)
      return []
    }

    const json = await response.json()

    console.log('[Pipedrive] Raw JSON:', JSON.stringify(json, null, 2))

    if (!json.data || !Array.isArray(json.data)) {
      console.warn('[Pipedrive] No data returned or invalid format:', json)
      return []
    }

    // Transform Pipedrive deals into our Opportunity format
    const opportunities = json.data
      .filter((deal: any) => deal?.id && deal?.title)
      .map((deal: any) => {
        return {
          id: String(deal.id),
          account: deal.org_name || 'No Account',
          title: deal.title,
          description: deal.person_name || '',
          stage: mapStage(deal.stage_id),
          value: Number(deal.value || 0),
          status: mapStatus(deal.status || 'open'),
        }
      })
    
    console.log('[API] Transformed opportunities:', opportunities)
    
    return opportunities
  } catch (error) {
    console.error('[Pipedrive] Unexpected error:', error)
    return []
  }
})

function mapStage(id: number): "qualification" | "proposal" | "negotiation" | "won" | "lost" {
  const stageMap: Record<number, "qualification" | "proposal" | "negotiation" | "won" | "lost"> = {
    1: 'qualification',
    2: 'proposal',
    3: 'negotiation',
    4: 'won',
    5: 'lost'
  }
  return stageMap[id] || 'qualification'
}

function mapStatus(status: string): string {
  if (status === 'won') return 'won'
  if (status === 'lost') return 'lost'
  return 'open'
}