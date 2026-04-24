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
import { usePrayer } from '../../hooks/usePrayers';
import { SOURCES } from '../../utils/gameData';

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

function extractDeity(description: string): string | null {
  const match = description.match(/^Miracle of ([^.(]+)/i);
  return match ? match[1].trim() : null;
}

export default function PrayerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: prayer, isLoading } = usePrayer(id!);

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

  if (!prayer) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Prayer not found.
        </Typography>
        <Button onClick={() => navigate(-1)}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>
    );
  }

  const { object: data } = prayer;
  const deity = extractDeity(data.description);

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
          {deity && (
            <Box sx={{ display: 'flex', gap: 2, py: 0.75 }}>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ minWidth: 120, flexShrink: 0 }}
              >
                Deity:
              </Typography>
              <Chip
                label={deity}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ borderWidth: 2 }}
              />
            </Box>
          )}
          <InfoRow label="Range:" value={data.range} />
          <InfoRow label="Target:" value={data.target} />
          <InfoRow label="Duration:" value={data.duration} />
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
