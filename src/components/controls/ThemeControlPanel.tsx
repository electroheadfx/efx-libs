'use client';

import { Panel, RadioGroup, Radio, Toggle, Stack, Text, Divider } from 'rsuite';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/types/theme.types';

export function ThemeControlPanel() {
  const { theme, themeSource, setTheme, setThemeSource } = useAppTheme();

  return (
    <Panel header="Theme Settings" bordered shaded>
      <Stack direction="column" spacing={16} alignItems="stretch">
        {/* System/Manual toggle */}
        <Stack justifyContent="space-between" alignItems="center">
          <Text>Use System Theme</Text>
          <Toggle
            checked={themeSource === 'system'}
            onChange={(checked) => setThemeSource(checked ? 'system' : 'manual')}
          />
        </Stack>

        <Divider />

        {/* Theme selection (only when manual) */}
        <div style={{ opacity: themeSource === 'manual' ? 1 : 0.5 }}>
          <Text size="sm" className="text-rs-secondary mb-2">
            Manual Theme Selection
          </Text>
          <RadioGroup
            name="theme"
            value={theme}
            onChange={(value) => setTheme(value as AppTheme)}
            disabled={themeSource === 'system'}
          >
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
            <Radio value="high-contrast">High Contrast</Radio>
          </RadioGroup>
        </div>

        <Divider />

        {/* Current theme display */}
        <Stack justifyContent="space-between" alignItems="center">
          <Text size="sm" className="text-rs-secondary">
            Active Theme
          </Text>
          <Text weight="semibold" className="capitalize">
            {theme}
          </Text>
        </Stack>
      </Stack>
    </Panel>
  );
}
