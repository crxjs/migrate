import chalk from 'chalk'
import { Command } from 'commander'
import { detect } from 'detect-package-manager'
import { diffLines } from 'diff'
import { readdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { isAbsolute, relative, resolve } from 'path'
import prompts, { PromptObject } from 'prompts'
import { codemod } from './codemod'
import { execa, ExecaError } from 'execa'

function isExecaError(x: unknown): x is ExecaError {
  return x instanceof Error && 'command' in x && 'stdout' in x && 'stderr' in x
}

const check = chalk.green('✔')
const fail = chalk.red('✘')

const program = new Command()
program
  .description(
    'Migrate your Chrome Extension project from RPCE@beta to @crxjs/vite-plugin',
  )
  .name('@crxjs/migrate')
  .option('-f, --file <filename>', 'Vite config filename')
  .option('-d, --dry', 'Dry run')
program.parse(process.argv)

const {
  file = readdirSync(process.cwd()).find((f) => f.startsWith('vite.config')),
  dry = false,
}: {
  file?: string
  dry?: boolean
} = program.opts()
const pm = await detect()

try {
  if (file) {
    const resolved = isAbsolute(file) ? file : resolve(process.cwd(), file)
    const local = relative(process.cwd(), resolved)
    const questions: [
      PromptObject<'applyChanges'>,
      PromptObject<'installCrxjs'>,
      PromptObject<'removeRpce'>,
    ] = [
      {
        name: 'applyChanges',
        type: 'confirm',
        initial: true,
        message: `Apply these changes to ${chalk.cyan(local)}`,
      },
      {
        name: 'installCrxjs',
        type: 'confirm',
        initial: true,
        message: `Install ${chalk.cyan(
          '@crxjs/vite-plugin',
        )} using ${chalk.cyan(pm)}`,
      },
      {
        name: 'removeRpce',
        type: 'confirm',
        initial: true,
        message: `Remove ${chalk.cyan('rollup-plugin-chrome-extension')}`,
      },
    ]

    const code = await readFile(resolved, { encoding: 'utf-8' })
    const modded = codemod({ code, isTypeScript: file.endsWith('.ts') })
    const hasDiff = code !== modded
    if (hasDiff) {
      const diff = diffLines(code, modded)
      let output = ''
      diff.forEach((part) => {
        // grey for common parts
        let color = chalk.grey
        // green for additions
        if (part.added) color = chalk.green
        // red for deletions
        else if (part.removed) color = chalk.red

        output += color(part.value)
      })
      console.log('---------')
      console.log(output)
      console.log('---------')
    } else {
      const message = chalk.bold(`No changes to apply to ${chalk.cyan(local)}`)
      console.log(`${fail} ${message}`)
      questions.shift()
    }

    let aborted = dry
    const {
      applyChanges,
      installCrxjs,
      removeRpce,
    }: {
      applyChanges?: boolean
      installCrxjs?: boolean
      removeRpce?: boolean
    } = await prompts(questions, {
      onCancel() {
        aborted = true
      },
    })

    if (aborted) {
      console.log(`${fail} ${chalk.bold('No changes made.')}`)
    } else {
      if (applyChanges) {
        await writeFile(resolved, modded)
        console.log(`${check} ${chalk.bold(`Updated ${chalk.cyan(local)}`)}`)
      }
      if (installCrxjs) {
        const subprocess = execa(pm, [
          pm === 'yarn' ? 'add' : 'install',
          pm === 'yarn' ? '--dev' : '--save-dev',
          '@crxjs/vite-plugin@latest',
        ])
        subprocess.stdout?.pipe(process.stdout)
        await subprocess
        console.log(
          `${check} ${chalk.bold(
            `Installed ${chalk.cyan('@crxjs/vite-plugin')}`,
          )}`,
        )
      }
      if (removeRpce) {
        const subprocess = execa(pm, [
          'remove',
          'rollup-plugin-chrome-extension',
        ])
        subprocess.stdout?.pipe(process.stdout)
        await subprocess
        console.log(
          `${check} ${chalk.bold(
            `Removed ${chalk.cyan('rollup-plugin-chrome-extension')}`,
          )}`,
        )
      }
      console.log(
        `${check} ${chalk.bold(
          `Project migrated to ${chalk.cyan('@crxjs/vite-plugin')} 🎉`,
        )}`,
      )
    }
  } else {
    console.log(
      `${fail} ${chalk.bold(
        `Unable to find ${chalk.cyan('vite.config.js')} or ${chalk.cyan(
          'vite.config.ts',
        )}`,
      )}`,
    )
    console.log(`You can specify a config file using the "--file" flag:`)
    console.log(chalk.cyan(`npx @crxjs/migrate --file <vite config>`))
  }
} catch (error) {
  if (isExecaError(error)) {
    console.error(error.stderr)
  } else {
    console.error(error)
  }
}
