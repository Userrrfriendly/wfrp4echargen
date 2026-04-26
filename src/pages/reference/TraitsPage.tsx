import { useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTraits } from '../../hooks/useTraits';
import { useReferenceFilters } from '../../hooks/useReferenceFilters';
import { ITEMS_PER_PAGE } from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';
import type { EntityModifiers } from '../../types';

function formatModifiers(modifiers: EntityModifiers): string | null {
  const parts: string[] = [];
  for (const [attr, val] of Object.entries(modifiers.attributes)) {
    if (val !== 0) parts.push(`${val > 0 ? '+' : ''}${val}${attr}`);
  }
  if (modifiers.movement !== 0)
    parts.push(`${modifiers.movement > 0 ? '+' : ''}${modifiers.movement}Mov`);
  return parts.length > 0 ? parts.join(', ') : null;
}

export default function TraitsPage() {
  const navigate = useNavigate();
  const { data: traits, isLoading, error } = useTraits();
  const {
    search,
    source: sourceFilter,
    page,
    setSearch,
    setSource,
    setPage,
  } = useReferenceFilters();

  const availableSources = useMemo(() => {
    if (!traits) return undefined;
    const set = new Set<string>();
    traits.forEach((t) =>
      Object.keys(t.object.source).forEach((k) => set.add(k)),
    );
    return Array.from(set);
  }, [traits]);

  const filtered = useMemo(() => {
    if (!traits) return [];
    return traits
      .filter((t) => {
        if (
          search &&
          !t.object.name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (
          sourceFilter &&
          !Object.keys(t.object.source).includes(sourceFilter)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [traits, search, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <ReferencePageLayout
      title="Creature Traits"
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
      resultLabel="trait"
      availableSources={availableSources}
      onItemClick={(trait) => navigate(`/reference/traits/${trait.id}`)}
      renderItem={(trait) => {
        const modLabel = formatModifiers(trait.object.modifiers);
        return (
          <Box sx={{ py: 0.25, width: '100%' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {trait.object.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {modLabel && (
                <Chip
                  label={modLabel}
                  size="small"
                  variant="outlined"
                  sx={{ borderWidth: 2, opacity: 0.95 }}
                />
              )}
              <SourceChips source={trait.object.source} />
            </Box>
          </Box>
        );
      }}
    />
  );
}
