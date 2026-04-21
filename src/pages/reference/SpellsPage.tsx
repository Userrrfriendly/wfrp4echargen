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
import { useSpells } from '../../hooks/useSpells';
import {
  ITEMS_PER_PAGE,
  MAGIC_LORES,
  SPELL_TYPES,
  loreName,
} from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

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
    spells.forEach((s) =>
      s.object.classification.labels.forEach((l) => set.add(l)),
    );
    return Array.from(set).sort((a, b) => a - b);
  }, [spells]);

  const filtered = useMemo(() => {
    if (!spells) return [];
    return spells
      .filter((s) => {
        if (
          search &&
          !s.object.name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (typeFilter !== '' && s.object.classification.type !== typeFilter)
          return false;
        if (
          loreFilter !== '' &&
          !s.object.classification.labels.includes(loreFilter as number)
        )
          return false;
        if (
          sourceFilter &&
          !Object.keys(s.object.source).includes(sourceFilter)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [spells, search, typeFilter, loreFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const resetPage = () => setPage(1);

  return (
    <ReferencePageLayout
      title="Spells"
      items={paged}
      isLoading={isLoading}
      error={error as Error | null}
      search={search}
      onSearchChange={(v) => {
        setSearch(v);
        resetPage();
      }}
      selectedSource={sourceFilter}
      onSourceChange={(v) => {
        setSourceFilter(v);
        resetPage();
      }}
      page={page}
      onPageChange={setPage}
      totalPages={totalPages}
      resultCount={filtered.length}
      resultLabel="spell"
      extraFilters={
        <>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e: SelectChangeEvent<number | ''>) => {
                setTypeFilter(e.target.value as number | '');
                resetPage();
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              {Object.entries(SPELL_TYPES).map(([num, name]) => (
                <MenuItem key={num} value={Number(num)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Lore</InputLabel>
            <Select
              value={loreFilter}
              label="Lore"
              onChange={(e: SelectChangeEvent<number | ''>) => {
                setLoreFilter(e.target.value as number | '');
                resetPage();
              }}
            >
              <MenuItem value="">All Lores</MenuItem>
              {availableLores.map((l) => (
                <MenuItem key={l} value={l}>
                  {MAGIC_LORES[l] ?? `Lore ${l}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      }
      renderItem={(spell) => (
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
              {spell.object.name}
            </Typography>
            <Chip
              label={`CN ${spell.object.cn}`}
              size="small"
              color="primary"
              variant="outlined"
            />
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
            <Chip
              label={
                SPELL_TYPES[spell.object.classification.type] ??
                `Type ${spell.object.classification.type}`
              }
              size="small"
              variant="outlined"
              sx={{ opacity: 0.95 }}
            />
            {spell.object.classification.labels.length > 0 && (
              <Chip
                label={loreName(spell.object.classification.labels)}
                size="small"
                variant="outlined"
                color="secondary"
              />
            )}
            <SourceChips source={spell.object.source} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ alignSelf: 'center' }}
            >
              Range: {spell.object.range} · Target: {spell.object.target} ·
              Duration: {spell.object.duration}
            </Typography>
          </Box>
        </Box>
      )}
    />
  );
}
