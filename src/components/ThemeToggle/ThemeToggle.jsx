import { Moon, Sun } from 'lucide-react';

// Named for the action it performs, so screen readers announce what will happen.
export default function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = nextTheme === 'dark' ? Moon : Sun;

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={onToggle}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}
