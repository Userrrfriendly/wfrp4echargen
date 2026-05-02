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
import type { Character, CharacterItemRef, Trapping } from '../../../types';
import { TRAPPING_TYPES } from '../../../utils/gameData';

const COIN_COLOURS: Record<string, string> = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  brass: '#CD7F32',
};

function ItemTable({
  refs,
  trappingMap,
}: {
  refs: CharacterItemRef[];
  trappingMap: Record<string, Trapping>;
}) {
  if (refs.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ py: 1, pl: 1 }}>
        None.
      </Typography>
    );
  }
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell align="center">Enc</TableCell>
          <TableCell align="center">Qty</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {refs.map((ref) => {
          const item = trappingMap[ref.id];
          const name = item?.object.name ?? ref.id;
          const type = item
            ? (TRAPPING_TYPES[item.object.type] ?? String(item.object.type))
            : '—';
          const enc = item?.object.enc ?? 0;
          return (
            <TableRow key={ref.id}>
              <TableCell>
                <Typography variant="body1">{name}</Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={type}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              </TableCell>
              <TableCell align="center">{enc}</TableCell>
              <TableCell align="center">{ref.number}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface Props {
  character: Character;
  trappings: Trapping[];
}

export default function EquipmentTab({ character, trappings }: Props) {
  const { object: data } = character;

  const trappingMap: Record<string, Trapping> = Object.fromEntries(
    trappings.map((t) => [t.id, t]),
  );

  const calcEnc = (refs: CharacterItemRef[]) =>
    refs.reduce((sum, ref) => {
      const item = trappingMap[ref.id];
      return sum + (item?.object.enc ?? 0) * ref.number;
    }, 0);

  const currentEnc = calcEnc(data.equippedItems) + calcEnc(data.carriedItems);
  const S = data.baseAttributes.S + data.attributeAdvances.S;
  const T = data.baseAttributes.T + data.attributeAdvances.T;
  const maxEnc = Math.floor(S / 10) + Math.floor(T / 10);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body1">
          Encumbrance:{' '}
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              color: currentEnc > maxEnc ? 'error.main' : 'text.primary',
            }}
          >
            {currentEnc}
          </Box>{' '}
          / {maxEnc}
        </Typography>
        <Divider orientation="vertical" flexItem />
        {(['gold', 'silver', 'brass'] as const).map((coin) => (
          <Box
            key={coin}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: COIN_COLOURS[coin],
              }}
            />
            <Typography variant="body1">
              {data[coin]}{' '}
              <Box
                component="span"
                sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
              >
                {coin.charAt(0).toUpperCase() + coin.slice(1)}
              </Box>
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="overline" color="text.secondary" sx={{ mb: 0.5 }}>
        Equipped
      </Typography>
      <ItemTable refs={data.equippedItems} trappingMap={trappingMap} />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mt: 2, mb: 0.5 }}
      >
        Carried
      </Typography>
      <ItemTable refs={data.carriedItems} trappingMap={trappingMap} />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mt: 2, mb: 0.5 }}
      >
        Stored
      </Typography>
      <ItemTable refs={data.storedItems} trappingMap={trappingMap} />
    </Box>
  );
}
