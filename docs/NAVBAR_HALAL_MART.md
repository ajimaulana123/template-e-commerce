# Navbar - Halal Mart Branding & Shadcn UI Integration

Dokumentasi perubahan navbar untuk branding Halal Mart dengan Shadcn UI components.

## Overview

Navbar telah diubah dari branding "jakartanotebook" menjadi "Halal Mart" dengan color scheme hijau dan menggunakan Shadcn UI components untuk konsistensi.

## Changes Summary

### 1. Logo Component (`components/navbar/Logo.tsx`)

#### Before (jakartanotebook)
```tsx
<span className="text-blue-600">jakarta</span>
<span className="text-orange-500">notebook</span>
```

#### After (Halal Mart)
```tsx
<Badge className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rotate-45" />
<span className="text-gray-800">Halal</span>
<Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
  Mart
</Badge>
```

**Shadcn UI Components Used**:
- `Badge` (variant="default") - Logo square icon
- `Badge` (variant="outline") - Brand name "Mart"
- `Badge` (variant="secondary") - Tagline

**Features**:
- Gradient green logo icon (rotated 45°)
- Two-part brand name with Badge
- Tagline: "🇯🇵 Halal Products in Tokyo"
- Responsive sizing (desktop vs mobile)

---

### 2. SearchBar Component (`components/navbar/SearchBar.tsx`)

#### Changes
- **Placeholder**: "Cari produk..." → "Cari produk halal..."
- **Button Color**: Gray → Green (`bg-green-600 hover:bg-green-700`)
- **Focus Ring**: Default → Green (`focus:border-green-500 focus:ring-green-500`)

**Shadcn UI Components Used**:
- `Input` - Search input field
- `Button` - Search submit button

---

### 3. Category Button

#### Desktop (`DesktopNavbar.tsx`)
```tsx
// Before: Orange
className="bg-orange-500 border-orange-500 hover:bg-orange-600"

// After: Green
className="bg-green-600 border-green-600 hover:bg-green-700"
```

#### Mobile (`MobileNavbar.tsx`)
```tsx
// Before: Orange icon
<Menu className="text-orange-500" />

// After: Green icon
<Menu className="text-green-600" />
```

---

### 4. Cart Button (`components/navbar/CartButton.tsx`)

#### Changes
- **Icon Color**: Orange → Green (`text-green-600`)
- **Badge**: Plain span → Shadcn UI Badge
- **Hover**: Orange → Green (`hover:text-green-600`)

**Shadcn UI Components Used**:
- `Button` (variant="ghost") - Wrapper button
- `Badge` (variant="destructive") - Count badge

**Before**:
```tsx
<Link className="text-orange-500 hover:text-orange-600">
  <ShoppingCart />
  <span className="bg-red-500">count</span>
</Link>
```

**After**:
```tsx
<Button variant="ghost" asChild>
  <Link className="text-green-600 hover:text-green-600">
    <ShoppingCart />
    <Badge variant="destructive">count</Badge>
  </Link>
</Button>
```

---

### 5. Wishlist Button (`components/navbar/WishlistButton.tsx`)

#### Changes
- **Badge**: Plain span → Shadcn UI Badge
- **Wrapper**: Plain Link → Button with asChild

**Shadcn UI Components Used**:
- `Button` (variant="ghost") - Wrapper button
- `Badge` (variant="destructive") - Count badge

**Features**:
- Consistent badge styling with Cart
- Hover states from Button component
- Accessible focus states

---

## Color Scheme

### Primary Colors (Green)
| Element | Color | Usage |
|---------|-------|-------|
| Logo Gradient | `from-green-400 to-green-600` | Brand icon |
| Brand Name | `text-green-600 border-green-600` | "Mart" badge |
| Category Button | `bg-green-600 hover:bg-green-700` | Primary action |
| Cart Icon | `text-green-600` | Navigation |
| Search Button | `bg-green-600 hover:bg-green-700` | Submit action |
| Menu Icon | `text-green-600` | Mobile menu |

### Secondary Colors
| Element | Color | Usage |
|---------|-------|-------|
| Tagline Badge | `bg-blue-50 text-blue-700` | Information |
| Wishlist Icon | `text-red-500` | Favorite action |
| Count Badge | `bg-red-500` (destructive) | Notifications |

---

## Responsive Behavior

### Desktop (>768px)
- Full logo with gradient icon + text + tagline
- All navigation items visible
- Full button labels ("My Cart", "Wishlist")

### Mobile (<768px)
- Compact logo (smaller icon + text only)
- Icon-only navigation
- Hamburger menu for categories

---

## Shadcn UI Components Summary

| Component | Variants Used | Purpose |
|-----------|---------------|---------|
| **Badge** | default, outline, secondary, destructive | Logo, brand name, counts, tagline |
| **Button** | default, ghost, outline | Actions, navigation |
| **Input** | - | Search field |

---

## Accessibility Improvements

### From Shadcn UI
✅ **Button Component**:
- Focus visible states
- Keyboard navigation
- ARIA attributes
- Disabled state handling

✅ **Badge Component**:
- Semantic HTML
- Color contrast compliance
- Screen reader friendly

✅ **Input Component**:
- Label association
- Error states
- Focus management

### Custom Enhancements
✅ Descriptive link text
✅ Logical tab order
✅ Visible focus indicators
✅ Sufficient color contrast (WCAG AA)

---

## Brand Identity

### Logo Elements
1. **Icon**: Green gradient square (rotated 45°)
2. **Text**: "Halal" (gray) + "Mart" (green badge)
3. **Tagline**: "🇯🇵 Halal Products in Tokyo"

### Typography
- **Desktop Logo**: `text-xl xl:text-2xl`
- **Mobile Logo**: `text-sm`
- **Tagline**: `text-xs`

### Spacing
- **Desktop**: `gap-3` between elements
- **Mobile**: `gap-1.5` between elements

---

## Implementation Details

### Logo Component Structure
```tsx
<Link href="/">
  {/* Icon */}
  <Badge variant="default" className="gradient rotate-45" />
  
  {/* Brand Name */}
  <span>Halal</span>
  <Badge variant="outline">Mart</Badge>
  
  {/* Tagline (desktop only) */}
  <Badge variant="secondary">🇯🇵 Halal Products in Tokyo</Badge>
</Link>
```

### Button Wrapper Pattern
```tsx
<Button variant="ghost" asChild>
  <Link href="/path">
    <Icon />
    <span>Label</span>
  </Link>
</Button>
```

**Benefits**:
- Semantic HTML (Link for navigation)
- Button styling and behavior
- No wrapper div needed
- Accessible by default

---

## Testing Checklist

- [x] Logo displays correctly on desktop
- [x] Logo displays correctly on mobile
- [x] Search placeholder updated
- [x] Search button green color
- [x] Category button green color
- [x] Cart icon green color
- [x] Cart badge displays count
- [x] Wishlist badge displays count
- [x] All hover states work
- [x] All focus states visible
- [x] Keyboard navigation works
- [x] Mobile menu icon green
- [x] Responsive breakpoints work
- [x] No console errors
- [x] Shadcn UI components render correctly

---

## Migration Notes

### Color Migration
```tsx
// Old colors → New colors
text-blue-600    → text-gray-800 (Halal)
text-orange-500  → text-green-600 (Mart, buttons)
bg-orange-500    → bg-green-600 (buttons)
hover:bg-orange-600 → hover:bg-green-700
```

### Component Migration
```tsx
// Plain HTML → Shadcn UI
<span className="badge"> → <Badge variant="...">
<a className="button">   → <Button asChild><Link>
<div className="icon">   → <Badge className="icon">
```

---

## Future Enhancements

- [ ] Add halal certification badge to logo
- [ ] Implement language switcher (ID/EN/JP)
- [ ] Add prayer time indicator
- [ ] Qibla direction indicator
- [ ] Halal product filter in search
- [ ] Category icons with halal symbols
- [ ] Dark mode support
- [ ] Animation on logo hover

---

## Related Files

- `components/navbar/Logo.tsx` - Brand logo
- `components/navbar/SearchBar.tsx` - Search functionality
- `components/navbar/CartButton.tsx` - Shopping cart
- `components/navbar/WishlistButton.tsx` - Wishlist
- `components/navbar/DesktopNavbar.tsx` - Desktop layout
- `components/navbar/MobileNavbar.tsx` - Mobile layout
- `components/MainNavbar.tsx` - Main orchestrator

---

## Brand Guidelines

### Do's ✅
- Use green (#10b981 family) for primary actions
- Use Badge component for brand elements
- Maintain gradient on logo icon
- Keep "Halal" and "Mart" as separate elements
- Use emoji flag 🇯🇵 for location context

### Don'ts ❌
- Don't use orange colors (old brand)
- Don't combine "Halal" and "Mart" into one word
- Don't remove the gradient from logo
- Don't use blue for primary actions
- Don't hide the tagline on large screens
