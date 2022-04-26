import { readFileSync } from 'fs'
import { parse, print } from 'recast'
import * as tsParser from 'recast/parsers/typescript'

export function codemod({ config }: { config: string }): string {
  const code = readFileSync(config, { encoding: 'utf-8' })
  const ast = config.endsWith('ts')
    ? parse(code, { parser: tsParser })
    : parse(code)

  // TODO: rename rpce import
  // TODO: rename plugin function import
  // TODO: rename plugin function call

  const result = print(ast)
  return result.code
}
