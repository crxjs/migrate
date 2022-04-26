#!/usr/bin/env node

import cli from 'commander'
import main from '../dist/main'

cli.description(
  'Migrate your Chrome Extension project from RPCE@beta to @crxjs/vite-plugin',
)
cli.name('@crxjs/migrate')

const program = new cli.Command()
program.option('-c, --config <filename>', 'Vite config filename')

main(program.opts())
