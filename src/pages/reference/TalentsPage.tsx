import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Chip, Pagination, Skeleton,  ListItemButton, Autocomplete,
} from '@mui/material';
import { useTalents } from '../../hooks/useTalents';
import { ATTRIBUTES, SOURCES } from '../../utils/gameData';

const SOURCE_OPTIONS = Object.entries(SOURCES).map(([id, label]) => ({ id, label }));

const ITEMS_PER_PAGE = 30;

export default function TalentsPage() {
  const { data: talents, isLoading, error } = useTalents();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!talents) return [];
    return talents
      .filter(t => {
        if (search && !t.object.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (sourceFilter && !Object.keys(t.object.source).includes(sourceFilter)) return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [talents, search, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Talents</Typography>
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 0.5 }} />)}
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load talents: {(error as Error).message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Talents</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search talents…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          sx={{ minWidth: 220 }}
        />
        <Autocomplete
          size="small"
          options={SOURCE_OPTIONS}
          value={SOURCE_OPTIONS.find(o => o.id === sourceFilter) ?? null}
          onChange={(_, val) => { setSourceFilter(val?.id ?? null); setPage(1); }}
          renderInput={params => <TextField {...params} label="Source" />}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          sx={{ minWidth: 220 }}
        />
        <Typography variant="body1" color="text.secondary" sx={{ ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'talent' : 'talents'}
        </Typography>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {paged.map(talent => (
          <Box
            key={talent.id}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
          >
            <ListItemButton >
              <Box sx={{ py: 0.25, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{talent.object.name}</Typography>
                  {talent.object.isGroup && (
                    <Chip label="Group" size="small" variant="outlined" sx={{ opacity: 0.5 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  {talent.object.attribute > 0 && (
                    <Chip
                      label={ATTRIBUTES[talent.object.attribute] ?? `Attr ${talent.object.attribute}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {talent.object.maxRank > 0 && (
                    <Chip
                      label={`Max ${talent.object.maxRank === 999 ? '∞' : talent.object.maxRank}`}
                      size="small"
                      variant="outlined"
                      sx={{ opacity: 0.6 }}
                    />
                  )}
                  {talent.object.tests && (
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                      {talent.object.tests}
                    </Typography>
                  )}
                  {Object.entries(talent.object.source).map(([key, page]) => (
                    <Chip key={key} label={`${SOURCES[key] ?? key}${page ? ` ${page}` : ''}`} size="small" variant="outlined" sx={{ opacity: 0.45 }} />
                  ))}
                </Box>
              </Box>
            </ListItemButton>
              <Box sx={{ px: 2, pb: 2, pt: 2,  bgcolor: 'action.hover' }}>
                <Typography variant="body1" color="text.secondary">
                  {talent.object.description || 'No description available.'}
                </Typography>
              </Box>
          </Box>
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
