# Homepage UX Improvements - Foundation

This directory contains the enhanced components, utilities, and tests for the Homepage UX Improvements feature.

## Structure

```
app/homepage/
├── components/          # New homepage components
├── hooks/              # Custom React hooks for homepage
├── utils/              # Utility functions
│   ├── animations.ts   # Animation utilities and configurations
│   └── accessibility.ts # Accessibility helper functions
└── README.md           # This file
```

## Design Tokens

Enhanced design tokens are available in `lib/design-tokens.ts` and include:

### New Token Categories

1. **Animation Tokens**
   - Duration values (fast, base, slow, slower)
   - Easing functions (easeIn, easeOut, easeInOut, spring)
   - Delay values for staggered animations

2. **Touch Target Tokens**
   - Minimum: 44px (WCAG 2.1 AA)
   - Comfortable: 48px (Android Material Design)
   - Large: 56px (Enhanced accessibility)

3. **Touch Spacing Tokens**
   - Minimum: 8px between interactive elements
   - Comfortable: 12px
   - Generous: 16px

4. **Focus Indicators**
   - Outline width, offset, color, and style
   - Ensures visible focus for keyboard navigation

5. **Contrast Ratios**
   - WCAG AA and AAA standards for normal and large text

## Utilities

### Animation Utilities (`utils/animations.ts`)

- `getStaggerDelay(index, baseDelay)` - Calculate stagger delays for sequential animations
- `getMotionSafeClasses(classes)` - Respect user's motion preferences
- `animationVariants` - Pre-configured animation variants (fadeIn, slideIn, etc.)
- `transitionConfig` - Transition timing configurations
- `enableGPUAcceleration()` - Optimize animations for performance

### Accessibility Utilities (`utils/accessibility.ts`)

- `generateA11yId(prefix)` - Generate unique IDs for ARIA attributes
- `isKeyboardFocusable(element)` - Check if element is keyboard accessible
- `getFocusableElements(container)` - Get all focusable elements
- `trapFocus(container, event)` - Trap focus within modals/dialogs
- `announceToScreenReader(message)` - Announce messages to screen readers
- `validateTouchTarget(element)` - Validate touch target size
- `validateInteractiveSpacing(el1, el2)` - Validate spacing between elements
- `validateHeadingHierarchy(container)` - Check proper heading structure
- `validateImageAltText(container)` - Ensure all images have alt text
- `validateAccessibleNames(container)` - Check interactive elements have names

## Testing

### Property-Based Testing

We use `fast-check` for property-based testing to validate universal properties across all inputs.

**Run property-based tests:**
```bash
npm run test:pbt
```

**Run all unit tests:**
```bash
npm run test:unit
```

**Run tests in watch mode:**
```bash
npm run test:unit:watch
```

**Generate coverage report:**
```bash
npm run test:unit:coverage
```

### Test Organization

- `*.test.ts` - Unit tests for specific examples and edge cases
- `*.pbt.test.ts` - Property-based tests for universal properties
- Tests are co-located with source files in `__tests__` directories

### Example Property Test

```typescript
import fc from 'fast-check'

it('should ensure all touch targets meet minimum size', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 20, max: 100 }),
      fc.integer({ min: 20, max: 100 }),
      (width, height) => {
        const result = a11y.meetsTouchTargetSize(width, height)
        const expected = width >= 44 && height >= 44
        expect(result).toBe(expected)
      }
    ),
    { numRuns: 100 }
  )
})
```

## Requirements Validation

This foundation setup validates the following requirements:

- **Requirement 6.1**: Animation utilities with proper timing and easing
- **Requirement 6.6**: Respect for `prefers-reduced-motion` setting
- **Requirement 7.1**: Accessibility helpers for ARIA labels and keyboard navigation
- **Requirement 14.1**: CSS custom properties and theme-ready color system

## Usage Examples

### Using Animation Utilities

```typescript
import { getStaggerDelay, animationVariants } from '@/app/homepage/utils/animations'

// Stagger animation delays
sections.map((section, index) => (
  <div style={{ animationDelay: getStaggerDelay(index, 100) }}>
    {section}
  </div>
))
```

### Using Accessibility Utilities

```typescript
import { validateTouchTarget, announceToScreenReader } from '@/app/homepage/utils/accessibility'

// Validate touch target
const validation = validateTouchTarget(buttonElement)
if (!validation.isValid) {
  console.warn(`Touch target too small: ${validation.width}x${validation.height}`)
}

// Announce to screen reader
announceToScreenReader('Product added to cart', 'polite')
```

### Using Design Tokens

```typescript
import { tokens, a11y } from '@/lib/design-tokens'

// Check contrast ratio
const meetsAA = a11y.meetsContrastRequirement('#000000', '#FFFFFF', 'aa')

// Use touch target sizes
<button className={`min-w-[${tokens.touchTarget.minimum}] min-h-[${tokens.touchTarget.minimum}]`}>
  Click me
</button>
```

## Next Steps

With the foundation in place, the next tasks will implement:

1. Hero Section Integration (Task 2)
2. Mobile Bottom Navigation (Task 3)
3. Enhanced CategoryIcons (Task 4)
4. Product Grid Enhancements (Task 5)

Each component will leverage these foundation utilities for consistent animations, accessibility, and design system compliance.
