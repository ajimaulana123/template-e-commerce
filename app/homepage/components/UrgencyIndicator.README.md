# UrgencyIndicator Component

A reusable React component that displays urgency signals to encourage purchase decisions through stock level indicators and view counters.

## Features

- **Stock Level Indicators**: Shows "Only X left!" when stock is below a configurable threshold
- **View Counters**: Displays popularity with "X viewing" when views exceed a threshold
- **Conditional Rendering**: Only renders when thresholds are met
- **Accessibility**: Full ARIA support with live regions and descriptive labels
- **Responsive**: Compact and detailed variants for different layouts
- **Customizable**: Configurable thresholds and styling

## Requirements Validation

- **Requirement 5.3**: Flash Sale products with limited stock display stock level indicators
- **Requirement 10.4**: Flash Sale products show view counters indicating product popularity

## Usage

### Basic Usage

```tsx
import UrgencyIndicator from '@/app/homepage/components/UrgencyIndicator'

// Show stock urgency for low stock items
<UrgencyIndicator stockRemaining={3} />

// Show popularity for high-view items
<UrgencyIndicator viewCount={150} />

// Show both indicators
<UrgencyIndicator stockRemaining={5} viewCount={200} />
```

### With Custom Thresholds

```tsx
// Only show stock indicator when stock is below 5
<UrgencyIndicator 
  stockRemaining={8} 
  stockThreshold={5} 
/>

// Only show view counter when views exceed 100
<UrgencyIndicator 
  viewCount={75} 
  viewThreshold={100} 
/>
```

### Variants

```tsx
// Compact variant (default) - smaller text and padding
<UrgencyIndicator 
  stockRemaining={3} 
  variant="compact" 
/>

// Detailed variant - larger text and padding
<UrgencyIndicator 
  stockRemaining={3} 
  variant="detailed" 
/>
```

### Integration with Product Cards

```tsx
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      
      {/* Add urgency indicators */}
      <UrgencyIndicator 
        stockRemaining={product.stock}
        viewCount={product.viewCount}
        variant="compact"
      />
      
      <div className="price">{product.price}</div>
      <button>Add to Cart</button>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stockRemaining` | `number \| undefined` | - | Current stock level. Shows indicator when below threshold |
| `viewCount` | `number \| undefined` | - | Number of views. Shows counter when above threshold |
| `stockThreshold` | `number` | `10` | Stock level below which indicator shows |
| `viewThreshold` | `number` | `50` | View count above which counter shows |
| `variant` | `'compact' \| 'detailed'` | `'compact'` | Display size variant |
| `className` | `string` | - | Additional CSS classes |

## Behavior

### Stock Level Indicator

- **Shows when**: `stockRemaining > 0 && stockRemaining <= stockThreshold`
- **Display**: "Only X left!" with package icon
- **Styling**: Orange background with border
- **Accessibility**: `aria-label="Only X items left in stock"`

### View Counter

- **Shows when**: `viewCount >= viewThreshold`
- **Display**: "X viewing" with eye icon
- **Formatting**: 
  - Shows exact count for < 1000 views
  - Shows "1K+" for >= 1000 views
  - Shows "5K+" for >= 5000 views
- **Styling**: Blue background with border
- **Accessibility**: `aria-label="X people viewing this product"`

### Conditional Rendering

The component returns `null` (renders nothing) when:
- No props are provided
- Stock is above threshold AND views are below threshold
- Stock is 0 or negative
- Both indicators fail their threshold checks

## Accessibility

The component follows WCAG 2.1 AA guidelines:

- **Live Region**: Container has `role="status"` and `aria-live="polite"` for screen reader announcements
- **Descriptive Labels**: Each indicator has a descriptive `aria-label`
- **Icon Hiding**: Icons are marked `aria-hidden="true"` to avoid redundant announcements
- **Semantic HTML**: Uses semantic elements and proper ARIA attributes

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
// Add custom classes
<UrgencyIndicator 
  stockRemaining={3}
  className="my-4 justify-center"
/>
```

### Default Styles

**Stock Indicator**:
- Background: `bg-orange-100`
- Text: `text-orange-800`
- Border: `border-orange-200`

**View Counter**:
- Background: `bg-blue-100`
- Text: `text-blue-800`
- Border: `border-blue-200`

## Testing

The component includes comprehensive unit tests covering:

- Stock level indicator display logic
- View counter display logic
- Threshold boundary conditions
- Combined indicators
- Conditional rendering
- Variants
- Accessibility features
- Edge cases

Run tests:
```bash
npm run test:unit -- UrgencyIndicator.test.tsx
```

## Examples

### E-commerce Product Card

```tsx
<div className="product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
  
  <UrgencyIndicator 
    stockRemaining={product.stock}
    viewCount={product.viewCount}
  />
  
  <div className="price">${product.price}</div>
  <button>Add to Cart</button>
</div>
```

### Flash Sale Section

```tsx
<div className="flash-sale">
  <h2>Flash Sale</h2>
  <CountdownTimer endTime={saleEndTime} />
  
  <div className="products">
    {products.map(product => (
      <div key={product.id} className="product">
        <img src={product.image} alt={product.name} />
        
        <UrgencyIndicator 
          stockRemaining={product.stockRemaining}
          viewCount={product.viewCount}
          stockThreshold={10}
          viewThreshold={50}
        />
        
        <div className="price">{product.price}</div>
      </div>
    ))}
  </div>
</div>
```

### High-Traffic Product

```tsx
// Only show view counter for very popular items
<UrgencyIndicator 
  viewCount={2500}
  viewThreshold={1000}
/>
// Displays: "2K+ viewing"
```

### Low Stock Alert

```tsx
// Only show stock indicator for critically low stock
<UrgencyIndicator 
  stockRemaining={2}
  stockThreshold={5}
/>
// Displays: "Only 2 left!"
```

## Performance

- **Lightweight**: Minimal dependencies (only Lucide icons)
- **Conditional Rendering**: Returns `null` when not needed, avoiding unnecessary DOM nodes
- **No Side Effects**: Pure component with no external state or effects
- **Optimized Icons**: Uses tree-shakeable Lucide React icons

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Flexbox
- ARIA attributes

## Related Components

- **CountdownTimer**: Displays time-limited sale countdown
- **FlashSaleSection**: Container for flash sale products
- **ProductCard**: Individual product display component

## License

Part of the Halal Mart e-commerce platform.
