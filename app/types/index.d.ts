export type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly'

export interface Range {
  start: Date
  end: Date
}

// Avatar interface for better typing
export interface Avatar {
  src?: string
  alt?: string
  icon?: string
  color?: string
  [key: string]: any // Support for additional avatar properties
}

// Member interface for team components
export interface Member {
  id: string
  name: string
  email: string
  username: string
  avatar?: string | Avatar // Can be either a string URL or an Avatar object
  role?: string
  department?: string
  status?: 'active' | 'inactive' | 'pending'
  joinDate?: Date | string
  permissions?: string[]
  teams?: string[]
  projects?: string[]
  skills?: string[]
  phone?: string
  location?: string
  timeZone?: string
  lastActive?: Date | string
  [key: string]: any // Allow additional properties
}

// Mail interface for inbox components
export interface Mail {
  id: string
  subject: string
  from: {
    name: string
    email: string
    avatar?: string
  }
  to: {
    name: string
    email: string
  }[]
  cc?: {
    name: string
    email: string
  }[]
  bcc?: {
    name: string
    email: string
  }[]
  date: Date
  body: string
  attachments?: {
    name: string
    size: number
    type: string
    url?: string
  }[]
  read: boolean
  unread?: boolean
  starred: boolean
  labels?: string[]
  folder?: string
}

export interface Opportunity {
  id: string
  account: string
  title: string
  description?: string
  stage: 'qualification' | 'proposal' | 'negotiation' | 'won' | 'lost'
  value: number
  status: 'open' | 'won' | 'lost'
  owner?: string
  avatar?: string | Avatar
  createdAt?: Date | string
  updatedAt?: Date | string
  closeDate?: Date | string
  tags?: string[]
  probability?: number
  [key: string]: any
}

export interface Stat {
  title: string
  icon: string
  value: string | number
  variation: number
}

export interface Mail {
  id: string
  subject: string
  from: {
    name: string
    email: string
    avatar?: string
  }
  to: { name: string; email: string }[]
  cc?: { name: string; email: string }[]
  bcc?: { name: string; email: string }[]
  date: Date
  body: string
  attachments?: { name: string; size: number; type: string; url?: string }[]
  read: boolean
  unread?: boolean
  starred: boolean
  labels?: string[]
  folder?: string

  /** 👇 Add this */
  [key: string]: any
}