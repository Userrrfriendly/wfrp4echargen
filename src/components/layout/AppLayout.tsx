import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import NavDrawer from './NavDrawer';
import { DRAWER_WIDTH } from './constants';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            WFRP4e Character Generator
          </Typography>
        </Toolbar>
      </AppBar>

      <NavDrawer />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: '100vh',
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
