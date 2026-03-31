import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { InputField } from '../../../../components/ui/InputField'

interface SectionHeaderProps {
  title: string
  description: string
  onTitleChange: (title: string) => void
  addLabel?: string
  onAdd?: () => void
}

export const SectionHeader = ({
  title,
  description,
  onTitleChange,
  addLabel = '新增',
  onAdd,
}: SectionHeaderProps) => (
  <Card>
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-slate">{description}</p>
      </div>
      {onAdd ? (
        <Button
          variant="primary"
          size="sm"
          className="whitespace-nowrap"
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      ) : null}
    </div>

    <div className="mt-3 max-w-[240px]">
      <InputField
        label="模块标题"
        value={title}
        placeholder="输入模块标题"
        onChange={(event) => onTitleChange(event.target.value)}
      />
    </div>
  </Card>
)
