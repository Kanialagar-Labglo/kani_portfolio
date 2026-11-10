import { describe, expect, it } from 'vitest';
import { theme as antdTheme } from 'antd';
import { antdThemeConfig } from './antdTheme.js';
import { ACCENT_COLORS } from './theme.js';

describe('antdThemeConfig', () => {
  it('uses the dark algorithm and dark accent in the dark theme', () => {
    expect(antdThemeConfig('dark')).toEqual({
      algorithm: antdTheme.darkAlgorithm,
      token: { colorPrimary: ACCENT_COLORS.dark },
    });
  });

  it('uses the default algorithm and light accent in the light theme', () => {
    expect(antdThemeConfig('light')).toEqual({
      algorithm: antdTheme.defaultAlgorithm,
      token: { colorPrimary: ACCENT_COLORS.light },
    });
  });
});
