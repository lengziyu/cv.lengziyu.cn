import type { ResumeData } from './resume'

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
  updateSectionTitle: (
    sectionId: 'experience' | 'project' | 'education' | 'skills',
    title: string,
  ) => void
  moveSection: (sourceId: 'experience' | 'project' | 'education' | 'skills', targetId: 'experience' | 'project' | 'education' | 'skills') => void
  replaceData: (data: ResumeData) => void
}
