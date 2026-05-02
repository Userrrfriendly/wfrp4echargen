import {
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Career, Character } from '../../../types';
import {
  ATTRIBUTE_LABELS,
  ATTRIBUTE_ORDER,
  CHARACTER_SPECIES,
  SPECIES_MOVEMENT,
  STATUS_TIERS,
} from '../../../utils/gameData';
import {
  attrBonus,
  calcWounds,
  careerLevelName,
  getTotalAttr,
} from '../../../utils/characterUtils';

interface Props {
  character: Character;
  career: Career | undefined;
}

export default function AttributesTab({ character, career }: Props) {
  const { object: data } = character;

  const totalT = getTotalAttr(character, 'T');
  const totalWP = getTotalAttr(character, 'WP');
  const movement = SPECIES_MOVEMENT[data.species] ?? 4;
  const wounds = calcWounds(character);
  const speciesName = CHARACTER_SPECIES[data.species] ?? data.species;
  const statusTier = STATUS_TIERS[data.status] ?? String(data.status);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        <Chip
          label={speciesName}
          size="small"
          variant="outlined"
          sx={{ borderWidth: 2 }}
        />
        {career && (
          <Chip
            label={`${careerLevelName(career, data.career.number)} (${career.object.name})`}
            size="small"
            color="primary"
          />
        )}
        <Chip
          label={`${statusTier} ${data.standing}`}
          size="small"
          variant="outlined"
          sx={{ borderWidth: 2 }}
        />
      </Box>

      {/* Desktop: attributes as columns */}
      <Box
        sx={{ display: { xs: 'none', sm: 'block' }, overflowX: 'auto', mb: 3 }}
      >
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }} />
              {ATTRIBUTE_ORDER.map((key) => (
                <TableCell
                  key={key}
                  align="center"
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {key}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', fontSize: '0.6rem' }}
                  >
                    {ATTRIBUTE_LABELS[key]}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                Initial
              </TableCell>
              {ATTRIBUTE_ORDER.map((key) => (
                <TableCell key={key} align="center">
                  {data.baseAttributes[key]}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                Advances
              </TableCell>
              {ATTRIBUTE_ORDER.map((key) => (
                <TableCell key={key} align="center">
                  {data.attributeAdvances[key]}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                Current
              </TableCell>
              {ATTRIBUTE_ORDER.map((key) => {
                const total = getTotalAttr(character, key);
                return (
                  <TableCell key={key} align="center" sx={{ fontWeight: 600 }}>
                    {total}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Mobile: attributes as rows */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Characteristic</TableCell>
              <TableCell align="center">Initial</TableCell>
              <TableCell align="center">Adv</TableCell>
              <TableCell align="center">Current</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ATTRIBUTE_ORDER.map((key) => {
              const base = data.baseAttributes[key];
              const advances = data.attributeAdvances[key];
              const total = getTotalAttr(character, key);
              return (
                <TableRow key={key}>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {key}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {ATTRIBUTE_LABELS[key]}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{base}</TableCell>
                  <TableCell align="center">{advances}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    {total}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="overline" color="text.secondary" gutterBottom>
        Derived Stats
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 1.5,
        }}
      >
        {[
          { label: 'Wounds', value: wounds },
          { label: 'Movement', value: movement },
          { label: 'Toughness Bonus', value: attrBonus(totalT) },
          { label: 'WP Bonus', value: attrBonus(totalWP) },
          { label: 'Fate', value: data.fate },
          { label: 'Fortune', value: data.fortune },
          { label: 'Resilience', value: data.resilience },
          { label: 'Resolve', value: data.resolve },
        ].map(({ label, value }) => (
          <Box
            key={label}
            sx={{
              p: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              textAlign: 'center',
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
  );
}
