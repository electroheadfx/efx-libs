'use client';

import { Panel, RadioGroup, Radio, Stack, Text } from 'rsuite';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/types/theme.types';

export function ThemeControlPanel() {
  const { theme, setTheme } = useAppTheme();

  return (
    <Panel header="Theme Settings" bordered shaded>
      <Stack direction="column" spacing={12} alignItems="stretch">
        <Text size="sm" className="text-rs-secondary">
          Select Theme
        </Text>
        <RadioGroup
          name="theme"
          value={theme}
          onChange={(value) => setTheme(value as AppTheme)}
        >
          <Radio value="light">Light</Radio>
          <Radio value="dark">Dark</Radio>
          <Radio value="high-contrast">High Contrast</Radio>
        </RadioGroup>

        <Stack justifyContent="space-between" alignItems="center" className="mt-2">
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
