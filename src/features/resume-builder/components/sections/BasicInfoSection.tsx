import type { ChangeEvent } from 'react'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { InputField } from '../../../../components/ui/InputField'
import { TextAreaField } from '../../../../components/ui/TextAreaField'
import type { ResumeData } from '../../types/resume'
import type { ResumeActions } from '../../types/actions'

interface BasicInfoSectionProps {
  data: ResumeData
  actions: ResumeActions
}

export const BasicInfoSection = ({ data, actions }: BasicInfoSectionProps) => {
  const { basic } = data
  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        actions.updateBasicField('avatar', reader.result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-ink">基础信息</h2>
        <p className="mt-1 text-sm text-slate">这些信息会展示在简历顶部。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="姓名"
          placeholder="例如：张三"
          value={basic.fullName}
          onChange={(event) => actions.updateBasicField('fullName', event.target.value)}
        />
        <InputField
          label="职位标题"
          placeholder="例如：高级前端工程师"
          value={basic.role}
          onChange={(event) => actions.updateBasicField('role', event.target.value)}
        />
        <InputField
          label="邮箱"
          placeholder="hello@example.com"
          value={basic.email}
          onChange={(event) => actions.updateBasicField('email', event.target.value)}
        />
        <InputField
          label="电话"
          placeholder="+86 138-0000-0000"
          value={basic.phone}
          onChange={(event) => actions.updateBasicField('phone', event.target.value)}
        />
        <InputField
          label="城市"
          placeholder="上海"
          value={basic.location}
          onChange={(event) => actions.updateBasicField('location', event.target.value)}
        />
        <InputField
          label="个人网站"
          placeholder="https://your.site"
          value={basic.website}
          onChange={(event) => actions.updateBasicField('website', event.target.value)}
        />
      </div>

      <div className="mt-4 rounded-lg border border-dashed border-line bg-paper-soft p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-20 w-20 overflow-hidden rounded-lg border border-line bg-white">
            {basic.avatar ? (
              <img
                src={basic.avatar}
                alt="头像预览"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate">
                未上传
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <span className="inline-flex h-8 items-center rounded-lg border border-line bg-white px-3 text-xs font-medium text-ink">
                上传照片
              </span>
            </label>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => actions.updateBasicField('avatar', '')}
              disabled={!basic.avatar}
            >
              清空
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate">可选，不上传也不影响导出。</p>
      </div>

      <div className="mt-4">
        <TextAreaField
          label="个人简介"
          rows={5}
          placeholder="用 2-3 句话描述你的优势、经验与方向。"
          value={basic.summary}
          onChange={(event) => actions.updateBasicField('summary', event.target.value)}
        />
      </div>
    </Card>
  )
}
