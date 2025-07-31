import { StarRating } from "./StarRating";
import type { Product, Reviewer } from "../types/types";

interface CatalogueRowProps {
	product: Product;
	onRatingChange: (id: number, field: Reviewer, value: number) => void;
	onCommentChange: (id: number, comment: string) => void;
	onNameChange: (id: number, name: string) => void;
}

export function CatalogueRow({
	product,
	onRatingChange,
	onCommentChange,
	onNameChange,
}: CatalogueRowProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center py-4 border-b border-gray-200">
			{/* Product Image */}
			<div>
				<img
					src={product.imageUrl}
					alt={`Product ${product.id}`}
					className="w-16 h-16 object-cover rounded-md"
				/>
			</div>

			{/* Product Name */}
			<div>
				<input
					type="text"
					value={product.name}
					onChange={(e) => onNameChange(product.id, e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md"
					placeholder="Product name"
				/>
			</div>

			{/* Star Ratings */}
			{(["nifar", "afia", "sijil", "naim"] as Reviewer[]).map((reviewer) => (
				<div key={reviewer}>
					<StarRating
						value={product.ratings[reviewer]}
						onChange={(value) => onRatingChange(product.id, reviewer, value)}
					/>
				</div>
			))}

			{/* Comments */}
			<div>
				<input
					type="text"
					value={product.comment}
					onChange={(e) => onCommentChange(product.id, e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md"
					placeholder="Comments..."
				/>
			</div>
		</div>
	);
}
