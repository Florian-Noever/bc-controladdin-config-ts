// CSS — injected as a <style> tag at runtime by rollup-plugin-postcss
declare module '*.css';

// SVG and raster images — inlined as base64 data URIs by @rollup/plugin-image
declare module '*.svg' { const src: string; export default src; }
declare module '*.png' { const src: string; export default src; }
declare module '*.jpg' { const src: string; export default src; }
declare module '*.jpeg' { const src: string; export default src; }
declare module '*.gif' { const src: string; export default src; }

// Fonts — inlined as base64 data URIs by @rollup/plugin-url
declare module '*.woff' { const src: string; export default src; }
declare module '*.woff2' { const src: string; export default src; }
declare module '*.eot' { const src: string; export default src; }
declare module '*.ttf' { const src: string; export default src; }
declare module '*.otf' { const src: string; export default src; }
