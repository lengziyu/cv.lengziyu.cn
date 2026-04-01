import {
  DEFAULT_RESUME_DATA,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SECTION_TITLES,
  RESUME_STORAGE_KEY,
  RESUME_WORKSPACE_STORAGE_KEY,
} from '../constants/resume'
import { createId } from '../../../shared/createId'
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSectionId,
  ResumeSectionTitles,
  ResumeVersion,
  ResumeWorkspace,
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
  custom: {
    enabled: raw?.custom?.enabled ?? DEFAULT_RESUME_DATA.custom.enabled,
    title: raw?.custom?.title || DEFAULT_RESUME_DATA.custom.title,
    content: raw?.custom?.content || DEFAULT_RESUME_DATA.custom.content,
  },
})

const normalizeResumeVersion = (raw?: Partial<ResumeVersion>, fallbackName = '默认简历'): ResumeVersion => ({
  id: raw?.id || createId(),
  name: raw?.name?.trim() || fallbackName,
  updatedAt: raw?.updatedAt || new Date().toISOString(),
  data: normalizeResumeData(raw?.data),
})

const createDefaultWorkspace = (): ResumeWorkspace => {
  const version = normalizeResumeVersion(
    {
      name: '默认简历',
      data: DEFAULT_RESUME_DATA,
    },
    '默认简历',
  )

  return {
    activeVersionId: version.id,
    versions: [version],
  }
}

const normalizeWorkspace = (raw?: Partial<ResumeWorkspace>): ResumeWorkspace => {
  const versions =
    raw?.versions?.length
      ? raw.versions.map((item, index) =>
          normalizeResumeVersion(item, `版本 ${index + 1}`),
        )
      : createDefaultWorkspace().versions

  const activeVersionId =
    raw?.activeVersionId && versions.some((item) => item.id === raw.activeVersionId)
      ? raw.activeVersionId
      : versions[0].id

  return {
    activeVersionId,
    versions,
  }
}

export const parseResumeJson = (jsonText: string): ResumeData => {
  const parsed = JSON.parse(jsonText) as Partial<ResumeData>
  return normalizeResumeData(parsed)
}

export const loadResumeWorkspace = (): ResumeWorkspace => {
  try {
    const workspaceCache = localStorage.getItem(RESUME_WORKSPACE_STORAGE_KEY)
    if (workspaceCache) {
      const parsed = JSON.parse(workspaceCache) as Partial<ResumeWorkspace>
      return normalizeWorkspace(parsed)
    }

    const legacyCache = localStorage.getItem(RESUME_STORAGE_KEY)
    if (legacyCache) {
      const migratedVersion = normalizeResumeVersion({
        name: '默认简历',
        data: parseResumeJson(legacyCache),
      })

      return {
        activeVersionId: migratedVersion.id,
        versions: [migratedVersion],
      }
    }

    return createDefaultWorkspace()
  } catch {
    return createDefaultWorkspace()
  }
}

export const saveResumeWorkspace = (workspace: ResumeWorkspace) => {
  localStorage.setItem(RESUME_WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))
}
