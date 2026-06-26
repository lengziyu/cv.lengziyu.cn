import type {
  FileChild,
  IParagraphOptions,
  IRunOptions,
  Paragraph as DocxParagraph,
  ParagraphChild,
  Table as DocxTable,
} from 'docx'
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSectionId,
} from '../types/resume'
import { getVisibleCustomSections, getVisibleSectionOrder } from './sections'

const ACCENT = '2563eb'
const ACCENT_DARK = '1e3a8a'
const ACCENT_LIGHT = 'eff6ff'
const BODY = '1f2937'
const MUTED = '64748b'
const LINE = 'e2e8f0'
const SOFT = 'f8fafc'
const FONT = {
  ascii: 'Arial',
  hAnsi: 'Arial',
  eastAsia: 'Microsoft YaHei',
  cs: 'Arial',
}

const paragraphText = (text: string) => text.trim().replace(/\s+/g, ' ')

const hasText = (value: string) => value.trim().length > 0

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export const exportResumeWord = async (data: ResumeData, fileName: string) => {
  const visibleCustomSections = getVisibleCustomSections(data)
  const visibleSectionOrder = getVisibleSectionOrder(data)
  const {
    AlignmentType,
    BorderStyle,
    Document,
    ExternalHyperlink,
    HeadingLevel,
    LevelFormat,
    Packer,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextRun,
    UnderlineType,
    VerticalAlign,
    WidthType,
  } = await import('docx')

  const noBorder = {
    style: BorderStyle.NONE,
    size: 0,
    color: 'ffffff',
  }

  const cardBorder = {
    style: BorderStyle.SINGLE,
    color: LINE,
    size: 8,
  }

  const textRun = (text: string, options: Omit<IRunOptions, 'text' | 'font'> = {}) =>
    new TextRun({
      text,
      font: FONT,
      ...options,
    })

  const paragraph = (
    text: string,
    options: Omit<IParagraphOptions, 'children'> = {},
  ) =>
    new Paragraph({
      children: [textRun(paragraphText(text), { color: BODY, size: 21 })],
      spacing: { after: 80, line: 276 },
      ...options,
    })

  const softParagraph = (children: ParagraphChild[], options: Omit<IParagraphOptions, 'children'> = {}) =>
    new Paragraph({
      children,
      spacing: { after: 80, line: 276 },
      ...options,
    })

  const sectionTitle = (title: string) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        textRun(paragraphText(title), {
          bold: true,
          color: ACCENT_DARK,
          size: 24,
        }),
      ],
      shading: {
        type: ShadingType.CLEAR,
        fill: ACCENT_LIGHT,
      },
      border: {
        left: {
          color: ACCENT,
          size: 18,
          style: 'single',
          space: 5,
        },
      },
      spacing: { before: 220, after: 120 },
      indent: { left: 110 },
    })

  const itemTitle = (primary: string, secondary?: string, dates?: string) => {
    const runs = [textRun(paragraphText(primary), { bold: true, color: BODY, size: 22 })]

    if (hasText(secondary ?? '')) {
      runs.push(textRun(` | ${paragraphText(secondary!)}`, { color: MUTED, size: 20 }))
    }

    if (hasText(dates ?? '')) {
      runs.push(textRun(` | ${paragraphText(dates!)}`, { color: MUTED, size: 20 }))
    }

    return new Paragraph({
      children: runs,
      spacing: { before: 20, after: 60 },
    })
  }

  const bulletParagraphs = (text: string) =>
    text
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/^[-*•]\s*/, ''))
      .filter(Boolean)
      .map(
        (line) =>
          new Paragraph({
            children: [textRun(line, { color: BODY, size: 21 })],
            numbering: { reference: 'resume-bullets', level: 0 },
            spacing: { after: 60, line: 276 },
            indent: { left: 360, hanging: 180 },
          }),
      )

  const chipRun = (text: string) =>
    textRun(` ${paragraphText(text)} `, {
      bold: true,
      color: '475569',
      size: 18,
      shading: {
        type: ShadingType.CLEAR,
        fill: 'f1f5f9',
      },
    })

  const chipParagraph = (items: string[]) =>
    new Paragraph({
      children: items.flatMap((item, index) => {
        const runs: ParagraphChild[] = []
        if (index > 0) runs.push(textRun('  ', { size: 18 }))
        runs.push(chipRun(item))
        return runs
      }),
      spacing: { after: 90 },
    })

  const detailLine = (label: string, value: string) =>
    hasText(value)
      ? new Paragraph({
          children: [
            textRun(label, { bold: true, color: MUTED, size: 18 }),
            textRun(paragraphText(value), { color: BODY, size: 20 }),
          ],
          spacing: { after: 50 },
        })
      : null

  const card = (children: (DocxParagraph | DocxTable)[]) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: {
        top: cardBorder,
        bottom: cardBorder,
        left: cardBorder,
        right: cardBorder,
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              shading: { type: ShadingType.CLEAR, fill: 'ffffff' },
              margins: { top: 180, right: 220, bottom: 160, left: 220 },
              verticalAlign: VerticalAlign.CENTER,
              children,
            }),
          ],
        }),
      ],
    })

  const spacer = (height = 90) =>
    new Paragraph({
      children: [],
      spacing: { after: height },
    })

  const contactParagraph = () => {
    const contacts = [
      data.basic.email,
      data.basic.phone,
      data.basic.location,
      data.basic.website,
    ].filter(hasText)

    const children = contacts.flatMap((item, index) => {
      const runs = []

      if (index > 0) {
        runs.push(textRun('  |  ', { color: MUTED, size: 20 }))
      }

      if (/^https?:\/\//i.test(item)) {
        runs.push(
          new ExternalHyperlink({
            link: item,
            children: [
              textRun(item, {
                color: ACCENT,
                size: 20,
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
          }),
        )
      } else {
        runs.push(textRun(item, { color: MUTED, size: 20 }))
      }

      return runs
    })

    if (!children.length) return spacer(0)

    return softParagraph(children, {
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    })
  }

  const experienceSection = () =>
    data.experiences.flatMap((item: ExperienceItem) => [
      card([
        itemTitle(
          item.company || item.position,
          item.position,
          [item.startDate, item.endDate].filter(hasText).join(' - '),
        ),
        ...bulletParagraphs(item.description),
      ]),
      spacer(80),
    ])

  const projectSection = () =>
    data.projects.flatMap((item: ProjectItem) => {
      const dates = [item.startDate, item.endDate].filter(hasText).join(' - ')
      const content = [
        itemTitle(item.name, item.role, dates),
      ]

      const techs = item.techStack
        .split(/[,，、/|]/)
        .map((tag) => tag.trim())
        .filter(Boolean)

      if (techs.length) {
        content.push(chipParagraph(techs))
      }

      if (hasText(item.link)) {
        content.push(
          new Paragraph({
            children: [
              new ExternalHyperlink({
                link: item.link,
                children: [
                  textRun(item.link, {
                    color: ACCENT,
                    size: 20,
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
              }),
            ],
            spacing: { after: 50 },
          }),
        )
      }

      content.push(...bulletParagraphs(item.description))
      return [card(content), spacer(80)]
    })

  const educationSection = () =>
    data.education.flatMap((item: EducationItem) => [
      card([
        itemTitle(
          item.school || item.degree,
          item.degree,
          [item.startDate, item.endDate].filter(hasText).join(' - '),
        ),
        ...bulletParagraphs(item.description),
      ]),
      spacer(80),
    ])

  const skillsSection = () =>
    data.skills.length
      ? [card([chipParagraph(data.skills)]), spacer(80)]
      : []

  const sectionContent: Record<ResumeSectionId, () => FileChild[]> = {
    experience: experienceSection,
    project: projectSection,
    education: educationSection,
    skills: skillsSection,
  }

  const headerChildren = [
    new Paragraph({
      children: [
        textRun(data.basic.fullName || 'resume', {
          bold: true,
          color: '0f172a',
          size: 42,
        }),
      ],
      spacing: { after: 50 },
    }),
  ]

  if (hasText(data.basic.role)) {
    headerChildren.push(
      new Paragraph({
        children: [textRun(data.basic.role, { bold: true, color: ACCENT_DARK, size: 23 })],
        spacing: { after: 90 },
      }),
    )
  }

  const headerDetails = [
    detailLine('邮箱  ', data.basic.email),
    detailLine('电话  ', data.basic.phone),
    detailLine('地点  ', data.basic.location),
    detailLine('网站  ', data.basic.website),
  ].filter(Boolean) as DocxParagraph[]

  const children: FileChild[] = [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      columnWidths: [6200, 2800],
      borders: {
        top: cardBorder,
        bottom: cardBorder,
        left: cardBorder,
        right: cardBorder,
        insideHorizontal: noBorder,
        insideVertical: {
          style: BorderStyle.SINGLE,
          color: 'dbeafe',
          size: 6,
        },
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: SOFT },
              margins: { top: 260, right: 260, bottom: 240, left: 300 },
              children: headerChildren,
            }),
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: 'ffffff' },
              margins: { top: 260, right: 240, bottom: 220, left: 240 },
              verticalAlign: VerticalAlign.CENTER,
              children: headerDetails.length ? headerDetails : [contactParagraph()],
            }),
          ],
        }),
      ],
    }),
    spacer(160),
  ]

  if (hasText(data.basic.summary)) {
    children.push(
      sectionTitle('个人简介'),
      card([
        paragraph(data.basic.summary, {
          spacing: { after: 0, line: 300 },
        }),
      ]),
      spacer(80),
    )
  }

  for (const sectionId of visibleSectionOrder) {
    const content = sectionContent[sectionId]()
    if (!content.length) continue

    children.push(sectionTitle(data.sectionTitles[sectionId]), ...content)
  }

  for (const customSection of visibleCustomSections) {
    if (!hasText(customSection.content)) continue

    children.push(
      sectionTitle(customSection.title || '自定义模块'),
      card(bulletParagraphs(customSection.content)),
      spacer(80),
    )
  }

  const doc = new Document({
    title: data.basic.fullName || 'resume',
    creator: 'cv.lengziyu.cn',
    numbering: {
      config: [
        {
          reference: 'resume-bullets',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 360, hanging: 180 },
                },
                run: {
                  color: '94a3b8',
                },
              },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: FONT,
            color: BODY,
            size: 21,
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 640,
              right: 640,
              bottom: 640,
              left: 640,
            },
            size: {
              width: 11906,
              height: 16838,
            },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, fileName)
}
