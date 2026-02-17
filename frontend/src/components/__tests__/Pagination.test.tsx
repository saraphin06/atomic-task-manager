import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination.tsx';

describe('Pagination', () => {
  it('renders correct page count', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={0} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByLabelText(/previous page/i)).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={4} totalPages={5} onPageChange={vi.fn()} />
    );

    expect(screen.getByLabelText(/next page/i)).toBeDisabled();
  });

  it('calls onPageChange when clicked', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );

    await user.click(screen.getByLabelText(/next page/i));
    expect(onPageChange).toHaveBeenCalledWith(2);

    await user.click(screen.getByLabelText(/previous page/i));
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={0} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container.innerHTML).toBe('');
  });
});
