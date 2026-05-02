import { Box, Chip, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Character, Talent } from '../../../types';
import { resolveMaxRank } from '../../../utils/characterUtils';

interface Props {
  character: Character;
  talents: Talent[];
}

export default function TalentsTab({ character, talents }: Props) {
  const navigate = useNavigate();
  const { object: data } = character;

  const talentMap: Record<string, Talent> = Object.fromEntries(
    talents.map((t) => [t.id, t]),
  );

  const rows = data.talents.map((ref) => {
    const talent = talentMap[ref.id];
    return {
      id: ref.id,
      name: talent?.object.name ?? ref.id,
      rank: ref.number,
      maxRank: talent
        ? resolveMaxRank(talent.object.attribute, talent.object.maxRank)
        : null,
      description: talent?.object.description ?? '',
      isGroup: talent?.object.isGroup ?? false,
    };
  });

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No talents recorded.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {rows.map((row) => (
        <Paper
          key={row.id}
          onClick={() => navigate(`/reference/talents/${row.id}`)}
          sx={(theme) => ({
            p: 2,
            mb: 1.5,
            boxShadow: 2,
            cursor: 'pointer',
            border: '1px solid transparent',
            transition: 'box-shadow 0.2s',
            '&:hover': {
              boxShadow: 6,
              border: `1px solid ${theme.palette.divider}`,
            },
          })}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {row.name}
              </Typography>
              {row.isGroup && (
                <Chip
                  label="Group"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 18 }}
                />
              )}
            </Box>
            <Chip
              label={`Rank ${row.rank}${row.maxRank ? ` / ${row.maxRank}` : ''}`}
              size="small"
              color="primary"
              sx={{ flexShrink: 0 }}
            />
          </Box>
          {row.description && (
            <Typography variant="body1" color="text.secondary">
              {row.description}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}
