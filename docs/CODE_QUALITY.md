# Code Quality Guidelines - Horror Stories

Wytyczne dla utrzymania wysokiej jakości kodu w projekcie.

## Quick Reference

| Area           | Standard                                         |
| -------------- | ------------------------------------------------ |
| **Export**     | `export const` (nie `export default`)            |
| **Imports**    | Barrel exports via `index.ts`                    |
| **TypeScript** | Strict mode, no `any`, wszystko typowane         |
| **Components** | PascalCase, props interface, style colocated     |
| **Tests**      | `*.test.tsx` obok kodu, 151+ testów (v0.1.0)    |
| **CSS**        | BEM naming, global + component-scoped            |
| **Commits**    | Conventional: `feat:/fix:/refactor:/test:/docs:` |

## Principles

### Type Safety

```typescript
// ✅ DOBRY STYL
export interface ButtonProps {
  variant: "primary" | "secondary";
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, onClick }) => (
  <button className={`btn btn--${variant}`} onClick={onClick}>Click</button>
);

// ❌ ZŁY STYL
const Button: React.FC<any> = (props: any) => <button {...props}>Click</button>;
```

Use `type` imports:

```typescript
import type { Paragraph, Choice } from "../types";
```

### Export Consistency

```typescript
// ✅ Components & pages
export const Home: React.FC = () => {};

// ✅ Modules - barrel exports
export { useGame } from "./useGame";
export { parseParagraphText } from "./paragraphParser";

// ❌ Avoid
export default Home;
```

### Project Structure

```
src/
├── types/          # Type definitions only
├── utils/          # Business logic (pure functions)
├── hooks/          # State management & effects
├── components/     # React components + Component.css
├── pages/          # Route pages
├── scenarios/      # Scenario data
└── styles/         # Global CSS, variables, pages/
```

### Testing

**Structure:** `Component.test.tsx` next to code

**Coverage:**

- Happy path (normalne działanie)
- Edge cases (przypadki graniczne)
- Error handling (obsługa błędów)

**Current:** 167 passing tests ✅

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for patterns.

### CSS & Styling

**Organization:**

- `src/styles/global.css` - Reset, base styles
- `src/styles/variables.css` - CSS variables (colors, spacing)
- `src/styles/pages/` - Page-specific CSS
- `Component.css` - Component styles (colocated)

**BEM:**

```css
.button {
} /* Block */
.button__text {
} /* Element */
.button--primary {
} /* Modifier */
.button.is-active {
} /* State */
```

### Git Commits

Use **Conventional Commits:**

```bash
feat:     # New feature
fix:      # Bug fix
refactor: # Code reorganization
test:     # Tests
docs:     # Documentation
chore:    # Build, config, dependencies
```

Examples:

```bash
git commit -m "feat: add variant system with reset display"
git commit -m "fix: resolve React key collision"
git commit -m "refactor: extract paragraph parser"
```

### Dead Code

Remove regularly:

- Placeholder components
- Unused variables/functions
- Commented-out code
- Old versions

### Performance

```typescript
// Memoize expensive computations
const processed = useMemo(
  () => parseText(paragraph),
  [paragraph]
);

// Memoize components
export const Display = React.memo(({ paragraph }: Props) => (
  <div>{paragraph.text}</div>
));
```

### Error Handling

```typescript
// ✅ Always handle errors
try {
  const para = await loadParagraph(id);
} catch (error) {
  console.error("Load failed:", error);
  // Handle gracefully
}
```

### Accessibility (a11y)

- Buttons have labels (`aria-label`)
- Keyboard navigation support
- Alt text for images
- Contrast ≥ 4.5:1
- Semantic HTML

### Documentation

- JSDoc for public functions
- Comments explain WHY (not WHAT)
- Keep in sync with code

---

## Resources

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Test patterns & best practices
- **[SCENARIO_SCHEMA.md](SCENARIO_SCHEMA.md)** - JSON paragraph format

---

**Last Updated:** 2026-03-04 | v0.0.12
