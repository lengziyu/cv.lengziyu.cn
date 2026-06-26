import type {
  CustomSection,
  ResumeData,
  ResumeSectionId,
} from '../types/resume'

export const getVisibleSectionOrder = (data: ResumeData): ResumeSectionId[] =>
  data.sectionOrder.filter(
    (id) => !data.hiddenSections.some((hiddenId) => hiddenId === id),
  )

export const getVisibleCustomSections = (data: ResumeData): CustomSection[] =>
  data.customSections.filter((section) => section.enabled)
