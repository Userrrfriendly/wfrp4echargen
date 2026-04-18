import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>();
  return <Typography variant="h4">Character Sheet — {id}</Typography>;
}
