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
import { useSkills } from '../../hooks/useSkills';
import { useReferenceFilters } from '../../hooks/useReferenceFilters';
import { ATTRIBUTES, ITEMS_PER_PAGE, SKILL_TYPES } from '../../utils/gameData';
import ReferencePageLayout from '../../components/reference/ReferencePageLayout';
import SourceChips from '../../components/reference/SourceChips';

export default function SkillsPage() {
  const navigate = useNavigate();
  const { data: skills, isLoading, error } = useSkills();
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

  const typeFilter: number | '' = searchParams.has('type')
    ? Number(searchParams.get('type'))
    : '';

  const availableSources = useMemo(() => {
    if (!skills) return undefined;
    const set = new Set<string>();
    skills.forEach((s) =>
      Object.keys(s.object.source).forEach((k) => set.add(k)),
    );
    return Array.from(set);
  }, [skills]);

  const filtered = useMemo(() => {
    if (!skills) return [];
    return skills
      .filter((s) => {
        if (
          search &&
          !s.object.name.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (typeFilter !== '' && s.object.type !== typeFilter) return false;
        if (
          sourceFilter &&
          !Object.keys(s.object.source).includes(sourceFilter)
        )
          return false;
        return true;
      })
      .sort((a, b) => a.object.name.localeCompare(b.object.name));
  }, [skills, search, typeFilter, sourceFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <ReferencePageLayout
      title="Skills"
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
      resultLabel="skill"
      availableSources={availableSources}
      hasActiveExtraFilters={typeFilter !== ''}
      onItemClick={(skill) => navigate(`/reference/skills/${skill.id}`)}
      extraFilters={
        <FormControl size="small" sx={{ minWidth: 140 }}>
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
            {Object.entries(SKILL_TYPES).map(([num, name]) => (
              <MenuItem key={num} value={Number(num)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
      renderItem={(skill) => (
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
              {skill.object.name}
            </Typography>
            {skill.object.isGroup && (
              <Chip
                label="Group"
                size="small"
                variant="outlined"
                sx={{ borderWidth: 2, opacity: 0.95 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
            <Chip
              label={
                ATTRIBUTES[skill.object.attribute] ??
                `Attr ${skill.object.attribute}`
              }
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={
                SKILL_TYPES[skill.object.type] ?? `Type ${skill.object.type}`
              }
              size="small"
              variant="outlined"
              sx={{ borderWidth: 2, opacity: 0.95 }}
            />
            <SourceChips source={skill.object.source} />
          </Box>
        </Box>
      )}
    />
  );
}
