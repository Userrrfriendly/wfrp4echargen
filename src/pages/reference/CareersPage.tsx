import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, Pagination, Skeleton, ListItemButton, Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCareers } from '../../hooks/useCareers';
import { CAREER_CLASSES, SPECIES, SOURCES } from '../../utils/gameData';

const ITEMS_PER_PAGE = 25;
const SOURCE_OPTIONS = Object.entries(SOURCES).map(([id, label]) => ({ id, label }));

export default function CareersPage() {
  const navigate = useNavigate();
  const { data: careers, isLoading, error } = useCareers();

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<number | ''>('');
  const [speciesFilter, setSpeciesFilter] = useState<number | ''>('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const resetPage = () => setPage(1);

  const filtered = useMemo(() => {
    if (!careers) return [];
    return careers
      .filter(c => {
        if (search && !c.object.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (classFilter !== '' && c.object.class !== classFilter) return false;
        if (speciesFilter !== '' && !c.object.species.includes(speciesFilter as number)) return false;
        if (sourceFilter && !Object.keys(c.object.source).includes(sourceFilter)) return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [careers, search, classFilter, speciesFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Careers</Typography>
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} height={64} sx={{ mb: 0.5 }} />)}
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load careers: {(error as Error).message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Careers</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search careers…"
          value={search}
          onChange={e => { setSearch(e.target.value); resetPage(); }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Class</InputLabel>
          <Select
            value={classFilter}
            label="Class"
            onChange={e => { setClassFilter(e.target.value as number | ''); resetPage(); }}
          >
            <MenuItem value="">All Classes</MenuItem>
            {Object.entries(CAREER_CLASSES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Species</InputLabel>
          <Select
            value={speciesFilter}
            label="Species"
            onChange={e => { setSpeciesFilter(e.target.value as number | ''); resetPage(); }}
          >
            <MenuItem value="">All Species</MenuItem>
            {Object.entries(SPECIES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          size="small"
          options={SOURCE_OPTIONS}
          value={SOURCE_OPTIONS.find(o => o.id === sourceFilter) ?? null}
          onChange={(_, val) => { setSourceFilter(val?.id ?? null); resetPage(); }}
          renderInput={params => <TextField {...params} label="Source" />}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          sx={{ minWidth: 220 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'career' : 'careers'}
        </Typography>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {paged.map(career => (
          <ListItemButton
            key={career.id}
            onClick={() => navigate(`/reference/careers/${career.id}`)}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
          >
            <Box sx={{ py: 0.5, width: '100%' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{career.object.name}</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                <Chip
                  label={CAREER_CLASSES[career.object.class] ?? `Class ${career.object.class}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {career.object.species.map(s => (
                  <Chip
                    key={s}
                    label={SPECIES[s] ?? `Species ${s}`}
                    size="small"
                    variant="outlined"
                    sx={{ opacity: 0.6 }}
                  />
                ))}
              </Box>
            </Box>
          </ListItemButton>
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
