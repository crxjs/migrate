# Migrate from RPCE to `@crxjs/vite-plugin`

RPCE has moved Vite support to a new NPM package. Thanks for joining us on the journey!

Migrate your Chrome Extension project from RPCE to `@crxjs/vite-plugin` using
this codemod script:

```sh
npx @crxjs/migrate
```

## What it does

This script will detect your package manager (npm, pnpm, or yarn) and ask permission to perform one or more of these actions:

1. Update your Vite config file
2. Install `@crxjs/vite-plugin`
3. Remove `rollup-plugin-chrome-extension`

## Options

You can specify the Vite config filename with the `--file` flag:

```sh
npx @crxjs/migrate --file vite.config.js
```
