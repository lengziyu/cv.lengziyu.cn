import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_RESUME_DATA } from '../constants/resume'
import { loadResumeWorkspace, saveResumeWorkspace } from '../lib/storage'
import { resumeReducer } from '../state/resumeReducer'
import type {
  ResumeActions,
  ResumeVersionActions,
  ResumeVersionSummary,
} from '../types/actions'
import type { ResumeData, ResumeWorkspace } from '../types/resume'
import { createId } from '../../../shared/createId'

const getNextVersionName = (workspace: ResumeWorkspace) => {
  const maxIndex = workspace.versions.reduce((max, version) => {
    const match = version.name.match(/^版本\s*(\d+)$/)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)

  return `版本 ${maxIndex + 1}`
}

const withUpdatedActiveVersion = (
  workspace: ResumeWorkspace,
  updater: (data: ResumeData) => ResumeData,
): ResumeWorkspace => ({
  ...workspace,
  versions: workspace.versions.map((version) =>
    version.id === workspace.activeVersionId
      ? {
          ...version,
          updatedAt: new Date().toISOString(),
          data: updater(version.data),
        }
      : version,
  ),
})

export const useResumeBuilder = () => {
  const [workspace, setWorkspace] = useState(loadResumeWorkspace)

  useEffect(() => {
    saveResumeWorkspace(workspace)
  }, [workspace])

  const activeVersion =
    workspace.versions.find((item) => item.id === workspace.activeVersionId) ||
    workspace.versions[0]

  const data = activeVersion.data

  const actions = useMemo<ResumeActions>(
    () => ({
      updateBasicField: (field, value) => {
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'basic/update-field', field, value }),
          ),
        )
      },
      addExperience: () =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'experience/add' }),
          ),
        ),
      removeExperience: (id) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'experience/remove', id }),
          ),
        ),
      updateExperienceField: (id, field, value) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, {
              type: 'experience/update-field',
              id,
              field,
              value,
            }),
          ),
        ),
      addEducation: () =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'education/add' }),
          ),
        ),
      removeEducation: (id) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'education/remove', id }),
          ),
        ),
      updateEducationField: (id, field, value) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, {
              type: 'education/update-field',
              id,
              field,
              value,
            }),
          ),
        ),
      addProject: () =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'project/add' }),
          ),
        ),
      removeProject: (id) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'project/remove', id }),
          ),
        ),
      updateProjectField: (id, field, value) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, {
              type: 'project/update-field',
              id,
              field,
              value,
            }),
          ),
        ),
      setSkills: (skills) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'skills/set', skills }),
          ),
        ),
      setTemplate: (templateId) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'template/set', templateId }),
          ),
        ),
      updateSectionTitle: (sectionId, title) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'section/title-set', sectionId, title }),
          ),
        ),
      moveSection: (sourceId, targetId) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'section/move', sourceId, targetId }),
          ),
        ),
      setSectionVisible: (sectionId, visible) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'section/visibility-set', sectionId, visible }),
          ),
        ),
      addCustomSection: () =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'custom/add' }),
          ),
        ),
      removeCustomSection: (id) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'custom/remove', id }),
          ),
        ),
      toggleCustomSection: (id, enabled) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, { type: 'custom/toggle', id, enabled }),
          ),
        ),
      updateCustomSectionField: (id, field, value) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, (current) =>
            resumeReducer(current, {
              type: 'custom/update-field',
              id,
              field,
              value,
            }),
          ),
        ),
      replaceData: (nextData) =>
        setWorkspace((prev) =>
          withUpdatedActiveVersion(prev, () =>
            resumeReducer(nextData, { type: 'data/replace', data: nextData }),
          ),
        ),
    }),
    [],
  )

  const versionActions = useMemo<ResumeVersionActions>(
    () => ({
      switchVersion: (id) =>
        setWorkspace((prev) =>
          prev.versions.some((item) => item.id === id)
            ? { ...prev, activeVersionId: id }
            : prev,
        ),
      createVersion: () =>
        setWorkspace((prev) => {
          const nextVersion = {
            id: createId(),
            name: getNextVersionName(prev),
            updatedAt: new Date().toISOString(),
            data: structuredClone(DEFAULT_RESUME_DATA),
          }

          return {
            activeVersionId: nextVersion.id,
            versions: [...prev.versions, nextVersion],
          }
        }),
      duplicateVersion: () =>
        setWorkspace((prev) => {
          const source =
            prev.versions.find((item) => item.id === prev.activeVersionId) || prev.versions[0]
          const nextVersion = {
            id: createId(),
            name: getNextVersionName(prev),
            updatedAt: new Date().toISOString(),
            data: structuredClone(source.data),
          }

          return {
            activeVersionId: nextVersion.id,
            versions: [...prev.versions, nextVersion],
          }
        }),
      renameVersion: (name) =>
        setWorkspace((prev) => ({
          ...prev,
          versions: prev.versions.map((version) =>
            version.id === prev.activeVersionId
              ? {
                  ...version,
                  name: name.trim() || '未命名版本',
                  updatedAt: new Date().toISOString(),
                }
              : version,
          ),
        })),
      deleteVersion: () =>
        setWorkspace((prev) => {
          if (prev.versions.length <= 1) return prev

          const currentIndex = prev.versions.findIndex(
            (item) => item.id === prev.activeVersionId,
          )
          const nextVersions = prev.versions.filter(
            (item) => item.id !== prev.activeVersionId,
          )
          const fallbackIndex = Math.max(0, currentIndex - 1)

          return {
            activeVersionId: nextVersions[fallbackIndex]?.id || nextVersions[0].id,
            versions: nextVersions,
          }
        }),
    }),
    [],
  )

  const versions = useMemo<ResumeVersionSummary[]>(
    () =>
      workspace.versions.map(({ id, name, updatedAt }) => ({
        id,
        name,
        updatedAt,
      })),
    [workspace.versions],
  )

  return {
    data,
    actions,
    versions,
    activeVersionId: workspace.activeVersionId,
    activeVersionName: activeVersion.name,
    versionActions,
  }
}
