import type { ReactNode } from 'react'
import type { ResumeSectionId } from '../types/resume'
import type { ResumeTemplateProps } from '../types/template'

const linesFromText = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

export const AtsClassicTemplate = ({ data }: ResumeTemplateProps) => {
  const { basic, experiences, projects, education, skills, sectionOrder } = data

  const sectionRenderer: Record<ResumeSectionId, ReactNode> = {
    experience: (
      <section className="pdf-page-block mt-5">
        <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider">
          {data.sectionTitles.experience}
        </h2>
        <div className="mt-3 space-y-4">
          {experiences.map((item) => (
            <div key={item.id} className="pdf-page-block">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold">
                  {item.position || 'Role'} | {item.company || 'Company'}
                </p>
                <p className="text-xs">
                  {item.startDate || 'Start'} - {item.endDate || 'End'}
                </p>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {linesFromText(item.description || 'Describe your impact in this role.').map(
                  (line, index) => (
                    <li key={`${item.id}-${index}`}>{line}</li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    project: (
      <section className="pdf-page-block mt-5">
        <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider">
          {data.sectionTitles.project}
        </h2>
        <div className="mt-3 space-y-4">
          {projects.map((item) => (
            <div key={item.id} className="pdf-page-block">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold">
                  {item.name || 'Project'} | {item.role || 'Role'}
                </p>
                <p className="text-xs">
                  {item.startDate || 'Start'} - {item.endDate || 'End'}
                </p>
              </div>
              <p className="mt-1 text-sm">
                <span className="font-semibold">Tech:</span>{' '}
                {item.techStack || 'Please add tech stack'}
              </p>
              {item.link ? (
                <p className="mt-1 text-sm">
                  <span className="font-semibold">Link:</span> {item.link}
                </p>
              ) : null}
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {linesFromText(item.description || 'Describe project outcomes.').map(
                  (line, index) => (
                    <li key={`${item.id}-desc-${index}`}>{line}</li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    education: (
      <section className="pdf-page-block mt-5">
        <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider">
          {data.sectionTitles.education}
        </h2>
        <div className="mt-3 space-y-3">
          {education.map((item) => (
            <div key={item.id} className="pdf-page-block">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-semibold">
                  {item.school || 'School'} | {item.degree || 'Degree'}
                </p>
                <p className="text-xs">
                  {item.startDate || 'Start'} - {item.endDate || 'End'}
                </p>
              </div>
              <p className="mt-1 text-sm leading-6">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    ),
    skills: (
      <section className="pdf-page-block mt-5">
        <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider">
          {data.sectionTitles.skills}
        </h2>
        <p className="mt-2 text-sm leading-6">{skills.join(', ')}</p>
      </section>
    ),
  }

  return (
    <article className="mx-auto w-full max-w-[920px] border border-neutral-300 bg-white p-8 text-black sm:p-10">
      <header className="border-b border-black pb-4">
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{basic.fullName}</h1>
            <p className="mt-1 text-base font-semibold">{basic.role}</p>
            <p className="mt-2 text-sm leading-6">
              {[basic.email, basic.phone, basic.location, basic.website]
                .filter(Boolean)
                .join(' | ')}
            </p>
          </div>
          {basic.avatar ? (
            <div className="h-36 w-28 overflow-hidden border border-neutral-400 bg-neutral-50">
              <img src={basic.avatar} alt="简历头像" className="h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
      </header>

      <section className="pdf-page-block mt-5">
        <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider">
          Summary
        </h2>
        <p className="mt-2 text-sm leading-6">{basic.summary}</p>
      </section>

      {sectionOrder.map((id) => (
        <div key={id}>{sectionRenderer[id]}</div>
      ))}

      {data.custom.enabled ? (
        <section className="pdf-page-block mt-5">
          <h2 className="border-b border-neutral-400 pb-1 text-sm font-bold uppercase tracking-wider">
            {data.custom.title}
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6">
            {data.custom.content || '请填写自定义模块内容。'}
          </p>
        </section>
      ) : null}
    </article>
  )
}
