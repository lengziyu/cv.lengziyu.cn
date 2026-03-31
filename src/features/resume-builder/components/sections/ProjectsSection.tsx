import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { InputField } from '../../../../components/ui/InputField'
import { TextAreaField } from '../../../../components/ui/TextAreaField'
import type { ResumeActions } from '../../types/actions'
import type { ResumeData } from '../../types/resume'
import { SectionHeader } from './SectionHeader'

interface ProjectsSectionProps {
  data: ResumeData
  actions: ResumeActions
}

export const ProjectsSection = ({ data, actions }: ProjectsSectionProps) => (
  <div className="space-y-4">
    <SectionHeader
      title={data.sectionTitles.project}
      description="支持多段项目，建议突出成果、技术栈和项目链接。"
      addLabel="新增"
      onAdd={actions.addProject}
      onTitleChange={(title) => actions.updateSectionTitle('project', title)}
    />

    {data.projects.map((item, index) => (
      <Card key={item.id}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate">
            项目 {index + 1}
          </h3>
          <Button
            variant="danger"
            size="sm"
            onClick={() => actions.removeProject(item.id)}
            disabled={data.projects.length === 1}
            title={data.projects.length === 1 ? '至少保留一个项目' : '删除该项目'}
          >
            删除
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="项目名称"
            placeholder="例如：后台管理系统重构"
            value={item.name}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'name', event.target.value)
            }
          />
          <InputField
            label="你的角色"
            placeholder="例如：前端负责人"
            value={item.role}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'role', event.target.value)
            }
          />
          <InputField
            label="开始时间"
            placeholder="2025.01"
            value={item.startDate}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'startDate', event.target.value)
            }
          />
          <InputField
            label="结束时间"
            placeholder="2025.05 / 至今"
            value={item.endDate}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'endDate', event.target.value)
            }
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InputField
            label="技术栈"
            placeholder="React, TypeScript, Node.js"
            value={item.techStack}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'techStack', event.target.value)
            }
          />
          <InputField
            label="项目链接"
            placeholder="https://example.com"
            value={item.link}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'link', event.target.value)
            }
          />
        </div>

        <div className="mt-4">
          <TextAreaField
            label="项目描述"
            rows={5}
            placeholder="描述背景、关键动作和最终结果，尽量量化。"
            value={item.description}
            onChange={(event) =>
              actions.updateProjectField(item.id, 'description', event.target.value)
            }
          />
        </div>
      </Card>
    ))}
  </div>
)
