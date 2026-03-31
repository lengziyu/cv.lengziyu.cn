export type ResumeSectionId = 'experience' | 'project' | 'education' | 'skills'

export type ResumeStepId = 'basic' | ResumeSectionId

export type ResumeSectionTitles = Record<ResumeSectionId, string>

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

export interface ResumeData {
  templateId: string
  basic: BasicInfo
  sectionOrder: ResumeSectionId[]
  sectionTitles: ResumeSectionTitles
  experiences: ExperienceItem[]
  projects: ProjectItem[]
  education: EducationItem[]
  skills: string[]
}

export interface StepItem {
  id: ResumeStepId
  title: string
  description: string
}
