# v0.1.0 Refactoring Plan - Implementation Queue

## Priority Ranking & Implementation Batches

### 🔴 CRITICAL (Phase 1: Do Immediately)

| # | Task | Score | Time | Status |
|---|------|-------|------|--------|
| **1** | Error Boundary | 8/10 | 30min | ⏳ **BATCH 1** |
| **2** | useGame Hook | 8/10 | 45min | ⏳ **BATCH 1** |
| **3** | ParagraphDisplay Component | 7/10 | 40min | ⏳ **BATCH 1** |
| **4** | Integration Tests | 8/10 | 60min | BATCH 2 |
| **5** | Schema Validation | 7/10 | 40min | BATCH 2 |

### 🟠 HIGH (Phase 2: Follow After)

| # | Task | Score | Time | Status |
|---|------|-------|------|--------|
| **6** | useGameActions Hook | 7/10 | 30min | BATCH 3 |
| **7** | Semantic HTML & ARIA | 6/10 | 35min | BATCH 3 |
| **8** | Better Error Messages | 5/10 | 25min | BATCH 3 |

### 🟡 MEDIUM (Phase 3: If Time)

| # | Task | Score | Time |
|---|------|-------|------|
| 9 | GameInputPanel Component | 4/10 | 25min |
| 10 | Type Guards | 5/10 | 20min |
| 11 | Enums for Game Modes | 5/10 | 15min |
| 12 | Keyboard Navigation | 5/10 | 20min |
| 13 | Edge Case Tests | 4/10 | 30min |

### 🟢 LOW (Defer to v0.1.1)

| # | Task | Score | Time |
|---|------|-------|------|
| 14 | AccessibilityWarning Dialog | 3/10 | 20min |
| 15 | Extract Constants | 3/10 | 15min |

---

## BATCH 1: Parallel Implementation (2h total)

Starting now - these 3 items are independent and can be worked on simultaneously:

### [1/3] Error Boundary Component ⚡ (30 min)

**File to create:** `src/components/ErrorBoundary/index.tsx`

**Current Issue:**
- No error boundary in App.tsx
- If any component throws error, entire app crashes with white screen
- Users have no recovery mechanism

**Implementation:**
```typescript
// src/components/ErrorBoundary/index.tsx
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error:', error, errorInfo);
    // TODO: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Coś poszło nie tak 😞</h1>
          <p>Przepraszamy, aplikacja napotkała błąd.</p>
          <details style={{ marginTop: '1rem', textAlign: 'left' }}>
            <summary>Szczegóły błędu</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          >
            Odśwież aplikację
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Files to modify:**
- `src/App.tsx` - Wrap BrowserRouter with ErrorBoundary

**Tests:**
- Create `src/components/ErrorBoundary/ErrorBoundary.test.tsx`
- Test error is caught and displayed
- Test error info is logged

**Benefits:**
✅ Graceful error handling  
✅ User-friendly error display  
✅ Better app stability  
✅ Production-ready error handling

---

### [2/3] useGame Hook ⚡ (45 min)

**File to create:** `src/hooks/useGame.ts`

**Current Issue:**
- Game.tsx has 8+ useState hooks mixed with rendering
- State logic scattered throughout component
- Hard to test state transitions
- Hard to reuse state logic

**Implementation:**
```typescript
// src/hooks/useGame.ts
import { useReducer } from 'react';
import { Paragraph, Scenario } from '../types';

export interface GameState {
  currentParagraphId: string | null;
  inputValue: string;
  showSetup: boolean;
  error: string;
  lastDiceResult: number | null;
  pendingParagraphId: string | null;
  showAccessibilityWarning: boolean;
}

type GameAction =
  | { type: 'SET_PARAGRAPH'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'TOGGLE_SETUP' }
  | { type: 'SHOW_WARNING'; payload: string }
  | { type: 'CLOSE_WARNING' }
  | { type: 'SET_DICE_RESULT'; payload: number }
  | { type: 'RESET' };

const initialState: GameState = {
  currentParagraphId: null,
  inputValue: '',
  showSetup: true,
  error: '',
  lastDiceResult: null,
  pendingParagraphId: null,
  showAccessibilityWarning: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PARAGRAPH':
      return { ...state, currentParagraphId: action.payload, error: '' };
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: '' };
    case 'TOGGLE_SETUP':
      return { ...state, showSetup: !state.showSetup };
    case 'SHOW_WARNING':
      return { ...state, showAccessibilityWarning: true, pendingParagraphId: action.payload };
    case 'CLOSE_WARNING':
      return { ...state, showAccessibilityWarning: false, pendingParagraphId: null };
    case 'SET_DICE_RESULT':
      return { ...state, lastDiceResult: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useGame(scenarioId: string) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return {
    state,
    dispatch,
    // Convenience methods
    setParagraph: (id: string) => dispatch({ type: 'SET_PARAGRAPH', payload: id }),
    setInput: (value: string) => dispatch({ type: 'SET_INPUT', payload: value }),
    setError: (error: string) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    toggleSetup: () => dispatch({ type: 'TOGGLE_SETUP' }),
    showWarning: (id: string) => dispatch({ type: 'SHOW_WARNING', payload: id }),
    closeWarning: () => dispatch({ type: 'CLOSE_WARNING' }),
    setDiceResult: (result: number) => dispatch({ type: 'SET_DICE_RESULT', payload: result }),
    reset: () => dispatch({ type: 'RESET' }),
  };
}
```

**Files to modify:**
- `src/pages/Game.tsx` - Replace 8 useState with useGame hook (saves ~60 lines)

**Tests:**
- Create `src/hooks/useGame.test.ts`
- Test all reducer actions
- Test state transitions

**Benefits:**
✅ Game.tsx reduced by 60 lines  
✅ State logic centralized  
✅ Easier to test state  
✅ Reusable across components

---

### [3/3] ParagraphDisplay Component ⚡ (40 min)

**File to create:** `src/components/ParagraphDisplay/index.tsx` + CSS

**Current Issue:**
- Game.tsx has 90+ lines of paragraph display JSX (lines 240-330)
- Mixed concerns: text + dice + choices + dead ends
- Hard to test paragraph rendering
- Hard to modify paragraph UI

**Implementation:**
```typescript
// src/components/ParagraphDisplay/index.tsx
import React from 'react';
import { Paragraph } from '../../types';
import { ParagraphText } from '../ParagraphText';
import { DiceRoller } from '../DiceRoller';
import { ConditionalChoice } from '../ConditionalChoice';
import './ParagraphDisplay.css';

interface ParagraphDisplayProps {
  paragraph: Paragraph;
  lastDiceResult: number | null;
  onChoice: (nextId: string) => void;
  onBack: () => void;
}

export const ParagraphDisplay: React.FC<ParagraphDisplayProps> = ({
  paragraph,
  lastDiceResult,
  onChoice,
  onBack,
}) => {
  // Check if dice roll was successful
  const isDiceRollSuccess = 
    paragraph.hasDiceRoll && 
    paragraph.diceResult && 
    lastDiceResult !== null &&
    lastDiceResult > paragraph.diceResult.threshold;

  // Check if paragraph is dead end
  const isDeadEnd = !paragraph.choices && !paragraph.hasDiceRoll;

  return (
    <section className="paragraph-display">
      <ParagraphText text={paragraph.text} />

      {isDeadEnd && (
        <div className="dead-end">
          <p>Koniec gry!</p>
          <button onClick={onBack}>Powrót</button>
        </div>
      )}

      {paragraph.hasDiceRoll && paragraph.diceResult && lastDiceResult !== null && (
        <div className="dice-result">
          <p>{isDiceRollSuccess ? paragraph.diceResult.successText : paragraph.diceResult.failText}</p>
          <button 
            onClick={() => onChoice(isDiceRollSuccess ? paragraph.diceResult!.successNextId : paragraph.diceResult!.failNextId)}
            className="button button--primary"
          >
            PRZEJDŹ
          </button>
        </div>
      )}

      {paragraph.hasDiceRoll && lastDiceResult === null && (
        <DiceRoller description={paragraph.diceRollDescription} />
      )}

      {paragraph.choices && paragraph.choices.length > 0 && (
        <div className="choices">
          {paragraph.choices.map((choice) => (
            <ConditionalChoice
              key={choice.id}
              choice={choice}
              onChoice={onChoice}
            />
          ))}
        </div>
      )}
    </section>
  );
};
```

**CSS:**
```css
/* src/components/ParagraphDisplay/ParagraphDisplay.css */
.paragraph-display {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.dead-end {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.dice-result {
  margin-top: 2rem;
  padding: 1rem;
  background: #fffbf0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
```

**Files to modify:**
- `src/pages/Game.tsx` - Replace paragraph JSX with `<ParagraphDisplay>` (saves ~90 lines)

**Tests:**
- Create `src/components/ParagraphDisplay/ParagraphDisplay.test.tsx`
- Test dead end display
- Test dice roll display
- Test choices display

**Benefits:**
✅ Game.tsx reduced by 90 lines  
✅ Paragraph rendering isolated  
✅ Easier to test paragraph UI  
✅ Easier to modify paragraph appearance

---

## Execution Plan

**Timeline:**
- **Next 2 hours:** Complete Batch 1 (Error Boundary + useGame + ParagraphDisplay)
- **After:** Run full test suite (should still be 48/48 passing)
- **Then:** Move to Batch 2 (Integration Tests + Schema Validation)

**Parallel work possible:**
✅ All 3 Batch 1 items are independent  
✅ Can be implemented in any order  
✅ No file conflicts  
✅ Tests can be written in parallel

**Commit strategy:**
```bash
# After completing all 3:
git commit -m "refactor: Phase 1 - Error Boundary, useGame hook, ParagraphDisplay component"
```

**Expected Results After Batch 1:**
- ✅ Game.tsx reduced from 342 to ~150 lines (goal already achieved, but maintainability improved)
- ✅ Better error handling
- ✅ Cleaner state management
- ✅ Same test count (48/48 passing)
- ✅ Same functionality

