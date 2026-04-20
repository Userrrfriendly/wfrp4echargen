import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Pagination,
  Skeleton,
  ListItemButton,
  Autocomplete,
} from '@mui/material';
import { usePrayers } from '../../hooks/usePrayers';
import { SOURCES } from '../../utils/gameData';

const SOURCE_OPTIONS = Object.entries(SOURCES).map(([id, label]) => ({
  id,
  label,
}));

const ITEMS_PER_PAGE = 30;

function extractDeity(description: string): string | null {
  const match = description.match(/^Miracle of ([^.(]+)/i);
  return match ? match[1].trim() : null;
}

export default function PrayersPage() {
  const { data: prayers, isLoading, error } = usePrayers();
  const [search, setSearch] = useState('');
  const [deityFilter, setDeityFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const deities = useMemo(() => {
    if (!prayers) return [] as string[];
    const set = new Set<string>();
    prayers.forEach((p) => {
      const d = extractDeity(p.object.description);
      if (d) set.add(d);
    });
    return Array.from(set).sort();
  }, [prayers]);

  const filtered = useMemo(() => {
    if (!prayers) return [];
    return prayers
      .filter((p) => {
        if (
          search &&
          !p.object.name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (deityFilter) {
          const d = extractDeity(p.object.description);
          if (d !== deityFilter) return false;
        }
        if (
          sourceFilter &&
          !Object.keys(p.object.source).includes(sourceFilter)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [prayers, search, deityFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const resetPage = () => setPage(1);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Prayers
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
        Failed to load prayers: {(error as Error).message}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Prayers
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
          placeholder="Search prayers…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
          sx={{ minWidth: 220 }}
        />
        <Box
          component="select"
          value={deityFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setDeityFilter(e.target.value);
            resetPage();
          }}
          sx={{
            bgcolor: 'background.paper',
            color: 'text.primary',
            border: '1px solid',
            borderColor: 'rgba(255,255,255,0.23)',
            borderRadius: 1,
            px: 1.5,
            py: 0.9,
            fontSize: '0.875rem',
            minWidth: 160,
            cursor: 'pointer',
            '&:focus': { outline: 'none', borderColor: 'primary.main' },
          }}
        >
          <option value="">All Deities</option>
          {deities.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Box>
        <Autocomplete
          size="small"
          options={SOURCE_OPTIONS}
          value={SOURCE_OPTIONS.find((o) => o.id === sourceFilter) ?? null}
          onChange={(_, val) => {
            setSourceFilter(val?.id ?? null);
            resetPage();
          }}
          renderInput={(params) => <TextField {...params} label="Source" />}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          sx={{ minWidth: 220 }}
        />
        <Typography variant="body1" color="text.secondary" sx={{ ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'prayer' : 'prayers'}
        </Typography>
      </Box>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {paged.map((prayer) => {
          const deity = extractDeity(prayer.object.description);
          return (
            <Box
              key={prayer.id}
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 0 },
              }}
            >
              <ListItemButton>
                <Box sx={{ py: 0.25, width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {prayer.object.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      mt: 0.5,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    {deity && (
                      <Chip
                        label={deity}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    {Object.entries(prayer.object.source).map(([key, page]) => (
                      <Chip
                        key={key}
                        label={`${SOURCES[key] ?? key}${page ? ` ${page}` : ''}`}
                        size="small"
                        variant="outlined"
                        sx={{ opacity: 0.45 }}
                      />
                    ))}
                    <Typography variant="caption" color="text.secondary">
                      Range: {prayer.object.range} · Target:{' '}
                      {prayer.object.target} · Duration:{' '}
                      {prayer.object.duration}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
              <Box sx={{ px: 2, pb: 2, pt: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body1" color="text.secondary">
                  {prayer.object.description || 'No description available.'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
