// src/components/CatalogueRow.tsx
import type { Product, Reviewer } from "../types/types";

interface CatalogueRowProps {
	product: Product;
	onToggle: (id: number, field: Reviewer) => void;
	onCommentChange: (id: number, comment: string) => void;
}

export default function CatalogueRow({
	product,
	onToggle,
	onCommentChange,
}: CatalogueRowProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-4 pb-4 border-b border-gray-200">
			{/* Image */}
			<div className="col-span-1 md:col-span-1">
				<img
					src={product.imageUrl}
					alt={`Product ${product.id}`}
					className="w-full h-[100px] object-cover rounded-lg"
				/>
			</div>

			{/* Checkbox columns */}
			{(["nifar", "afia", "sijil", "naim"] as Reviewer[]).map((field) => (
				<div
					key={field}
					className="col-span-1 md:col-span-1 flex flex-col items-start">
					<label className="inline-flex items-center">
						<input
							type="checkbox"
							checked={product[reviewer]}
							onChange={() => onToggle(product.id, field)}
							className="h-4 w-4 text-indigo-600 rounded"
						/>
						<span className="ml-2 text-gray-700">Tick</span>
					</label>
				</div>
			))}

			{/* Comment */}
			<div className="col-span-1 md:col-span-1">
				<textarea
					value={product.comment}
					onChange={(e) => onCommentChange(product.id, e.target.value)}
					placeholder="Add comments here..."
					className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] resize-y focus:border-indigo-500 transition"
				/>
			</div>
		</div>
	);
}
