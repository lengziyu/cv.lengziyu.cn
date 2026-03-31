import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
  ResumeData,
} from '../types/resume'
import type { ReactNode } from 'react'
import type { ResumeTemplateProps } from '../types/template'

const ContactPill = ({ text }: { text: string }) => (
  <span className="pdf-pill inline-grid min-h-[28px] place-items-center whitespace-nowrap rounded-full border border-line px-3 py-1 text-xs leading-none align-middle">
    <span className="pdf-pill-text">{text}</span>
  </span>
)

const TagPill = ({
  text,
  compact = false,
}: {
  text: string
  compact?: boolean
}) => (
  <span
    className={
      compact
        ? 'pdf-pill inline-grid min-h-[22px] place-items-center rounded-md border border-line bg-paper-soft px-2 py-0.5 text-xs leading-none text-slate align-middle'
        : 'pdf-pill inline-grid min-h-[26px] place-items-center rounded-md border border-line bg-paper-soft px-2.5 py-1 text-xs font-medium leading-none text-ink align-middle'
    }
  >
    <span className="pdf-pill-text">{text}</span>
  </span>
)

const renderLines = (text: string) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length <= 1) {
    return <p className="text-sm leading-6 text-slate">{text}</p>
  }

  return (
    <ul className="space-y-2">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`} className="flex gap-2 text-sm leading-6 text-slate">
          <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-slate/60" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

const ExperienceSection = ({
  title,
  items,
  density,
}: {
  title: string
  items: ExperienceItem[]
  density: number
}) => (
  <section style={{ marginTop: `${16 * density}px` }}>
    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">{title}</h2>
    <div className="mt-3 flex flex-col" style={{ gap: `${12 * density}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-center rounded-xl border border-line"
          style={{
            padding: `${12 * density}px`,
            minHeight: `${Math.max(104, Math.min(168, 120 * density))}px`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.position || '未填写职位'}</h3>
              <p className="mt-1 text-sm text-slate">{item.company || '未填写公司'}</p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate">
              {(item.startDate || '开始时间') + ' - ' + (item.endDate || '结束时间')}
            </p>
          </div>
          <div className="mt-2 text-sm text-slate">
            {renderLines(item.description || '请补充你在该经历中的关键贡献。')}
          </div>
        </div>
      ))}
    </div>
  </section>
)

const ProjectSection = ({
  title,
  items,
  density,
}: {
  title: string
  items: ProjectItem[]
  density: number
}) => (
  <section style={{ marginTop: `${16 * density}px` }}>
    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">{title}</h2>
    <div className="mt-3 flex flex-col" style={{ gap: `${12 * density}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-center rounded-xl border border-line"
          style={{
            padding: `${12 * density}px`,
            minHeight: `${Math.max(110, Math.min(210, 146 * density))}px`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.name || '未填写项目名称'}</h3>
              <p className="mt-1 text-sm text-slate">{item.role || '未填写角色'}</p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate">
              {(item.startDate || '开始时间') + ' - ' + (item.endDate || '结束时间')}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {(item.techStack || '请填写技术栈')
              .split(',')
              .map((tech) => tech.trim())
              .filter(Boolean)
              .map((tech) => (
                <TagPill key={`${item.id}-${tech}`} text={tech} compact />
              ))}
          </div>

          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-ink underline decoration-line underline-offset-4"
            >
              {item.link}
            </a>
          ) : null}

          <div className="mt-2 text-sm text-slate">
            {renderLines(item.description || '请补充项目目标、关键动作与结果。')}
          </div>
        </div>
      ))}
    </div>
  </section>
)

const EducationSection = ({
  title,
  items,
  density,
}: {
  title: string
  items: EducationItem[]
  density: number
}) => (
  <section style={{ marginTop: `${16 * density}px` }}>
    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">{title}</h2>
    <div className="mt-3 flex flex-col" style={{ gap: `${12 * density}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col justify-center rounded-xl border border-line"
          style={{
            padding: `${12 * density}px`,
            minHeight: `${Math.max(96, Math.min(156, 116 * density))}px`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.school || '未填写学校'}</h3>
              <p className="mt-1 text-sm text-slate">{item.degree || '未填写专业/学位'}</p>
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate">
              {(item.startDate || '开始时间') + ' - ' + (item.endDate || '结束时间')}
            </p>
          </div>
          <p className="mt-2 text-sm leading-5 text-slate">
            {item.description || '请补充课程、项目或荣誉信息。'}
          </p>
        </div>
      ))}
    </div>
  </section>
)

const SkillSection = ({
  title,
  skills,
  density,
}: {
  title: string
  skills: ResumeData['skills']
  density: number
}) => (
  <section style={{ marginTop: `${16 * density}px` }}>
    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">{title}</h2>
    <div className="mt-2 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <TagPill key={skill} text={skill} />
      ))}
      {skills.length === 0 ? (
        <span className="text-sm text-slate">请在左侧填写技能关键词。</span>
      ) : null}
    </div>
  </section>
)

export const NotionLinearTemplate = ({ data, density = 1 }: ResumeTemplateProps) => {
  const { basic, experiences, projects, education, skills, sectionOrder } = data
  const d = Math.max(0.9, Math.min(1.14, density))

  const sectionRenderer: Record<ResumeSectionId, ReactNode> = {
    experience: (
      <ExperienceSection
        title={data.sectionTitles.experience}
        items={experiences}
        density={d}
      />
    ),
    project: (
      <ProjectSection title={data.sectionTitles.project} items={projects} density={d} />
    ),
    education: (
      <EducationSection
        title={data.sectionTitles.education}
        items={education}
        density={d}
      />
    ),
    skills: (
      <SkillSection title={data.sectionTitles.skills} skills={skills} density={d} />
    ),
  }

  return (
    <article
      className="mx-auto w-full max-w-[920px] rounded-2xl border border-line bg-white shadow-panel"
      style={{ padding: `${22 * d}px` }}
    >
      <header className="border-b border-line" style={{ paddingBottom: `${14 * d}px` }}>
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">{basic.fullName}</h1>
            <p className="mt-1 text-base font-medium text-slate">{basic.role}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate">
              <ContactPill text={basic.email} />
              <ContactPill text={basic.phone} />
              <ContactPill text={basic.location} />
              <ContactPill text={basic.website} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate">{basic.summary}</p>
          </div>

          <div
            className="overflow-hidden rounded-lg border border-line bg-paper-soft"
            style={{
              height: `${128 * d}px`,
              width: `${96 * d}px`,
              minWidth: `${96 * d}px`,
            }}
          >
            {basic.avatar ? (
              <img src={basic.avatar} alt="简历头像" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-slate">
                照片（可选）
              </div>
            )}
          </div>
        </div>
      </header>

      {sectionOrder.map((id) => (
        <div key={id}>{sectionRenderer[id]}</div>
      ))}
    </article>
  )
}
