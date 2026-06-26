import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const templatePath = path.resolve(
  process.cwd(),
  'src/features/resume-builder/templates/NotionLinearTemplate.tsx',
)

const source = fs.readFileSync(templatePath, 'utf8')

assert(
  source.includes("className=\"space-y-2\""),
  'Expected multiline descriptions to render as plain stacked paragraphs.',
)

assert(
  source.includes("className=\"text-sm leading-6 text-slate\""),
  'Expected multiline description paragraphs to keep the resume body typography.',
)

assert(
  !source.includes('grid-cols-[10px_minmax(0,1fr)]'),
  'Legacy grid-based bullet layout is still present.',
)

assert(
  !source.includes('list-disc'),
  'Native bullet list rendering is still present.',
)

assert(
  !source.includes('<li'),
  'List item rendering is still present.',
)

assert(
  !source.includes('rounded-full bg-slate/60'),
  'Manual bullet dot rendering is still present.',
)

console.log('plain multiline layout check passed')
