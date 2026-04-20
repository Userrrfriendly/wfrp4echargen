import { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, Pagination, Skeleton, ListItemButton, Autocomplete,
} from '@mui/material';
import { useTrappings } from '../../hooks/useTrappings';
import {
  TRAPPING_TYPES, AVAILABILITY, MELEE_REACH, MELEE_GROUPS, RANGED_GROUPS,
  ARMOUR_LOCATIONS, formatPrice, SOURCES,
} from '../../utils/gameData';

const SOURCE_OPTIONS = Object.entries(SOURCES).map(([id, label]) => ({ id, label }));

const ITEMS_PER_PAGE = 30;

function TrappingStats({ type, object }: { type: number; object: ReturnType<typeof useTrappings>['data'] extends (infer T)[] | undefined ? T extends { object: infer O } ? O : never : never }) {
  if (!object) return null;
  if (type === 0 && object.melee.group >= 0 && (object.melee.dmg > 0 || object.melee.dmgSbMult > 0)) {
    const dmgStr = [
      object.melee.dmg ? `+${object.melee.dmg}` : '',
      object.melee.dmgSbMult ? `+${object.melee.dmgSbMult}SB` : '',
    ].filter(Boolean).join(' ') || '+0';
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Typography variant="body1" color="text.secondary">Dmg: {dmgStr}</Typography>
        <Typography variant="body1" color="text.secondary">
          Reach: {MELEE_REACH[object.melee.reach] ?? object.melee.reach}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Group: {MELEE_GROUPS[object.melee.group] ?? `G${object.melee.group}`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hands: {object.melee.hands === 2 ? 'Two-handed' : object.melee.hands === 1 ? 'One-handed' : '—'}
        </Typography>
      </Box>
    );
  }
  if (type === 1 && (object.ranged.dmg > 0 || object.ranged.dmgSbMult > 0 || object.ranged.rng > 0)) {
    const dmgStr = [
      object.ranged.dmg ? `+${object.ranged.dmg}` : '',
      object.ranged.dmgSbMult ? `+${object.ranged.dmgSbMult}SB` : '',
    ].filter(Boolean).join(' ') || '+0';
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Typography variant="body1" color="text.secondary">Dmg: {dmgStr}</Typography>
        <Typography variant="body1" color="text.secondary">
          Rng: {object.ranged.rng > 0 ? `${object.ranged.rng}` : '—'}
          {object.ranged.rngSbMult > 0 ? ` (+${object.ranged.rngSbMult}×SB)` : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Group: {RANGED_GROUPS[object.ranged.group] ?? `G${object.ranged.group}`}
        </Typography>
      </Box>
    );
  }
  if (type === 3 && object.armour.points > 0) {
    const locs = object.armour.location.map(l => ARMOUR_LOCATIONS[l] ?? `Loc${l}`).join(', ');
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Typography variant="body1" color="text.secondary">AP: {object.armour.points}</Typography>
        {locs && <Typography variant="body1" color="text.secondary">Covers: {locs}</Typography>}
      </Box>
    );
  }
  return null;
}

export default function TrappingsPage() {
  const { data: trappings, isLoading, error } = useTrappings();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | ''>('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!trappings) return [];
    return trappings
      .filter(t => {
        if (search && !t.object.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (typeFilter !== '' && t.object.type !== typeFilter) return false;
        if (sourceFilter && !Object.keys(t.object.source).includes(sourceFilter)) return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [trappings, search, typeFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Trappings</Typography>
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 0.5 }} />)}
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load trappings: {(error as Error).message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Trappings</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search trappings…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          sx={{ minWidth: 220 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={e => { setTypeFilter(e.target.value as number | ''); setPage(1); }}
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(TRAPPING_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </Typography>
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        {paged.map(item => (
          <Box
            key={item.id}
            sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}
          >
            <ListItemButton  >
              <Box sx={{ py: 0.25, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.object.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      {formatPrice(item.object.price)}
                    </Typography>
                    {item.object.enc > 0 && (
                      <Typography variant="body1" color="text.secondary">
                        Enc {item.object.enc}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                  <Chip
                    label={TRAPPING_TYPES[item.object.type] ?? `Type ${item.object.type}`}
                    size="small"
                    variant="outlined"
                    sx={{ opacity: 0.7 }}
                  />
                  {item.object.availability !== undefined && (
                    <Chip
                      label={AVAILABILITY[item.object.availability] ?? `Av ${item.object.availability}`}
                      size="small"
                      variant="outlined"
                      sx={{ opacity: 0.6 }}
                    />
                  )}
                  {Object.entries(item.object.source).map(([key, page]) => (
                    <Chip key={key} label={`${SOURCES[key] ?? key}${page ? ` ${page}` : ''}`} size="small" variant="outlined" sx={{ opacity: 0.45 }} />
                  ))}
                </Box>
                <TrappingStats type={item.object.type} object={item.object} />
              </Box>
            </ListItemButton>
              <Box sx={{ px: 2, pb: 2, pt: 2, bgcolor: 'action.hover' }}>
                <Typography variant="body1" color="text.secondary">
                  {item.object.description || 'No description available.'}
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
