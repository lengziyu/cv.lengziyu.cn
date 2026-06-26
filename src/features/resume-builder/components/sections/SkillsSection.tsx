import { Card } from '../../../../components/ui/Card'
import { TextAreaField } from '../../../../components/ui/TextAreaField'
import type { ResumeActions } from '../../types/actions'
import type { ResumeData } from '../../types/resume'
import { SectionHeader } from './SectionHeader'

interface SkillsSectionProps {
  data: ResumeData
  actions: ResumeActions
}

export const SkillsSection = ({ data, actions }: SkillsSectionProps) => {
  const rawValue = data.skills.join(', ')

  return (
    <div className="space-y-4">
      <SectionHeader
        title={data.sectionTitles.skills}
        description="用逗号分隔多个技能，会自动渲染成标签。"
        onTitleChange={(title) => actions.updateSectionTitle('skills', title)}
      />
      <Card className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">在简历中显示技能清单</p>
          <p className="mt-1 text-xs text-slate">关闭后仍可编辑技能，但预览和导出会隐藏该模块。</p>
        </div>
        <input
          type="checkbox"
          checked={!data.hiddenSections.includes('skills')}
          onChange={(event) => actions.setSectionVisible('skills', event.target.checked)}
          className="h-4 w-4 rounded border-line text-ink focus:ring-slate-300"
        />
      </Card>
      <Card>
        <TextAreaField
          label="技能"
          rows={6}
          hint="示例：React, TypeScript, Node.js, Docker"
          placeholder="输入你的技能关键词"
          value={rawValue}
          onChange={(event) => {
            const skills = event.target.value
              .split(',')
              .map((skill) => skill.trim())
              .filter(Boolean)
            actions.setSkills(skills)
          }}
        />
      </Card>
    </div>
  )
}
