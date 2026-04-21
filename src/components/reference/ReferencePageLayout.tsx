import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Paper,
  Pagination,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { SOURCE_OPTIONS } from '../../utils/gameData';

type ReferenceItem = { id: string; object: { description: string } };

interface ReferencePageLayoutProps<T extends ReferenceItem> {
  title: string;
  /** Pre-filtered, pre-paginated items for the current page. */
  items: T[];
  isLoading: boolean;
  error: Error | null;
  search: string;
  onSearchChange: (value: string) => void;
  selectedSource: string | null;
  onSourceChange: (value: string | null) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  /** Total filtered count (before pagination) — used for the result label. */
  resultCount: number;
  /** Singular noun for the result count, e.g. "skill", "talent". */
  resultLabel: string;
  /** Optional page-specific filters rendered between search and source fields. */
  extraFilters?: ReactNode;
  /** Renders the content inside each item's card. */
  renderItem: (item: T) => ReactNode;
  /** When provided the entire card becomes clickable and navigates to the item's detail page. */
  onItemClick?: (item: T) => void;
}

/**
 * Shared layout for all reference pages (Skills, Talents, Spells, etc.).
 * Handles the title, loading/error states, search + source filter bar,
 * item list container, description area, and pagination.
 * Each page owns its own filtering logic and passes pre-filtered items.
 *
 * ## Search debouncing
 * The search input is debounced internally (300 ms). `onSearchChange` is called
 * only after the user stops typing — do NOT add a debounce in the parent.
 * The `search` prop holds the last committed (debounced) value; if the parent
 * resets it externally (e.g. clearing all filters) the input syncs automatically.
 *
 * @example
 * <ReferencePageLayout
 *   title="Skills"
 *   items={paged}
 *   isLoading={isLoading}
 *   error={error}
 *   search={search}
 *   onSearchChange={(v) => { setSearch(v); setPage(1); }}
 *   selectedSource={sourceFilter}
 *   onSourceChange={(v) => { setSourceFilter(v); setPage(1); }}
 *   page={page}
 *   onPageChange={setPage}
 *   totalPages={totalPages}
 *   resultCount={filtered.length}
 *   resultLabel="skill"
 *   renderItem={(skill) => <SkillRow skill={skill} />}
 * />
 */
export default function ReferencePageLayout<T extends ReferenceItem>({
  title,
  items,
  isLoading,
  error,
  search,
  onSearchChange,
  selectedSource,
  onSourceChange,
  page,
  onPageChange,
  totalPages,
  resultCount,
  resultLabel,
  extraFilters,
  renderItem,
  onItemClick,
}: ReferencePageLayoutProps<T>) {
  const [inputValue, setInputValue] = useState(search);
  const onSearchChangeRef = useRef(onSearchChange);
  onSearchChangeRef.current = onSearchChange;
  const externalSync = useRef(false);

  // Sync display value if the parent resets search externally (e.g. clearing all filters)
  useEffect(() => {
    externalSync.current = true;
    setInputValue(search);
  }, [search]);

  // Debounce: wait 300ms after the user stops typing before filtering
  useEffect(() => {
    if (externalSync.current) {
      externalSync.current = false;
      return;
    }
    const id = setTimeout(() => onSearchChangeRef.current(inputValue), 300);
    return () => clearTimeout(id);
  }, [inputValue]);

  if (isLoading) {
    return (
      <Box
        aria-busy="true"
        aria-label={`Loading ${title.toLowerCase()}`}
        sx={{ height: '100%', overflowY: 'auto' }}
      >
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} height={56} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Typography role="alert" color="error">
        Failed to load {title.toLowerCase()}: {error.message}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <TextField
          size="small"
          placeholder={`Search ${title.toLowerCase()}…`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          slotProps={{
            htmlInput: { 'aria-label': `Search ${title.toLowerCase()}` },
          }}
          sx={{ minWidth: 220 }}
        />
        {extraFilters}
        <Autocomplete
          size="small"
          options={SOURCE_OPTIONS}
          value={SOURCE_OPTIONS.find((o) => o.id === selectedSource) ?? null}
          onChange={(_, val) => onSourceChange(val?.id ?? null)}
          renderInput={(params) => <TextField {...params} label="Source" />}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          sx={{ minWidth: 220 }}
        />
        <Typography
          variant="body1"
          color="text.secondary"
          aria-live="polite"
          sx={{ ml: 'auto' }}
        >
          {resultCount} {resultCount === 1 ? resultLabel : `${resultLabel}s`}
        </Typography>
      </Box>

      <Box
        id="scrollable-container"
        component="ul"
        sx={{
          flex: 1,
          overflowY: 'auto',
          listStyle: 'none',
          p: 0,
          m: 0,
          borderRadius: 1,
        }}
      >
        {items.length === 0 ? (
          <Box
            component="li"
            sx={{ listStyle: 'none', py: 4, textAlign: 'center' }}
          >
            <Typography variant="body1" color="text.secondary">
              No {resultLabel}s found.
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <Paper
              key={item.id}
              component="li"
              role={onItemClick ? 'link' : undefined}
              tabIndex={onItemClick ? 0 : undefined}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
              onKeyDown={
                onItemClick
                  ? (e: KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onItemClick(item);
                      }
                    }
                  : undefined
              }
              sx={(theme) => ({
                boxShadow: 2,
                my: 1,
                '&:first-of-type': { mt: 0 },
                border: '1px solid transparent',
                transition: 'box-shadow 0.2s',
                cursor: onItemClick ? 'pointer' : 'default',
                '&:hover': {
                  boxShadow: 6,
                  border: `1px solid ${theme.palette.divider}`,
                },
                '&:last-child': { borderBottom: 0 },
              })}
            >
              <Box sx={{ px: 2, py: 1.5 }}>{renderItem(item)}</Box>
              <Box sx={{ px: 2, py: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body1" color="text.secondary">
                  {item.object.description || 'No description available.'}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => onPageChange(p)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
