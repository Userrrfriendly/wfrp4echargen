import { useState, useMemo } from 'react';
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
import { useQualities } from '../../hooks/useQualities';
import { ITEMS_PER_PAGE, QUALITY_TYPES, TRAPPING_TYPES } from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

function applicableToLabel(applicableTo: number[]): string {
  const allTypes = Object.keys(TRAPPING_TYPES).length;
  if (applicableTo.length >= allTypes) return 'All';
  return applicableTo.map((n) => TRAPPING_TYPES[n] ?? `${n}`).join(', ');
}

export default function QualitiesPage() {
  const { data: qualities, isLoading, error } = useQualities();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | ''>('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!qualities) return [];
    return qualities
      .filter((q) => {
        if (search && !q.object.name.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (typeFilter !== '' && q.object.type !== typeFilter) return false;
        if (sourceFilter && !Object.keys(q.object.source).includes(sourceFilter))
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [qualities, search, typeFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <ReferencePageLayout
      title="Qualities & Flaws"
      items={paged}
      isLoading={isLoading}
      error={error as Error | null}
      search={search}
      onSearchChange={(v) => {
        setSearch(v);
        setPage(1);
      }}
      selectedSource={sourceFilter}
      onSourceChange={(v) => {
        setSourceFilter(v);
        setPage(1);
      }}
      page={page}
      onPageChange={setPage}
      totalPages={totalPages}
      resultCount={filtered.length}
      resultLabel="quality"
      extraFilters={
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e: SelectChangeEvent<number | ''>) => {
              setTypeFilter(e.target.value as number | '');
              setPage(1);
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(QUALITY_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      renderItem={(quality) => (
        <Box sx={{ py: 0.25, width: '100%' }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {quality.object.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label={QUALITY_TYPES[quality.object.type] ?? `Type ${quality.object.type}`}
              size="small"
              color={quality.object.type === 0 ? 'success' : 'error'}
              variant="outlined"
            />
            <Chip
              label={applicableToLabel(quality.object.applicableTo)}
              size="small"
              variant="outlined"
              sx={{ opacity: 0.95 }}
            />
            <SourceChips source={quality.object.source} />
          </Box>
        </Box>
      )}
    />
  );
}
