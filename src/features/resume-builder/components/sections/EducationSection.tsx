import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { InputField } from '../../../../components/ui/InputField'
import { TextAreaField } from '../../../../components/ui/TextAreaField'
import type { ResumeActions } from '../../types/actions'
import type { ResumeData } from '../../types/resume'
import { SectionHeader } from './SectionHeader'

interface EducationSectionProps {
  data: ResumeData
  actions: ResumeActions
}

export const EducationSection = ({ data, actions }: EducationSectionProps) => (
  <div className="space-y-4">
    <SectionHeader
      title={data.sectionTitles.education}
      description="支持多段教育经历，可用于本科/硕士/培训项目。"
      addLabel="新增"
      onAdd={actions.addEducation}
      onTitleChange={(title) => actions.updateSectionTitle('education', title)}
    />

    <Card className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-ink">在简历中显示教育经历</p>
        <p className="mt-1 text-xs text-slate">关闭后仍可编辑内容，但预览和导出会隐藏该模块。</p>
      </div>
      <input
        type="checkbox"
        checked={!data.hiddenSections.includes('education')}
        onChange={(event) => actions.setSectionVisible('education', event.target.checked)}
        className="h-4 w-4 rounded border-line text-ink focus:ring-slate-300"
      />
    </Card>

    {data.education.map((item, index) => (
      <Card key={item.id}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate">
            教育 {index + 1}
          </h3>
          <Button
            variant="danger"
            size="sm"
            onClick={() => actions.removeEducation(item.id)}
            disabled={data.education.length === 1}
            title={data.education.length === 1 ? '至少保留一段教育经历' : '删除该段教育经历'}
          >
            删除
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="学校"
            placeholder="学校名称"
            value={item.school}
            onChange={(event) =>
              actions.updateEducationField(item.id, 'school', event.target.value)
            }
          />
          <InputField
            label="学位 / 专业"
            placeholder="计算机科学与技术"
            value={item.degree}
            onChange={(event) =>
              actions.updateEducationField(item.id, 'degree', event.target.value)
            }
          />
          <InputField
            label="开始时间"
            placeholder="2018.09"
            value={item.startDate}
            onChange={(event) =>
              actions.updateEducationField(item.id, 'startDate', event.target.value)
            }
          />
          <InputField
            label="结束时间"
            placeholder="2022.06"
            value={item.endDate}
            onChange={(event) =>
              actions.updateEducationField(item.id, 'endDate', event.target.value)
            }
          />
        </div>

        <div className="mt-4">
          <TextAreaField
            label="补充说明"
            rows={4}
            placeholder="例如：荣誉、奖项、课程或研究方向。"
            value={item.description}
            onChange={(event) =>
              actions.updateEducationField(item.id, 'description', event.target.value)
            }
          />
        </div>
      </Card>
    ))}
  </div>
)
