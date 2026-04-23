import type { MouseEvent } from 'react';
import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useUiStore } from '../stores/uiStore';
import type { ThemeMode } from '../stores/uiStore';

export default function SettingsPage() {
  const { themeMode, setThemeMode } = useUiStore();

  const handleThemeChange = (_: MouseEvent, value: ThemeMode | null) => {
    if (value) setThemeMode(value);
  };

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h3" gutterBottom>
        Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" gutterBottom>
        Appearance
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Choose your preferred colour theme.
      </Typography>
      <ToggleButtonGroup
        value={themeMode}
        exclusive
        onChange={handleThemeChange}
        aria-label="theme selection"
      >
        <ToggleButton value="dark" aria-label="dark theme">
          Dark
        </ToggleButton>
        <ToggleButton value="light" aria-label="light theme">
          Light
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
