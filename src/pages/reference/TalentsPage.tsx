import { useState, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import type { EntityModifiers } from '../../types';
import { useTalents } from '../../hooks/useTalents';
import { ATTRIBUTES, ITEMS_PER_PAGE } from '../../utils/gameData';

function resolveMaxRank(attribute: number, maxRank: number): string | null {
  if (attribute > 0) return `${ATTRIBUTES[attribute] ?? `Attr ${attribute}`} Bonus`;
  if (maxRank === 0) return null;
  if (maxRank >= 99) return '∞';
  return String(maxRank);
}

function formatModifiers(modifiers: EntityModifiers): string | null {
  const parts: string[] = [];
  for (const [attr, val] of Object.entries(modifiers.attributes)) {
    if (val !== 0) parts.push(`${val > 0 ? '+' : ''}${val}${attr}`);
  }
  if (modifiers.movement !== 0)
    parts.push(`${modifiers.movement > 0 ? '+' : ''}${modifiers.movement}Mov`);
  return parts.length > 0 ? parts.join(', ') : null;
}
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

export default function TalentsPage() {
  const { data: talents, isLoading, error } = useTalents();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!talents) return [];
    return talents
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
  }, [talents, search, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <ReferencePageLayout
      title="Talents"
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
      resultLabel="talent"
      renderItem={(talent) => (
        <Box sx={{ py: 0.25, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {talent.object.name}
            </Typography>
            {talent.object.isGroup && (
              <Chip
                label="Group"
                size="small"
                variant="outlined"
                sx={{ opacity: 0.95 }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              mt: 0.5,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {(() => {
              const label = resolveMaxRank(talent.object.attribute, talent.object.maxRank);
              return label ? (
                <Chip
                  label={`Max rank: ${label}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ) : null;
            })()}
            {talent.object.tests && (
              <Chip
                label={talent.object.tests}
                size="small"
                variant="outlined"
                sx={{ opacity: 0.95 }}
              />
            )}
            {(() => {
              const modLabel = formatModifiers(talent.object.modifiers);
              return modLabel ? (
                <Chip
                  label={modLabel}
                  size="small"
                  variant="outlined"
                  sx={{ opacity: 0.95 }}
                />
              ) : null;
            })()}
            <SourceChips source={talent.object.source} />
          </Box>
        </Box>
      )}
    />
  );
}
