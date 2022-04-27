import { program } from 'commander'
import { isAbsolute, resolve } from 'path'
import { readFileSync } from 'fs'
import { codemod } from './codemod'
import { questions, update } from './prompts'

program
  .description(
    'Migrate your Chrome Extension project from RPCE@beta to @crxjs/vite-plugin',
  )
  .name('@crxjs/migrate')
  .option('-c, --config <filename>', 'Vite config filename')
  .option('-w, --write', 'Update Vite config')

const options: { config: string } = program.opts()
if (!isAbsolute(options.config))
  options.config = resolve(process.cwd(), options.config)

const answers = await questions(options)
const code = readFileSync(options.config, { encoding: 'utf-8' })
const result = codemod({ code, isTypeScript: options.config.endsWith('ts') })
update({ code, result, ...answers })
