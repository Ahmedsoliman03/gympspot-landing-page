// Ambient declarations for non-code side-effect imports.
//
// Next's generated types cover CSS Modules (`*.module.css`), but a plain global
// stylesheet imported for its side effects (e.g. `import "../globals.css"` in
// the root layout) has no type declaration, so the editor's TS server reports
// TS2882 ("Cannot find module or type declarations for side-effect import").
// Declaring the wildcard module here makes those imports type-check cleanly.
declare module "*.css";
