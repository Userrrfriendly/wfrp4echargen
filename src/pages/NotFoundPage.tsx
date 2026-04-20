import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Button component={Link as React.ElementType} to="/" variant="contained">
        Go Home
      </Button>
    </Box>
  );
}
