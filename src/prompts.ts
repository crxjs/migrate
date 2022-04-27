import chalk from 'chalk'
import { detect } from 'detect-package-manager'
import { diffChars } from 'diff'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import prompts from 'prompts'

export interface Answers {
  config: string
  installCrxjs: boolean
  packageManager: 'npm' | 'yarn' | 'pnpm'
  removeRpce: boolean
  updateConfig: boolean
}

export async function questions({
  config,
}: {
  config: string
}): Promise<Answers> {
  const local = resolve(config, process.cwd())
  const pm = await detect()

  const { installCrxjs } = await prompts([
    {
      name: 'installCrxjs',
      type: 'confirm',
      initial: true,
      message: `Migrate ${local} to @crxjs/vite-plugin?`,
    },
  ])

  if (!installCrxjs)
    return {
      config,
      installCrxjs: false,
      packageManager: pm,
      removeRpce: false,
      updateConfig: false,
    }

  const answers = await prompts([
    {
      name: 'removeRpce',
      type: 'confirm',
      initial: true,
      message: 'Remove rollup-plugin-chrome-extension?',
    },
    {
      name: 'updateConfig',
      type: 'confirm',
      initial: true,
      message: `Update imports in "${local}"?`,
    },
    {
      name: 'correctPM',
      type: 'confirm',
      initial: true,
      message: `Use ${pm}?`,
    },
  ])

  const { packageManager } = answers.correctPM
    ? { packageManager: pm }
    : await prompts({
        name: 'packageManager',
        type: 'select',
        message: 'Choose a package manager',
        choices: [
          { title: 'npm', value: 'npm' },
          { title: 'pnpm', value: 'pnpm' },
          { title: 'yarn', value: 'yarn' },
        ],
      })

  return { ...answers, config, packageManager, installCrxjs }
}

export async function update({
  code,
  result,
  config,
  write,
}: Answers & {
  code: string
  result: string
  write?: boolean
}) {
  const diff = diffChars(code, result)
  let output = ''
  diff.forEach((part) => {
    // green for additions, red for deletions
    // grey for common parts
    const color = part.added
      ? chalk.green
      : part.removed
      ? chalk.red
      : chalk.grey
    output += color(part.value)
  })
  console.log(output)

  const local = resolve(config, process.cwd())
  const answers =
    typeof write === 'boolean'
      ? { write }
      : await prompts({
          name: 'write',
          type: 'confirm',
          message: `Apply these changes to "${local}"?`,
        })

  if (answers.write) {
    writeFileSync(config, result, { encoding: 'utf8' })
    console.log(`Updated "${local}"`)
  } else {
    console.log('Aborted codemod and install.')
  }
}
