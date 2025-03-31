# CLAUDE.md - Working with this Angular project

## Build Commands
- `npm start` - Run development server (http://localhost:4200)
- `npm run build` - Build production-ready application
- `npm test` - Run all tests
- `ng test --include=**/some-component.spec.ts` - Run single test file
- `npm run watch` - Watch for changes during development
- `npm run serve:ssr:contentful-product-catalog-angular` - Run server-side rendering

## Code Style Guidelines
- **TypeScript**: Use strict mode with all strictness flags enabled
- **Components**: Standalone components with separate HTML/SCSS/TS files
- **CSS**: Use Tailwind utility classes for styling instead of custom CSS
- **Imports**: Group by Angular core, third-party, then application imports
- **Naming**:
  - Components/Services: PascalCase (ProductListComponent)
  - Class members: camelCase
  - Private members: _prefixPrefix (_contentfulService)
  - Component selectors: kebab-case with app- prefix (app-product-list)
- **Error Handling**: Use Promise catch blocks or RxJS error operators
- **Types**: Always define precise types; avoid `any` when possible
- **Comments**: Use // for inline comments and /** */ for documentation

## Tailwind CSS
- Use utility classes instead of custom CSS wherever possible
- For responsive design, use Tailwind's responsive prefixes (sm:, md:, lg:, etc.)
- For component styling, use the appropriate Tailwind classes directly in the HTML
- Tailwind config is in `tailwind.config.js`