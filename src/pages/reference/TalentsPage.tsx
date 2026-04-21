import { useState, useMemo } from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { useTalents } from '../../hooks/useTalents';
import { ATTRIBUTES, ITEMS_PER_PAGE } from '../../utils/gameData';
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
        if (search && !t.object.name.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (sourceFilter && !Object.keys(t.object.source).includes(sourceFilter))
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [talents, search, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <ReferencePageLayout
      title="Talents"
      items={paged}
      isLoading={isLoading}
      error={error as Error | null}
      search={search}
      onSearchChange={(v) => { setSearch(v); setPage(1); }}
      selectedSource={sourceFilter}
      onSourceChange={(v) => { setSourceFilter(v); setPage(1); }}
      page={page}
      onPageChange={setPage}
      totalPages={totalPages}
      resultCount={filtered.length}
      resultLabel="talent"
      renderItem={(talent) => (
        <Box sx={{ py: 0.25, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {talent.object.name}
            </Typography>
            {talent.object.isGroup && (
              <Chip label="Group" size="small" variant="outlined" sx={{ opacity: 0.5 }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
            {talent.object.attribute > 0 && (
              <Chip
                label={ATTRIBUTES[talent.object.attribute] ?? `Attr ${talent.object.attribute}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {talent.object.maxRank > 0 && (
              <Chip
                label={`Max ${talent.object.maxRank === 999 ? '∞' : talent.object.maxRank}`}
                size="small"
                variant="outlined"
                sx={{ opacity: 0.6 }}
              />
            )}
            {talent.object.tests && (
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                {talent.object.tests}
              </Typography>
            )}
            <SourceChips source={talent.object.source} />
          </Box>
        </Box>
      )}
    />
  );
}
