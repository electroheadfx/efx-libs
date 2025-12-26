import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	ChevronDown,
	Contrast,
	Grid3X3,
	Home,
	Layers,
	LayoutGrid,
	LineChart,
	Menu,
	Moon,
	PieChart,
	Settings,
	Sun,
	TrendingUp,
	X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppTheme } from "@/providers/ThemeProvider";
import type { AppTheme } from "@/types/theme.types";

const themeOptions: { value: AppTheme; label: string; icon: typeof Sun }[] = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "high-contrast", label: "High Contrast", icon: Contrast },
];

function ThemeDropdown() {
	const { theme, setTheme } = useAppTheme();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const currentOption =
		themeOptions.find((opt) => opt.value === theme) || themeOptions[0];
	const CurrentIcon = currentOption.icon;

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
				aria-label="Select theme"
			>
				<CurrentIcon size={18} />
				<ChevronDown
					size={14}
					className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
					{themeOptions.map((option) => {
						const Icon = option.icon;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => {
									setTheme(option.value);
									setIsOpen(false);
								}}
								className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
									theme === option.value
										? "bg-cyan-600 text-white"
										: "text-gray-300 hover:bg-gray-700"
								}`}
							>
								<Icon size={16} />
								{option.label}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
				<div className="flex items-center">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<h1 className="ml-4 text-xl font-semibold">
						<Link to="/">
							<img
								src="/tanstack-word-logo-white.svg"
								alt="TanStack Logo"
								className="h-10"
							/>
						</Link>
					</h1>
				</div>

				{/* Theme Controls */}
				<ThemeDropdown />
			</header>

			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold">Navigation</h2>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<Link
						to="/"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Home size={20} />
						<span className="font-medium">Home</span>
					</Link>

					<div className="mt-4 mb-2 px-3 text-xs text-gray-400 uppercase tracking-wider">
						ECharts Demos
					</div>

					<Link
						to="/basic-echarts"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Grid3X3 size={20} />
						<div>
							<span className="font-medium">Basic ECharts</span>
							<div className="text-xs text-gray-400">12 chart types</div>
						</div>
					</Link>

					<Link
						to="/layout-echarts"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<LayoutGrid size={20} />
						<div>
							<span className="font-medium">Layout Systems</span>
							<div className="text-xs text-gray-400">7 layout demos</div>
						</div>
					</Link>

					<Link
						to="/dashboard"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Layers size={20} />
						<div>
							<span className="font-medium">Dashboard Hub</span>
							<div className="text-xs text-gray-400">5 dashboards</div>
						</div>
					</Link>

					<div className="mt-4 mb-2 px-3 text-xs text-gray-400 uppercase tracking-wider">
						Dashboards
					</div>

					<Link
						to="/examples/sales-analytics"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<TrendingUp size={20} />
						<span className="font-medium">Sales Analytics</span>
					</Link>

					<Link
						to="/examples/performance"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<BarChart3 size={20} />
						<span className="font-medium">Performance Metrics</span>
					</Link>

					<Link
						to="/examples/financial"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<LineChart size={20} />
						<span className="font-medium">Financial Reports</span>
					</Link>

					<Link
						to="/examples/marketing"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<PieChart size={20} />
						<span className="font-medium">Marketing Dashboard</span>
					</Link>

					<Link
						to="/examples/operations"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Settings size={20} />
						<span className="font-medium">Operations Center</span>
					</Link>
				</nav>
			</aside>
		</>
	);
}
