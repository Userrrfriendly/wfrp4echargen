import { useState } from 'react';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import type {
  Career,
  Character,
  Mutation,
  Prayer,
  Skill,
  Spell,
  Talent,
  Trapping,
} from '../../types';
import AttributesTab from './tabs/AttributesTab';
import SkillsTab from './tabs/SkillsTab';
import TalentsTab from './tabs/TalentsTab';
import EquipmentTab from './tabs/EquipmentTab';
import MagicTab from './tabs/MagicTab';
import NotesTab from './tabs/NotesTab';

interface CharacterSheetProps {
  character: Character;
  career: Career | undefined;
  careerMap: Record<string, Career>;
  skills: Skill[];
  talents: Talent[];
  trappings: Trapping[];
  spells: Spell[];
  prayers: Prayer[];
  mutations: Mutation[];
  onBack: () => void;
}

const TABS = [
  'Attributes',
  'Skills',
  'Talents',
  'Equipment',
  'Magic',
  'Notes',
] as const;

export default function TabbedCharacterSheet({
  character,
  career,
  careerMap,
  skills,
  talents,
  trappings,
  spells,
  prayers,
  mutations,
  onBack,
}: CharacterSheetProps) {
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Button onClick={onBack} sx={{ mb: 1, px: 0 }}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
        <Typography variant="h4" gutterBottom>
          {character.object.name}
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          {TABS.map((label) => (
            <Tab key={label} label={label} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {tab === 0 && <AttributesTab character={character} career={career} />}
        {tab === 1 && <SkillsTab character={character} skills={skills} />}
        {tab === 2 && <TalentsTab character={character} talents={talents} />}
        {tab === 3 && (
          <EquipmentTab character={character} trappings={trappings} />
        )}
        {tab === 4 && (
          <MagicTab spells={spells} prayers={prayers} mutations={mutations} />
        )}
        {tab === 5 && (
          <NotesTab
            character={character}
            career={career}
            careerMap={careerMap}
          />
        )}
      </Box>
    </Box>
  );
}
