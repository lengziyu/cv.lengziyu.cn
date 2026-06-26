import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const templatePath = path.resolve(
  process.cwd(),
  'src/features/resume-builder/templates/NotionLinearTemplate.tsx',
)

const source = fs.readFileSync(templatePath, 'utf8')

assert(
  source.includes("className=\"m-0 list-outside list-disc space-y-2 pl-5 marker:text-slate/60\""),
  'Expected bullet lists to use native outside disc markers.',
)

assert(
  source.includes("className=\"pl-2 text-sm leading-6 text-slate\""),
  'Expected list items to keep text spacing on the native marker.',
)

assert(
  !source.includes('grid-cols-[10px_minmax(0,1fr)]'),
  'Legacy grid-based bullet layout is still present.',
)

assert(
  !source.includes('rounded-full bg-slate/60'),
  'Manual bullet dot rendering is still present.',
)

console.log('bullet layout check passed')
