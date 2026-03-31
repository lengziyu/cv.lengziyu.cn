import type { ResumeActions } from '../types/actions'
import type { ResumeData, ResumeStepId } from '../types/resume'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { EducationSection } from './sections/EducationSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { SkillsSection } from './sections/SkillsSection'

interface ResumeEditorPanelProps {
  activeStep: ResumeStepId
  data: ResumeData
  actions: ResumeActions
}

const renderStepSection = (
  activeStep: ResumeStepId,
  data: ResumeData,
  actions: ResumeActions,
) => {
  switch (activeStep) {
    case 'basic':
      return <BasicInfoSection data={data} actions={actions} />
    case 'experience':
      return <ExperienceSection data={data} actions={actions} />
    case 'education':
      return <EducationSection data={data} actions={actions} />
    case 'project':
      return <ProjectsSection data={data} actions={actions} />
    case 'skills':
      return <SkillsSection data={data} actions={actions} />
    default:
      return null
  }
}

export const ResumeEditorPanel = ({
  activeStep,
  data,
  actions,
}: ResumeEditorPanelProps) => (
  <section>{renderStepSection(activeStep, data, actions)}</section>
)
