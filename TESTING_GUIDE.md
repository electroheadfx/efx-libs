# Testing Guide: React 19 use() Hook with TanStack Router

## Quick Start

```bash
pnpm dev
# Open http://localhost:3000
```

---

## Test 1: React 19 `use()` Hook

### What to Test
Verify that the `use()` hook properly unwraps the deferred promise.

### Steps
1. Navigate to http://localhost:3000/efx-charts
2. Open React DevTools (Components tab)
3. Find the `ChartsContent` component in the tree
4. Inspect its props and state

### Expected Results
- ✅ `ChartsContent` component exists
- ✅ `dataPromise` prop is a Promise
- ✅ Component suspends during loading
- ✅ After loading, component renders with resolved data
- ✅ No `<Await>` component in the tree (replaced by `use()`)

### What Changed
**Before:** `<Await promise={data}>{(data) => ...}</Await>`
**After:** `const chartData = use(dataPromise)`

---

## Test 2: Route-Level Caching

### What to Test
Verify that data is cached and reused for the same seed value.

### Steps
1. Navigate to http://localhost:3000/efx-charts?seed=42
2. Wait for charts to fully load (1 second delay)
3. Click "Home" in the header
4. Click "EfxCharts" to return
5. Observe loading behavior

### Expected Results
- ✅ First visit: Shows loading state for ~1 second
- ✅ Second visit: Charts appear **instantly** (from cache)
- ✅ No network request on second visit (check DevTools Network tab)
- ✅ Cache expires after 10 seconds (staleTime)

### What Changed
Added to route config:
```tsx
staleTime: 10_000,      // Fresh for 10 seconds
gcTime: 5 * 60_000,     // Keep in memory for 5 minutes
```

---

## Test 3: Route Preloading

### What to Test
Verify that hovering over links preloads the route data.

### Steps
1. Go to http://localhost:3000 (homepage)
2. Open DevTools Network tab
3. **Hover** over the "EfxCharts" link (don't click yet)
4. Wait 1 second
5. Observe Network tab for requests
6. Now **click** the link

### Expected Results
- ✅ Hovering triggers a preload request
- ✅ Clicking the link shows charts **instantly** (already loaded)
- ✅ No second request when clicking (data already preloaded)

### What Changed
Updated `src/router.tsx`:
```tsx
defaultPreloadStaleTime: 30_000,  // Preload if cache > 30s old
```

---

## Test 4: Pending Component

### What to Test
Verify that the custom pending component shows during route loading.

### Steps
1. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
2. Navigate to http://localhost:3000/efx-charts?seed=999
3. Observe the loading state

### Expected Results
- ✅ Shows custom pending component (matches page design)
- ✅ Displays "Matrix-based ECharts layout..." text
- ✅ Shows loading spinner in control panel
- ✅ Shows "Preparing charts..." in main area
- ✅ Pending component waits 500ms before showing (no flash)

### What Changed
Added to route config:
```tsx
pendingComponent: EfxChartsPendingComponent,
pendingMs: 500,
pendingMinMs: 300,
```

---

## Test 5: Error Handling

### What to Test
Verify that errors are caught and displayed with custom UI.

### Steps
1. Temporarily modify `src/serverActions/efxChartsActions.ts`:
   ```tsx
   .handler(async ({ data }) => {
     throw new Error('Test error: Data generation failed')
   })
   ```
2. Navigate to http://localhost:3000/efx-charts
3. Observe error UI
4. Click "Try Again" button
5. Revert the error code

### Expected Results
- ✅ Shows custom error component (red icon, error message)
- ✅ Displays "Failed to Load Chart Data" title
- ✅ Shows error message: "Test error: Data generation failed"
- ✅ "Try Again" button reloads the route
- ✅ "Go Home" button navigates to homepage
- ✅ In dev mode, shows error stack trace in details

### What Changed
Added to route config:
```tsx
errorComponent: EfxChartsErrorComponent,
```

---

## Test 6: Request Cancellation

### What to Test
Verify that in-flight requests are cancelled when navigating away.

### Steps
1. Open DevTools Network tab
2. Navigate to http://localhost:3000/efx-charts?seed=123
3. **Immediately** click "Home" (before charts load)
4. Check Network tab for the request status

### Expected Results
- ✅ Request shows as "cancelled" in Network tab
- ✅ No error in console
- ✅ Server stops processing (saves resources)

### What Changed
Added to loader:
```tsx
loader: async ({ deps, abortController }) => {
  return {
    data: defer(
      getEfxChartsData({
        data: { seed: deps.seed },
        signal: abortController.signal,  // ✨ Cancellation support
      })
    ),
  }
}
```

---

## Test 7: Suspense Fallback

### What to Test
Verify that the Suspense fallback shows while deferred data loads.

### Steps
1. Navigate to http://localhost:3000/efx-charts
2. Observe the loading sequence

### Expected Results
- ✅ Control panel renders immediately (not deferred)
- ✅ Chart area shows "Loading charts..." fallback
- ✅ After 1 second, charts stream in
- ✅ Smooth transition (no layout shift)

### What Changed
```tsx
<Suspense fallback={<ChartLoadingFallback />}>
  <ChartsContent dataPromise={data} sidebarPosition={sidebarPosition} />
</Suspense>
```

---

## Performance Comparison

### Before Optimization
```
Navigation to /efx-charts?seed=42:
1. Click link → 0ms
2. Loader starts → 0ms
3. Wait for data → 1000ms
4. Component renders → 1050ms
5. Charts appear → 1100ms

Navigate away and back:
1. Click link → 0ms
2. Loader starts → 0ms
3. Wait for data → 1000ms (REFETCH!)
4. Component renders → 1050ms
5. Charts appear → 1100ms
```

### After Optimization
```
First navigation to /efx-charts?seed=42:
1. Click link → 0ms
2. Loader starts → 0ms
3. Wait for data → 1000ms
4. Component renders → 1050ms
5. Charts appear → 1100ms

Navigate away and back (within 10s):
1. Click link → 0ms
2. Loader uses cache → 0ms
3. Component renders → 50ms
4. Charts appear → 100ms (10x faster!)

With preloading (hover first):
1. Hover link → preload starts
2. Click link → 0ms
3. Data already loaded → 0ms
4. Component renders → 50ms
5. Charts appear → 100ms (instant!)
```

---

## Browser DevTools Tips

### React DevTools
- **Components tab:** See `ChartsContent` component with `use()` hook
- **Profiler tab:** Measure render performance
- **Look for:** No `<Await>` component (replaced by `use()`)

### Network Tab
- **Filter by XHR/Fetch:** See data requests
- **Look for:** Cancelled requests when navigating away
- **Look for:** No duplicate requests with caching

### Console
- **Look for:** "EfxChartsLayout ready" log when charts load
- **Look for:** "Chart clicked" log when clicking charts
- **No errors:** Should be clean

---

## Success Criteria

✅ All 7 tests pass
✅ No TypeScript errors
✅ No console errors
✅ Charts load smoothly
✅ Caching works (instant re-navigation)
✅ Preloading works (instant navigation after hover)
✅ Error handling works (custom UI with retry)
✅ Request cancellation works (no wasted requests)

---

## Troubleshooting

### Issue: Charts don't load
- Check console for errors
- Verify server is running on port 3000
- Check Network tab for failed requests

### Issue: Caching doesn't work
- Clear browser cache and try again
- Check that seed value is the same
- Verify staleTime is set in route config

### Issue: use() hook error
- Verify React version is 19+ (`grep '"react"' package.json`)
- Check that `use` is imported from 'react'
- Ensure Suspense boundary exists

### Issue: Preloading doesn't work
- Check router config has `defaultPreloadStaleTime: 30_000`
- Hover for at least 1 second
- Check Network tab for preload requests

