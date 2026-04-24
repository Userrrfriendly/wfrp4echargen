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
import { useSpell } from '../../hooks/useSpells';
import { MAGIC_LORES, SOURCES, SPELL_TYPES, loreName } from '../../utils/gameData';

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

export default function SpellDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: spell, isLoading } = useSpell(id!);

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

  if (!spell) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Spell not found.
        </Typography>
        <Button onClick={() => navigate(-1)}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>
    );
  }

  const { object: data } = spell;

  const sourcesText = Object.entries(data.source)
    .map(([key, page]) => `${SOURCES[key] ?? key}${page ? ` p. ${page}` : ''}`)
    .join(', ');

  const lores = data.classification.labels;
  const loreText = lores.length > 0
    ? lores.map((l) => MAGIC_LORES[l] ?? `Lore ${l}`).join(', ')
    : null;

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
          <InfoRow label="CN:" value={String(data.cn)} />
          <InfoRow label="Range:" value={data.range} />
          <InfoRow label="Target:" value={data.target} />
          <InfoRow label="Duration:" value={data.duration} />
          <Box sx={{ display: 'flex', gap: 2, py: 0.75, flexWrap: 'wrap' }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ minWidth: 120, flexShrink: 0 }}
            >
              Type:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip
                label={
                  SPELL_TYPES[data.classification.type] ??
                  `Type ${data.classification.type}`
                }
                size="small"
                variant="outlined"
                sx={{ borderWidth: 2 }}
              />
              {loreText && (
                <Chip
                  label={loreName(lores)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderWidth: 2 }}
                />
              )}
            </Box>
          </Box>
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
