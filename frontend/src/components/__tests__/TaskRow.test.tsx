import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TaskRow } from '../../features/tasks/components/TaskRow.tsx';
import type { Task } from '../../types/task.ts';

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'A test description',
  isCompleted: false,
  dueDate: '2026-06-15T10:00:00',
  createdAt: '2026-01-01T10:00:00',
  updatedAt: '2026-01-01T10:00:00',
  assignedTo: 'Alice',
};

function renderInTable(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <table>
        <tbody>{ui}</tbody>
      </table>
    </BrowserRouter>
  );
}

describe('TaskRow', () => {
  it('renders task title and due date', () => {
    renderInTable(
      <TaskRow task={mockTask} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText(/jun/i)).toBeInTheDocument();
  });

  it('shows completed state when isCompleted is true', () => {
    const completed = { ...mockTask, isCompleted: true };
    renderInTable(
      <TaskRow task={completed} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    renderInTable(
      <TaskRow task={mockTask} onToggle={onToggle} onDelete={vi.fn()} />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('calls onDelete when delete button clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    renderInTable(
      <TaskRow task={mockTask} onToggle={vi.fn()} onDelete={onDelete} />
    );

    await user.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
