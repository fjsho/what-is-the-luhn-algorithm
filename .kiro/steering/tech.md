# Technical Guidelines

## Technology Stack

### Core Technologies
- **Language**: TypeScript (compiles to JavaScript for browser execution)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Runtime**: Browser (client-side only, no server)

### File Structure
```
/
├── src/
│   ├── main.ts          # Entry point
│   ├── luhn.ts          # Luhn algorithm logic
│   └── validator.ts     # Validation UI logic
├── index.html           # Single page HTML
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## TypeScript Configuration

### Compiler Options
- **Target**: ES2020+ for modern browser features
- **Module**: ESNext (Vite handles module resolution)
- **Type Checking**: Basic strictness
  - `noImplicitAny: true` - Require explicit types for unknowns
  - `strictNullChecks: false` - Allow null/undefined flexibility for learning
  - `strict: false` - Keep complexity manageable for small project

### Type Definition Strategy
```typescript
// Define clear types for domain logic
type ValidationResult = {
  isValid: boolean;
  message: string;
};

// Use explicit parameter types
function validateLuhn(input: string): ValidationResult {
  // Implementation
}

// Avoid 'any' in core logic, acceptable in DOM manipulation for simplicity
```

## Build & Development

### Vite Configuration
- **Dev Server**: Hot module reload for fast iteration
- **Build Output**: Static files (`dist/`) ready for deployment
- **TypeScript**: Handled via `vite-plugin-ts` (no separate tsc needed)

### Development Workflow
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Styling Guidelines

### Tailwind CSS Approach
- **Utility-first**: Use Tailwind classes directly in HTML/JSX
- **Custom Classes**: Minimal custom CSS, leverage Tailwind configuration
- **Responsive Design**: Use Tailwind breakpoints (sm:, md:, lg:)

### Floating Form Pattern
```html
<!-- Fixed positioning with Tailwind -->
<div class="fixed top-4 right-4 bg-white shadow-lg p-6 rounded-lg">
  <!-- Validator form -->
</div>
```

## Code Organization

### Separation of Concerns
- **`luhn.ts`**: Pure algorithm logic (no DOM dependencies)
  - Export functions for calculation steps
  - Fully typed input/output

- **`validator.ts`**: UI interaction logic
  - DOM event handlers
  - Real-time validation trigger
  - Result display updates

- **`main.ts`**: Application initialization
  - DOM ready setup
  - Wire validator to form inputs

### Example: Pure Function Pattern
```typescript
// luhn.ts - Pure logic, easily testable
export function calculateLuhnChecksum(digits: number[]): number {
  // Implementation
}

export function isValidLuhn(input: string): boolean {
  // Implementation
}

// validator.ts - UI integration
import { isValidLuhn } from './luhn';

export function setupValidator(inputElement: HTMLInputElement) {
  inputElement.addEventListener('input', (e) => {
    const result = isValidLuhn(e.target.value);
    updateUI(result);
  });
}
```

## Static Site Requirements

### No Server Communication
- All logic runs in browser
- No fetch/axios calls
- No backend API dependencies
- Pure static file deployment (can use GitHub Pages, Netlify, etc.)

### Single Page Application
- One `index.html` with all content
- No client-side routing needed
- JavaScript enhances static content

## Performance Considerations

### Bundle Size
- Keep dependencies minimal (Tailwind CSS only external dependency)
- Vite tree-shaking handles unused code removal
- Target < 100KB total bundle size

### Real-time Validation
- Debounce input events if needed for complex validation
- Use `input` event for immediate feedback
- Avoid heavy computation on each keystroke

## Browser Compatibility

### Target Browsers
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features assumed
- No IE11 support needed

### Graceful Degradation
- Ensure content readable without JavaScript
- Progressive enhancement for validation features

## Error Handling

### Input Validation
```typescript
function validateInput(value: string): string | null {
  if (!value) return "入力値が空です";
  if (!/^\d+$/.test(value)) return "数値のみを入力してください";
  return null; // Valid
}
```

### Type Safety for Errors
- Use union types for error states: `Result<T, E>`
- Avoid throwing exceptions for expected validation failures
- Return error objects for UI display

## Development Best Practices

### Type-First Development
1. Define types for data structures first
2. Implement logic with type constraints
3. Let TypeScript guide implementation

### Code Style
- **Naming**: camelCase for variables/functions, PascalCase for types
- **Exports**: Named exports preferred over default exports
- **Comments**: JSDoc for public API functions

### Testing Strategy
- Manual testing in browser during development
- Consider Vitest for unit tests if project grows
- Focus on pure `luhn.ts` logic for test coverage

## Deployment

### Build Output
```
dist/
├── index.html
├── assets/
│   ├── main.[hash].js
│   └── main.[hash].css
```

### Deployment Targets
- GitHub Pages
- Netlify
- Vercel
- Any static file hosting

No server configuration needed.
