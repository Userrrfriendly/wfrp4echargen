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
import type { EntityModifiers } from '../../types';
import { useMutations } from '../../hooks/useMutations';
import { ITEMS_PER_PAGE, MUTATION_TYPES } from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

function formatModifiers(modifiers: EntityModifiers): string | null {
  const parts: string[] = [];

  for (const [attr, val] of Object.entries(modifiers.attributes)) {
    if (val !== 0) parts.push(`${val > 0 ? '+' : ''}${val}${attr}`);
  }

  if (modifiers.movement !== 0)
    parts.push(`${modifiers.movement > 0 ? '+' : ''}${modifiers.movement}Mov`);

  return parts.length > 0 ? `${parts.join(', ')}` : null;
}

export default function MutationsPage() {
  const { data: mutations, isLoading, error } = useMutations();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<number | ''>('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!mutations) return [];
    return mutations
      .filter((m) => {
        if (
          search &&
          !m.object.name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (typeFilter !== '' && m.object.type !== typeFilter) return false;
        if (
          sourceFilter &&
          !Object.keys(m.object.source).includes(sourceFilter)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [mutations, search, typeFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <ReferencePageLayout
      title="Mutations"
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
      resultLabel="mutation"
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
            {Object.entries(MUTATION_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      renderItem={(mutation) => {
        const modLabel = formatModifiers(mutation.object.modifiers);
        return (
          <Box sx={{ py: 0.25, width: '100%' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {mutation.object.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              <Chip
                label={
                  MUTATION_TYPES[mutation.object.type] ??
                  `Type ${mutation.object.type}`
                }
                size="small"
                color={mutation.object.type === 0 ? 'primary' : 'secondary'}
                variant="outlined"
              />
              {modLabel && (
                <Chip
                  label={modLabel}
                  size="small"
                  variant="outlined"
                  sx={{ opacity: 0.95 }}
                />
              )}
              <SourceChips source={mutation.object.source} />
            </Box>
          </Box>
        );
      }}
    />
  );
}
