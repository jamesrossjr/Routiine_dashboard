interface LearningItem {
    id: string
    skill: string
    signalId?: string
    points: number
    status: 'positive' | 'neutral' | 'negative'
    createdAt: Date
  }