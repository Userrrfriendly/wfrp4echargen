import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '../../hooks/useMutations';
import { MUTATION_TYPES, SOURCES } from '../../utils/gameData';
import type { EntityModifiers } from '../../types';

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

function formatModifiers(modifiers: EntityModifiers): string | null {
  const parts: string[] = [];
  for (const [attr, val] of Object.entries(modifiers.attributes)) {
    if (val !== 0) parts.push(`${val > 0 ? '+' : ''}${val}${attr}`);
  }
  if (modifiers.movement !== 0)
    parts.push(`${modifiers.movement > 0 ? '+' : ''}${modifiers.movement}Mov`);
  return parts.length > 0 ? parts.join(', ') : null;
}

export default function MutationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: mutation, isLoading } = useMutation(id!);

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

  if (!mutation) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Mutation not found.
        </Typography>
        <Button onClick={() => navigate(-1)}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>
    );
  }

  const { object: data } = mutation;
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
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          {data.name}
        </Typography>

        <Paper sx={{ p: 2.5, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, py: 0.75 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ minWidth: 120, flexShrink: 0 }}
            >
              Type:
            </Typography>
            <Chip
              label={MUTATION_TYPES[data.type] ?? `Type ${data.type}`}
              size="small"
              color={data.type === 0 ? 'primary' : 'secondary'}
              variant="outlined"
              sx={{ borderWidth: 2 }}
            />
          </Box>
          {modLabel && <InfoRow label="Modifiers:" value={modLabel} />}
          {data.modifiers.size !== 0 && (
            <InfoRow
              label="Size:"
              value={`${data.modifiers.size > 0 ? '+' : ''}${data.modifiers.size}`}
            />
          )}
          {effects.length > 0 && (
            <InfoRow label="Effects:" value={effects.join('; ')} />
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
