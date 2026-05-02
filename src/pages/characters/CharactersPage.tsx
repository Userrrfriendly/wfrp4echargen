import { useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useNavigate } from 'react-router-dom';
import { useCharacters } from '../../hooks/useCharacters';
import { useCareers } from '../../hooks/useCareers';
import { CHARACTER_SPECIES, STATUS_TIERS } from '../../utils/gameData';
import {
  calcWounds,
  careerLevelName,
  getTotalAttr,
} from '../../utils/characterUtils';
import type { Career, Character } from '../../types';

interface CharacterCardProps {
  char: Character;
  careerMap: Record<string, Career>;
  onClick: () => void;
}

function CharacterCard({ char, careerMap, onClick }: CharacterCardProps) {
  const { object: data } = char;
  const career = careerMap[data.career.id];
  const speciesName = CHARACTER_SPECIES[data.species] ?? data.species;
  const careerName = career ? careerLevelName(career, data.career.number) : '…';
  const statusTier = STATUS_TIERS[data.status] ?? String(data.status);
  const wounds = calcWounds(char);
  const T = getTotalAttr(char, 'T');
  const WP = getTotalAttr(char, 'WP');

  return (
    <Card sx={{ mb: 2 }}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                {data.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                <Chip
                  label={speciesName}
                  size="small"
                  variant="outlined"
                  sx={{ borderWidth: 2 }}
                />
                <Chip label={careerName} size="small" color="primary" />
                <Chip
                  label={`${statusTier} ${data.standing}`}
                  size="small"
                  variant="outlined"
                  sx={{ borderWidth: 2 }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexShrink: 0,
                alignItems: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Wounds
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {wounds}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  T
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {T}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  WP
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {WP}
                </Typography>
              </Box>
            </Box>
          </Box>
          {data.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 0.5,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {data.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function CharactersPage() {
  const navigate = useNavigate();
  const {
    data: characters,
    isLoading: charsLoading,
    error: charsError,
  } = useCharacters();
  const { data: careers, isLoading: careersLoading } = useCareers();

  const isLoading = charsLoading || careersLoading;

  const careerMap = useMemo<Record<string, Career>>(() => {
    if (!careers) return {};
    return Object.fromEntries(careers.map((c) => [c.id, c]));
  }, [careers]);

  if (isLoading) {
    return (
      <Box sx={{ height: '100%', overflowY: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4">My Characters</Typography>
        </Box>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={120} sx={{ mb: 2, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (charsError) {
    return (
      <Typography role="alert" color="error">
        Failed to load characters: {(charsError as Error).message}
      </Typography>
    );
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4">My Characters</Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate('/characters/new')}
        >
          New
        </Button>
      </Box>

      {characters && characters.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No characters yet. Create your first one!
          </Typography>
        </Box>
      ) : (
        characters?.map((char) => (
          <CharacterCard
            key={char.id}
            char={char}
            careerMap={careerMap}
            onClick={() => navigate(`/characters/${char.id}`)}
          />
        ))
      )}
    </Box>
  );
}
