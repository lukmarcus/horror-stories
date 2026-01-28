# Refactoring Proposals

This document tracks proposed refactoring improvements identified during v0.0.6 code review. Changes are organized by priority and can be implemented incrementally.

## Priority 1: CRITICAL (High Impact, 30-40 min)

### 1.1 Remove Duplicate Context Folder

**Issue:** Two folders exist: `src/context/` and `src/contexts/`

- `src/context/` appears to be empty or obsolete (from deleted GameSetupContext)
- `src/contexts/` contains nothing currently (GameSetupProvider was deleted in v0.0.3)
- Both are unused after v0.0.3 refactor

**Action Items:**

- [ ] Check if `src/context/` is empty
- [ ] Check if `src/contexts/` is empty
- [ ] Delete both folders
- [ ] Verify no imports reference these folders
- [ ] Run tests: `npm test -- --run`

**Affected Files:** None (both folders already unused)

---

### 1.2 Consolidate Type Definitions

**Issue:** Type definitions scattered across files

- `src/types/index.ts` exists but may be outdated
- Current interfaces defined inline in `src/pages/Game.tsx` (Scenario, Paragraph, Choice, DiceResult, etc.)
- Test files reference duplicated types

**Action Items:**

- [ ] Audit `src/types/index.ts` - compare with Game.tsx interfaces
- [ ] Create consolidated `src/types/index.ts` with:
  - `Scenario` interface (id, title, description, playerCount, duration)
  - `Choice` interface (id, text, nextParagraphId, isConditional, yesText, noText, yesNextId, noNextId)
  - `DiceResult` interface (threshold, successText, failText, successNextId, failNextId)
  - `Paragraph` interface (id, text, choices[], hasDiceRoll, diceRollDescription, diceResult, isDirect, accessibleFrom)
- [ ] Update `src/pages/Game.tsx` to import from `src/types/index.ts`
- [ ] Update test files to import from `src/types/index.ts`
- [ ] Run tests: `npm test -- --run`

**Files to Update:**

- `src/types/index.ts` (create/update)
- `src/pages/Game.tsx` (remove inline types, add import)
- `src/pages/Game.test.tsx` (update imports)

---

### 1.3 Extract Hardcoded Data to Data File

**Issue:** All game data hardcoded in `src/pages/Game.tsx` (437 lines)

- 3 scenarios hardcoded
- 11 paragraphs with full content hardcoded
- Makes Game.tsx too long and couples presentation with data
- Makes testing data logic difficult

**Action Items:**

- [x] Create `src/data/scenarios.ts` with:
  - [x] `SCENARIOS: Scenario[]` - array of 3 scenarios
  - [x] `PARAGRAPHS: Paragraph[]` - array of 11 paragraphs
  - [x] Export both as constants
- [x] Update `src/pages/Game.tsx` to import data:
  - [x] `import { SCENARIOS, PARAGRAPHS } from '../data/scenarios'`
  - [x] Replace hardcoded arrays with imported constants
- [x] Reduce Game.tsx from 479 to 150 lines
- [x] Run tests: `npm test -- --run` - 38 passing

**Files to Update:**

- [x] `src/data/scenarios.ts` (create)
- [x] `src/pages/Game.tsx` (import and use data)

---

## Priority 2: MEDIUM (Good to Have, 20-30 min)

### 2.1 Create Game Logic Utilities

**Issue:** Game logic scattered in Game.tsx component

- Accessibility checking logic inline
- Dice validation inline
- Choice branching logic inline

**Action Items:**

- [ ] Create `src/utils/gameLogic.ts` with:
  - `checkAccessibility(paragraphId: string, paragraph: Paragraph): { isAccessible: boolean, warningMessage?: string }`
  - `validateParagraphTransition(fromId: string, toId: string, paragraphs: Paragraph[]): boolean`
  - `resolveDiceOutcome(diceResult: number, paragraph: Paragraph): string` (returns next paragraph ID)
- [ ] Move accessibility warning logic to utility function
- [ ] Update `src/pages/Game.tsx` to use utility functions
- [ ] Add tests for gameLogic.ts functions
- [ ] Run tests: `npm test -- --run`

**Files to Update:**

- `src/utils/gameLogic.ts` (create)
- `src/pages/Game.tsx` (import and use utilities)
- `src/utils/gameLogic.test.ts` (create, add 3-5 tests)

---

### 2.2 Update README.md

**Issue:** README references deleted features and pages

- References `ScenarioSetup.tsx` (deleted in v0.0.3)
- May reference difficulty levels (removed in v0.0.3)
- Architecture section outdated

**Action Items:**

- [ ] Review README.md for outdated references
- [ ] Remove ScenarioSetup mentions
- [ ] Update architecture section to reflect current dual-mode Game screen
- [ ] Add section on game data structure (types, scenarios)
- [ ] Verify all feature descriptions are current as of v0.0.6

**Files to Update:**

- `README.md` (update)

---

### 2.3 Consolidate CSS Organization

**Current Structure:**

- ✅ `src/styles/variables.css` - CSS custom properties (colors, spacing, typography) - **GOOD**
- ✅ `src/styles/global.css` - Global styles + resets - **GOOD**
- `src/index.css` - Duplicate global styles (redundant with global.css)
- Page-level CSS: `src/pages/Game.css` (348 lines), Home.css, About.css, Instructions.css, ScenariosList.css
- Component CSS: `src/components/common/*.css` (Button, Header, Footer), DiceRoller.css, ConditionalChoice.css
- `src/components/ParagraphText/ParagraphText.module.css` (CSS Module - good practice)

**Issues:**

- `src/index.css` duplicates styles from `src/styles/global.css` - pick one
- Page-level CSS could benefit from being in `src/styles/pages/` subfolder
- Component CSS is currently colocated (good), but could have organizational guide

**Recommended Action:**

- [ ] Delete or empty `src/index.css` - use only `src/styles/global.css`
- [ ] Update `src/main.tsx` to import `src/styles/global.css` instead of `src/index.css`
- [ ] Create `src/styles/pages/` subfolder and move page-level CSS there
  - `src/styles/pages/game.css` (move from src/pages/Game.css)
  - `src/styles/pages/home.css` (move from src/pages/Home.css)
  - etc.
- [ ] Update import statements in page components
- [ ] Keep component CSS colocated (current structure is good)

**Benefits:**

- Single source of truth for global styles
- Better organization of styles by layer (variables → global → pages → components)
- Easier to maintain design system
- Follows design system best practices

**Recommendation:** **ADD TO PRIORITY 2** - moderate effort (10 min), good organizational benefit

---

## Priority 3: SMALL (Nice to Have, Can Defer)

### 3.1 Reorganize Tests to Separate `/tests` Directory

**Current Structure:**

- Tests colocated with source files (`.test.ts` / `.test.tsx` next to implementation)
- 6 test files total:
  - `src/pages/Game.test.tsx`
  - `src/components/DiceRoller/DiceRoller.test.ts`
  - `src/components/ConditionalChoice/ConditionalChoice.test.ts`
  - `src/components/ParagraphText/ParagraphText.test.tsx`
  - `src/utils/paragraphParser.test.ts`
  - `src/utils/paragraphAccessibility.test.ts`

**Pros of Current Approach:**

- ✅ Tests live next to code (easy to navigate)
- ✅ Clear which component/file is tested
- ✅ Vitest finds them automatically

**Pros of Separate `/tests` Directory:**

- Cleaner `src/` directory (production code separate from test code)
- Easier to exclude tests from build output
- Centralized test configuration
- Better for monorepo structures

**Recommendation:** **DEFER to v0.1.0** - Current colocated approach is industry standard for component-based architectures and actually preferred by most React teams. Separate `/tests/` folder makes sense for backend APIs but adds friction here. Only consider if project grows significantly.

**If implementing anyway:**

```
/tests
├── pages/
│   └── Game.test.tsx
├── components/
│   ├── DiceRoller.test.ts
│   ├── ConditionalChoice.test.ts
│   └── ParagraphText.test.tsx
└── utils/
    ├── paragraphParser.test.ts
    └── paragraphAccessibility.test.ts
```

Update `vitest.config.ts` to search `/tests` directory instead.

---

**Issue:** Some utility functions have good coverage, but edge cases missing

- Current: 38 tests passing
- Target: 50+ tests for v0.1.0

**Action Items (defer to v0.1.0):**

- [ ] Add tests for gameLogic.ts utility functions
- [ ] Add edge case tests for paragraph parser
- [ ] Add integration tests for scenario loading

---

### 3.2 Extract Component Props to Separate Type Files

**Issue:** Component prop interfaces mixed with domain types

- Could create `src/types/components.ts` for ButtonProps, GameProps, etc.

**Recommendation:** Defer to v0.1.0 - current inline props are readable and not problematic.

---

### 3.3 Type-Safe Game State Management

**Issue:** Game state uses multiple useState calls (8+ state variables)

- Could consolidate to useReducer for complex state
- Could create custom hook `useGameState`

**Recommendation:** Defer to v0.1.0 - current state management is understandable for current complexity.

---

## Implementation Checklist

### Critical Path (Recommended Order)

**PRIORITY 1 (40 min total):**

1. ✅ **Step 1:** Remove duplicate context folders (5 min)
   - ✅ Delete `src/context/` and `src/contexts/`
   - ✅ Run tests - 38 passing

2. ✅ **Step 2:** Consolidate types (10 min)
   - ✅ Create `src/types/index.ts` with all interfaces (Paragraph, Choice, DiceResult, Scenario, GameState)
   - ✅ Update Game.tsx imports (use type-only imports for TypeScript strict mode)
   - ✅ Add missing `id` property to Scenario interface
   - ✅ Update validation.ts to work with new Scenario structure
   - ✅ Run tests - 38 passing

3. **Step 3:** Extract data (10 min)
   - Create `src/data/scenarios.ts`
   - Move hardcoded data
   - Update Game.tsx imports
   - Run tests

4. **Step 4:** Create game logic utilities (10 min)
   - Create `src/utils/gameLogic.ts`
   - Extract accessibility logic
   - Add tests
   - Update Game.tsx
   - Run tests

**PRIORITY 2 (15 min total):** 5. **Step 5:** Reorganize CSS (10 min)

- Delete/empty `src/index.css`
- Update `src/main.tsx` import
- Create `src/styles/pages/` folder
- Move page-level CSS files
- Update page component imports
- Run tests

6. **Step 6:** Update documentation (5 min)
   - Update README.md
   - Final commit

---

## Benefits Summary

| Change                   | Benefits                                           |
| ------------------------ | -------------------------------------------------- |
| Remove duplicate folders | Cleaner structure, less confusion                  |
| Consolidate types        | Single source of truth, easier maintenance         |
| Extract data             | Separates concerns, game logic testable without UI |
| Game logic utilities     | Reusable functions, easier testing                 |
| Reorganize CSS           | Design system clarity, better maintainability      |
| Update README            | Documentation accurate, onboarding easier          |

---

## Expected Outcomes

After completing Priority 1 + 2:

- ✅ Cleaner project structure
- ✅ Better separation of concerns (data, logic, presentation, styles)
- ✅ Easier to test game mechanics independently
- ✅ Design system more organized and maintainable
- ✅ More scalable codebase ready for v0.0.7+

**Estimated Total Time:** 55 minutes (Priority 1: 40 min + Priority 2: 15 min)  
**Test Impact:** All 38+ tests should continue passing  
**Breaking Changes:** None (refactoring only)
**Defer to v0.1.0:** CSS consolidation into modules, separate /tests directory, increased test coverage
