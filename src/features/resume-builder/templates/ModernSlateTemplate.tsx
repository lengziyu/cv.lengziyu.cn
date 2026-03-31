import type { ReactNode } from 'react'
import type { ResumeSectionId } from '../types/resume'
import type { ResumeTemplateProps } from '../types/template'

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

export const ModernSlateTemplate = ({ data }: ResumeTemplateProps) => {
  const { basic, experiences, projects, education, skills, sectionOrder } = data

  const sections: Record<ResumeSectionId, ReactNode> = {
    experience: (
      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-4">
        <SectionTitle>{data.sectionTitles.experience}</SectionTitle>
        <div className="mt-3 space-y-4">
          {experiences.map((item) => (
            <div key={item.id} className="rounded-lg bg-slate-50/70 p-3">
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
      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-4">
        <SectionTitle>{data.sectionTitles.project}</SectionTitle>
        <div className="mt-3 space-y-4">
          {projects.map((item) => (
            <div key={item.id} className="rounded-lg bg-slate-50/70 p-3">
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
      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-4">
        <SectionTitle>{data.sectionTitles.education}</SectionTitle>
        <div className="mt-3 space-y-3">
          {education.map((item) => (
            <div key={item.id}>
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
      <section className="mt-6 rounded-xl border border-slate-200/80 bg-white p-4">
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
    <article className="mx-auto w-full max-w-[920px] rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 sm:p-9">
      <header className="rounded-xl bg-slate-900 px-5 py-5 text-white">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold">{basic.fullName}</h1>
            <p className="mt-1 text-slate-200">{basic.role}</p>
            <p className="mt-3 text-sm text-slate-300">
              {[basic.email, basic.phone, basic.location].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 text-sm text-slate-300">{basic.website}</p>
          </div>
          <div className="h-28 w-24 overflow-hidden rounded-md border border-white/20 bg-white/10">
            {basic.avatar ? (
              <img src={basic.avatar} alt="简历头像" className="h-full w-full object-cover" />
            ) : null}
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-200">{basic.summary}</p>
      </header>

      {sectionOrder.map((id) => (
        <div key={id}>{sections[id]}</div>
      ))}
    </article>
  )
}
