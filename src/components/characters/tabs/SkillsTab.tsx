import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Character, Skill } from '../../../types';
import { ATTRIBUTES } from '../../../utils/gameData';
import type { AttributeKey } from '../../../utils/gameData';

// Map attribute number (1-based) to AttributeKey string
const ATTR_NUM_TO_KEY: Record<number, AttributeKey> = {
  1: 'WS',
  2: 'BS',
  3: 'S',
  4: 'T',
  5: 'I',
  6: 'Ag',
  7: 'Dex',
  8: 'Int',
  9: 'WP',
  10: 'Fel',
};

interface Props {
  character: Character;
  skills: Skill[];
}

export default function SkillsTab({ character, skills }: Props) {
  const { object: data } = character;

  const skillAdvanceMap: Record<string, number> = Object.fromEntries(
    data.skills.map((s) => [s.id, s.number]),
  );

  const skillMap: Record<string, Skill> = Object.fromEntries(
    skills.map((s) => [s.id, s]),
  );

  const rows = data.skills
    .map((ref) => {
      const skill = skillMap[ref.id];
      const name = skill?.object.name ?? ref.id;
      const attrNum = skill?.object.attribute ?? 0;
      const attrKey = ATTR_NUM_TO_KEY[attrNum];
      const attrLabel = ATTRIBUTES[attrNum] ?? '—';
      const attrValue = attrKey
        ? data.baseAttributes[attrKey] + data.attributeAdvances[attrKey]
        : 0;
      const advances = skillAdvanceMap[ref.id] ?? 0;
      const total = attrValue + advances;
      const isGroup = skill?.object.isGroup ?? false;
      return {
        id: ref.id,
        name,
        attrLabel,
        attrValue,
        advances,
        total,
        isGroup,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No skills recorded.
        </Typography>
      </Box>
    );
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Skill</TableCell>
          <TableCell>Attr</TableCell>
          <TableCell align="center">Attr Value</TableCell>
          <TableCell align="center">Adv</TableCell>
          <TableCell align="center">Total</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body1">{row.name}</Typography>
                {row.isGroup && (
                  <Chip
                    label="Group"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 18 }}
                  />
                )}
              </Box>
            </TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>
              {row.attrLabel}
            </TableCell>
            <TableCell align="center">{row.attrValue}</TableCell>
            <TableCell align="center">{row.advances}</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>
              {row.total}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
