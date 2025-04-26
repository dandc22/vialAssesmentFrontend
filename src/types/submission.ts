export interface SourceDataItem {
  id: string
  question: string
  answer: string
  sourceRecordId: string
}

export interface FormSubmission {
  id: string
  formId: string
  sourceData: SourceDataItem[]
}