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
import { useTrapping } from '../../hooks/useTrappings';
import {
  ARMOUR_LOCATIONS,
  AVAILABILITY,
  MELEE_GROUPS,
  MELEE_REACH,
  RANGED_GROUPS,
  SOURCES,
  TRAPPING_TYPES,
} from '../../utils/gameData';
import ThemedTooltip from '../../components/common/ThemedTooltip';
import type { Trapping } from '../../types';

const CURRENCY_COLORS = {
  GC: 'gold',
  SS: 'silver',
  BP: '#983719',
} as const;

function PriceDisplay({ brass }: { brass: number }) {
  const gold = Math.floor(brass / 240);
  const silver = Math.floor((brass % 240) / 12);
  const bp = brass % 12;

  const parts = [
    gold > 0 && { value: gold, unit: 'GC', unitLong: 'Gold Crown' as const },
    silver > 0 && { value: silver, unit: 'SS', unitLong: 'Silver Shilling' as const },
    bp > 0 && { value: bp, unit: 'BP', unitLong: 'Brass Penny' as const },
  ].filter(Boolean) as {
    value: number;
    unit: keyof typeof CURRENCY_COLORS;
    unitLong: string;
  }[];

  if (parts.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        —
      </Typography>
    );
  }

  const currencyParts = (
    <Box component="span" sx={{ display: 'flex', gap: 0.75 }}>
      {parts.map(({ value, unit }) => (
        <Box key={unit} component="span" sx={{ color: CURRENCY_COLORS[unit] }}>
          {value}
          {unit}
        </Box>
      ))}
    </Box>
  );

  return (
    <ThemedTooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" sx={{ display: 'block' }}>
            Price:
          </Typography>
          <Box>
            {parts.map(({ value, unitLong }) => (
              <Typography key={unitLong} variant="body2">
                {value} {unitLong}
              </Typography>
            ))}
          </Box>
          {parts.some((p) => p.unit === 'GC' || p.unit === 'SS') && (
            <Typography
              variant="body2"
              sx={{ display: 'block', fontWeight: 600, fontSize: '1rem' }}
            >
              ({brass} BP)
            </Typography>
          )}
        </Box>
      }
    >
      <Chip
        size="small"
        label={currencyParts}
        sx={{
          typography: 'diablo',
          fontWeight: 600,
          fontSize: '1rem',
          backgroundColor: 'black',
          borderWidth: 2,
        }}
      />
    </ThemedTooltip>
  );
}

function TrappingStats({ item }: { item: Trapping }) {
  const { type, melee, ranged, armour } = item.object;

  if (type === 0 && melee.group >= 0 && (melee.dmg > 0 || melee.dmgSbMult > 0)) {
    const dmgStr =
      [
        melee.dmg ? `+${melee.dmg}` : '',
        melee.dmgSbMult ? `+${melee.dmgSbMult}SB` : '',
      ]
        .filter(Boolean)
        .join(' ') || '+0';
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body1" color="text.secondary">
          Dmg: {dmgStr}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reach: {MELEE_REACH[melee.reach] ?? melee.reach}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Group: {MELEE_GROUPS[melee.group] ?? `G${melee.group}`}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hands:{' '}
          {melee.hands === 2 ? 'Two-handed' : melee.hands === 1 ? 'One-handed' : '—'}
        </Typography>
      </Box>
    );
  }

  if (type === 1 && (ranged.dmg > 0 || ranged.dmgSbMult > 0 || ranged.rng > 0)) {
    const dmgStr =
      [
        ranged.dmg ? `+${ranged.dmg}` : '',
        ranged.dmgSbMult ? `+${ranged.dmgSbMult}SB` : '',
      ]
        .filter(Boolean)
        .join(' ') || '+0';
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body1" color="text.secondary">
          Dmg: {dmgStr}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rng: {ranged.rng > 0 ? `${ranged.rng}` : '—'}
          {ranged.rngSbMult > 0 ? ` (+${ranged.rngSbMult}×SB)` : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Group: {RANGED_GROUPS[ranged.group] ?? `G${ranged.group}`}
        </Typography>
      </Box>
    );
  }

  if (type === 3 && armour.points > 0) {
    const locs = armour.location.map((l) => ARMOUR_LOCATIONS[l] ?? `Loc${l}`).join(', ');
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body1" color="text.secondary">
          AP: {armour.points}
        </Typography>
        {locs && (
          <Typography variant="body1" color="text.secondary">
            Covers: {locs}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
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

export default function TrappingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trapping, isLoading } = useTrapping(id!);

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

  if (!trapping) {
    return (
      <Box>
        <Typography variant="body1" gutterBottom>
          Item not found.
        </Typography>
        <Button onClick={() => navigate(-1)}>
          <ArrowBackRounded fontSize="small" /> Back
        </Button>
      </Box>
    );
  }

  const { object: data } = trapping;

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
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={TRAPPING_TYPES[data.type] ?? `Type ${data.type}`}
              size="small"
              variant="outlined"
              sx={{ borderWidth: 2 }}
            />
            {data.availability !== undefined && (
              <Chip
                label={AVAILABILITY[data.availability] ?? `Av ${data.availability}`}
                size="small"
                variant="outlined"
                sx={{ borderWidth: 2 }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, py: 0.75, alignItems: 'center' }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ minWidth: 120, flexShrink: 0 }}
            >
              Price:
            </Typography>
            <PriceDisplay brass={data.price} />
          </Box>

          {data.enc > 0 && <InfoRow label="Enc:" value={String(data.enc)} />}

          {data.properties.length > 0 && (
            <InfoRow label="Properties:" value={data.properties.join(', ')} />
          )}

          <TrappingStats item={trapping} />

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
