// src/App.tsx
import { useState } from "react";
import type { Product, Reviewer } from "./types/types";
import Header from "./components/Header";
import CatalogueRow from "./components/CatalogueRow";

export default function App() {
	const [products, setProducts] = useState<Product[]>([
		{
			id: 1,
			imageUrl: "https://placehold.co/100x100/A78BFA/FFFFFF?text=Product+1",
			nifar: 0,
			afia: 0,
			sijil: 0,
			naim: 0,
			comment: "",
		},
	]);

	const handleToggle = (id: number, field: Reviewer) => {
		setProducts(
			products.map((product) =>
				product.id === id ? { ...product, [field]: !product[field] } : product
			)
		);
	};

	const handleCommentChange = (id: number, comment: string) => {
		setProducts(
			products.map((product) =>
				product.id === id ? { ...product, comment } : product
			)
		);
	};

	const addNewRow = () => {
		const newProduct: Product = {
			id: products.length + 1,
			imageUrl: `https://placehold.co/100x100/A78BFA/FFFFFF?text=Product+${
				products.length + 1
			}`,
			nifar: 0,
			afia: 0,
			sijil: 0,
			naim: 0,
			comment: "",
		};
		setProducts([...products, newProduct]);
	};

	return (
		<div className="font-inter bg-gray-50 p-4 sm:p-6 md:p-8">
			<div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
				<Header />

				<div className="p-4 sm:p-6">
					{/* Table Header */}
					<div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm sm:text-base font-semibold text-gray-700 border-b-2 border-gray-300 pb-2 mb-4">
						<div className="col-span-3 md:col-span-1">Image</div>
						<div className="col-span-1 md:col-span-1">Nifar</div>
						<div className="col-span-1 md:col-span-1">Afia</div>
						<div className="col-span-1 md:col-span-1">Sijil</div>
						<div className="col-span-1 md:col-span-1">Naim</div>
						<div className="col-span-1 md:col-span-1">Comments</div>
					</div>

					{/* Product Rows */}
					{products.map((product) => (
						<CatalogueRow
							key={product.id}
							product={product}
							onToggle={handleToggle}
							onCommentChange={handleCommentChange}
						/>
					))}

					<div className="mt-8 text-center">
						<button
							onClick={addNewRow}
							className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
							Add New Row
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
