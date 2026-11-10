// antd theming for the lazily loaded extras (ADR-0006). Kept apart from theme.js, which is part of
// the startup code, so importing antd here never pulls it into the first page load.
import { theme as antdTheme } from 'antd';
import { ACCENT_COLORS } from './theme.js';

/**
 * The antd ConfigProvider theme for the site theme.
 * @param {'light' | 'dark'} theme
 */
export function antdThemeConfig(theme) {
  return {
    algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: { colorPrimary: ACCENT_COLORS[theme] },
  };
}
