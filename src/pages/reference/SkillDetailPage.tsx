import { useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { useParams, useNavigate } from 'react-router-dom';
import { useSkill, useSkills } from '../../hooks/useSkills';
import { ATTRIBUTES, SKILL_TYPES, SOURCES } from '../../utils/gameData';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 0.75 }}>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ minWidth: 120, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: skill, isLoading } = useSkill(id!);
  const { data: allSkills } = useSkills();

  const skillNameMap = useMemo<Record<string, string>>(() => {
    if (!allSkills) return {};
    return Object.fromEntries(allSkills.map((s) => [s.id, s.object.name]));
  }, [allSkills]);

  if (isLoading) {
    return (
      <Box>
        <Skeleton width={120} height={36} />
        <Skeleton width="40%" height={48} sx={{ mt: 1 }} />
        <Skeleton height={24} sx={{ mt: 1 }} />
        <Skeleton height={120} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (!skill) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Skill not found.
        </Typography>
        <Button onClick={() => navigate(-1)}><ArrowBackRounded fontSize="small" /> Back</Button>
      </Box>
    );
  }

  const { object: data } = skill;

  const sourcesText = Object.entries(data.source)
    .map(([key, page]) => `${SOURCES[key] ?? key}${page ? ` p. ${page}` : ''}`)
    .join(', ');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2, px: 0 }}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {data.name}
        </Typography>

        <Paper sx={{ p: 2.5, mb: 2 }}>
          <InfoRow
            label="Attribute:"
            value={ATTRIBUTES[data.attribute] ?? `Attr ${data.attribute}`}
          />
          <InfoRow
            label="Type:"
            value={SKILL_TYPES[data.type] ?? `Type ${data.type}`}
          />
          {data.group.length > 0 && (
            <InfoRow
              label="Belongs to Group:"
              value={data.group
                .map((gid) => skillNameMap[gid] ?? gid)
                .join(', ')}
            />
          )}
          {sourcesText && <InfoRow label="Source:" value={sourcesText} />}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="text.secondary">
            {data.description || 'No description available.'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
