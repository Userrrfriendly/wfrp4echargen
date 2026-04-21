import { Chip } from '@mui/material';
import { SOURCES } from '../../utils/gameData';

interface SourceChipsProps {
  source: Record<string, string>;
}

/**
 * Renders source book chips for a WFRP4e entity.
 * Falls back to the raw source key if it is not found in the SOURCES constant.
 *
 * @param props - { source } map of source ID → page number string
 * @example
 * <SourceChips source={skill.object.source} />
 */
export default function SourceChips({ source }: SourceChipsProps) {
  const label = Object.entries(source)
    .map(([key, page]) => `${SOURCES[key] ?? key}${page ? ` ${page}` : ''}`)
    .join(' , ');

  if (!label) return null;

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{ opacity: 0.95, borderColor: 'warning.light' }}
    />
  );
}
