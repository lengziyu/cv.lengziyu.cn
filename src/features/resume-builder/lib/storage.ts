import {
  DEFAULT_RESUME_DATA,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_TITLES,
  RESUME_STORAGE_KEY,
} from '../constants/resume'
import { createId } from '../../../shared/createId'
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSectionId,
  ResumeSectionTitles,
} from '../types/resume'

const normalizeExperience = (item: Partial<ExperienceItem>): ExperienceItem => ({
  id: item.id || createId(),
  company: item.company || '',
  position: item.position || '',
  startDate: item.startDate || '',
  endDate: item.endDate || '',
  description: item.description || '',
})

const normalizeEducation = (item: Partial<EducationItem>): EducationItem => ({
  id: item.id || createId(),
  school: item.school || '',
  degree: item.degree || '',
  startDate: item.startDate || '',
  endDate: item.endDate || '',
  description: item.description || '',
})

const normalizeProject = (item: Partial<ProjectItem>): ProjectItem => ({
  id: item.id || createId(),
  name: item.name || '',
  role: item.role || '',
  techStack: item.techStack || '',
  startDate: item.startDate || '',
  endDate: item.endDate || '',
  link: item.link || '',
  description: item.description || '',
})

const normalizeSectionOrder = (order?: string[]): ResumeSectionId[] => {
  if (!order?.length) {
    return [...DEFAULT_SECTION_ORDER]
  }

  const valid = order.filter((item): item is ResumeSectionId =>
    DEFAULT_SECTION_ORDER.includes(item as ResumeSectionId),
  )
  const missing = DEFAULT_SECTION_ORDER.filter((item) => !valid.includes(item))
  return [...valid, ...missing]
}

const normalizeSectionTitles = (
  titles?: Partial<ResumeSectionTitles>,
): ResumeSectionTitles => ({
  experience: titles?.experience || DEFAULT_SECTION_TITLES.experience,
  project: titles?.project || DEFAULT_SECTION_TITLES.project,
  education: titles?.education || DEFAULT_SECTION_TITLES.education,
  skills: titles?.skills || DEFAULT_SECTION_TITLES.skills,
})

export const normalizeResumeData = (raw?: Partial<ResumeData>): ResumeData => ({
  templateId: raw?.templateId || DEFAULT_RESUME_DATA.templateId,
  basic: {
    fullName: raw?.basic?.fullName || DEFAULT_RESUME_DATA.basic.fullName,
    role: raw?.basic?.role || DEFAULT_RESUME_DATA.basic.role,
    email: raw?.basic?.email || DEFAULT_RESUME_DATA.basic.email,
    phone: raw?.basic?.phone || DEFAULT_RESUME_DATA.basic.phone,
    location: raw?.basic?.location || DEFAULT_RESUME_DATA.basic.location,
    website: raw?.basic?.website || DEFAULT_RESUME_DATA.basic.website,
    summary: raw?.basic?.summary || DEFAULT_RESUME_DATA.basic.summary,
    avatar: raw?.basic?.avatar || '',
  },
  sectionOrder: normalizeSectionOrder(raw?.sectionOrder),
  sectionTitles: normalizeSectionTitles(raw?.sectionTitles),
  experiences:
    raw?.experiences?.length
      ? raw.experiences.map((item) => normalizeExperience(item))
      : DEFAULT_RESUME_DATA.experiences.map((item) => normalizeExperience(item)),
  projects:
    raw?.projects?.length
      ? raw.projects.map((item) => normalizeProject(item))
      : DEFAULT_RESUME_DATA.projects.map((item) => normalizeProject(item)),
  education:
    raw?.education?.length
      ? raw.education.map((item) => normalizeEducation(item))
      : DEFAULT_RESUME_DATA.education.map((item) => normalizeEducation(item)),
  skills: raw?.skills?.length ? raw.skills.filter(Boolean) : [...DEFAULT_RESUME_DATA.skills],
})

export const parseResumeJson = (jsonText: string): ResumeData => {
  const parsed = JSON.parse(jsonText) as Partial<ResumeData>
  return normalizeResumeData(parsed)
}

export const loadResumeData = (): ResumeData => {
  try {
    const cache = localStorage.getItem(RESUME_STORAGE_KEY)
    if (!cache) {
      return normalizeResumeData()
    }

    return parseResumeJson(cache)
  } catch {
    return normalizeResumeData()
  }
}

export const saveResumeData = (data: ResumeData) => {
  localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
}
