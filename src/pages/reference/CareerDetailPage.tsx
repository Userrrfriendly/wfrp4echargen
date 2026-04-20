import { useState, useMemo } from 'react';
import {
  Box, Typography, Chip, Button, Tabs, Tab, Skeleton, Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareer } from '../../hooks/useCareers';
import { useSkills } from '../../hooks/useSkills';
import { useTalents } from '../../hooks/useTalents';
import { CAREER_CLASSES, SPECIES, ATTRIBUTES, STATUS_TIERS } from '../../utils/gameData';
import type { CareerLevelData } from '../../types';

interface LevelPanelProps {
  level: CareerLevelData;
  skillMap: Record<string, string>;
  talentMap: Record<string, string>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
        {title}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

function LevelPanel({ level, skillMap, talentMap }: LevelPanelProps) {
  return (
    <Box sx={{ py: 2 }}>
      <Section title="Status">
        <Typography>
          {STATUS_TIERS[level.status] ?? `Tier ${level.status}`}{' '}
          {level.standing > 0 ? level.standing : ''}
        </Typography>
      </Section>

      {level.attributes.length > 0 && (
        <Section title="Characteristic Advances">
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {level.attributes.map((a, i) => (
              <Chip key={i} label={ATTRIBUTES[a] ?? String(a)} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        </Section>
      )}

      {level.skills.length > 0 && (
        <Section title="Skills">
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {level.skills.map(id => (
              <Chip key={id} label={skillMap[id] ?? id} size="small" />
            ))}
          </Box>
        </Section>
      )}

      {level.talents.length > 0 && (
        <Section title="Talents">
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {level.talents.map(id => (
              <Chip key={id} label={talentMap[id] ?? id} size="small" color="secondary" variant="outlined" />
            ))}
          </Box>
        </Section>
      )}

      {level.items && (
        <Section title="Starting Trappings">
          <Typography variant="body1" color="text.secondary">{level.items}</Typography>
        </Section>
      )}
    </Box>
  );
}

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const { data: career, isLoading: careerLoading } = useCareer(id!);
  const { data: allSkills, isLoading: skillsLoading } = useSkills();
  const { data: allTalents, isLoading: talentsLoading } = useTalents();

  const isLoading = careerLoading || skillsLoading || talentsLoading;

  const skillMap = useMemo<Record<string, string>>(() => {
    if (!allSkills) return {};
    return Object.fromEntries(allSkills.map(s => [s.id, s.object.name]));
  }, [allSkills]);

  const talentMap = useMemo<Record<string, string>>(() => {
    if (!allTalents) return {};
    return Object.fromEntries(allTalents.map(t => [t.id, t.object.name]));
  }, [allTalents]);

  if (isLoading) {
    return (
      <Box>
        <Skeleton width={120} height={36} />
        <Skeleton width="50%" height={48} sx={{ mt: 1 }} />
        <Skeleton height={24} sx={{ mt: 1 }} />
        <Skeleton height={200} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!career) {
    return (
      <Box>
        <Typography gutterBottom>Career not found.</Typography>
        <Button onClick={() => navigate('/reference/careers')}>← Back to Careers</Button>
      </Box>
    );
  }

  const { object: data } = career;
  const levels = [data.level1, data.level2, data.level3, data.level4].filter(l => l.exists);

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Button onClick={() => navigate('/reference/careers')} sx={{ mb: 2, px: 0 }}>
        ← Careers
      </Button>

      <Typography variant="h4" gutterBottom>{data.name}</Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
        <Chip
          label={CAREER_CLASSES[data.class] ?? `Class ${data.class}`}
          color="primary"
          size="small"
        />
        {data.species.map(s => (
          <Chip key={s} label={SPECIES[s] ?? `Species ${s}`} size="small" variant="outlined" />
        ))}
      </Box>

      {data.description && (
        <Typography color="text.secondary" sx={{ mb: 2, maxWidth: 680 }}>
          {data.description}
        </Typography>
      )}

      <Divider sx={{ mb: 2 }} />

      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {levels.map((level, i) => (
          <Tab key={i} label={level.name || `Level ${i + 1}`} />
        ))}
      </Tabs>

      {levels.map((level, i) => (
        <Box key={i} role="tabpanel" hidden={tab !== i}>
          {tab === i && (
            <LevelPanel level={level} skillMap={skillMap} talentMap={talentMap} />
          )}
        </Box>
      ))}
    </Box>
  );
}
