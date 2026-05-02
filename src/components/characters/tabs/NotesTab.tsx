import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import type { Career, Character } from '../../../types';
import { STATUS_TIERS } from '../../../utils/gameData';
import {
  careerLevelName,
  careerFullTitle,
} from '../../../utils/characterUtils';

interface Props {
  character: Character;
  career: Career | undefined;
  careerMap: Record<string, Career>;
}

export default function NotesTab({ character, career, careerMap }: Props) {
  const { object: data } = character;
  const totalExp = data.currentExp + data.spentExp;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {data.description && (
        <Box>
          <Typography variant="overline" color="text.secondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1">{data.description}</Typography>
        </Box>
      )}

      {data.notes && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="overline" color="text.secondary" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body1">{data.notes}</Typography>
        </Box>
      )}

      <Divider />

      <Box>
        <Typography variant="overline" color="text.secondary" gutterBottom>
          Career
        </Typography>
        {career ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {careerLevelName(career, data.career.number)}
            </Typography>
            <Chip
              label={`Level ${data.career.number}`}
              size="small"
              color="primary"
            />
            <Chip
              label={`${STATUS_TIERS[data.status] ?? String(data.status)} ${data.standing}`}
              size="small"
              variant="outlined"
              sx={{ borderWidth: 2 }}
            />
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            Unknown career
          </Typography>
        )}
      </Box>

      {data.careerPath.length > 0 && (
        <Box>
          <Typography variant="overline" color="text.secondary" gutterBottom>
            Career Path
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.careerPath.map((entry, i) => (
              <Paper
                key={i}
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ minWidth: 24 }}
                >
                  {i + 1}.
                </Typography>
                <Typography variant="body1">
                  {careerMap[entry.id]
                    ? careerFullTitle(careerMap[entry.id], entry.number)
                    : entry.id}
                </Typography>
                <Chip
                  label={`Level ${entry.number}`}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 'auto' }}
                />
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      <Divider />

      <Box>
        <Typography variant="overline" color="text.secondary" gutterBottom>
          Experience
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { label: 'Current', value: data.currentExp },
            { label: 'Spent', value: data.spentExp },
            { label: 'Total', value: totalExp },
          ].map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 80,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h5">{value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      <Box>
        <Typography variant="overline" color="text.secondary" gutterBottom>
          Corruption & Sin
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { label: 'Corruption', value: data.corruption },
            { label: 'Sin', value: data.sin },
          ].map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                textAlign: 'center',
                minWidth: 80,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography
                variant="h5"
                color={value > 0 ? 'error.main' : 'text.primary'}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
