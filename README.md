# Migrate from RPCE to `@crxjs/vite-plugin`

RPCE is moving Vite support to a new NPM package. Thanks for joining us on the journey!

Migrate your Chrome Extension project from RPCE to `@crxjs/vite-plugin` using
this codemod:

```sh
npx @crxjs/migrate
```

You can specify the Vite config filename with the `--file` flag:

```sh
npx @crxjs/migrate --file vite.config.js
```
