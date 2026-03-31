import { useEffect, useMemo, useReducer } from 'react'
import { loadResumeData, saveResumeData } from '../lib/storage'
import { resumeReducer } from '../state/resumeReducer'
import type { ResumeActions } from '../types/actions'

export const useResumeBuilder = () => {
  const [data, dispatch] = useReducer(resumeReducer, undefined, loadResumeData)

  useEffect(() => {
    saveResumeData(data)
  }, [data])

  const actions = useMemo<ResumeActions>(
    () => ({
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
      ) => {
        dispatch({ type: 'basic/update-field', field, value })
      },
      addExperience: () => dispatch({ type: 'experience/add' }),
      removeExperience: (id: string) => dispatch({ type: 'experience/remove', id }),
      updateExperienceField: (
        id: string,
        field: 'company' | 'position' | 'startDate' | 'endDate' | 'description',
        value: string,
      ) => dispatch({ type: 'experience/update-field', id, field, value }),
      addEducation: () => dispatch({ type: 'education/add' }),
      removeEducation: (id: string) => dispatch({ type: 'education/remove', id }),
      updateEducationField: (
        id: string,
        field: 'school' | 'degree' | 'startDate' | 'endDate' | 'description',
        value: string,
      ) => dispatch({ type: 'education/update-field', id, field, value }),
      addProject: () => dispatch({ type: 'project/add' }),
      removeProject: (id: string) => dispatch({ type: 'project/remove', id }),
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
      ) => dispatch({ type: 'project/update-field', id, field, value }),
      setSkills: (skills: string[]) => dispatch({ type: 'skills/set', skills }),
      setTemplate: (templateId: string) =>
        dispatch({ type: 'template/set', templateId }),
      updateSectionTitle: (sectionId, title) =>
        dispatch({ type: 'section/title-set', sectionId, title }),
      moveSection: (sourceId, targetId) =>
        dispatch({ type: 'section/move', sourceId, targetId }),
      replaceData: (nextData) => dispatch({ type: 'data/replace', data: nextData }),
    }),
    [],
  )

  return { data, actions }
}
