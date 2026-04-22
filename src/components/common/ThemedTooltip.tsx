import type { ReactNode, ReactElement } from 'react';
import { Tooltip } from '@mui/material';

/**
 * Tooltip styled to match the app theme — background.paper background,
 * divider border, elevated box-shadow, and a matching bordered arrow.
 * Use wherever a MUI Tooltip would normally appear.
 *
 * @example
 * <ThemedTooltip title={<Typography variant="body1">Details here</Typography>}>
 *   <Chip label="Hover me" />
 * </ThemedTooltip>
 */
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
