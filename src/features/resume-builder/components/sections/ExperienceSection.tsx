import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { InputField } from '../../../../components/ui/InputField'
import { TextAreaField } from '../../../../components/ui/TextAreaField'
import type { ResumeActions } from '../../types/actions'
import type { ResumeData } from '../../types/resume'
import { SectionHeader } from './SectionHeader'

interface ExperienceSectionProps {
  data: ResumeData
  actions: ResumeActions
}

export const ExperienceSection = ({
  data,
  actions,
}: ExperienceSectionProps) => (
  <div className="space-y-4">
    <SectionHeader
      title={data.sectionTitles.experience}
      description="支持添加多段经历，实时同步到预览。"
      addLabel="新增"
      onAdd={actions.addExperience}
      onTitleChange={(title) => actions.updateSectionTitle('experience', title)}
    />

    {data.experiences.length === 0 ? (
      <Card>
        <p className="text-sm text-slate">暂无经历，点击右上角「新增」开始填写。</p>
      </Card>
    ) : null}

    {data.experiences.map((item, index) => (
      <Card key={item.id}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate">
            经历 {index + 1}
          </h3>
          <Button
            variant="danger"
            size="sm"
            onClick={() => actions.removeExperience(item.id)}
            disabled={data.experiences.length === 1}
            title={data.experiences.length === 1 ? '至少保留一段经历' : '删除该经历'}
          >
            删除
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="公司"
            placeholder="公司名称"
            value={item.company}
            onChange={(event) =>
              actions.updateExperienceField(item.id, 'company', event.target.value)
            }
          />
          <InputField
            label="职位"
            placeholder="例如：前端工程师"
            value={item.position}
            onChange={(event) =>
              actions.updateExperienceField(item.id, 'position', event.target.value)
            }
          />
          <InputField
            label="开始时间"
            placeholder="2023.06"
            value={item.startDate}
            onChange={(event) =>
              actions.updateExperienceField(item.id, 'startDate', event.target.value)
            }
          />
          <InputField
            label="结束时间"
            placeholder="至今 / 2025.03"
            value={item.endDate}
            onChange={(event) =>
              actions.updateExperienceField(item.id, 'endDate', event.target.value)
            }
          />
        </div>

        <div className="mt-4">
          <TextAreaField
            label="经历描述"
            rows={5}
            placeholder="描述你的职责、关键动作和量化结果。"
            value={item.description}
            onChange={(event) =>
              actions.updateExperienceField(item.id, 'description', event.target.value)
            }
          />
        </div>
      </Card>
    ))}
  </div>
)
