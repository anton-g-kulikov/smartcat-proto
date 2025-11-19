export type SmartwordsOperation = {
  id: string
  timestamp: string
  type: 'translation' | 'allocation' | 'reclaim' | 'transfer'
  projectName?: string
  projectId?: string
  amount: number // Positive for spending, negative for allocation/transfer in
  description: string
  sourceLanguage?: string
  targetLanguages?: string[]
  fileType?: string
  wordCount?: number
}





