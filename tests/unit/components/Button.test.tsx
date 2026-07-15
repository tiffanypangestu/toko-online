import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button component', () => {
  it('renders button children content correctly', () => {
    render(<Button>Beli Sekarang</Button>);
    expect(screen.getByText('Beli Sekarang')).toBeInTheDocument();
  });

  it('calls onClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Klik</Button>);
    
    fireEvent.click(screen.getByText('Klik'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click events when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Klik</Button>);
    
    fireEvent.click(screen.getByText('Klik'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
