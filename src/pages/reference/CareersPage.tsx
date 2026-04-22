import { useMemo } from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCareers } from '../../hooks/useCareers';
import { useReferenceFilters } from '../../hooks/useReferenceFilters';
import { CAREER_CLASSES, ITEMS_PER_PAGE, SPECIES } from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

export default function CareersPage() {
  const navigate = useNavigate();
  const { data: careers, isLoading, error } = useCareers();
  const { search, source: sourceFilter, page, searchParams, setSearch, setSource, setPage, setExtraParam } = useReferenceFilters();

  const classFilter: number | '' = searchParams.has('class') ? Number(searchParams.get('class')) : '';
  const speciesFilter: number | '' = searchParams.has('species') ? Number(searchParams.get('species')) : '';

  const filtered = useMemo(() => {
    if (!careers) return [];
    return careers
      .filter((c) => {
        if (search && !c.object.name.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (classFilter !== '' && c.object.class !== classFilter) return false;
        if (speciesFilter !== '' && !c.object.species.includes(speciesFilter as number))
          return false;
        if (sourceFilter && !Object.keys(c.object.source).includes(sourceFilter))
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [careers, search, classFilter, speciesFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <ReferencePageLayout
      title="Careers"
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
      resultLabel="career"
      onItemClick={(career) => navigate(`/reference/careers/${career.id}`)}
      extraFilters={
        <>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={classFilter}
              label="Class"
              onChange={(e: SelectChangeEvent<number | ''>) => {
                const val = e.target.value as number | '';
                setExtraParam('class', val !== '' ? String(val) : null);
              }}
            >
              <MenuItem value="">All Classes</MenuItem>
              {Object.entries(CAREER_CLASSES).map(([num, name]) => (
                <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Species</InputLabel>
            <Select
              value={speciesFilter}
              label="Species"
              onChange={(e: SelectChangeEvent<number | ''>) => {
                const val = e.target.value as number | '';
                setExtraParam('species', val !== '' ? String(val) : null);
              }}
            >
              <MenuItem value="">All Species</MenuItem>
              {Object.entries(SPECIES).map(([num, name]) => (
                <MenuItem key={num} value={Number(num)}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      }
      renderItem={(career) => (
        <Box sx={{ py: 0.25, width: '100%' }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {career.object.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip
              label={CAREER_CLASSES[career.object.class] ?? `Class ${career.object.class}`}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ opacity: 0.95 }}
            />
            {career.object.species.length > 0 && (
              <Chip
                label={career.object.species.map((s) => SPECIES[s] ?? `Species ${s}`).join(' · ')}
                size="small"
                variant="outlined"
                sx={{ opacity: 0.95 }}
              />
            )}
            <SourceChips source={career.object.source} />
          </Box>
        </Box>
      )}
    />
  );
}
