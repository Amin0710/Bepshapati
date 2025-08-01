import { ProductAPI } from "../types/types";

const API_BASE = "http://localhost:3001/api";

export const fetchProducts = async (): Promise<ProductAPI[]> => {
	const response = await fetch(`${API_BASE}/products`);
	if (!response.ok) throw new Error("Failed to fetch products");
	return await response.json();
};

export const saveProduct = async (product: ProductAPI): Promise<ProductAPI> => {
	const method = product._id ? "PUT" : "POST";
	const url = product._id
		? `${API_BASE}/products/${product._id}`
		: `${API_BASE}/products`;

	const response = await fetch(url, {
		method,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(product),
	});

	if (!response.ok) throw new Error("Failed to save product");
	return await response.json();
};
