// src/App.tsx
import { useState } from "react";
import type { ProductAPI, Reviewer } from "./types/types";
import Header from "./components/Header";
import { CatalogueRow } from "./components/CatalogueRow";
import { fetchProducts, saveProduct } from "./api/products";
import { useEffect } from "react";

export default function App() {
	const [products, setProducts] = useState<ProductAPI[]>([]);

	useEffect(() => {
		fetchProducts().then((data) => setProducts(data));
	}, []);

	const handleRatingChange = (id: string, field: Reviewer, value: number) => {
		setProducts(
			products.map((product) =>
				product._id === id
					? {
							...product,
							ratings: { ...product.ratings, [field]: value },
					  }
					: product
			)
		);
	};

	const handleCommentChange = (id: string, comment: string) => {
		setProducts(
			products.map((product) =>
				product._id === id ? { ...product, comment } : product
			)
		);
	};

	const handleSave = async () => {
		try {
			await Promise.all(products.map(saveProduct));
			console.log("All products saved successfully");
		} catch (error) {
			console.error("Error saving products:", error);
		}
	};

	// const addNewRow = () => {
	// 	const newProduct: ProductAPI = {
	// 		name: `Product ${products.length + 1}`,
	// 		imageUrl: `https://placehold.co/100x100/A78BFA/FFFFFF?text=Product+${
	// 			products.length + 1
	// 		}`,
	// 		ratings: {
	// 			nifar: 0,
	// 			afia: 0,
	// 			sijil: 0,
	// 			naim: 0,
	// 		},
	// 		comment: "",
	// 	};
	// 	setProducts([...products, newProduct]);
	// };

	return (
		<div className="font-inter bg-gray-300 p-4 sm:p-6 md:p-8">
			<div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
				<Header />

				<div className="p-4 sm:p-6">
					<div className="grid grid-cols-[3fr_1fr_2fr_2fr] gap-4 items-center py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
						<div className="font-bold text-blue-600 text-center">Image</div>
						<div className="font-bold text-blue-600 text-center">
							Product Name
						</div>
						<div className="font-bold text-blue-600 text-center">Rating</div>
						<div className="font-bold text-blue-600 text-center">Comments</div>
					</div>

					{products.map((product) => (
						<CatalogueRow
							key={product._id}
							product={product}
							onRatingChange={handleRatingChange}
							onCommentChange={handleCommentChange}
						/>
					))}

					<div className="mt-8 flex justify-center gap-4">
						{/* <button
							onClick={addNewRow}
							className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
							Add New Row
						</button> */}
						<button
							onClick={handleSave}
							className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
							Save All
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
