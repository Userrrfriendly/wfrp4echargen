import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrimaryButton from '../PrimaryButton';

describe('PrimaryButton', () => {
  it('renders its children', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);

    // getByRole finds the element by its ARIA role — buttons have role="button"
    // This is the preferred query: it tests what a screen reader would see
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    // userEvent.setup() creates a simulated user that fires real browser-like events
    const user = userEvent.setup();
    const handleClick = vi.fn(); // vi.fn() is Vitest's mock function (like jest.fn())

    render(<PrimaryButton onClick={handleClick}>Save</PrimaryButton>);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled when the disabled prop is passed', () => {
    render(<PrimaryButton disabled>Save</PrimaryButton>);

    // toBeDisabled() checks the HTML disabled attribute — more meaningful than
    // testing click behaviour, since the browser enforces non-interactivity for us
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('forwards aria-label for accessibility', () => {
    // Useful when the button has an icon but no visible text
    render(<PrimaryButton aria-label="Close dialog" />);

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });
});
