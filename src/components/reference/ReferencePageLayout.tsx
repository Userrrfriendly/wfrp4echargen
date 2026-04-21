import type { ReactNode } from 'react';
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
  /** Renders the content inside each item's ListItemButton. */
  renderItem: (item: T) => ReactNode;
}

/**
 * Shared layout for all reference pages (Skills, Talents, Spells, etc.).
 * Handles the title, loading/error states, search + source filter bar,
 * item list container, description area, and pagination.
 * Each page owns its own filtering logic and passes pre-filtered items.
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
}: ReferencePageLayoutProps<T>) {
  if (isLoading) {
    return (
      <Box>
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
      <Typography color="error">
        Failed to load {title.toLowerCase()}: {error.message}
      </Typography>
    );
  }

  return (
    <Box>
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
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
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
        <Typography variant="body1" color="text.secondary" sx={{ ml: 'auto' }}>
          {resultCount} {resultCount === 1 ? resultLabel : `${resultLabel}s`}
        </Typography>
      </Box>

      <Box
        sx={{
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {items.map((item) => (
          <Paper
            key={item.id}
            sx={{
              boxShadow: 3,
              margin: '0.25rem 0',
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': { borderBottom: 0 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>{renderItem(item)}</Box>
            <Box sx={{ px: 2, pb: 2, pt: 2, bgcolor: 'action.hover' }}>
              <Typography variant="body1" color="text.secondary">
                {item.object.description || 'No description available.'}
              </Typography>
            </Box>
          </Paper>
        ))}
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
