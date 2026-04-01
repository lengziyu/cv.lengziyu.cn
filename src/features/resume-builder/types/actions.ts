import type { ResumeData, ResumeSectionId, ResumeVersion } from './resume'

export interface ResumeActions {
  updateBasicField: (
    field:
      | 'fullName'
      | 'role'
      | 'email'
      | 'phone'
      | 'location'
      | 'website'
      | 'summary'
      | 'avatar',
    value: string,
  ) => void
  addExperience: () => void
  removeExperience: (id: string) => void
  updateExperienceField: (
    id: string,
    field: 'company' | 'position' | 'startDate' | 'endDate' | 'description',
    value: string,
  ) => void
  addEducation: () => void
  removeEducation: (id: string) => void
  updateEducationField: (
    id: string,
    field: 'school' | 'degree' | 'startDate' | 'endDate' | 'description',
    value: string,
  ) => void
  addProject: () => void
  removeProject: (id: string) => void
  updateProjectField: (
    id: string,
    field:
      | 'name'
      | 'role'
      | 'techStack'
      | 'startDate'
      | 'endDate'
      | 'link'
      | 'description',
    value: string,
  ) => void
  setSkills: (skills: string[]) => void
  setTemplate: (templateId: string) => void
  updateSectionTitle: (sectionId: ResumeSectionId, title: string) => void
  moveSection: (sourceId: ResumeSectionId, targetId: ResumeSectionId) => void
  toggleCustomSection: (enabled: boolean) => void
  updateCustomTitle: (title: string) => void
  updateCustomContent: (content: string) => void
  replaceData: (data: ResumeData) => void
}

export interface ResumeVersionSummary extends Pick<ResumeVersion, 'id' | 'name' | 'updatedAt'> {}

export interface ResumeVersionActions {
  switchVersion: (id: string) => void
  createVersion: () => void
  duplicateVersion: () => void
  renameVersion: (name: string) => void
  deleteVersion: () => void
}
