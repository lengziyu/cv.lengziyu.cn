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
      <h2 className="text-lg font-semibold text-ink">自定义模块</h2>
      <p className="mt-1 text-sm text-slate">
        这个模块固定显示在简历最底部，适合补充证书、获奖、个人说明或其他自由内容。
      </p>
    </Card>

    <Card className="space-y-4">
      <InputField
        label="模块标题"
        placeholder="例如：证书 / 获奖 / 其他补充"
        value={data.custom.title}
        onChange={(event) => actions.updateCustomTitle(event.target.value)}
      />

      <TextAreaField
        label="模块内容"
        rows={10}
        hint="支持多行内容；每行会按段落或列表形式展示。"
        placeholder="请输入你想补充到简历底部的内容"
        value={data.custom.content}
        onChange={(event) => actions.updateCustomContent(event.target.value)}
      />
    </Card>
  </div>
)
