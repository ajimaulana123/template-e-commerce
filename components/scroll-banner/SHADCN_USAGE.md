# Shadcn UI Integration in ScrollBanner

Dokumentasi penggunaan Shadcn UI components dalam ScrollBanner.

## Components Used

### 1. Button Component

**File**: `BannerLinks.tsx`

**Variants Used**:
- `default` - Primary action buttons (Track Order)
- `ghost` - Secondary navigation links

**Sizes Used**:
- `xs` - Extra small (mobile)
- `sm` - Small (tablet)
- `default` - Default (desktop)

**Implementation**:
```tsx
<Button
  variant={link.variant === 'primary' ? 'default' : 'ghost'}
  size={sizeMap[size]}
  asChild
  className="bg-green-600 hover:bg-green-700"
>
  <a href={link.href}>{link.label}</a>
</Button>
```

**Custom Styling**:
- Primary buttons: `bg-green-600 hover:bg-green-700`
- Ghost buttons: `hover:text-green-600`

**Benefits**:
- Built-in focus states
- Keyboard navigation support
- Consistent hover/active states
- ARIA attributes for accessibility

---

### 2. Badge Component

**File**: `BannerLogo.tsx` & `BannerContent.tsx`

**Variants Used**:
- `default` - Logo square decoration
- `outline` - Brand name "Mart" & separator
- `secondary` - Store information display

**Implementation Examples**:

#### Logo Square (BannerLogo.tsx)
```tsx
<Badge 
  variant="default" 
  className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 transform rotate-45 rounded-sm p-0 border-0"
/>
```

#### Brand Name Badge (BannerLogo.tsx)
```tsx
<Badge 
  variant="outline" 
  className="text-lg font-bold text-green-600 border-green-600 bg-green-50 hover:bg-green-100"
>
  Mart
</Badge>
```

#### Separator (BannerContent.tsx)
```tsx
<Badge 
  variant="outline" 
  className="h-6 border-gray-300 text-gray-400 px-1"
>
  |
</Badge>
```

#### Store Info (BannerContent.tsx)
```tsx
<Badge 
  variant="secondary" 
  className="truncate bg-blue-50 text-blue-700 border-blue-200 text-sm"
>
  🇯🇵 Tokyo Store • Senin - Minggu (10:00-22:00)
</Badge>
```

**Custom Styling**:
- Green theme for brand elements
- Blue theme for informational badges
- Gray theme for separators

**Benefits**:
- Semantic HTML (span elements)
- Consistent sizing and spacing
- Easy to customize with Tailwind
- Accessible color contrasts

---

## Color Scheme

### Primary Colors (Green)
- **Brand Logo**: `from-green-400 to-green-600`
- **Brand Name**: `text-green-600 border-green-600 bg-green-50`
- **Primary Button**: `bg-green-600 hover:bg-green-700`
- **Link Hover**: `hover:text-green-600`

### Secondary Colors (Blue)
- **Store Info Badge**: `bg-blue-50 text-blue-700 border-blue-200`

### Neutral Colors (Gray)
- **Separator**: `border-gray-300 text-gray-400`
- **Text**: `text-gray-800`, `text-gray-600`

---

## Responsive Behavior

### Size Mapping

**Button Sizes**:
```typescript
const sizeMap = {
  sm: 'xs' as const,    // Mobile
  md: 'sm' as const,    // Tablet
  lg: 'default' as const // Desktop
}
```

**Badge Sizes**:
- Logo: `w-6 h-6` (desktop) → `w-3.5 h-3.5` (mobile)
- Text: `text-lg` (desktop) → `text-xs` (mobile)

### Breakpoint Behavior

| Breakpoint | Button Size | Badge Size | Links Shown |
|------------|-------------|------------|-------------|
| 2xl+ | default | text-lg | All (4) |
| xl-2xl | sm | text-base | All (3) |
| lg-xl | sm | text-base | Compact (3) |
| md-lg | sm | text-base | Essential (2) |
| sm-md | xs | text-sm | Essential (2) |
| <sm | xs | text-xs | Minimal (1) |

---

## Accessibility Features

### From Shadcn UI Button
- ✅ Focus visible states (`focus-visible:border-ring`)
- ✅ Keyboard navigation support
- ✅ ARIA attributes
- ✅ Disabled state handling
- ✅ Active state feedback

### From Shadcn UI Badge
- ✅ Semantic HTML (span)
- ✅ Color contrast compliance
- ✅ Focus states for interactive badges
- ✅ Screen reader friendly

### Custom Enhancements
- ✅ Descriptive link text
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ Sufficient color contrast

---

## Customization Guide

### Change Primary Color

Update in `BannerLinks.tsx`:
```tsx
className="bg-green-600 hover:bg-green-700" // Change green to your color
```

Update in `BannerLogo.tsx`:
```tsx
className="from-green-400 to-green-600" // Gradient colors
className="text-green-600 border-green-600" // Border and text
```

### Add New Button Variant

In `BannerLinks.tsx`:
```tsx
<Button
  variant="outline" // Try: outline, secondary, destructive
  size="sm"
  asChild
>
  <a href={link.href}>{link.label}</a>
</Button>
```

### Customize Badge Style

In `BannerContent.tsx`:
```tsx
<Badge 
  variant="secondary"
  className="your-custom-classes"
>
  Content
</Badge>
```

---

## Performance Considerations

### Shadcn UI Benefits
1. **Tree-shakeable** - Only imports used components
2. **No runtime overhead** - Pure CSS with Tailwind
3. **Small bundle size** - Minimal JavaScript
4. **CSS-in-JS free** - No runtime style injection

### Optimization Tips
1. Use `asChild` prop to avoid wrapper divs
2. Leverage Tailwind's JIT for minimal CSS
3. Components are already optimized by Shadcn UI
4. No need for additional memoization

---

## Testing with Shadcn UI

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react'
import BannerLinks from './BannerLinks'

describe('BannerLinks with Shadcn UI', () => {
  it('renders Button components', () => {
    const links = [
      { href: '/test', label: 'Test', variant: 'primary' }
    ]
    render(<BannerLinks links={links} size="md" />)
    
    const button = screen.getByRole('link', { name: 'Test' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-green-600')
  })
})
```

### Accessibility Tests
```typescript
import { axe } from 'jest-axe'

it('has no accessibility violations', async () => {
  const { container } = render(<BannerLinks links={links} />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

---

## Migration Notes

### Before (Plain HTML)
```tsx
<a href="/link" className="hover:text-green-600">
  Link
</a>
```

### After (Shadcn UI)
```tsx
<Button variant="ghost" size="sm" asChild>
  <a href="/link">Link</a>
</Button>
```

### Benefits of Migration
- ✅ Consistent styling across app
- ✅ Built-in accessibility
- ✅ Better hover/focus states
- ✅ Easier to maintain
- ✅ Type-safe props
- ✅ Variant system for flexibility

---

## Future Enhancements

- [ ] Add tooltip component for link descriptions
- [ ] Implement dropdown menu for mobile navigation
- [ ] Add skeleton loading states
- [ ] Integrate with theme provider for dark mode
- [ ] Add animation variants from Shadcn UI
- [ ] Implement command palette for quick navigation
