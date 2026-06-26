import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const templatePath = path.resolve(
  process.cwd(),
  'src/features/resume-builder/templates/NotionLinearTemplate.tsx',
)

const source = fs.readFileSync(templatePath, 'utf8')

assert(
  source.includes("className=\"relative pl-5 text-sm leading-6 text-slate\""),
  'Expected bullet list items to use relative positioning with left padding.',
)

assert(
  source.includes("className=\"absolute left-0 top-[0.78em] block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-slate/60\""),
  'Expected bullet dots to be anchored to the first text line with absolute positioning.',
)

assert(
  !source.includes('grid-cols-[10px_minmax(0,1fr)]'),
  'Legacy grid-based bullet layout is still present.',
)

assert(!source.includes("className=\"mt-2 block h-1.5 w-1.5 rounded-full bg-slate/60\""), 'Legacy margin-top bullet alignment is still present.')

console.log('bullet layout check passed')
