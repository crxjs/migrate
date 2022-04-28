# Migrate from RPCE to `@crxjs/vite-plugin`

RPCE is moving Vite support to a new NPM package. Thanks for joining us on the journey!

Migrate your Chrome Extension project from RPCE to `@crxjs/vite-plugin` using
this codemod:

```sh
npx @crxjs/migrate
```

## What it does

The codemod with detect your package manager (npm, pnpm, or yarn) and ask to perform one or more of these actions:

1. Install `@crxjs/vite-plugin`
2. Remove `rollup-plugin-chrome-extension`
3. Update your Vite config file

## Options

You can specify the Vite config filename with the `--file` flag:

```sh
npx @crxjs/migrate --file vite.config.js
```
