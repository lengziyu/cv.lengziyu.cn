import {
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject,
} from '../constants/resume'
import type {
  BasicInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSectionId,
} from '../types/resume'

type ExperienceField = keyof Omit<ExperienceItem, 'id'>
type EducationField = keyof Omit<EducationItem, 'id'>
type ProjectField = keyof Omit<ProjectItem, 'id'>

export type ResumeAction =
  | { type: 'basic/update-field'; field: keyof BasicInfo; value: string }
  | { type: 'experience/add' }
  | { type: 'experience/remove'; id: string }
  | {
      type: 'experience/update-field'
      id: string
      field: ExperienceField
      value: string
    }
  | { type: 'education/add' }
  | { type: 'education/remove'; id: string }
  | {
      type: 'education/update-field'
      id: string
      field: EducationField
      value: string
    }
  | { type: 'project/add' }
  | { type: 'project/remove'; id: string }
  | {
      type: 'project/update-field'
      id: string
      field: ProjectField
      value: string
    }
  | { type: 'skills/set'; skills: string[] }
  | { type: 'template/set'; templateId: string }
  | {
      type: 'section/title-set'
      sectionId: ResumeSectionId
      title: string
    }
  | {
      type: 'section/move'
      sourceId: ResumeSectionId
      targetId: ResumeSectionId
    }
  | { type: 'data/replace'; data: ResumeData }

export const resumeReducer = (
  state: ResumeData,
  action: ResumeAction,
): ResumeData => {
  switch (action.type) {
    case 'basic/update-field':
      return {
        ...state,
        basic: {
          ...state.basic,
          [action.field]: action.value,
        },
      }

    case 'experience/add':
      return {
        ...state,
        experiences: [...state.experiences, createEmptyExperience()],
      }

    case 'experience/remove':
      return {
        ...state,
        experiences: state.experiences.filter((item) => item.id !== action.id),
      }

    case 'experience/update-field':
      return {
        ...state,
        experiences: state.experiences.map((item) =>
          item.id === action.id
            ? {
                ...item,
                [action.field]: action.value,
              }
            : item,
        ),
      }

    case 'education/add':
      return {
        ...state,
        education: [...state.education, createEmptyEducation()],
      }

    case 'education/remove':
      return {
        ...state,
        education: state.education.filter((item) => item.id !== action.id),
      }

    case 'education/update-field':
      return {
        ...state,
        education: state.education.map((item) =>
          item.id === action.id
            ? {
                ...item,
                [action.field]: action.value,
              }
            : item,
        ),
      }

    case 'project/add':
      return {
        ...state,
        projects: [...state.projects, createEmptyProject()],
      }

    case 'project/remove':
      return {
        ...state,
        projects: state.projects.filter((item) => item.id !== action.id),
      }

    case 'project/update-field':
      return {
        ...state,
        projects: state.projects.map((item) =>
          item.id === action.id
            ? {
                ...item,
                [action.field]: action.value,
              }
            : item,
        ),
      }

    case 'skills/set':
      return {
        ...state,
        skills: action.skills,
      }

    case 'template/set':
      return {
        ...state,
        templateId: action.templateId,
      }

    case 'section/title-set':
      return {
        ...state,
        sectionTitles: {
          ...state.sectionTitles,
          [action.sectionId]: action.title,
        },
      }

    case 'section/move': {
      const sourceIndex = state.sectionOrder.indexOf(action.sourceId)
      const targetIndex = state.sectionOrder.indexOf(action.targetId)
      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return state
      }

      const next = [...state.sectionOrder]
      const [removed] = next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, removed)

      return {
        ...state,
        sectionOrder: next,
      }
    }

    case 'data/replace':
      return action.data

    default:
      return state
  }
}
