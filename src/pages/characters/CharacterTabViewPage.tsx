import { useMemo } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacter } from '../../hooks/useCharacters';
import { useSkillsByIds } from '../../hooks/useSkills';
import { useTalentsByIds } from '../../hooks/useTalents';
import { useTrappingsByIds } from '../../hooks/useTrappings';
import { useCareer, useCareers } from '../../hooks/useCareers';
import { useSpells } from '../../hooks/useSpells';
import { usePrayers } from '../../hooks/usePrayers';
import { useMutations } from '../../hooks/useMutations';
import { usePageTitle } from '../../hooks/usePageTitle';
import TabbedCharacterSheet from '../../components/characters/TabbedCharacterSheet';
import type { Career, Spell, Prayer, Mutation } from '../../types';

export default function CharacterTabViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: character, isLoading: charLoading, error } = useCharacter(id!);

  usePageTitle(
    character ? `Characters / ${character.object.name}` : 'Characters',
  );

  const skillIds = useMemo(
    () => character?.object.skills.map((s) => s.id) ?? [],
    [character],
  );
  const talentIds = useMemo(
    () => character?.object.talents.map((t) => t.id) ?? [],
    [character],
  );
  const allItemIds = useMemo(() => {
    if (!character) return [];
    const { equippedItems, carriedItems, storedItems } = character.object;
    return [
      ...equippedItems.map((i) => i.id),
      ...carriedItems.map((i) => i.id),
      ...storedItems.map((i) => i.id),
    ];
  }, [character]);
  const careerId = character?.object.career.id ?? '';

  const { data: skills, isLoading: skillsLoading } = useSkillsByIds(skillIds);
  const { data: talents, isLoading: talentsLoading } =
    useTalentsByIds(talentIds);
  const { data: trappings, isLoading: trappingsLoading } =
    useTrappingsByIds(allItemIds);
  const { data: career, isLoading: careerLoading } = useCareer(careerId);
  const { data: allCareers, isLoading: careersLoading } = useCareers();
  const careerMap = useMemo<Record<string, Career>>(() => {
    if (!allCareers) return {};
    return Object.fromEntries(allCareers.map((c) => [c.id, c]));
  }, [allCareers]);
  const { data: allSpells, isLoading: spellsLoading } = useSpells();
  const { data: allPrayers, isLoading: prayersLoading } = usePrayers();
  const { data: allMutations, isLoading: mutationsLoading } = useMutations();

  const isLoading =
    charLoading ||
    skillsLoading ||
    talentsLoading ||
    trappingsLoading ||
    careerLoading ||
    careersLoading ||
    spellsLoading ||
    prayersLoading ||
    mutationsLoading;

  const spells = useMemo<Spell[]>(() => {
    if (!allSpells || !character) return [];
    const ids = new Set(character.object.spells);
    return allSpells.filter((s) => ids.has(s.id));
  }, [allSpells, character]);

  const prayers = useMemo<Prayer[]>(() => {
    if (!allPrayers || !character) return [];
    const ids = new Set(character.object.prayers);
    return allPrayers.filter((p) => ids.has(p.id));
  }, [allPrayers, character]);

  const mutations = useMemo<Mutation[]>(() => {
    if (!allMutations || !character) return [];
    const ids = new Set(character.object.mutations);
    return allMutations.filter((m) => ids.has(m.id));
  }, [allMutations, character]);

  if (isLoading) {
    return (
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Skeleton width={100} height={36} />
        <Skeleton width="40%" height={52} sx={{ mt: 1 }} />
        <Skeleton height={48} sx={{ mt: 2 }} />
        <Skeleton height={300} sx={{ mt: 1 }} />
      </Box>
    );
  }

  if (error || !character) {
    return (
      <Box>
        <Typography role="alert" color="error" gutterBottom>
          {error ? (error as Error).message : 'Character not found.'}
        </Typography>
        <Button onClick={() => navigate('/characters')} sx={{ px: 0 }}>
          <ArrowBackRounded fontSize="small" /> Back to Characters
        </Button>
      </Box>
    );
  }

  return (
    <TabbedCharacterSheet
      character={character}
      career={career}
      careerMap={careerMap}
      skills={skills ?? []}
      talents={talents ?? []}
      trappings={trappings ?? []}
      spells={spells}
      prayers={prayers}
      mutations={mutations}
      onBack={() => navigate('/characters')}
    />
  );
}
