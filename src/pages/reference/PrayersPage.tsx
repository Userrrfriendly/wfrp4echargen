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
import { useNavigate } from 'react-router-dom';
import { usePrayers } from '../../hooks/usePrayers';
import { useReferenceFilters } from '../../hooks/useReferenceFilters';
import { ITEMS_PER_PAGE } from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

function extractDeity(description: string): string | null {
  const match = description.match(/^Miracle of ([^.(]+)/i);
  return match ? match[1].trim() : null;
}

export default function PrayersPage() {
  const navigate = useNavigate();
  const { data: prayers, isLoading, error } = usePrayers();
  const {
    search,
    source: sourceFilter,
    page,
    searchParams,
    setSearch,
    setSource,
    setPage,
    setExtraParam,
  } = useReferenceFilters();

  const deityFilter = searchParams.get('deity') ?? '';

  const deities = useMemo(() => {
    if (!prayers) return [] as string[];
    const set = new Set<string>();
    prayers.forEach((p) => {
      const d = extractDeity(p.object.description);
      if (d) set.add(d);
    });
    return Array.from(set).sort();
  }, [prayers]);

  const availableSources = useMemo(() => {
    if (!prayers) return undefined;
    const set = new Set<string>();
    prayers.forEach((p) => Object.keys(p.object.source).forEach((k) => set.add(k)));
    return Array.from(set);
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
        if (deityFilter && extractDeity(p.object.description) !== deityFilter)
          return false;
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

  return (
    <ReferencePageLayout
      title="Prayers"
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
      resultLabel="prayer"
      availableSources={availableSources}
      onItemClick={(prayer) => navigate(`/reference/prayers/${prayer.id}`)}
      extraFilters={
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Deity</InputLabel>
          <Select
            value={deityFilter}
            label="Deity"
            onChange={(e: SelectChangeEvent) => {
              setExtraParam('deity', e.target.value || null);
            }}
          >
            <MenuItem value="">All Deities</MenuItem>
            {deities.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      renderItem={(prayer) => {
        const deity = extractDeity(prayer.object.description);
        return (
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
                  sx={{ borderWidth: 2, opacity: 0.95 }}
                />
              )}
              <SourceChips source={prayer.object.source} />
              <Typography variant="caption" color="text.secondary">
                Range: {prayer.object.range} · Target: {prayer.object.target} ·
                Duration: {prayer.object.duration}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}
