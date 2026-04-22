import { useMemo } from 'react';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTrappings } from '../../hooks/useTrappings';
import { useReferenceFilters } from '../../hooks/useReferenceFilters';
import {
  ARMOUR_LOCATIONS,
  AVAILABILITY,
  ITEMS_PER_PAGE,
  MELEE_GROUPS,
  MELEE_REACH,
  RANGED_GROUPS,
  TRAPPING_TYPES,
} from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';
import type { Trapping } from '../../types';

const CURRENCY_COLORS = {
  GC: '#c8960c', // gold crown
  SS: '#a8a9b4', // silver shilling
  BP: '#b87333', // brass penny
} as const;

function PriceDisplay({ brass }: { brass: number }) {
  const gold = Math.floor(brass / 240);
  const silver = Math.floor((brass % 240) / 12);
  const bp = brass % 12;

  const parts = [
    gold > 0 && { value: gold, unit: 'GC' as const },
    silver > 0 && { value: silver, unit: 'SS' as const },
    bp > 0 && { value: bp, unit: 'BP' as const },
  ].filter(Boolean) as { value: number; unit: keyof typeof CURRENCY_COLORS }[];

  if (parts.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <Box component="span" sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      {parts.map(({ value, unit }) => (
        <Typography
          key={unit}
          component="span"
          variant="body1"
          sx={{ color: CURRENCY_COLORS[unit], fontWeight: 500 }}
        >
          {value}{unit}
        </Typography>
      ))}
    </Box>
  );
}

function TrappingStats({ item }: { item: Trapping }) {
  const { type, melee, ranged, armour } = item.object;

  if (
    type === 0 &&
    melee.group >= 0 &&
    (melee.dmg > 0 || melee.dmgSbMult > 0)
  ) {
    const dmgStr =
      [
        melee.dmg ? `+${melee.dmg}` : '',
        melee.dmgSbMult ? `+${melee.dmgSbMult}SB` : '',
      ]
        .filter(Boolean)
        .join(' ') || '+0';
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Typography variant="body1" color="text.secondary">
          Dmg: {dmgStr}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reach: {MELEE_REACH[melee.reach] ?? melee.reach}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Group: {MELEE_GROUPS[melee.group] ?? `G${melee.group}`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hands:{' '}
          {melee.hands === 2
            ? 'Two-handed'
            : melee.hands === 1
              ? 'One-handed'
              : '—'}
        </Typography>
      </Box>
    );
  }

  if (
    type === 1 &&
    (ranged.dmg > 0 || ranged.dmgSbMult > 0 || ranged.rng > 0)
  ) {
    const dmgStr =
      [
        ranged.dmg ? `+${ranged.dmg}` : '',
        ranged.dmgSbMult ? `+${ranged.dmgSbMult}SB` : '',
      ]
        .filter(Boolean)
        .join(' ') || '+0';
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Typography variant="body1" color="text.secondary">
          Dmg: {dmgStr}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rng: {ranged.rng > 0 ? `${ranged.rng}` : '—'}
          {ranged.rngSbMult > 0 ? ` (+${ranged.rngSbMult}×SB)` : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Group: {RANGED_GROUPS[ranged.group] ?? `G${ranged.group}`}
        </Typography>
      </Box>
    );
  }

  if (type === 3 && armour.points > 0) {
    const locs = armour.location
      .map((l) => ARMOUR_LOCATIONS[l] ?? `Loc${l}`)
      .join(', ');
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
        <Typography variant="body1" color="text.secondary">
          AP: {armour.points}
        </Typography>
        {locs && (
          <Typography variant="body1" color="text.secondary">
            Covers: {locs}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
}

export default function TrappingsPage() {
  const { data: trappings, isLoading, error } = useTrappings();
  const { search, source: sourceFilter, page, searchParams, setSearch, setSource, setPage, setExtraParam } = useReferenceFilters();

  const typeFilter: number | '' = searchParams.has('type') ? Number(searchParams.get('type')) : '';

  const filtered = useMemo(() => {
    if (!trappings) return [];
    return trappings
      .filter((t) => {
        if (
          search &&
          !t.object.name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (typeFilter !== '' && t.object.type !== typeFilter) return false;
        if (
          sourceFilter &&
          !Object.keys(t.object.source).includes(sourceFilter)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [trappings, search, typeFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <ReferencePageLayout
      title="Trappings"
      items={paged}
      isLoading={isLoading}
      error={error as Error | null}
      search={search}
      onSearchChange={setSearch}
      selectedSource={sourceFilter}
      onSourceChange={setSource}
      page={page}
      onPageChange={setPage}
      totalPages={totalPages}
      resultCount={filtered.length}
      resultLabel="item"
      extraFilters={
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e: SelectChangeEvent<number | ''>) => {
              const val = e.target.value as number | '';
              setExtraParam('type', val !== '' ? String(val) : null);
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(TRAPPING_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      renderItem={(item) => (
        <Box sx={{ py: 0.25, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {item.object.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <PriceDisplay brass={item.object.price} />
              {item.object.enc > 0 && (
                <Typography variant="body1" color="text.secondary">
                  Enc {item.object.enc}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label={
                TRAPPING_TYPES[item.object.type] ?? `Type ${item.object.type}`
              }
              size="small"
              variant="outlined"
              sx={{ opacity: 0.95 }}
            />
            {item.object.availability !== undefined && (
              <Chip
                label={
                  AVAILABILITY[item.object.availability] ??
                  `Av ${item.object.availability}`
                }
                size="small"
                variant="outlined"
                sx={{ opacity: 0.95 }}
              />
            )}
            <SourceChips source={item.object.source} />
          </Box>
          <TrappingStats item={item} />
        </Box>
      )}
    />
  );
}
