'use client';

import { Text } from 'rsuite';
import type { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
  valueColor?: 'primary' | 'secondary' | 'default' | string;
}

export function KPICard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = '',
  valueColor = 'primary',
}: KPICardProps) {
  const changeColor =
    changeType === 'positive'
      ? 'text-green-500'
      : changeType === 'negative'
        ? 'text-red-500'
        : 'text-gray-500';

  const getValueColor = () => {
    switch (valueColor) {
      case 'primary':
        return 'var(--rs-primary-500)';
      case 'secondary':
        return 'var(--rs-text-secondary)';
      case 'default':
        return 'var(--rs-text-heading)';
      default:
        return valueColor;
    }
  };

  return (
    <div
      className={`h-full flex flex-col justify-center p-4 gap-1 rounded-md border border-rs-border bg-rs-bg-card ${className}`}
    >
      <div className="flex justify-between items-center w-full">
        <Text size="sm" className="text-rs-secondary">
          {title}
        </Text>
        {icon && <span className="text-rs-primary">{icon}</span>}
      </div>
      <span
        style={{
          fontSize: '1.875rem',
          lineHeight: '2.25rem',
          fontWeight: 700,
          color: getValueColor(),
        }}
      >
        {value}
      </span>
      {change && (
        <Text size="sm" className={changeColor}>
          {change}
        </Text>
      )}
    </div>
  );
}
