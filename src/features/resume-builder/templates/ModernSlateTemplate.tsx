import type { ReactNode } from 'react'
import type { ResumeSectionId } from '../types/resume'
import type { ResumeTemplateProps } from '../types/template'
import { getVisibleCustomSections, getVisibleSectionOrder } from '../lib/sections'

const toList = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
    {children}
  </h2>
)

export const ModernSlateTemplate = ({ data, density = 1 }: ResumeTemplateProps) => {
  const { basic, experiences, projects, education, skills } = data
  const d = Math.max(0.9, Math.min(1.14, density))
  const visibleCustomSections = getVisibleCustomSections(data)
  const visibleSectionOrder = getVisibleSectionOrder(data)

  const sections: Record<ResumeSectionId, ReactNode> = {
    experience: (
      <section className="pdf-page-block rounded-xl border border-slate-200/80 bg-white" style={{ marginTop: `${20 * d}px`, padding: `${14 * d}px` }}>
        <SectionTitle>{data.sectionTitles.experience}</SectionTitle>
        <div className="mt-3 space-y-4">
          {experiences.map((item) => (
            <div key={item.id} className="pdf-page-block rounded-lg bg-slate-50/70 p-3">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.position}</p>
                  <p className="text-sm text-slate-600">{item.company}</p>
                </div>
                <p className="text-xs text-slate-500">
                  {item.startDate} - {item.endDate}
                </p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
                {toList(item.description).map((line, i) => (
                  <li key={`${item.id}-${i}`}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    project: (
      <section className="pdf-page-block rounded-xl border border-slate-200/80 bg-white" style={{ marginTop: `${20 * d}px`, padding: `${14 * d}px` }}>
        <SectionTitle>{data.sectionTitles.project}</SectionTitle>
        <div className="mt-3 space-y-4">
          {projects.map((item) => (
            <div key={item.id} className="pdf-page-block rounded-lg bg-slate-50/70 p-3">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.startDate} - {item.endDate}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-600">{item.role}</p>
              <p className="mt-2 text-xs text-slate-500">{item.techStack}</p>
              <p className="mt-2 text-sm text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    education: (
      <section className="pdf-page-block rounded-xl border border-slate-200/80 bg-white" style={{ marginTop: `${20 * d}px`, padding: `${14 * d}px` }}>
        <SectionTitle>{data.sectionTitles.education}</SectionTitle>
        <div className="mt-3 space-y-3">
          {education.map((item) => (
            <div key={item.id} className="pdf-page-block">
              <p className="text-sm font-semibold text-slate-900">{item.school}</p>
              <p className="text-xs text-slate-600">{item.degree}</p>
              <p className="text-xs text-slate-500">
                {item.startDate} - {item.endDate}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    skills: (
      <section className="pdf-page-block rounded-xl border border-slate-200/80 bg-white" style={{ marginTop: `${20 * d}px`, padding: `${14 * d}px` }}>
        <SectionTitle>{data.sectionTitles.skills}</SectionTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
              {skill}
            </span>
          ))}
        </div>
      </section>
    ),
  }

  return (
    <article className="mx-auto w-full max-w-[920px] rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white" style={{ padding: `${26 * d}px` }}>
      <header
        className="rounded-xl px-5 py-5"
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold">{basic.fullName || '姓名'}</h1>
            <p className="mt-1" style={{ color: 'rgba(226, 232, 240, 0.95)' }}>
              {basic.role || '职位'}
            </p>
            <p className="mt-3 text-sm" style={{ color: 'rgba(203, 213, 225, 0.95)' }}>
              {[basic.email, basic.phone, basic.location]
                .filter(Boolean)
                .join(' · ') || '邮箱 · 电话 · 城市'}
            </p>
            <p className="mt-1 text-sm" style={{ color: 'rgba(203, 213, 225, 0.95)' }}>
              {basic.website || '个人网站'}
            </p>
          </div>

          {basic.avatar ? (
            <div className="h-28 w-24 overflow-hidden rounded-md border border-white/20 bg-white/10">
              <img src={basic.avatar} alt="简历头像" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-6" style={{ color: 'rgba(226, 232, 240, 0.95)' }}>
          {basic.summary || '请补充个人简介，突出你的核心竞争力和代表性成果。'}
        </p>
      </header>

      {visibleSectionOrder.map((id) => (
        <div key={id}>{sections[id]}</div>
      ))}

      {visibleCustomSections.map((section) => (
        <section
          key={section.id}
          className="pdf-page-block rounded-xl border border-slate-200/80 bg-white"
          style={{ marginTop: `${20 * d}px`, padding: `${14 * d}px` }}
        >
          <SectionTitle>{section.title}</SectionTitle>
          <div className="mt-3 rounded-lg bg-slate-50/70 p-3">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {section.content || '请填写自定义模块内容。'}
            </p>
          </div>
        </section>
      ))}
    </article>
  )
}
