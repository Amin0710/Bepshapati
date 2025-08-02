/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductAPI } from "../types/types";

const API_BASE = "http://localhost:3001/api";

export const fetchProducts = async (): Promise<ProductAPI[]> => {
	const response = await fetch(`${API_BASE}/products`);
	if (!response.ok) throw new Error("Failed to fetch products");
	return await response.json();
};

export async function saveProduct(product, auth) {
	const updates: Record<string, any> = {};

	// Convert ratings to dot notation (e.g., "ratings.naim")
	if (product.ratings) {
		Object.keys(product.ratings).forEach((key) => {
			updates[`ratings.${key}`] = product.ratings[key];
		});
	}

	// Add comment if it exists
	if (product.comment) {
		updates.comment = product.comment;
	}

	const response = await fetch(
		`http://localhost:3001/api/products/${product._id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Basic ${auth}`,
			},
			body: JSON.stringify(updates),
		}
	);

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Unauthorized");
		}
		throw new Error(`Failed to save product: ${response.statusText}`);
	}

	return await response.json();
}
