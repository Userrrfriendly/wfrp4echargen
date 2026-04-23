import { useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Skeleton,
  Divider,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ThemedTooltip from '../../components/common/ThemedTooltip';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareer } from '../../hooks/useCareers';
import { useSkills } from '../../hooks/useSkills';
import { useTalents } from '../../hooks/useTalents';
import {
  ATTRIBUTES,
  CAREER_CLASSES,
  SKILL_TYPES,
  SPECIES,
  STATUS_TIERS,
} from '../../utils/gameData';
import type { CareerLevelData, Skill, Talent } from '../../types';

const ALL_CHAR_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function resolveMaxRank(attribute: number, maxRank: number): string | null {
  if (attribute > 0)
    return `${ATTRIBUTES[attribute] ?? `Attr ${attribute}`} Bonus`;
  if (maxRank === 0) return null;
  if (maxRank >= 99) return '∞';
  return String(maxRank);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        mb: 2.5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        gap: { md: 2 },
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: 1, flexShrink: 0 }}
      >
        {title ? title + ': ' : ''}
      </Typography>
      <Box sx={{ mt: { xs: 0.5, md: 0 }, minWidth: 0, flex: { md: 1 } }}>
        {children}
      </Box>
    </Box>
  );
}

interface LevelPanelProps {
  level: CareerLevelData;
  index: number;
  skillMap: Record<string, Skill>;
  talentMap: Record<string, Talent>;
  previousAttributes: number[];
}

function LevelPanel({
  level,
  index,
  skillMap,
  talentMap,
  previousAttributes,
}: LevelPanelProps) {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'baseline' },
          gap: { md: 2 },
          mb: 2.5,
        }}
      >
        <Typography variant="h5">
          {`Level ${index + 1}`}
          {level.name ? ` / ${level.name} /` : ''}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          {'Status: '}
          {STATUS_TIERS[level.status] ?? `Tier ${level.status}`}{' '}
          {level.standing > 0 ? level.standing : ''}
        </Typography>
      </Box>

      <Section title="Characteristic Advances">
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {ALL_CHAR_INDICES.map((idx) => {
            const active = level.attributes.includes(idx);
            const inherited = !active && previousAttributes.includes(idx);
            const color = active
              ? 'success'
              : inherited
                ? 'primary'
                : 'default';
            return (
              <Chip
                key={idx}
                label={ATTRIBUTES[idx]}
                size="small"
                color={color}
                variant="outlined"
                sx={{
                  opacity: 0.95,
                  borderWidth: 2,
                  fontWeight: active ? 'bold' : 'default',
                }}
              />
            );
          })}
        </Box>
      </Section>

      {level.skills.length > 0 && (
        <Section title="Skills">
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {level.skills.map((id) => {
              const skill = skillMap[id];
              const label = skill?.object.name ?? id;
              const tooltipTitle = skill ? (
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {ATTRIBUTES[skill.object.attribute] ??
                      `Attr ${skill.object.attribute}`}
                    {' · '}
                    {SKILL_TYPES[skill.object.type] ??
                      `Type ${skill.object.type}`}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {skill.object.description || 'No description available.'}
                  </Typography>
                </Box>
              ) : (
                ''
              );
              return (
                <ThemedTooltip key={id} title={tooltipTitle}>
                  <Chip
                    label={label}
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/reference/skills/${id}`)}
                    sx={{ opacity: 0.95, borderWidth: 2, cursor: 'pointer' }}
                  />
                </ThemedTooltip>
              );
            })}
          </Box>
        </Section>
      )}

      {level.talents.length > 0 && (
        <Section title="Talents">
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {level.talents.map((id) => {
              const talent = talentMap[id];
              const label = talent?.object.name ?? id;
              const maxRank = talent
                ? resolveMaxRank(talent.object.attribute, talent.object.maxRank)
                : null;
              const tooltipTitle = talent ? (
                <Box sx={{ p: 0.5 }}>
                  {maxRank && (
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      Max rank: {maxRank}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mt: maxRank ? 0.5 : 0 }}>
                    {talent.object.description || 'No description available.'}
                  </Typography>
                </Box>
              ) : (
                ''
              );
              return (
                <ThemedTooltip key={id} title={tooltipTitle}>
                  <Chip
                    label={label}
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/reference/talents/${id}`)}
                    sx={{ opacity: 0.95, borderWidth: 2, cursor: 'pointer' }}
                  />
                </ThemedTooltip>
              );
            })}
          </Box>
        </Section>
      )}

      {level.items && (
        <Section title="Starting Trappings">
          <Typography variant="body1" color="text.secondary">
            {level.items}
          </Typography>
        </Section>
      )}
    </Box>
  );
}

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: career, isLoading: careerLoading } = useCareer(id!);
  const { data: allSkills, isLoading: skillsLoading } = useSkills();
  const { data: allTalents, isLoading: talentsLoading } = useTalents();

  const isLoading = careerLoading || skillsLoading || talentsLoading;

  const skillMap = useMemo<Record<string, Skill>>(() => {
    if (!allSkills) return {};
    return Object.fromEntries(allSkills.map((s) => [s.id, s]));
  }, [allSkills]);

  const talentMap = useMemo<Record<string, Talent>>(() => {
    if (!allTalents) return {};
    return Object.fromEntries(allTalents.map((t) => [t.id, t]));
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
        <Button onClick={() => navigate(-1)}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>
    );
  }

  const { object: data } = career;
  const levels = [data.level1, data.level2, data.level3, data.level4].filter(
    (l) => l.exists,
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2, px: 0 }}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>

        <Typography variant="h4" gutterBottom>
          {data.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 1, md: 2 },
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box
            sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexShrink: 0 }}
          >
            <Chip
              label={CAREER_CLASSES[data.class] ?? `Class ${data.class}`}
              color="primary"
              size="small"
            />
            {data.species.map((s) => (
              <Chip
                key={s}
                label={SPECIES[s] ?? `Species ${s}`}
                size="small"
                variant="outlined"
                sx={{ borderWidth: 2, opacity: 0.95 }}
              />
            ))}
          </Box>
          {data.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              {data.description}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {levels.map((level, i) => (
          <Box key={i}>
            <LevelPanel
              level={level}
              index={i}
              skillMap={skillMap}
              talentMap={talentMap}
              previousAttributes={levels
                .slice(0, i)
                .flatMap((l) => l.attributes)}
            />
            {i < levels.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
