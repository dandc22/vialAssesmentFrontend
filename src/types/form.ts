export enum FormInputType {
  TEXT = 'TEXT',
  PASSWORD = 'PASSWORD',
  NUMBER = 'NUMBER',
  DATETIME = 'DATETIME'
}

export interface ApiFormField {
  type: string
  question: string
  required: boolean
}

export interface ApiFormConfig {
  id: string
  name: string
  fields: Record<string, ApiFormField>
}

export interface ApiFormResponse {
  statusCode: number
  data: ApiFormConfig
  message: string
}

export interface FormField {
  id: string
  type: FormInputType
  label: string
  required: boolean
}

export interface FormConfig {
  id: string
  name: string
  fields: FormField[]
}