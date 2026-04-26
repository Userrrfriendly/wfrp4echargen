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
import { useQuality } from '../../hooks/useQualities';
import { QUALITY_TYPES, SOURCES, TRAPPING_TYPES } from '../../utils/gameData';
import { usePageTitle } from '../../hooks/usePageTitle';

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

function applicableToLabel(applicableTo: number[]): string {
  const allTypes = Object.keys(TRAPPING_TYPES).length;
  if (applicableTo.length >= allTypes) return 'All';
  return applicableTo.map((n) => TRAPPING_TYPES[n] ?? `${n}`).join(', ');
}

export default function QualityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quality, isLoading } = useQuality(id!);
  usePageTitle(
    quality
      ? `Qualities & Flaws / ${quality.object.name}`
      : 'Qualities & Flaws',
  );

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

  if (!quality) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Quality not found.
        </Typography>
        <Button onClick={() => navigate(-1)}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>
    );
  }

  const { object: data } = quality;

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
              label={QUALITY_TYPES[data.type] ?? `Type ${data.type}`}
              size="small"
              color={data.type === 0 ? 'success' : 'error'}
              variant="outlined"
              sx={{ borderWidth: 2 }}
            />
          </Box>
          {data.applicableTo.length > 0 && (
            <InfoRow
              label="Applies to:"
              value={applicableToLabel(data.applicableTo)}
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
