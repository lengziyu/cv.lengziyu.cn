import type { ReactNode } from 'react'
import type { ResumeSectionId } from '../types/resume'
import type { ResumeTemplateProps } from '../types/template'

export const CleanColumnsTemplate = ({ data }: ResumeTemplateProps) => {
  const { basic, experiences, projects, education, skills, sectionOrder } = data

  const sectionRenderer: Record<ResumeSectionId, ReactNode> = {
    experience: (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700">
          {data.sectionTitles.experience}
        </h2>
        <div className="mt-3 space-y-4">
          {experiences.map((item) => (
            <div key={item.id} className="rounded-lg border border-sky-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.position}</p>
                  <p className="text-sm text-slate-600">{item.company}</p>
                </div>
                <p className="text-xs text-slate-500">
                  {item.startDate} - {item.endDate}
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    project: (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700">
          {data.sectionTitles.project}
        </h2>
        <div className="mt-3 space-y-4">
          {projects.map((item) => (
            <div key={item.id} className="rounded-lg border border-sky-100 p-3">
              <p className="text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="mt-1 text-xs text-slate-600">{item.role}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.startDate} - {item.endDate}
              </p>
              <p className="mt-2 text-xs text-sky-700">{item.techStack}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    education: (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700">
          {data.sectionTitles.education}
        </h2>
        <div className="mt-3 space-y-3">
          {education.map((item) => (
            <div key={item.id} className="rounded-lg border border-sky-100 p-3">
              <p className="text-sm font-semibold text-slate-900">{item.school}</p>
              <p className="mt-1 text-xs text-slate-600">{item.degree}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.startDate} - {item.endDate}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
    skills: (
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700">
          {data.sectionTitles.skills}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700">
              {skill}
            </span>
          ))}
        </div>
      </section>
    ),
  }

  return (
    <article className="mx-auto w-full max-w-[920px] rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <header className="border-b border-slate-200 pb-5">
        <div className="grid grid-cols-[1fr_auto] items-start gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{basic.fullName}</h1>
            <p className="mt-1 text-base text-slate-600">{basic.role}</p>
            <p className="mt-3 text-sm text-slate-500">
              {[basic.email, basic.phone, basic.location].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 text-sm text-slate-500">{basic.website}</p>
          </div>
          {basic.avatar ? (
            <div className="h-28 w-24 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              <img src={basic.avatar} alt="简历头像" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">{basic.summary}</p>
      </header>

      <div className="mt-6 space-y-6">
        {sectionOrder.map((id) => (
          <div key={id}>{sectionRenderer[id]}</div>
        ))}
      </div>
    </article>
  )
}
