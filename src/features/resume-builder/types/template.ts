import type { ComponentType } from 'react'
import type { ResumeData } from './resume'

export interface ResumeTemplateProps {
  data: ResumeData
  density?: number
}

export interface ResumeTemplateDefinition {
  id: string
  name: string
  component: ComponentType<ResumeTemplateProps>
}
