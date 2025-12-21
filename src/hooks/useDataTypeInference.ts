// Custom hook for data type inference
import { useMemo } from "react";
import { inferDataType } from "@/lib/dataTypeInference";
import type { InferenceResult } from "@/types/data.types";

export function useDataTypeInference(data: unknown[]): InferenceResult {
	return useMemo(() => inferDataType(data), [data]);
}
