import { parse, print } from 'recast'
import { visit, builders, namedTypes } from 'ast-types'
import * as tsParser from 'recast/parsers/typescript'

export function codemod({
  code,
  isTypeScript,
}: {
  code: string
  isTypeScript: boolean
}): string {
  let quote: 'single' | 'auto' = 'auto'
  const ast = isTypeScript ? parse(code, { parser: tsParser }) : parse(code)
  visit(ast, {
    visitImportDeclaration(path) {
      if (
        namedTypes.ImportDeclaration.check(path.value) &&
        namedTypes.Literal.check(path.value.source) &&
        path.value.source.value === 'rollup-plugin-chrome-extension' &&
        Array.isArray(path.value.specifiers)
      ) {
        /* ----------------- SET QUOTE TYPE ---------------- */

        // @ts-expect-error Literal type is incomplete
        const raw = path.value.source.extra?.raw ?? path.value.source.raw
        if (typeof raw === 'string' && raw.startsWith("'")) quote = 'single'

        /* --------------- UPDATE MODULE NAME -------------- */

        path.value.source = builders.stringLiteral('@crxjs/vite-plugin')

        /* ------------ UPDATE IMPORT SPECIFIER ------------ */

        const index = path.value.specifiers.findIndex(
          (s) =>
            namedTypes.ImportSpecifier.check(s) &&
            namedTypes.Identifier.check(s.imported) &&
            s.imported.name === 'chromeExtension',
        )
        const rpceSpecifier = path.value.specifiers[index]
        path.value.specifiers[index] = builders.importSpecifier(
          builders.identifier('crx'),
        )

        /* ---------- UPDATE FUNCTION CALLEE NAME ---------- */

        if (rpceSpecifier.local?.name === 'chromeExtension')
          visit(ast, {
            visitCallExpression(path) {
              if (
                namedTypes.CallExpression.check(path.value) &&
                namedTypes.Identifier.check(path.value.callee) &&
                path.value.callee.name === 'chromeExtension'
              ) {
                path.value.callee = builders.identifier('crx')
              }

              this.traverse(path)
            },
          })

        this.traverse(path)
      }

      return false
    },
  })

  const result = print(ast, { quote })
  return result.code
}
