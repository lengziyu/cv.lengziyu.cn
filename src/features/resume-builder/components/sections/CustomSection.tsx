import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { InputField } from '../../../../components/ui/InputField'
import { TextAreaField } from '../../../../components/ui/TextAreaField'
import type { ResumeActions } from '../../types/actions'
import type { ResumeData } from '../../types/resume'

interface CustomSectionProps {
  data: ResumeData
  actions: ResumeActions
}

export const CustomSection = ({ data, actions }: CustomSectionProps) => (
  <div className="space-y-4">
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">自定义模块</h2>
          <p className="mt-1 text-sm text-slate">
            可新增多个模块，适合补充证书、获奖、个人说明或其他自由内容。
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={actions.addCustomSection}>
          新增模块
        </Button>
      </div>
    </Card>

    {data.customSections.length === 0 ? (
      <Card>
        <p className="text-sm text-slate">暂无自定义模块，点击“新增模块”开始添加。</p>
      </Card>
    ) : null}

    {data.customSections.map((item, index) => (
      <Card key={item.id} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate">
            自定义 {index + 1}
          </h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate">
              <span>显示</span>
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(event) =>
                  actions.toggleCustomSection(item.id, event.target.checked)
                }
                className="h-4 w-4 rounded border-line text-ink focus:ring-slate-300"
              />
            </label>
            <Button
              variant="danger"
              size="sm"
              onClick={() => actions.removeCustomSection(item.id)}
            >
              删除
            </Button>
          </div>
        </div>

        <InputField
          label="模块标题"
          placeholder="例如：证书 / 获奖 / 其他补充"
          value={item.title}
          onChange={(event) =>
            actions.updateCustomSectionField(item.id, 'title', event.target.value)
          }
        />

        <TextAreaField
          label="模块内容"
          rows={8}
          hint="支持多行内容；每行会按段落或列表形式展示。"
          placeholder="请输入你想补充到简历底部的内容"
          value={item.content}
          onChange={(event) =>
            actions.updateCustomSectionField(item.id, 'content', event.target.value)
          }
        />
      </Card>
    ))}
  </div>
)
