import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../features/tasks/components/TaskForm.tsx';

describe('TaskForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isSubmitting: false,
    serverError: null,
  };

  it('renders all form fields', () => {
    render(<TaskForm {...defaultProps} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assigned to/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save task/i })).toBeInTheDocument();
  });

  it('submits valid data and calls onSubmit', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.click(screen.getByRole('button', { name: /save task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Task' }),
        expect.anything()
      );
    });
  });

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /save task/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when title exceeds 100 characters', async () => {
    const user = userEvent.setup();
    render(<TaskForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/title/i), 'A'.repeat(101));
    await user.click(screen.getByRole('button', { name: /save task/i }));

    await waitFor(() => {
      expect(screen.getByText(/must not exceed 100/i)).toBeInTheDocument();
    });
  });

  it('prefills fields in edit mode', () => {
    render(
      <TaskForm
        {...defaultProps}
        defaultValues={{
          title: 'Existing Task',
          description: 'Some description',
          assignedTo: 'Alice',
        }}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Task');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Some description');
    expect(screen.getByLabelText(/assigned to/i)).toHaveValue('Alice');
  });

  it('displays server errors on submit failure', () => {
    render(
      <TaskForm
        {...defaultProps}
        serverError={{
          status: 400,
          message: 'Validation failed',
          timestamp: '2026-01-01T00:00:00',
          errors: [{ field: 'title', message: 'Title already exists' }],
        }}
      />
    );

    expect(screen.getByText(/title already exists/i)).toBeInTheDocument();
  });
});
