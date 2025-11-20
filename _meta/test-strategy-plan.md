# Test Strategy Plan for Smartcat Prototype

## Executive Summary

This document outlines a practical testing strategy for the Smartcat UI prototype. Given that this is a **prototype** (not a production application), the strategy prioritizes **simplicity**, **speed**, and **user flow validation** over comprehensive coverage.

**Recommended Approach**: **E2E tests with Playwright** for critical user journeys, with optional **component tests** for complex UI interactions.

---

## Project Context

### What We're Testing

- **Type**: UI Prototype (not production)
- **Purpose**: Demonstrate features to stakeholders, validate UX flows
- **Tech Stack**: React 19, TypeScript, Vite, React Router, Radix UI
- **Data**: Mock data (no real backend)
- **Deployment**: GitHub Pages (static site)

### Key Features to Test

1. **Navigation System**
   - Left sidebar navigation
   - Hub/Work sub-navigation panels
   - Organization/User menus
   - Route navigation

2. **Organization Management**
   - Smartwords allocation/reclaim flows
   - Full Access toggle
   - Workspace table interactions
   - Progress bar calculations

3. **Chats**
   - Chat sidebar navigation
   - Message sending/receiving
   - Chat history

4. **Smartwords Usage Report**
   - Time period filtering
   - Chart rendering
   - CSV export
   - Pagination

5. **Authentication**
   - Login flow
   - Protected routes

---

## Testing Strategy Recommendation

### Primary Choice: **E2E Tests (Playwright)**

**Why E2E for a Prototype?**

1. **User-Focused**: Prototypes are about demonstrating user flows, not internal implementation
2. **High Confidence**: E2E tests verify the entire user journey works as expected
3. **Stakeholder Value**: Tests that mirror real user interactions are most valuable for demos
4. **Simpler Maintenance**: Fewer tests to maintain than unit + integration + E2E
5. **Mock Data Friendly**: Since we use mock data, E2E tests can easily verify the full flow

**What to Test with E2E:**

- Critical user journeys (happy paths)
- Navigation flows
- Form submissions and modals
- Data display and calculations
- Route protection

**What NOT to Test with E2E:**

- Edge cases (prototype doesn't need them)
- Error handling beyond basic validation
- Performance (not critical for prototype)
- Accessibility (can be verified manually)

### Secondary Choice: **Component Tests (React Testing Library)**

**When Component Tests Make Sense:**

- Complex interactive components (modals, dropdowns, tables)
- Components with complex state logic
- Reusable UI components that might break other features

**Recommendation**: Use sparingly, only for components that are:
1. Complex enough to warrant isolated testing
2. Used across multiple features
3. Have intricate state management

---

## Unit Tests: Skip for Prototype

### Arguments Against Unit Tests for Prototypes

1. **Time Investment**: Unit tests require significant setup and maintenance
2. **Low ROI**: Prototypes change frequently; unit tests become outdated quickly
3. **Mock Data Context**: With mock data, most "unit" logic is trivial
4. **Focus Mismatch**: Prototypes are about UX, not internal logic correctness

### When Unit Tests Might Be Worth It

Only consider unit tests for:
- **Pure utility functions** with complex logic (e.g., date calculations, number formatting)
- **Business rule calculations** (e.g., Smartwords balance calculations)
- **Validation schemas** (Zod schemas)

**Recommendation**: Start without unit tests. Add them only if you find yourself debugging calculation errors repeatedly.

---

## Recommended Test Framework: Playwright

### Why Playwright?

1. **Modern & Fast**: Built for modern web apps
2. **Great DX**: Excellent debugging tools, trace viewer
3. **TypeScript Native**: Perfect for this TypeScript project
4. **Multi-Browser**: Can test Chrome, Firefox, Safari
5. **Visual Testing**: Built-in screenshot comparison
6. **CI/CD Ready**: Easy to integrate with GitHub Actions

### Alternative: Cypress

- Also excellent for E2E
- Slightly easier setup
- Better for component testing if needed
- **Trade-off**: Less performant, more opinionated

**Recommendation**: **Playwright** for better performance and modern tooling.

---

## Test Coverage Plan

### Phase 1: Critical User Journeys (Priority 1)

These are the "must-have" tests that ensure the prototype works for demos:

#### 1. Authentication Flow
- ✅ User can log in
- ✅ Protected routes redirect to login
- ✅ Authenticated user can access all pages

#### 2. Navigation Flow
- ✅ Left sidebar navigation works
- ✅ Hub sub-navigation expands/collapses
- ✅ Active route highlighting works
- ✅ Organization/User menus open and close
- ✅ Route navigation works

#### 3. Organization Management - Core Flow
- ✅ Page loads and displays org data
- ✅ Stats cards display correctly
- ✅ Progress bar shows correct values
- ✅ Workspace table displays data
- ✅ Tabs filter workspaces correctly

#### 4. Smartwords Allocation Flow
- ✅ "Allocate" opens modal
- ✅ Form validation works (cannot exceed balance)
- ✅ Allocation updates workspace and org balance
- ✅ Progress bar updates correctly

#### 5. Smartwords Reclaim Flow
- ✅ "Reclaim" opens modal
- ✅ Form validation works (cannot exceed remaining)
- ✅ Reclaim updates workspace and org balance
- ✅ Progress bar updates correctly

#### 6. Full Access Toggle
- ✅ Toggle switches state
- ✅ State persists (optimistic update)

#### 7. Usage Report Flow
- ✅ Navigate to usage report from actions menu
- ✅ Time period filter works
- ✅ Chart renders with data
- ✅ Operations table displays data
- ✅ Pagination works

#### 8. Chats Flow
- ✅ Chat sidebar displays
- ✅ Can select chat from sidebar
- ✅ Can send message
- ✅ Message appears in conversation

**Estimated Tests**: ~15-20 E2E tests

### Phase 2: Additional Validations (Priority 2)

Add these if time permits:

- Multiple packages per workspace
- Workspace-purchased packages (non-reclaimable)
- CSV export functionality
- Search/filter in tables (if implemented)
- Breadcrumb navigation

**Estimated Tests**: ~5-10 additional tests

### Phase 3: Component Tests (Optional)

Only if needed for complex components:

- `AllocationModal` - Form validation, calculations
- `WorkspacesTable` - Sorting, filtering (if complex)
- `ProgressBar` - Calculation display
- `StatisticsWidget` - Chart rendering, time period calculations

**Estimated Tests**: ~5-10 component tests

---

## Test Implementation Plan

### Step 1: Setup (1-2 hours)

1. Install Playwright:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. Create `playwright.config.ts`:
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: 'html',
     use: {
       baseURL: 'http://localhost:5173',
       trace: 'on-first-retry',
     },
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
     ],
     webServer: {
       command: 'npm run dev',
       url: 'http://localhost:5173',
       reuseExistingServer: !process.env.CI,
     },
   });
   ```

3. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "playwright test",
       "test:ui": "playwright test --ui",
       "test:debug": "playwright test --debug"
     }
   }
   ```

### Step 2: Create Test Structure (30 minutes)

```
tests/
├── e2e/
│   ├── auth.spec.ts
│   ├── navigation.spec.ts
│   ├── org-management.spec.ts
│   ├── allocation.spec.ts
│   ├── chats.spec.ts
│   └── usage-report.spec.ts
├── helpers/
│   ├── auth-helpers.ts
│   └── test-data.ts
└── fixtures/
    └── page.ts
```

### Step 3: Implement Tests (4-8 hours)

Start with Priority 1 tests, one feature at a time.

### Step 4: CI/CD Integration (1 hour)

Add GitHub Actions workflow to run tests on PRs.

---

## Example Test Structure

### E2E Test Example: Allocation Flow

```typescript
// tests/e2e/allocation.spec.ts
import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth-helpers';

test.describe('Smartwords Allocation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/org/management');
  });

  test('should allocate smartwords to workspace', async ({ page }) => {
    // Find a workspace row
    const workspaceRow = page.locator('[data-testid="workspace-row"]').first();
    
    // Click Actions menu
    await workspaceRow.locator('[data-testid="actions-menu"]').click();
    
    // Click Allocate
    await page.locator('text=Allocate').click();
    
    // Wait for modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Enter amount
    await page.locator('input[type="number"]').fill('10000');
    
    // Verify validation (if needed)
    const confirmButton = page.locator('button:has-text("Confirm")');
    await expect(confirmButton).toBeEnabled();
    
    // Submit
    await confirmButton.click();
    
    // Verify modal closes
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    
    // Verify balance updated (check progress bar or table)
    // This depends on your implementation
  });
});
```

### Component Test Example (Optional)

```typescript
// tests/components/AllocationModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AllocationModal } from '@/components/org-management/AllocationModal';

test('validates amount cannot exceed balance', async () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  
  render(
    <AllocationModal
      open={true}
      workspaceName="Test Workspace"
      currentAllocation={0}
      orgBalance={50000}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
  
  const input = screen.getByLabelText(/amount/i);
  fireEvent.change(input, { target: { value: '100000' } });
  
  const confirmButton = screen.getByRole('button', { name: /confirm/i });
  expect(confirmButton).toBeDisabled();
  
  const error = screen.getByText(/cannot exceed/i);
  expect(error).toBeInTheDocument();
});
```

---

## Test Data Strategy

### Using Mock Data

Since the prototype uses mock data:

1. **No API mocking needed**: Tests interact with the app as-is
2. **Consistent data**: Mock data in `src/mocks/` is predictable
3. **Test helpers**: Create helpers to navigate to specific states

### Test Helpers Example

```typescript
// tests/helpers/test-data.ts
export const testWorkspace = {
  id: 'ws1',
  name: 'Test Workspace',
  allocated: 0,
  spent: 0,
};

// tests/helpers/navigation-helpers.ts
export async function navigateToOrgManagement(page: Page) {
  await page.goto('/org/management');
  await page.waitForSelector('[data-testid="org-header"]');
}
```

---

## Maintenance Strategy

### For a Prototype

1. **Run tests before demos**: Ensure critical flows work
2. **Update tests when features change**: Keep tests in sync with features
3. **Don't obsess over coverage**: Focus on user journeys, not percentages
4. **Delete obsolete tests**: If a feature is removed, remove its tests

### Test Maintenance Checklist

- [ ] Tests pass before each demo
- [ ] Tests updated when features change
- [ ] Broken tests fixed or removed
- [ ] No flaky tests (tests that sometimes fail)

---

## Cost-Benefit Analysis

### E2E Tests (Recommended)

**Cost:**
- Setup: 2-3 hours
- Writing tests: 8-12 hours
- Maintenance: ~1 hour per feature change

**Benefit:**
- High confidence in user flows
- Catches integration issues
- Valuable for demos
- Documents expected behavior

**ROI**: ⭐⭐⭐⭐⭐ (Excellent for prototype)

### Component Tests (Optional)

**Cost:**
- Setup: 1 hour (if using Vitest)
- Writing tests: 4-6 hours
- Maintenance: ~30 min per component change

**Benefit:**
- Faster feedback for complex components
- Isolated testing of logic
- Good for reusable components

**ROI**: ⭐⭐⭐ (Moderate - only for complex components)

### Unit Tests (Not Recommended)

**Cost:**
- Setup: 2-3 hours
- Writing tests: 10-15 hours
- Maintenance: ~1 hour per logic change

**Benefit:**
- Tests internal logic
- Fast execution
- Good for production apps

**ROI**: ⭐⭐ (Low - not worth it for prototype)

---

## Final Recommendation

### Recommended Approach: **E2E Tests with Playwright**

**Implementation Plan:**

1. ✅ **Setup Playwright** (2 hours)
2. ✅ **Write 15-20 critical E2E tests** (8-12 hours)
3. ✅ **Add to CI/CD** (1 hour)
4. ⏸️ **Skip component tests** (unless you hit complex components)
5. ⏸️ **Skip unit tests** (unless you have complex calculations)

**Total Time Investment**: ~12-15 hours for a solid test foundation

**Expected Outcome:**
- Confidence that prototype works for demos
- Quick feedback when features break
- Documentation of expected user flows
- Easy to maintain and update

---

## Next Steps

1. **Review this plan** with the team
2. **Decide on framework** (Playwright recommended)
3. **Set up test infrastructure** (Step 1 above)
4. **Write first test** (authentication flow is a good start)
5. **Iterate** - add tests as you develop features

---

## Questions to Consider

1. **Do we need visual regression testing?**
   - For a prototype: Probably not, unless design consistency is critical
   - Can add later with Playwright's screenshot comparison

2. **Should we test on multiple browsers?**
   - For a prototype: Chrome is probably enough
   - Can add Firefox/Safari later if needed

3. **How often should we run tests?**
   - Before each demo: Yes
   - On every commit: Optional (can be slow)
   - On PRs: Recommended

4. **What about accessibility testing?**
   - For a prototype: Manual testing is probably sufficient
   - Can add automated a11y tests later if needed

---

## Conclusion

For a UI prototype, **E2E tests with Playwright** provide the best balance of:
- ✅ Coverage of user flows
- ✅ Confidence for demos
- ✅ Reasonable maintenance burden
- ✅ Fast feedback

**Skip unit tests** unless you have complex business logic that needs isolated testing.

**Add component tests** only for complex, reusable components that are hard to test via E2E.

**Focus on happy paths** - prototypes don't need exhaustive edge case testing.

---

**Last Updated**: Based on project review on 2025-01-XX
**Status**: Ready for implementation

