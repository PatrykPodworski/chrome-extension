# Copilot Project Instructions

- Use pnpm for all package management tasks.
- Always write JavaScript/TypeScript functions as arrow functions.
- Prefer `type` over `interface` in TypeScript.
- **NEVER** use explicit type annotations when TypeScript can infer the type - this includes React.FC, function returns, and obvious variable types.
- Always place the main function (component, hook, etc.) at the top of the file, with types and supporting code below it.
- Do not use `export default` - always use named exports.
