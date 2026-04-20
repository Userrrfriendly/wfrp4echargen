import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';
import { DIABLO_FONT_FAMILY } from '../../theme/theme';

const BUTTON_VARIANT = 'contained' as const;
const BUTTON_COLOR = 'primary' as const;

/**
 * PrimaryButton is a reusable button component with primary styling.
 * It wraps MUI's Button and applies default variant, color, and Diablo font.
 *
 * Accessibility: All props for MUI Button are supported, including aria-label and tabIndex.
 *
 * @param props - All MUI Button props are supported, including accessibility props.
 * @example
 * <PrimaryButton onClick={handleClick} aria-label="Save">Save</PrimaryButton>
 */
const PrimaryButton: React.FC<ButtonProps> = ({ children, sx, ...props }) => (
  <Button
    variant={BUTTON_VARIANT}
    color={BUTTON_COLOR}
    sx={[
      { fontFamily: DIABLO_FONT_FAMILY, border: '1px solid #fff' },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...props}
  >
    {children}
  </Button>
);

export default PrimaryButton;
