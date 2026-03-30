# Design Document: Homepage UX Improvements

## Overview

This design document outlines the technical approach for transforming the Halal Mart homepage from its current state (UI/UX score: 44/100) to a modern, accessible, and conversion-optimized e-commerce experience (target score: 85+/100).

The design follows a mobile-first approach, leverages existing components where possible, and introduces new patterns for enhanced user engagement. Key improvements include hero section integration, touch-friendly navigation, comprehensive accessibility enhancements, strategic animations, and social proof elements.

### Design Principles

1. **Mobile-First Responsive Design**: All components designed for mobile screens first, then enhanced for larger viewports
2. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced features layer on top
3. **Performance-Conscious**: Lazy loading, code splitting, and optimized assets to maintain <3s load time
4. **Accessibility-First**: WCAG 2.1 AA compliance minimum, targeting AAA where feasible
5. **Component Reusability**: Leverage existing components (HeroSlider, CategoryIcons, ProductGrid) and extend them
6. **Design System Consistency**: Use Tailwind CSS and shadcn/ui patterns throughout

## Architecture

### Component Hierarchy

```
HomePage (app/page.tsx)
└── HomePageClient (app/HomePageClient.tsx)
    ├── HeroSection (new)
    │   ├── HeroSlider (existing, enhanced)
    │   └── SideBanners (new, desktop only)
    ├── CategoryIconsSection (enhanced)
    │   └── CategoryIcons (existing, enhanced)
    ├── FlashSaleSection (new)
    │   ├── CountdownTimer (new)
    │   ├── ProductGrid (existing, enhanced)
    │   └── UrgencyIndicators (new)
    ├── FeaturedProductsSection (enhanced)
    │   └── ProductGrid (existing, enhanced)
    ├── TestimonialsSection (new)
    │   └── TestimonialCard (new)
    ├── CTASection (new)
    │   └── EnhancedButton (existing)
    └── Footer (enhanced)
        ├── FooterNavigation (new)
        ├── SocialLinks (new)
        ├── PaymentMethods (new)
        └── NewsletterSignup (new)

MobileBottomNav (new, mobile only)
└── NavItem (new)

StickyFloatingCTA (new, scroll-triggered)
```

### Data Flow

1. **Server-Side Rendering (SSR)**: Initial page load renders with server-fetched data
2. **Client-Side Hydration**: Interactive features activate after hydration
3. **Incremental Loading**: Below-the-fold content lazy loads as user scrolls
4. **State Management**: React hooks for local state, no global state library needed for homepage

### File Structure

```
app/
├── page.tsx (SSR entry point)
├── HomePageClient.tsx (enhanced)
└── homepage/
    ├── components/
    │   ├── HeroSection.tsx
    │   ├── SideBanners.tsx
    │   ├── FlashSaleSection.tsx
    │   ├── CountdownTimer.tsx
    │   ├── UrgencyIndicator.tsx
    │   ├── TestimonialsSection.tsx
    │   ├── TestimonialCard.tsx
    │   ├── CTASection.tsx
    │   ├── EnhancedFooter.tsx
    │   ├── FooterNavigation.tsx
    │   ├── SocialLinks.tsx
    │   ├── PaymentMethods.tsx
    │   └── NewsletterSignup.tsx
    ├── hooks/
    │   ├── useScrollReveal.ts
    │   ├── useCountdown.ts
    │   └── useIntersectionObserver.ts
    └── utils/
        ├── animations.ts
        └── accessibility.ts

components/
├── HeroSlider.tsx (enhanced)
├── CategoryIcons.tsx (enhanced)
├── ProductGrid.tsx (enhanced)
├── MobileBottomNav.tsx (new)
└── StickyFloatingCTA.tsx (new)

lib/
└── design-tokens.ts (enhanced with new tokens)
```

## Components and Interfaces

### 1. HeroSection Component

**Purpose**: Integrate existing HeroSlider with responsive layout and side banners

**Props Interface**:
```typescript
interface HeroSectionProps {
  slides: HeroSlide[];
  sideBanners?: SideBanner[];
  className?: string;
}

interface HeroSlide {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  priority?: boolean; // For image loading priority
}

interface SideBanner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}
```

**Responsive Behavior**:
- Mobile (<768px): Full-width slider, 100vh max-height, touch swipe enabled
- Tablet (768px-1023px): Full-width slider, 70vh height
- Desktop (≥1024px): 60% slider + 40% side banners, 60vh min-height

**Accessibility Features**:
- `aria-label="Hero carousel"` on slider container
- `aria-live="polite"` for slide changes
- Keyboard navigation (arrow keys, tab)
- Pause button for auto-rotation
- Skip link to main content

### 2. MobileBottomNav Component

**Purpose**: Provide thumb-friendly navigation for mobile users

**Props Interface**:
```typescript
interface MobileBottomNavProps {
  items: NavItem[];
  activeItem?: string;
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number; // For cart count, wishlist count
  ariaLabel: string;
}
```

**Layout Specifications**:
- Fixed position at bottom: 0
- Height: 64px (provides 44px touch targets with padding)
- Background: white with subtle shadow
- Items: 3-5 evenly distributed
- Touch target: 48x48px minimum
- Spacing: 8dp between items

**Default Navigation Items**:
1. Home (House icon)
2. Categories (Grid icon)
3. Cart (Shopping cart icon with badge)
4. Wishlist (Heart icon with badge)
5. Account (User icon)

**Visibility**:
- Display: Mobile only (<768px)
- Hidden: Desktop (≥768px)
- Z-index: 40 (above content, below modals)

### 3. Enhanced CategoryIcons Component

**Current Issues to Fix**:
- Touch targets too small (<44px)
- No horizontal scroll indicator
- Missing hover/active states
- Insufficient spacing

**Enhanced Props Interface**:
```typescript
interface CategoryIconsProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
  className?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  productCount?: number;
  ariaLabel: string;
}
```

**Enhancements**:
- Minimum touch target: 56x56px (icon + padding)
- Horizontal scroll with snap points
- Scroll indicator (gradient fade at edges)
- Active state: border + background color
- Hover state: scale(1.05) + shadow
- Spacing: 12px between items
- Keyboard navigation support

### 4. Enhanced ProductGrid Component

**Current Issues to Fix**:
- Template literal className syntax (won't compile)
- Insufficient gap between cards
- No hover animations
- Missing loading states

**Fixed Implementation**:
```typescript
interface ProductGridProps {
  products: Product[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  loading?: boolean;
  className?: string;
}
```

**Responsive Grid Configuration**:
```typescript
const defaultColumns = {
  mobile: 2,    // <640px
  tablet: 3,    // 640px-1024px
  desktop: 4    // ≥1024px
};

const defaultGap = {
  mobile: 16,   // 1rem
  tablet: 20,   // 1.25rem
  desktop: 24   // 1.5rem
};
```

**Fixed Tailwind Classes** (no template literals):
```typescript
// Instead of: className={`grid-cols-${columns.mobile}`}
// Use conditional classes:
const gridClasses = cn(
  "grid",
  columns.mobile === 2 && "grid-cols-2",
  columns.mobile === 3 && "grid-cols-3",
  "md:grid-cols-3",
  "lg:grid-cols-4",
  "gap-4 md:gap-5 lg:gap-6"
);
```

**Card Hover Animation**:
```css
.product-card {
  transition: transform 300ms ease-out, box-shadow 300ms ease-out;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
```

### 5. FlashSaleSection Component

**Purpose**: Create urgency and highlight time-limited offers

**Props Interface**:
```typescript
interface FlashSaleSectionProps {
  title: string;
  endTime: Date;
  products: Product[];
  maxProducts?: number;
  className?: string;
}
```

**Visual Design**:
- Distinctive border: 2px solid gradient (red to orange)
- Background: subtle gradient or pattern
- Prominent heading with fire emoji icon
- Countdown timer: large, bold numbers
- Stock indicators on product cards
- View counters showing popularity

**CountdownTimer Sub-component**:
```typescript
interface CountdownTimerProps {
  endTime: Date;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
```

**Timer Display Format**:
- Days: Show only if >0
- Hours: Always show (00-23)
- Minutes: Always show (00-59)
- Seconds: Always show (00-59)
- Update interval: 1000ms
- Accessibility: `aria-live="polite"` for screen readers

### 6. TestimonialsSection Component

**Purpose**: Build trust through customer social proof

**Props Interface**:
```typescript
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
}

interface Testimonial {
  id: string;
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  date: Date;
  productPurchased?: string;
  verified?: boolean;
  avatarUrl?: string;
}
```

**Layout**:
- Desktop: 3 columns, side-by-side
- Tablet: 2 columns
- Mobile: 1 column, horizontal scroll with snap
- Card design: white background, subtle shadow, rounded corners

**TestimonialCard Design**:
- Star rating at top (visual + aria-label)
- Review text (max 3 lines, truncate with "Read more")
- Customer name and date
- Verified badge if applicable
- Avatar (or initials fallback)

### 7. EnhancedFooter Component

**Purpose**: Provide comprehensive navigation, trust signals, and newsletter signup

**Structure**:
```typescript
interface FooterProps {
  navigationGroups: FooterNavGroup[];
  socialLinks: SocialLink[];
  paymentMethods: PaymentMethod[];
  newsletterConfig: NewsletterConfig;
  className?: string;
}

interface FooterNavGroup {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'tiktok';
  url: string;
  ariaLabel: string;
}

interface PaymentMethod {
  name: string;
  icon: React.ComponentType;
}

interface NewsletterConfig {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  onSubmit: (email: string) => Promise<void>;
}
```

**Layout**:
- Desktop: 4 columns (Shop, Support, Company, Newsletter)
- Tablet: 2 columns
- Mobile: 1 column, collapsible sections
- Bottom bar: Social links, payment methods, copyright

**Navigation Groups**:
1. **Shop**: Categories, Flash Sales, New Arrivals, Best Sellers
2. **Support**: Contact Us, FAQ, Shipping Info, Returns, Track Order
3. **Company**: About Us, Careers, Blog, Press
4. **Legal**: Terms of Service, Privacy Policy, Cookie Policy

### 8. StickyFloatingCTA Component

**Purpose**: Maintain CTA visibility as user scrolls

**Props Interface**:
```typescript
interface StickyFloatingCTAProps {
  text: string;
  href: string;
  icon?: React.ComponentType;
  showAfterScroll?: number; // pixels scrolled before showing
  position?: 'bottom-right' | 'bottom-center' | 'top-right';
  variant?: 'primary' | 'secondary';
  className?: string;
}
```

**Behavior**:
- Hidden initially (first 300px of scroll)
- Fade in when user scrolls past hero section
- Fixed position with smooth entrance animation
- Pulse animation every 5 seconds
- Hide when footer is in viewport
- Mobile: Bottom center, full width
- Desktop: Bottom right, fixed width

## Data Models

### HeroSlide Data Model

```typescript
interface HeroSlide {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  priority?: boolean;
  alt: string; // For accessibility
  backgroundColor?: string; // Fallback while loading
}
```

**Data Source**: CMS or database table `hero_slides`
**Fetching**: Server-side in `app/page.tsx`
**Caching**: Static generation with revalidation every 1 hour

### FlashSale Data Model

```typescript
interface FlashSale {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  products: FlashSaleProduct[];
  active: boolean;
}

interface FlashSaleProduct extends Product {
  originalPrice: number;
  discountPercentage: number;
  stockRemaining: number;
  viewCount: number;
  soldCount: number;
}
```

**Data Source**: Database table `flash_sales` with relation to `products`
**Fetching**: Server-side with real-time stock updates
**Caching**: ISR with 60-second revalidation

### Testimonial Data Model

```typescript
interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: Date;
  productId?: string;
  verified: boolean;
  helpful: number; // Helpful vote count
  avatarUrl?: string;
  featured: boolean; // For homepage display
}
```

**Data Source**: Database table `reviews` filtered by `featured: true`
**Fetching**: Server-side, top 6 featured reviews
**Caching**: Static generation with daily revalidation

### Newsletter Subscription Model

```typescript
interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
  source: 'homepage' | 'checkout' | 'footer';
  confirmed: boolean;
  preferences?: {
    deals: boolean;
    newProducts: boolean;
    blog: boolean;
  };
}
```

**Data Source**: Database table `newsletter_subscriptions`
**API Endpoint**: `POST /api/newsletter/subscribe`
**Validation**: Email format, duplicate check, rate limiting

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Touch-Enabled Swipe Navigation

*For any* hero slider on mobile viewport (<768px), swiping left or right should advance or retreat the slider to the adjacent slide.

**Validates: Requirements 1.4**

### Property 2: Required Hero Elements Present

*For any* hero section render, the DOM should contain both a headline element and a primary CTA button within the hero container.

**Validates: Requirements 1.5** (example)

### Property 3: Loading State Skeleton Screens

*For any* asynchronous content section (hero, products, testimonials), when in loading state, the system should render skeleton screens that match the expected content structure.

**Validates: Requirements 1.6, 4.6, 13.1**

### Property 4: Mobile Bottom Navigation Presence

*For any* mobile viewport (<768px), the page should render a bottom navigation bar containing 3-5 navigation items.

**Validates: Requirements 2.1** (example)

### Property 5: Universal Touch Target Minimum Size

*For any* interactive element (buttons, links, nav items, category icons), the computed dimensions should be minimum 44x44 pixels including padding.

**Validates: Requirements 2.2, 3.1, 3.2, 3.5**

### Property 6: Interactive Element Spacing

*For any* two adjacent interactive elements, the spacing between their touch target boundaries should be minimum 8 pixels.

**Validates: Requirements 2.3, 3.3**

### Property 7: Active Navigation Visual Feedback

*For any* bottom navigation item, when marked as active, it should have distinct visual styling (different class, aria-current attribute, or style) compared to inactive items.

**Validates: Requirements 2.4**

### Property 8: Desktop Bottom Navigation Hidden

*For any* desktop viewport (≥1024px), the bottom navigation component should not be visible (display: none or not rendered).

**Validates: Requirements 2.5** (example)

### Property 9: No Template Literal ClassNames

*For any* component className prop, the value should not contain template literal syntax (${...}) that would fail Tailwind compilation.

**Validates: Requirements 4.1**

### Property 10: Responsive Product Grid Layout

*For any* product grid, the number of columns should match the viewport: 2 columns on mobile (<640px), 3 columns on tablet (640px-1024px), and 4-6 columns on desktop (≥1024px).

**Validates: Requirements 4.2, 4.3, 4.4** (example)

### Property 11: Product Card Hover Transform

*For any* product card, hovering should apply a translateY transform (lifting effect) via CSS transition.

**Validates: Requirements 4.5, 6.3**

### Property 12: Flash Sale Distinctive Styling

*For any* flash sale section render, the section should have distinctive visual styling (border, background, or shadow class) that differentiates it from regular product sections.

**Validates: Requirements 5.1** (example)

### Property 13: Countdown Timer Display

*For any* active flash sale, the section should render a countdown timer component displaying hours, minutes, and seconds.

**Validates: Requirements 5.2** (example)

### Property 14: Stock Level Indicators

*For any* flash sale product with stock remaining below a threshold (e.g., <10), the product card should display a stock level indicator.

**Validates: Requirements 5.3**

### Property 15: Consistent Section Spacing

*For any* two adjacent product sections on the homepage, the vertical spacing between them should be consistent (48-64px range).

**Validates: Requirements 5.4**

### Property 16: Proper Heading Hierarchy

*For any* page render, heading elements should follow proper hierarchical structure: h1 for page title, h2 for main sections, h3 for subsections, with no skipped levels.

**Validates: Requirements 5.5**

### Property 17: Scroll-Triggered Reveal Animations

*For any* section with scroll-reveal animation, when the section enters the viewport (via intersection observer), animation classes should be added to trigger the reveal.

**Validates: Requirements 6.2**

### Property 18: CTA Pulse Animation

*For any* primary CTA button, the element should have animation classes applied for pulse or glow effect.

**Validates: Requirements 6.4** (example)

### Property 19: Reduced Motion Respect

*For any* animated element, when the user's system has prefers-reduced-motion enabled, animations should be disabled or significantly reduced.

**Validates: Requirements 6.6**

### Property 20: Interactive Elements Have Accessible Names

*For any* interactive element (button, link, control), the element should have an accessible name via aria-label, aria-labelledby, or text content.

**Validates: Requirements 7.1**

### Property 21: No Raw Emoji in Headings

*For any* heading element, the text content should not contain raw emoji characters (should use icon components with accessible text instead).

**Validates: Requirements 7.2**

### Property 22: Valid Navigation Hrefs

*For any* navigation link element, the href attribute should not be a placeholder "#" value (should be a valid path or URL).

**Validates: Requirements 7.3**

### Property 23: Skip-to-Content Link First

*For any* page render, the first focusable element in tab order should be a skip-to-content link.

**Validates: Requirements 7.4** (example)

### Property 24: Images Have Alt Text

*For any* img element rendered on the page, the alt attribute should be present and non-empty (or empty only for decorative images with role="presentation").

**Validates: Requirements 7.6**

### Property 25: Hero CTA Present

*For any* hero section render, a primary CTA button should be present with non-empty action text.

**Validates: Requirements 8.1** (example)

### Property 26: Sticky CTA After Scroll

*For any* page state where scroll position exceeds the hero section height, a sticky or floating CTA should be visible.

**Validates: Requirements 8.2** (example)

### Property 27: Secondary CTA Placement

*For any* homepage with multiple product sections, secondary CTAs should appear after every 2-3 product sections.

**Validates: Requirements 8.3**

### Property 28: CTA Contrast Ratio

*For any* CTA button, the contrast ratio between text color and background color should be minimum 7:1.

**Validates: Requirements 8.4**

### Property 29: Footer Navigation Groups

*For any* footer render, navigation links should be organized into logical groups (Shop, Support, Company, Legal).

**Validates: Requirements 9.1** (example)

### Property 30: Required Footer Links

*For any* footer render, links to About, Contact, Terms of Service, Privacy Policy, and FAQ should be present.

**Validates: Requirements 9.2** (example)

### Property 31: Social Media Links Valid

*For any* social media link in the footer, the href should be a valid URL (not empty or "#").

**Validates: Requirements 9.3**

### Property 32: Payment Method Icons

*For any* footer render, accepted payment method icons should be displayed.

**Validates: Requirements 9.4** (example)

### Property 33: Newsletter Email Validation

*For any* newsletter signup form, submitting an invalid email format should trigger validation error and prevent submission.

**Validates: Requirements 9.5**

### Property 34: Mobile Footer Collapsible

*For any* mobile viewport (<768px), footer navigation sections should be collapsible (accordion or similar pattern).

**Validates: Requirements 9.6** (example)

### Property 35: Minimum Testimonials Count

*For any* homepage render, the testimonials section should display minimum 3 testimonials.

**Validates: Requirements 10.1** (example)

### Property 36: Testimonial Required Fields

*For any* testimonial card, it should include customer name, rating (1-5 stars), and review text.

**Validates: Requirements 10.2**

### Property 37: Trust Badges Present

*For any* footer or checkout section, trust badges (SSL, secure payment, guarantees) should be displayed.

**Validates: Requirements 10.3** (example)

### Property 38: Flash Sale View Counters

*For any* flash sale product card, a view counter should be displayed indicating product popularity.

**Validates: Requirements 10.4**

### Property 39: Lazy Loading for Performance

*For any* below-the-fold image or social proof element, the loading="lazy" attribute or intersection observer lazy loading should be implemented.

**Validates: Requirements 10.5, 11.2**

### Property 40: Hero First Slide Priority

*For any* hero slider render, the first slide image should have priority loading (fetchpriority="high" or similar).

**Validates: Requirements 11.3** (example)

### Property 41: GPU-Accelerated Animations

*For any* CSS animation or transition, the properties animated should be limited to transform and opacity (GPU-accelerated properties).

**Validates: Requirements 11.4**

### Property 42: Consistent Breakpoint Values

*For any* responsive styling (media queries or responsive classes), breakpoint values should be consistent: 640px, 768px, 1024px, 1280px.

**Validates: Requirements 12.2**

### Property 43: Error State with Retry

*For any* failed product data load, an error message with a retry button should be displayed.

**Validates: Requirements 13.2** (example)

### Property 44: Hero Slider Fallback

*For any* hero slider load failure, a fallback static hero image with CTA should be displayed.

**Validates: Requirements 13.3** (example)

### Property 45: Empty State with Actions

*For any* empty product category, an engaging empty state with suggested actions should be displayed.

**Validates: Requirements 13.5** (example)

### Property 46: No Hardcoded Color Values

*For any* component style definition, colors should use CSS custom properties or Tailwind theme colors, not hardcoded hex values.

**Validates: Requirements 14.1**

## Error Handling

### Client-Side Error Boundaries

Implement React Error Boundaries at strategic levels:

1. **Page-Level Boundary**: Catches catastrophic errors, displays full-page error state
2. **Section-Level Boundaries**: Wrap major sections (Hero, Products, Testimonials)
3. **Component-Level Boundaries**: Wrap complex components (HeroSlider, CountdownTimer)

**Error Boundary Implementation**:
```typescript
interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class SectionErrorBoundary extends React.Component<ErrorBoundaryProps> {
  // Standard error boundary implementation
  // Log errors to monitoring service
  // Display fallback UI
}
```

### Data Fetching Error Handling

**Server-Side (app/page.tsx)**:
```typescript
async function getHomePageData() {
  try {
    const [slides, products, testimonials] = await Promise.allSettled([
      fetchHeroSlides(),
      fetchFeaturedProducts(),
      fetchTestimonials()
    ]);
    
    return {
      slides: slides.status === 'fulfilled' ? slides.value : DEFAULT_SLIDES,
      products: products.status === 'fulfilled' ? products.value : [],
      testimonials: testimonials.status === 'fulfilled' ? testimonials.value : []
    };
  } catch (error) {
    logger.error('Homepage data fetch failed', error);
    return DEFAULT_HOMEPAGE_DATA;
  }
}
```

**Client-Side (React Query/SWR)**:
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['flash-sale'],
  queryFn: fetchFlashSale,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  staleTime: 60000 // 1 minute
});

if (error) {
  return <ErrorState message="Failed to load flash sale" onRetry={refetch} />;
}
```

### Graceful Degradation Strategies

1. **Hero Slider Failure**: Display static hero image with CTA
2. **Product Data Failure**: Show cached products or empty state with browse CTA
3. **Testimonials Failure**: Hide section entirely (not critical)
4. **Countdown Timer Failure**: Show static "Limited Time" badge
5. **Image Load Failure**: Display placeholder with product name

### Network Error Handling

**Offline Detection**:
```typescript
useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);

if (!isOnline) {
  return <OfflineBanner message="You're offline. Some features may be limited." />;
}
```

### Form Validation Errors

**Newsletter Signup**:
```typescript
const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return null;
};

const handleSubmit = async (email: string) => {
  const error = validateEmail(email);
  if (error) {
    setError(error);
    return;
  }
  
  try {
    await subscribeToNewsletter(email);
    setSuccess(true);
  } catch (err) {
    if (err.code === 'DUPLICATE_EMAIL') {
      setError('This email is already subscribed');
    } else {
      setError('Subscription failed. Please try again.');
    }
  }
};
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, error conditions, and integration points
- **Property Tests**: Verify universal properties across all inputs through randomization

### Property-Based Testing Configuration

**Library**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: homepage-ux-improvements, Property {N}: {description}`

**Example Property Test**:
```typescript
import fc from 'fast-check';

describe('Feature: homepage-ux-improvements, Property 5: Universal Touch Target Minimum Size', () => {
  it('should ensure all interactive elements meet 44x44px minimum', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          type: fc.constantFrom('button', 'link', 'nav-item'),
          width: fc.integer({ min: 44, max: 200 }),
          height: fc.integer({ min: 44, max: 200 })
        })),
        (elements) => {
          // Render elements
          const rendered = renderInteractiveElements(elements);
          
          // Check each element meets minimum
          rendered.forEach(el => {
            const rect = el.getBoundingClientRect();
            expect(rect.width).toBeGreaterThanOrEqual(44);
            expect(rect.height).toBeGreaterThanOrEqual(44);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

**Component Tests** (React Testing Library):
- Hero Section: Render, navigation, responsive behavior
- Bottom Navigation: Item rendering, active states, click handlers
- Product Grid: Layout, hover effects, loading states
- Countdown Timer: Time display, updates, expiration
- Testimonials: Card rendering, rotation, accessibility
- Footer: Link presence, form validation, responsive layout

**Integration Tests**:
- Full homepage render with all sections
- Data fetching and error handling
- Scroll-triggered animations
- Responsive breakpoint transitions
- Accessibility tree structure

**Visual Regression Tests** (Playwright + Percy/Chromatic):
- Homepage at all breakpoints (mobile, tablet, desktop)
- Hover states and animations
- Loading states and skeletons
- Error states and empty states
- Dark mode preparation (when implemented)

### Accessibility Testing

**Automated Tools**:
- `@axe-core/react` for runtime accessibility checks
- Lighthouse CI for accessibility scoring
- `jest-axe` for unit test accessibility validation

**Manual Testing Checklist**:
- Screen reader navigation (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Focus management and visible focus indicators
- Color contrast verification
- Touch target size verification on real devices

### Performance Testing

**Metrics to Track**:
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.8s
- Cumulative Layout Shift (CLS): <0.1
- First Input Delay (FID): <100ms

**Testing Tools**:
- Lighthouse CI in GitHub Actions
- WebPageTest for real-world performance
- Chrome DevTools Performance profiling
- Bundle size analysis (webpack-bundle-analyzer)

### Test Coverage Goals

- Unit test coverage: >80% for new components
- Property test coverage: All 46 properties implemented
- Integration test coverage: All critical user paths
- Accessibility test coverage: 100% of interactive elements
- Visual regression: All breakpoints and states

### Continuous Integration

**GitHub Actions Workflow**:
1. Run unit tests and property tests
2. Run Lighthouse CI for performance and accessibility
3. Run visual regression tests
4. Check bundle size against budget
5. Verify no accessibility violations
6. Generate coverage report

**Quality Gates**:
- All tests must pass
- Accessibility score ≥95
- Performance score ≥85
- No critical accessibility violations
- Bundle size within budget (+10% max)
