import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import type { Mutation, Prayer, Spell } from '../../../types';
import { MUTATION_TYPES } from '../../../utils/gameData';

interface Props {
  spells: Spell[];
  prayers: Prayer[];
  mutations: Mutation[];
}

function SpellCard({ spell }: { spell: Spell }) {
  const { object: s } = spell;
  return (
    <Paper sx={{ p: 2, mb: 1.5, boxShadow: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
          mb: 0.5,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {s.name}
        </Typography>
        <Chip
          label={`CN ${s.cn}`}
          size="small"
          color="primary"
          sx={{ flexShrink: 0 }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
        {s.range && (
          <Chip
            label={`Range: ${s.range}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
        {s.target && (
          <Chip
            label={`Target: ${s.target}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
        {s.duration && (
          <Chip
            label={`Duration: ${s.duration}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
      </Box>
      {s.description && (
        <Typography variant="body1" color="text.secondary">
          {s.description}
        </Typography>
      )}
    </Paper>
  );
}

function PrayerCard({ prayer }: { prayer: Prayer }) {
  const { object: p } = prayer;
  return (
    <Paper sx={{ p: 2, mb: 1.5, boxShadow: 2 }}>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
        {p.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
        {p.range && (
          <Chip
            label={`Range: ${p.range}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
        {p.target && (
          <Chip
            label={`Target: ${p.target}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
        {p.duration && (
          <Chip
            label={`Duration: ${p.duration}`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        )}
      </Box>
      {p.description && (
        <Typography variant="body1" color="text.secondary">
          {p.description}
        </Typography>
      )}
    </Paper>
  );
}

function MutationCard({ mutation }: { mutation: Mutation }) {
  const { object: m } = mutation;
  const typeLabel = MUTATION_TYPES[m.type] ?? String(m.type);
  return (
    <Paper sx={{ p: 2, mb: 1.5, boxShadow: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {m.name}
        </Typography>
        <Chip
          label={typeLabel}
          size="small"
          color={m.type === 0 ? 'error' : 'warning'}
        />
      </Box>
      {m.description && (
        <Typography variant="body1" color="text.secondary">
          {m.description}
        </Typography>
      )}
    </Paper>
  );
}

export default function MagicTab({ spells, prayers, mutations }: Props) {
  const hasContent =
    spells.length > 0 || prayers.length > 0 || mutations.length > 0;

  if (!hasContent) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No spells, prayers, or mutations.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {spells.length > 0 && (
        <>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1 }}>
            Spells ({spells.length})
          </Typography>
          {spells.map((s) => (
            <SpellCard key={s.id} spell={s} />
          ))}
          {(prayers.length > 0 || mutations.length > 0) && (
            <Divider sx={{ my: 2 }} />
          )}
        </>
      )}

      {prayers.length > 0 && (
        <>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1 }}>
            Prayers ({prayers.length})
          </Typography>
          {prayers.map((p) => (
            <PrayerCard key={p.id} prayer={p} />
          ))}
          {mutations.length > 0 && <Divider sx={{ my: 2 }} />}
        </>
      )}

      {mutations.length > 0 && (
        <>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1 }}>
            Mutations ({mutations.length})
          </Typography>
          {mutations.map((m) => (
            <MutationCard key={m.id} mutation={m} />
          ))}
        </>
      )}
    </Box>
  );
}
