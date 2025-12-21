// Categorical data for bar/pie charts
export interface CategoryDataPoint {
	category: string;
	value: number;
	[key: string]: string | number | undefined;
}

export const categoryData: CategoryDataPoint[] = [
	{ category: "Electronics", value: 350000 },
	{ category: "Clothing", value: 275000 },
	{ category: "Home & Garden", value: 180000 },
	{ category: "Sports", value: 145000 },
	{ category: "Books", value: 95000 },
	{ category: "Toys", value: 120000 },
];

export const marketShareData: CategoryDataPoint[] = [
	{ category: "Product A", value: 35 },
	{ category: "Product B", value: 28 },
	{ category: "Product C", value: 18 },
	{ category: "Product D", value: 12 },
	{ category: "Others", value: 7 },
];

export const regionData: CategoryDataPoint[] = [
	{ category: "North America", value: 420000 },
	{ category: "Europe", value: 380000 },
	{ category: "Asia Pacific", value: 520000 },
	{ category: "Latin America", value: 145000 },
	{ category: "Middle East", value: 95000 },
];
