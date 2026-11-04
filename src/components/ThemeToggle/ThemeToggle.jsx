import { Button } from 'antd';
import { Moon, Sun } from 'lucide-react';

// Named for the action it performs, so screen readers announce what will happen.
export default function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = nextTheme === 'dark' ? Moon : Sun;

  return (
    <Button
      type="text"
      shape="circle"
      aria-label={`Switch to ${nextTheme} theme`}
      icon={<Icon size={20} aria-hidden="true" />}
      onClick={onToggle}
    />
  );
}
