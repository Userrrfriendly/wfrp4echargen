import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useReferenceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const source = searchParams.get('source') ?? null;
  const page = Number(searchParams.get('page') ?? '1');

  /** Applies a transform to the current URLSearchParams using history replace (no back-button pollution).
   * update is a stable wrapper around setSearchParams that:
   * (1) accepts a transform function instead of a value
   * (2) always uses replace history mode.
   */
  const update = useCallback(
    (updater: (prev: URLSearchParams) => URLSearchParams) =>
      setSearchParams(updater, { replace: true }),
    [setSearchParams],
  );

  const setSearch = useCallback(
    (value: string) =>
      update((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set('search', value);
        } else {
          next.delete('search');
        }
        next.delete('page');
        return next;
      }),
    [update],
  );

  const setSource = useCallback(
    (value: string | null) =>
      update((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set('source', value);
        } else {
          next.delete('source');
        }
        next.delete('page');
        return next;
      }),
    [update],
  );

  const setPage = useCallback(
    (value: number) =>
      update((prev) => {
        const next = new URLSearchParams(prev);
        if (value > 1) {
          next.set('page', String(value));
        } else {
          next.delete('page');
        }
        return next;
      }),
    [update],
  );

  /** Sets (or clears when value is null) an arbitrary URL search param and resets the page to 1. */
  const setExtraParam = useCallback(
    (key: string, value: string | null) =>
      update((prev) => {
        const next = new URLSearchParams(prev);
        if (value !== null) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        next.delete('page');
        return next;
      }),
    [update],
  );

  return {
    search,
    source,
    page,
    searchParams,
    setSearch,
    setSource,
    setPage,
    setExtraParam,
  };
}
