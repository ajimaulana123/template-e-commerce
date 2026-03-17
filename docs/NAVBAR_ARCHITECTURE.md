# Navbar Architecture Documentation

Dokumentasi arsitektur MainNavbar yang telah direfactor menggunakan best practices dan design patterns.

## Design Patterns & Principles

### 1. **Separation of Concerns (SoC)**
Setiap bagian navbar dipecah menjadi component terpisah dengan tanggung jawab spesifik.

### 2. **Single Responsibility Principle (SRP)**
Setiap component hanya punya satu alasan untuk berubah.

### 3. **DRY (Don't Repeat Yourself)**
Eliminasi duplikasi code antara desktop dan mobile navbar.

### 4. **Composition over Inheritance**
Menggunakan component composition untuk build complex UI.

### 5. **Custom Hooks Pattern**
Extract reusable logic ke custom hooks.

## Folder Structure

```
components/
├── MainNavbar.tsx              # Main orchestrator component
├── navbar/
│   ├── index.ts                # Barrel export
│   ├── types.ts                # TypeScript types
│   ├── CartButton.tsx          # Cart button component
│   ├── Logo.tsx                # Logo components (Desktop & Mobile)
│   ├── SearchBar.tsx           # Search bar with dropdown
│   ├── UserMenu.tsx            # User dropdown menu
│   ├── DesktopNavbar.tsx       # Desktop layout
│   ├── MobileNavbar.tsx        # Mobile layout
│   └── hooks/
│       ├── index.ts            # Hooks barrel export
│       ├── useAuth.ts          # Authentication logic
│       ├── useCartCount.ts     # Cart count logic
│       └── useScrollBanner.ts  # Scroll behavior logic
```

## Component Breakdown

### MainNavbar (Orchestrator)
**Responsibility**: Coordinate all navbar components and manage global state.

```typescript
// Clean, minimal, easy to understand
export default function MainNavbar() {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  
  const bannerVisible = useScrollBanner()
  const { user, loading, logout } = useAuth()
  const cartCount = useCartCount()

  return (
    <>
      <nav>
        <DesktopNavbar {...props} />
        <MobileNavbar {...props} />
      </nav>
      <CategoryModal />
    </>
  )
}
```

**Benefits**:
- Easy to read and understand
- Clear data flow
- Minimal logic in main component

### Custom Hooks

#### useAuth
**Responsibility**: Handle authentication state and logout.

```typescript
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user on mount
  // Provide logout function
  
  return { user, loading, logout }
}
```

**Benefits**:
- Reusable across components
- Testable in isolation
- Clear API

#### useCartCount
**Responsibility**: Manage cart count state and updates.

```typescript
export const useCartCount = () => {
  const [cartCount, setCartCount] = useState(0)

  // Fetch cart count
  // Listen for cart updates
  
  return cartCount
}
```

**Benefits**:
- Automatic updates via event listener
- Single source of truth
- Easy to mock for testing

#### useScrollBanner
**Responsibility**: Handle scroll behavior for banner visibility.

```typescript
export const useScrollBanner = () => {
  const [bannerVisible, setBannerVisible] = useState(true)
  
  // Handle scroll events
  
  return bannerVisible
}
```

**Benefits**:
- Encapsulated scroll logic
- Performance optimized
- Reusable

### Presentational Components

#### CartButton
**Responsibility**: Display cart icon with count badge.

```typescript
interface CartButtonProps {
  count: number
  mobile?: boolean
}

export const CartButton = ({ count, mobile }: CartButtonProps) => {
  // Render cart button with badge
}
```

**Benefits**:
- Pure presentational component
- Easy to test
- Reusable for desktop & mobile

#### Logo
**Responsibility**: Display brand logo.

```typescript
export const Logo = () => {
  // Desktop logo
}

export const MobileLogo = () => {
  // Mobile logo
}
```

**Benefits**:
- Separate variants for different layouts
- Easy to update branding
- No logic, just presentation

#### SearchBar
**Responsibility**: Search input with dropdown.

```typescript
export const SearchBar = ({ className }: SearchBarProps) => {
  // Local state for search
  // Handle dropdown
}
```

**Benefits**:
- Self-contained search logic
- Reusable across layouts
- Clean API

#### UserMenu
**Responsibility**: User dropdown menu with auth actions.

```typescript
interface UserMenuProps {
  user: User | null
  loading: boolean
  onLogout: () => void
  mobile?: boolean
}

export const UserMenu = (props: UserMenuProps) => {
  // Render dropdown menu
}
```

**Benefits**:
- Controlled component pattern
- Props-driven rendering
- Easy to test different states

### Layout Components

#### DesktopNavbar
**Responsibility**: Desktop layout composition.

```typescript
export const DesktopNavbar = ({
  user,
  loading,
  cartCount,
  onLogout,
  onCategoryClick
}: DesktopNavbarProps) => {
  return (
    <div className="hidden md:block">
      <Logo />
      <SearchBar />
      <CartButton count={cartCount} />
      <UserMenu user={user} onLogout={onLogout} />
    </div>
  )
}
```

**Benefits**:
- Composition of smaller components
- Clear props interface
- Responsive design

#### MobileNavbar
**Responsibility**: Mobile layout composition.

```typescript
export const MobileNavbar = (props: MobileNavbarProps) => {
  return (
    <div className="block md:hidden">
      <MobileLogo />
      <SearchBar />
      <CartButton count={cartCount} mobile />
      <UserMenu user={user} onLogout={onLogout} mobile />
    </div>
  )
}
```

**Benefits**:
- Separate mobile layout
- Reuses same components
- Mobile-optimized

## Type Safety

### types.ts
```typescript
export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  profile?: {
    fotoProfil: string | null
  }
}

export interface NavbarProps {
  bannerVisible?: boolean
}
```

**Benefits**:
- Type safety across all components
- Better IDE autocomplete
- Catch errors at compile time

## Testing Strategy

### Unit Tests
```typescript
// Test individual components
describe('CartButton', () => {
  it('displays count badge when count > 0', () => {})
  it('shows 99+ for count > 99', () => {})
})

// Test hooks
describe('useAuth', () => {
  it('fetches user on mount', () => {})
  it('handles logout', () => {})
})
```

### Integration Tests
```typescript
describe('MainNavbar', () => {
  it('renders desktop navbar on large screens', () => {})
  it('renders mobile navbar on small screens', () => {})
  it('updates cart count when cart changes', () => {})
})
```

## Performance Optimizations

### 1. **Lazy Loading**
```typescript
// Only load CategoryModal when needed
const CategoryModal = lazy(() => import('./CategoryModal'))
```

### 2. **Memoization**
```typescript
// Memoize expensive computations
const cartCount = useMemo(() => 
  cart.reduce((total, item) => total + item.quantity, 0),
  [cart]
)
```

### 3. **Event Delegation**
```typescript
// Use single event listener for scroll
window.addEventListener('scroll', handleScroll, { passive: true })
```

## Advantages of This Architecture

### 1. **Maintainability**
- Easy to find and fix bugs
- Clear component boundaries
- Self-documenting code

### 2. **Scalability**
- Easy to add new features
- Components can be reused
- Clear extension points

### 3. **Testability**
- Components are isolated
- Hooks can be tested separately
- Clear dependencies

### 4. **Developer Experience**
- Better IDE support
- Clear prop types
- Easy to understand

### 5. **Performance**
- Smaller bundle size (tree-shaking)
- Better code splitting
- Optimized re-renders

## Migration Guide

### Before (Monolithic)
```typescript
// 400+ lines in one file
export default function MainNavbar() {
  // All logic here
  // All UI here
  // Hard to maintain
}
```

### After (Modular)
```typescript
// 50 lines orchestrator
export default function MainNavbar() {
  const bannerVisible = useScrollBanner()
  const { user, loading, logout } = useAuth()
  const cartCount = useCartCount()
  
  return (
    <>
      <DesktopNavbar {...props} />
      <MobileNavbar {...props} />
    </>
  )
}
```

## Best Practices Applied

1. ✅ **Component Composition** - Build complex UI from simple components
2. ✅ **Custom Hooks** - Extract reusable logic
3. ✅ **Type Safety** - TypeScript for all components
4. ✅ **Separation of Concerns** - Each file has one responsibility
5. ✅ **DRY Principle** - No code duplication
6. ✅ **Single Responsibility** - Each component does one thing
7. ✅ **Props Drilling Solution** - Use composition instead
8. ✅ **Barrel Exports** - Clean import statements
9. ✅ **Controlled Components** - Props-driven rendering
10. ✅ **Performance** - Optimized re-renders

## Future Enhancements

1. **Context API** - For deeply nested props
2. **React Query** - For server state management
3. **Storybook** - Component documentation
4. **E2E Tests** - Playwright/Cypress tests
5. **Accessibility** - ARIA labels and keyboard navigation

## Conclusion

Refactored navbar menggunakan modern React patterns dan best practices. Code lebih maintainable, testable, dan scalable. Perfect untuk senior-level development! 🚀
