# Category Hooks Documentation

Modular hooks untuk manajemen kategori di dashboard admin.

## Struktur File

```
hooks/
├── index.ts              # Entry point untuk semua hooks
├── useCategoryList.ts    # Hook untuk manajemen list kategori
├── useCreateCategory.ts  # Hook untuk pembuatan kategori
├── useDebounce.ts       # Hook utility untuk debouncing
└── README.md            # Dokumentasi ini
```

## Hooks Available

### 1. useCategoryList(initialCategories)

Hook untuk manajemen list kategori dengan fitur:
- **Filtering**: Search by name/slug, filter by product count
- **Sorting**: Sort by name, date, product count
- **CRUD Operations**: Update dan delete kategori
- **State Management**: Loading, error, editing states

**Usage:**
```typescript
const { categories, state, sortState, filterState, actions } = useCategoryList(initialCategories)
```

**Returns:**
- `categories`: Filtered dan sorted categories
- `state`: UI state (loading, error, editingId, searchQuery)
- `sortState`: Current sort configuration
- `filterState`: Current filter configuration
- `actions`: Object dengan semua action functions

### 2. useCreateCategory()

Hook untuk pembuatan kategori baru dengan fitur:
- **Form Management**: State management untuk form data
- **Validation**: Real-time validation dengan error handling
- **Auto-slug**: Otomatis generate slug dari nama
- **API Integration**: Submit ke CategoryService

**Usage:**
```typescript
const { formData, errors, state, actions } = useCreateCategory()
```

**Returns:**
- `formData`: Current form data
- `errors`: Validation errors per field
- `state`: Form state (loading, error, success)
- `actions`: Form actions (updateFormData, resetForm, submitForm)

### 3. useDebounce(value, delay)

Utility hook untuk debouncing values, berguna untuk search input.

**Usage:**
```typescript
const debouncedSearchQuery = useDebounce(searchQuery, 300)
```

## Best Practices

### 1. Error Handling
Semua hooks menggunakan consistent error handling:
- Rate limiting protection
- API error parsing
- User-friendly error messages
- Proper error state management

### 2. Performance Optimization
- Memoized computations untuk filtering/sorting
- Debounced search untuk mengurangi API calls
- Optimistic UI updates
- Proper dependency arrays di useCallback/useMemo

### 3. Type Safety
- Semua hooks fully typed dengan TypeScript
- Proper type inference untuk return values
- Type-safe API integration

### 4. State Management
- Immutable state updates
- Proper state isolation
- Consistent state structure
- Clear state transitions

## Migration dari hooks.ts lama

File `hooks.ts` lama sekarang hanya re-export dari modular hooks:

```typescript
// hooks.ts
export { useCategoryList, useCreateCategory, useDebounce } from './hooks'
```

Ini memastikan backward compatibility sambil menggunakan struktur modular yang baru.

## Testing

Setiap hook bisa di-test secara independen:

```typescript
// Test useCategoryList
import { renderHook } from '@testing-library/react'
import { useCategoryList } from './useCategoryList'

test('should filter categories by search query', () => {
  const { result } = renderHook(() => useCategoryList(mockCategories))
  // Test implementation
})
```

## Future Enhancements

1. **useOptimisticUpdates**: Hook untuk optimistic UI updates
2. **useCategoryCache**: Hook untuk caching kategori data
3. **useCategorySync**: Hook untuk real-time synchronization
4. **useCategoryAnalytics**: Hook untuk analytics dan metrics