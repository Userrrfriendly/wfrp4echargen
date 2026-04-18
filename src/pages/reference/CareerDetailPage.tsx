import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function CareerDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <Typography variant="h4">Career Detail — {id}</Typography>;
}
