// useMatrixLayout hook - converts simple templates to mediaDefinitions
import { useMemo } from 'react';
import { buildMediaDefinitions } from '@/lib/matrixLayoutBuilder';
import type { SimpleMatrixLayout, MediaDefinition } from '@/types/matrixLayout.types';

export function useMatrixLayout(layout: SimpleMatrixLayout): MediaDefinition[] {
  return useMemo(() => buildMediaDefinitions(layout), [layout]);
}
