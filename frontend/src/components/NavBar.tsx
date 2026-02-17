import { Link, useLocation } from 'react-router-dom';

export function NavBar() {
  const location = useLocation();

  return (
    <nav className="border-b border-gray-200 bg-white" aria-label="Main navigation">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/tasks" className="text-xl font-bold text-gray-900">
          Task Manager
        </Link>
        <div className="flex gap-4">
          <Link
            to="/tasks"
            className={`text-sm font-medium ${
              location.pathname === '/tasks'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Tasks
          </Link>
          <Link
            to="/tasks/new"
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            New Task
          </Link>
        </div>
      </div>
    </nav>
  );
}
