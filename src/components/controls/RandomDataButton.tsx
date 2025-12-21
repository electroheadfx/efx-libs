"use client";

import { Shuffle } from "lucide-react";
import { Button } from "rsuite";

interface RandomDataButtonProps {
	onClick: () => void;
	loading?: boolean;
	className?: string;
}

export function RandomDataButton({
	onClick,
	loading = false,
	className = "",
}: RandomDataButtonProps) {
	return (
		<Button
			appearance="primary"
			color="cyan"
			onClick={onClick}
			loading={loading}
			className={`w-full ${className}`}
			startIcon={<Shuffle size={18} />}
		>
			Randomize Data
		</Button>
	);
}
