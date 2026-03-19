# ScrollBanner Component - Modular Architecture

Komponen ScrollBanner yang telah direfactor menggunakan design pattern modular untuk maintainability dan reusability yang lebih baik.

## Struktur Folder

```
components/scroll-banner/
├── index.tsx                 # Main component (orchestrator)
├── BannerContent.tsx         # Content layout component
├── BannerLogo.tsx           # Logo component
├── BannerLinks.tsx          # Navigation links component
├── useScrollVisibility.ts   # Custom hook for scroll behavior
├── constants.ts             # Configuration constants
├── types.ts                 # TypeScript type definitions
└── README.md               # Documentation
```

## Design Patterns

### 1. **Separation of Concerns**
Setiap komponen memiliki tanggung jawab yang jelas:
- `index.tsx` - Orchestration & responsive breakpoints
- `BannerContent.tsx` - Layout logic with Shadcn UI components
- `BannerLogo.tsx` - Brand identity display using Badge component
- `BannerLinks.tsx` - Navigation rendering using Button component
- `useScrollVisibility.ts` - Scroll behavior logic

### 2. **Shadcn UI Integration**
Menggunakan Shadcn UI components untuk konsistensi dan aksesibilitas:
- **Button** - Untuk navigation links dengan variants (default, ghost, link)
- **Badge** - Untuk logo decoration dan store info display

Keuntungan:
- Konsisten dengan design system
- Built-in accessibility (ARIA attributes)
- Variant system yang fleksibel
- Type-safe dengan TypeScript
- Customizable dengan Tailwind CSS

### 2. **Configuration-Driven**
Semua konfigurasi disimpan di `constants.ts`:
```typescript
export const BANNER_CONFIGS: Record<string, BannerConfig> = {
  '2xl': { /* config */ },
  'xl': { /* config */ },
  // ...
}
```

Keuntungan:
- Mudah menambah/mengubah breakpoint
- Konsistensi data di semua breakpoint
- Single source of truth

### 3. **Custom Hook Pattern**
`useScrollVisibility` mengenkapsulasi scroll logic:
```typescript
const isVisible = useScrollVisibility()
```

Keuntungan:
- Reusable di komponen lain
- Testable secara terpisah
- Clean component code

### 4. **Component Composition**
Komponen kecil yang composable:
```typescript
<BannerContent config={config}>
  <BannerLogo />
  <BannerLinks />
</BannerContent>
```

### 5. **Type Safety**
TypeScript interfaces untuk type safety:
```typescript
interface BannerConfig {
  logo: { size: string; textSize: string }
  storeInfo?: string
  links: BannerLink[]
  padding: string
}
```

## File Details

### index.tsx
**Purpose**: Main orchestrator component

**Responsibilities**:
- Manage scroll visibility state
- Render responsive breakpoints
- Pass configuration to child components

**Key Features**:
- Uses `useScrollVisibility` hook
- Maps breakpoints to configurations
- Handles responsive display logic

### BannerContent.tsx
**Purpose**: Layout component for banner content

**Props**:
```typescript
interface BannerContentProps {
  config: BannerConfig
  containerClass?: string
  linkSize?: 'sm' | 'md' | 'lg'
}
```

**Responsibilities**:
- Arrange logo, store info, and links
- Handle conditional rendering
- Apply responsive styling

### BannerLogo.tsx
**Purpose**: Display brand logo and name

**Props**:
```typescript
interface BannerLogoProps {
  size: string      // Tailwind class for logo size
  textSize: string  // Tailwind class for text size
}
```

**Features**:
- Gradient background logo
- Two-part brand name
- Responsive sizing

### BannerLinks.tsx
**Purpose**: Render navigation links

**Props**:
```typescript
interface BannerLinksProps {
  links: BannerLink[]
  size?: 'sm' | 'md' | 'lg'
}
```

**Features**:
- Dynamic link rendering
- Variant support (default/primary)
- Responsive sizing

### useScrollVisibility.ts
**Purpose**: Custom hook for scroll-based visibility

**Returns**: `boolean` - visibility state

**Logic**:
- Show at top (< 50px)
- Show when scrolling up
- Hide when scrolling down (> 100px)

**Features**:
- Passive event listener for performance
- Cleanup on unmount
- Debounced state updates

### constants.ts
**Purpose**: Centralized configuration

**Exports**:
- `BRAND_NAME` - Brand identity
- `STORE_INFO` - Store information variants
- `LINKS` - All navigation links
- `BANNER_CONFIGS` - Breakpoint configurations

**Benefits**:
- Easy to update content
- Consistent across breakpoints
- Single source of truth

### types.ts
**Purpose**: TypeScript type definitions

**Types**:
```typescript
interface BannerLink {
  href: string
  label: string
  variant?: 'default' | 'primary'
}

interface BannerConfig {
  logo: { size: string; textSize: string }
  storeInfo?: string
  links: BannerLink[]
  padding: string
}
```

## Usage

### Basic Usage
```typescript
import ScrollBanner from '@/components/ScrollBanner'

export default function Layout() {
  return (
    <>
      <ScrollBanner />
      {/* rest of layout */}
    </>
  )
}
```

### Customization

#### Add New Breakpoint
Edit `constants.ts`:
```typescript
export const BANNER_CONFIGS = {
  // ... existing configs
  '3xl': {
    logo: { size: 'w-8 h-8', textSize: 'text-xl' },
    storeInfo: STORE_INFO.full,
    links: [/* custom links */],
    padding: 'px-8 py-3'
  }
}
```

Then add to `index.tsx`:
```typescript
<div className="hidden 3xl:block">
  <BannerContent config={BANNER_CONFIGS['3xl']} />
</div>
```

#### Update Store Info
Edit `constants.ts`:
```typescript
export const STORE_INFO = {
  full: '🇯🇵 New Store Info',
  short: '🇯🇵 Short Info'
}
```

#### Add New Link
Edit `constants.ts`:
```typescript
export const LINKS = {
  // ... existing links
  newLink: { 
    href: '/new-page', 
    label: 'New Page',
    variant: 'primary' 
  }
}
```

Then add to desired config:
```typescript
'2xl': {
  // ...
  links: [
    LINKS.storeLocation,
    LINKS.newLink, // Add here
    // ...
  ]
}
```

## Benefits of Modular Architecture with Shadcn UI

### 1. Maintainability
- Easy to locate and fix bugs
- Clear component boundaries
- Self-documenting code structure
- Consistent UI with Shadcn components

### 2. Reusability
- Components can be used elsewhere
- Hook can be shared
- Configuration can be extended
- Shadcn UI components are reusable across app

### 3. Testability
- Each component can be tested independently
- Mock configurations easily
- Isolated unit tests
- Shadcn UI components have built-in accessibility

### 4. Scalability
- Easy to add new breakpoints
- Simple to add new features
- Minimal code duplication
- Leverage Shadcn UI variant system

### 5. Developer Experience
- Clear file organization
- Type safety with TypeScript
- Intuitive component names
- Familiar Shadcn UI API

### 6. Accessibility
- Built-in ARIA attributes from Shadcn UI
- Keyboard navigation support
- Focus management
- Screen reader friendly

### 7. Design Consistency
- Unified design system with Shadcn UI
- Consistent spacing and colors
- Predictable component behavior
- Easy theming support

## Testing Strategy

### Unit Tests
```typescript
// BannerLogo.test.tsx
describe('BannerLogo', () => {
  it('renders brand name correctly', () => {
    // test implementation
  })
})

// useScrollVisibility.test.ts
describe('useScrollVisibility', () => {
  it('shows banner at top', () => {
    // test implementation
  })
})
```

### Integration Tests
```typescript
// ScrollBanner.test.tsx
describe('ScrollBanner', () => {
  it('renders correct breakpoint', () => {
    // test implementation
  })
})
```

## Performance Considerations

1. **Passive Event Listeners**
   - Scroll listener uses `{ passive: true }`
   - Improves scroll performance

2. **Conditional Rendering**
   - Only one breakpoint rendered at a time
   - Reduces DOM nodes

3. **CSS Transitions**
   - Hardware-accelerated transforms
   - Smooth animations

4. **Memoization Opportunities**
   - Components can be wrapped with `React.memo`
   - Configuration is static

## Migration from Old Code

Old code (200 lines, monolithic):
```typescript
export default function ScrollBanner() {
  // 200 lines of mixed concerns
}
```

New code (modular, ~150 lines total):
```typescript
// Separated into 7 focused files
// Each file < 50 lines
// Clear responsibilities
```

## Future Enhancements

- [ ] Add animation variants
- [ ] Support for custom themes
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Accessibility improvements (ARIA labels)
- [ ] Keyboard navigation
- [ ] RTL support
- [ ] Dark mode support
