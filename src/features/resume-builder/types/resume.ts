export type ResumeSectionId = 'experience' | 'project' | 'education' | 'skills'

export type ResumeStepId = 'basic' | ResumeSectionId | 'custom'

export type ResumeSectionTitles = Record<ResumeSectionId, string>

export type HideableResumeSectionId = 'education' | 'skills'

export interface BasicInfo {
  fullName: string
  role: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  avatar: string
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface EducationItem {
  id: string
  school: string
  degree: string
  startDate: string
  endDate: string
  description: string
}

export interface ProjectItem {
  id: string
  name: string
  role: string
  techStack: string
  startDate: string
  endDate: string
  link: string
  description: string
}

export interface CustomSection {
  id: string
  enabled: boolean
  title: string
  content: string
}

export interface ResumeData {
  templateId: string
  basic: BasicInfo
  sectionOrder: ResumeSectionId[]
  hiddenSections: HideableResumeSectionId[]
  sectionTitles: ResumeSectionTitles
  experiences: ExperienceItem[]
  projects: ProjectItem[]
  education: EducationItem[]
  skills: string[]
  customSections: CustomSection[]
}

export interface ResumeVersion {
  id: string
  name: string
  updatedAt: string
  data: ResumeData
}

export interface ResumeWorkspace {
  activeVersionId: string
  versions: ResumeVersion[]
}

export interface StepItem {
  id: ResumeStepId
  title: string
  description: string
}
