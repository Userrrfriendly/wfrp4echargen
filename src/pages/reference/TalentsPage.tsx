import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Chip, Pagination, Skeleton, Collapse, ListItemButton,
} from '@mui/material';
import { useTalents } from '../../hooks/useTalents';
import { ATTRIBUTES } from '../../utils/gameData';

const ITEMS_PER_PAGE = 30;

export default function TalentsPage() {
  const { data: talents, isLoading, error } = useTalents();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!talents) return [];
    return talents
      .filter(t => !search || t.object.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [talents, search]);

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
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'talent' : 'talents'}
        </Typography>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {paged.map(talent => (
          <Box
            key={talent.id}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
          >
            <ListItemButton onClick={() => setExpanded(prev => prev === talent.id ? null : talent.id)}>
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
                </Box>
              </Box>
            </ListItemButton>
            <Collapse in={expanded === talent.id}>
              <Box sx={{ px: 2, pb: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  {talent.object.description || 'No description available.'}
                </Typography>
              </Box>
            </Collapse>
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
