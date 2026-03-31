import { AtsClassicTemplate } from './AtsClassicTemplate'
import { CleanColumnsTemplate } from './CleanColumnsTemplate'
import { ModernSlateTemplate } from './ModernSlateTemplate'
import { NotionLinearTemplate } from './NotionLinearTemplate'
import type { ResumeTemplateDefinition } from '../types/template'

export const templateRegistry: ResumeTemplateDefinition[] = [
  {
    id: 'notion-linear',
    name: 'Notion / Linear',
    component: NotionLinearTemplate,
  },
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    component: AtsClassicTemplate,
  },
  {
    id: 'modern-slate',
    name: 'Modern Slate',
    component: ModernSlateTemplate,
  },
  {
    id: 'clean-columns',
    name: 'Clean Columns',
    component: CleanColumnsTemplate,
  },
]

export const defaultTemplateId = templateRegistry[0].id
