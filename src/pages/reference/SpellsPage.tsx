import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, Pagination, Skeleton,  ListItemButton, Autocomplete,
} from '@mui/material';
import { useSpells } from '../../hooks/useSpells';
import { SPELL_TYPES, MAGIC_LORES, loreName, SOURCES } from '../../utils/gameData';

const SOURCE_OPTIONS = Object.entries(SOURCES).map(([id, label]) => ({ id, label }));

const ITEMS_PER_PAGE = 30;

export default function SpellsPage() {
  const { data: spells, isLoading, error } = useSpells();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | ''>('');
  const [loreFilter, setLoreFilter] = useState<number | ''>('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const availableLores = useMemo(() => {
    if (!spells) return [] as number[];
    const set = new Set<number>();
    spells.forEach(s => s.object.classification.labels.forEach(l => set.add(l)));
    return Array.from(set).sort((a, b) => a - b);
  }, [spells]);

  const filtered = useMemo(() => {
    if (!spells) return [];
    return spells
      .filter(s => {
        if (search && !s.object.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (typeFilter !== '' && s.object.classification.type !== typeFilter) return false;
        if (loreFilter !== '' && !s.object.classification.labels.includes(loreFilter as number)) return false;
        if (sourceFilter && !Object.keys(s.object.source).includes(sourceFilter)) return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [spells, search, typeFilter, loreFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetPage = () => setPage(1);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Spells</Typography>
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 0.5 }} />)}
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load spells: {(error as Error).message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Spells</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search spells…"
          value={search}
          onChange={e => { setSearch(e.target.value); resetPage(); }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={e => { setTypeFilter(e.target.value as number | ''); resetPage(); }}
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(SPELL_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Lore</InputLabel>
          <Select
            value={loreFilter}
            label="Lore"
            onChange={e => { setLoreFilter(e.target.value as number | ''); resetPage(); }}
          >
            <MenuItem value="">All Lores</MenuItem>
            {availableLores.map(l => (
              <MenuItem key={l} value={l}>{MAGIC_LORES[l] ?? `Lore ${l}`}</MenuItem>
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
          {filtered.length} {filtered.length === 1 ? 'spell' : 'spells'}
        </Typography>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {paged.map(spell => (
          <Box
            key={spell.id}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
          >
            <ListItemButton >
              <Box sx={{ py: 0.25, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{spell.object.name}</Typography>
                  <Chip
                    label={`CN ${spell.object.cn}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={SPELL_TYPES[spell.object.classification.type] ?? `Type ${spell.object.classification.type}`}
                    size="small"
                    variant="outlined"
                    sx={{ opacity: 0.7 }}
                  />
                  {spell.object.classification.labels.length > 0 && (
                    <Chip
                      label={loreName(spell.object.classification.labels)}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    {spell.object.range} · {spell.object.target} · {spell.object.duration}
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
              <Box sx={{ px: 2, pb: 2, pt: 2,  bgcolor: 'action.hover' }}>
                <Typography variant="body2" color="text.secondary">
                  {spell.object.description || 'No description available.'}
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
