import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError();

  let status = 'Error';
  let message = 'Something went wrong.';

  if (isRouteErrorResponse(error)) {
    status = String(error.status);
    message = error.statusText || String(error.data) || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" color="primary">{status}</Typography>
      <Typography variant="h6" color="text.secondary">{message}</Typography>
      <Button component={Link as React.ElementType} to="/" variant="contained">
        Back to Home
      </Button>
    </Box>
  );
}
