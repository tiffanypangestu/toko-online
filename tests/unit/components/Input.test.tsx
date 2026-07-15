import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input component', () => {
  it('renders input with label correctly', () => {
    render(<Input label="Nama Lengkap" placeholder="Masukkan nama..." />);
    expect(screen.getByText('Nama Lengkap')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan nama...')).toBeInTheDocument();
  });

  it('displays validation error label if provided', () => {
    render(<Input label="Email" error="Email wajib diisi." />);
    expect(screen.getByText('Email wajib diisi.')).toBeInTheDocument();
  });

  it('updates text value when user types', () => {
    const handleChange = vi.fn();
    render(<Input label="Cari" onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');

    fireEvent.change(inputElement, { target: { value: 'Laptop' } });
    expect(handleChange).toHaveBeenCalled();
  });
});
