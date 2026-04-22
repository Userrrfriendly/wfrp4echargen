import { useMemo } from 'react';
import {
  Box,
  Button,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTalent, useTalents } from '../../hooks/useTalents';
import { ATTRIBUTES, SOURCES } from '../../utils/gameData';
import type { EntityModifiers } from '../../types';

function resolveMaxRank(attribute: number, maxRank: number): string | null {
  if (attribute > 0)
    return `${ATTRIBUTES[attribute] ?? `Attr ${attribute}`} Bonus`;
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

export default function TalentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: talent, isLoading } = useTalent(id!);
  const { data: allTalents } = useTalents();

  const talentNameMap = useMemo<Record<string, string>>(() => {
    if (!allTalents) return {};
    return Object.fromEntries(allTalents.map((t) => [t.id, t.object.name]));
  }, [allTalents]);

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

  if (!talent) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Talent not found.
        </Typography>
        <Button onClick={() => navigate(-1)}>← Back</Button>
      </Box>
    );
  }

  const { object: data } = talent;

  const maxRank = resolveMaxRank(data.attribute, data.maxRank);
  const modLabel = formatModifiers(data.modifiers);
  const effects = data.modifiers.effects.filter(
    (e): e is string => typeof e === 'string',
  );
  const sourcesText = Object.entries(data.source)
    .map(([key, page]) => `${SOURCES[key] ?? key}${page ? ` p. ${page}` : ''}`)
    .join(', ');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Button onClick={() => navigate(-1)} sx={{ mb: 2, px: 0 }}>
          ← Back
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {data.name}
        </Typography>

        <Paper sx={{ p: 2.5, mb: 2 }}>
          {maxRank && <InfoRow label="Max Rank:" value={maxRank} />}
          {data.tests && <InfoRow label="Tests:" value={data.tests} />}
          {modLabel && <InfoRow label="Modifiers:" value={modLabel} />}
          {data.modifiers.size !== 0 && (
            <InfoRow
              label="Size:"
              value={`${data.modifiers.size > 0 ? '+' : ''}${data.modifiers.size} `}
            />
          )}
          {effects.length > 0 && (
            <InfoRow label="Effect:" value={effects.join('; ')} />
          )}
          {data.group.length > 0 && (
            <InfoRow
              label="Belongs to Group:"
              value={data.group
                .map((gid) => talentNameMap[gid] ?? gid)
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
