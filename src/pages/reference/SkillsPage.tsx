import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, Pagination, Skeleton, Collapse, ListItemButton,
} from '@mui/material';
import { useSkills } from '../../hooks/useSkills';
import { ATTRIBUTES, SKILL_TYPES } from '../../utils/gameData';

const ITEMS_PER_PAGE = 30;

export default function SkillsPage() {
  const { data: skills, isLoading, error } = useSkills();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | ''>('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!skills) return [];
    return skills
      .filter(s => {
        if (search && !s.object.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (typeFilter !== '' && s.object.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [skills, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Skills</Typography>
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 0.5 }} />)}
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load skills: {(error as Error).message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Skills</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search skills…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={e => { setTypeFilter(e.target.value as number | ''); setPage(1); }}
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(SKILL_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'skill' : 'skills'}
        </Typography>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {paged.map(skill => (
          <Box key={skill.id} sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
            <ListItemButton onClick={() => setExpanded(prev => prev === skill.id ? null : skill.id)}>
              <Box sx={{ py: 0.25, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{skill.object.name}</Typography>
                  {skill.object.isGroup && (
                    <Chip label="Group" size="small" variant="outlined" sx={{ opacity: 0.5 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  <Chip
                    label={ATTRIBUTES[skill.object.attribute] ?? `Attr ${skill.object.attribute}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={SKILL_TYPES[skill.object.type] ?? `Type ${skill.object.type}`}
                    size="small"
                    variant="outlined"
                    sx={{ opacity: 0.6 }}
                  />
                </Box>
              </Box>
            </ListItemButton>
            <Collapse in={expanded === skill.id}>
              <Box sx={{ px: 2, pb: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  {skill.object.description || 'No description available.'}
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
