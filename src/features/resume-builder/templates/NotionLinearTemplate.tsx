import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSectionId,
  ResumeData,
} from '../types/resume'
import type { ReactNode } from 'react'
import type { ResumeTemplateProps } from '../types/template'
import { getVisibleCustomSections, getVisibleSectionOrder } from '../lib/sections'

const ContactPill = ({ text }: { text: string }) => (
  <span className="pdf-pill pdf-pill-contact rounded-full border border-line">
    <span className="pdf-pill-label">{text}</span>
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
        ? 'pdf-pill pdf-pill-tag-compact rounded-md border border-line bg-paper-soft text-slate'
        : 'pdf-pill pdf-pill-tag rounded-md border border-line bg-paper-soft text-ink'
    }
  >
    <span className="pdf-pill-label">{text}</span>
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
    <div className="space-y-2">
      {lines.map((line, index) => (
        <p key={`${line}-${index}`} className="text-sm leading-6 text-slate">
          {line}
        </p>
      ))}
    </div>
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
    <div className="mt-3 flex flex-col" style={{ gap: `${10 * density}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          data-page-label={item.company || title}
          className="pdf-page-block flex flex-col justify-start rounded-xl border border-line"
          style={{
            padding: `${11 * density}px`,
            minHeight: `${Math.max(92, Math.min(148, 108 * density))}px`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.company || '未填写公司'}</h3>
              <p className="mt-1 text-sm text-slate">{item.position || '未填写职位'}</p>
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
    <div className="mt-3 flex flex-col" style={{ gap: `${10 * density}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          data-page-label={item.name || title}
          className="pdf-page-block flex flex-col justify-start rounded-xl border border-line"
          style={{
            padding: `${11 * density}px`,
            minHeight: `${Math.max(96, Math.min(176, 124 * density))}px`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.name || '未填写项目名称'}</h3>
              <p className="mt-1 text-sm text-slate">{item.role || '未填写角色'}</p>
            </div>
            {item.startDate || item.endDate ? (
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate">
                {[item.startDate, item.endDate].filter(Boolean).join(' - ')}
              </p>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
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
    <div className="mt-3 flex flex-col" style={{ gap: `${10 * density}px` }}>
      {items.map((item) => (
        <div
          key={item.id}
          data-page-label={item.school || title}
          className="pdf-page-block flex flex-col justify-start rounded-xl border border-line"
          style={{
            padding: `${11 * density}px`,
            minHeight: `${Math.max(84, Math.min(136, 102 * density))}px`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-ink">{item.school || '未填写学校'}</h3>
              <p className="mt-1 text-sm text-slate">{item.degree || '未填写专业/学位'}</p>
            </div>
            {item.startDate || item.endDate ? (
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate">
                {[item.startDate, item.endDate].filter(Boolean).join(' - ')}
              </p>
            ) : null}
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
  <section className="pdf-page-block" style={{ marginTop: `${16 * density}px` }}>
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

const CustomSection = ({
  title,
  content,
  density,
}: {
  title: string
  content: string
  density: number
}) => (
  <section className="pdf-page-block" style={{ marginTop: `${16 * density}px` }}>
    <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">{title}</h2>
    <div
      className="mt-3 rounded-xl border border-line bg-paper-soft"
      style={{ padding: `${12 * density}px` }}
    >
      {renderLines(content || '请填写自定义模块内容。')}
    </div>
  </section>
)

export const NotionLinearTemplate = ({ data, density = 1 }: ResumeTemplateProps) => {
  const { basic, experiences, projects, education, skills } = data
  const d = Math.max(0.9, Math.min(1.14, density))
  const visibleCustomSections = getVisibleCustomSections(data)
  const visibleSectionOrder = getVisibleSectionOrder(data)

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
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate">
              <ContactPill text={basic.email} />
              <ContactPill text={basic.phone} />
              <ContactPill text={basic.location} />
              <ContactPill text={basic.website} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate">{basic.summary}</p>
          </div>

          {basic.avatar ? (
            <div
              className="overflow-hidden rounded-lg border border-line bg-paper-soft"
              style={{
                height: `${128 * d}px`,
                width: `${96 * d}px`,
                minWidth: `${96 * d}px`,
              }}
            >
              <img src={basic.avatar} alt="简历头像" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
      </header>

      {visibleSectionOrder.map((id) => (
        <div key={id}>{sectionRenderer[id]}</div>
      ))}

      {visibleCustomSections.map((section) => (
        <CustomSection
          key={section.id}
          title={section.title}
          content={section.content}
          density={d}
        />
      ))}
    </article>
  )
}
