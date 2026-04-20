import React from 'react';
import Button from '@mui/material/Button';
import type { ButtonProps } from '@mui/material/Button';

/**
 * PrimaryButton is a reusable button component with primary styling.
 * It wraps MUI's Button and applies default variant and color.
 *
 * Accessibility: All props for MUI Button are supported, including aria-label and tabIndex.
 *
 * @param {ButtonProps} props - All MUI Button props are supported, including accessibility props.
 * @example
 * <PrimaryButton onClick={handleClick} aria-label="Save">Save</PrimaryButton>
 */
const PrimaryButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <Button
    variant="contained"
    color="primary"
    {...props}
  >
    {children}
  </Button>
);

export default PrimaryButton;
