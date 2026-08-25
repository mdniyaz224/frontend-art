import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusChip from './StatusChip';

describe('StatusChip', () => {
  it('renders the given label', () => {
    render(<StatusChip label="Active" color="success" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('defaults to the "default" color when none is given', () => {
    render(<StatusChip label="Unknown" />);
    expect(screen.getByText('Unknown').closest('.MuiChip-root')).toHaveClass(
      'MuiChip-colorDefault',
    );
  });
});
