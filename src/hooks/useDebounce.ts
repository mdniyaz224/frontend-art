// ============================================================
// useDebounce Hook
// ============================================================

import { useState, useEffect } from 'react';

/**
 * Debounce a value by the specified delay.
 * Useful for search inputs to avoid excessive API calls.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 400);
 *
 * useEffect(() => {
 *   dispatch(fetchItems({ search: debouncedSearch }));
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
