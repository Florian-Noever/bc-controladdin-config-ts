# BC ControlAddIn Config TS

Shared TypeScript and Rollup configuration for Business Central control add-ins.

Provides:
- A `createRollupConfig` factory that produces a ready-to-use Rollup bundle config (IIFE, TypeScript, CSS injection, image inlining, font inlining)
- A base `tsconfig.json` tuned for BC control add-in projects
- Ambient type declarations for CSS, image, and font imports

## How to use the package

1. Install via `npm install --save-dev @floriannoever/bc-controladdin-config-ts`
2. Add `rollup` as a peer dependency if not already present: `npm install --save-dev rollup`

## Setting up the Rollup config

Create a `rollup.config.js` in the root of your project:

```js
import { readFileSync } from 'node:fs';
import { createRollupConfig } from '@floriannoever/bc-controladdin-config-ts/rollup';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
export default createRollupConfig(pkg);
```

`createRollupConfig` reads the following from your `package.json`:
- **`name`** — used to derive the output file name (`dist/<name>.bundle.js`) and the IIFE global variable name (hyphens replaced with underscores). Scoped package names (e.g. `@scope/my-addin`) have the scope stripped automatically.

The factory always uses `src/index.ts` as the entry point and writes a single IIFE bundle to `dist/`. A `//# sourceURL` footer is appended so DevTools stack traces are clickable.

### Included plugins

| Plugin                        | Effect                                                                 |
| ----------------------------- | ---------------------------------------------------------------------- |
| `@rollup/plugin-node-resolve` | Resolves third-party packages from `node_modules` (browser conditions) |
| `@rollup/plugin-commonjs`     | Converts CommonJS dependencies to ES modules                           |
| `@rollup/plugin-typescript`   | Compiles TypeScript via the project's own `tsconfig.json`              |
| `rollup-plugin-postcss`       | Bundles CSS and injects it via a `<style>` tag at runtime              |
| `@rollup/plugin-image`        | Inlines SVG and raster images as base64 data URIs                      |
| `@rollup/plugin-url`          | Inlines font files (woff, woff2, eot, ttf, otf) as base64 data URIs    |

ESLint directive comments (`// eslint-...` and `/* eslint-... */`) are stripped from the final bundle automatically.

## Setting up the TypeScript config

Create a `tsconfig.json` in the root of your project that extends the shared config:

```json
{
    "extends": "@floriannoever/bc-controladdin-config-ts/tsconfig.json",
    "compilerOptions": {
        "types": ["@floriannoever/bc-controladdin-config-ts"]
    },
    "include": ["src"]
}
```

The `"types"` entry registers the ambient module declarations from this package, which lets TypeScript resolve imports of `.css`, `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.woff`, `.woff2`, `.eot`, `.ttf`, and `.otf` files without errors.

### Base compiler options

The shared `tsconfig.json` sets the following defaults (all can be overridden in your project):

| Option             | Value                                            |
| ------------------ | ------------------------------------------------ |
| `target`           | `esnext`                                         |
| `module`           | `ESNext`                                         |
| `moduleResolution` | `bundler`                                        |
| `lib`              | `dom`, `dom.iterable`, `esnext`                  |
| `strict`           | `true`                                           |
| `isolatedModules`  | `true`                                           |
| `noEmit`           | `true` (type-checking only; Rollup handles emit) |

## Recommended scripts

Add these to your `package.json`:

```json
{
    "scripts": {
        "build": "rollup --config rollup.config.js",
        "type-check": "tsc --noEmit"
    }
}
```
