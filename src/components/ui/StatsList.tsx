'use client';

import { List, Panel, Stack, Text } from 'rsuite';

interface StatsItem {
  label: string;
  value: string | number;
  change?: string;
}

interface StatsListProps {
  data: StatsItem[];
  title?: string;
  className?: string;
}

export function StatsList({ data, title, className = '' }: StatsListProps) {
  return (
    <Panel header={title} bordered shaded className={className}>
      <List hover>
        {data.map((item) => (
          <List.Item key={item.label}>
            <Stack justifyContent="space-between" alignItems="center">
              <Text>{item.label}</Text>
              <Stack spacing={8} alignItems="center">
                <Text weight="semibold">{item.value}</Text>
                {item.change && (
                  <Text size="sm" className="text-rs-secondary">
                    {item.change}
                  </Text>
                )}
              </Stack>
            </Stack>
          </List.Item>
        ))}
      </List>
    </Panel>
  );
}
