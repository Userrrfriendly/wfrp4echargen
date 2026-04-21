import type { ReactNode, ReactElement } from 'react';
import { Tooltip } from '@mui/material';

interface ThemedTooltipProps {
  title: ReactNode;
  children: ReactElement;
}

export default function ThemedTooltip({ title, children }: ThemedTooltipProps) {
  return (
    <Tooltip
      title={title}
      arrow
      slotProps={{
        tooltip: {
          sx: {
            maxWidth: 320,
            bgcolor: 'info.dark',
            border: '1px solid',
            borderRadius: 2,
            borderColor: 'divider',
            boxShadow: 4,
            color: 'text.primary',
            p: 0,
          },
        },
        arrow: {
          sx: {
            color: 'info.dark',
            '&::before': {
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
}
