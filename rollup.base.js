import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import url from '@rollup/plugin-url';

/**
 * Creates a Rollup configuration for a Business Central control add-in.
 *
 * Defaults:
 * - Entry:  `src/index.ts`
 * - Output: `dist/<pkg.name>.bundle.js` as an IIFE, named after the package
 * - Plugins: node-resolve (browser), commonjs, image, url (fonts), typescript, postcss (inject)
 * - Strips ESLint directive comments from the final bundle
 * - Appends `//# sourceURL=<pkg.name>.js` so DevTools stack traces are clickable
 *
 * @param {object} pkg - The parsed package.json of the consumer project.
 * @returns {import('rollup').RollupOptions}
 */
export function createRollupConfig(pkg) {
    const baseName = pkg.name.replace(/^@[^/]+\//, '');
    const libName = baseName.replace(/-/g, '_');

    return {
        input: 'src/index.ts',

        output: {
            file: `dist/${baseName}.bundle.js`,
            format: 'iife',
            name: libName,
            // Gives the bundle a virtual name in DevTools so stack trace links are clickable.
            footer: `//# sourceURL=${pkg.name}.js`,
        },

        plugins: [
            // Resolve third-party packages from node_modules using browser conditions.
            resolve({ browser: true }),

            // Convert any CommonJS dependencies to ES modules.
            commonjs(),

            // Inline SVG and raster images as base64 data URIs.
            image(),

            // Inline font files as base64 data URIs.
            url({
                include: ['**/*.woff', '**/*.woff2', '**/*.eot', '**/*.ttf', '**/*.otf'],
            }),

            // Compile TypeScript. Type-checking is handled separately via `npm run type-check`.
            typescript({ tsconfig: './tsconfig.json' }),

            // Bundle the CSS and inject it into the page via a <style> tag at runtime.
            postcss({ inject: true }),

            // Strip ESLint directive comments from the final bundle.
            {
                name: 'strip-eslint-comments',
                renderChunk(code) {
                    const result = code
                        .replace(/\/\*\s*eslint-[\s\S]*?\*\//g, '')    // /* eslint-... */
                        .replace(/^\s*\/\/\s*eslint-.*$/gm, '');       // // eslint-...
                    return { code: result, map: null };
                },
            },
        ],
    };
}
