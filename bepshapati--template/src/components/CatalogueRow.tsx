//CatalogueRowProps
import { StarRating } from "./StarRating";
import type { ProductAPI, Reviewer } from "../types/types";

interface CatalogueRowProps {
	product: ProductAPI;
	onRatingChange: (id: string, field: Reviewer, value: number) => void;
	onCommentChange: (id: string, comment: string) => void;
}

export function CatalogueRow({
	product,
	onRatingChange,
	onCommentChange,
}: CatalogueRowProps) {
	return (
		<div className="grid grid-cols-[3fr_1fr_2fr_2fr] gap-4 items-center py-4 border-b border-gray-200">
			{/* Image */}
			<div className="flex flex-wrap gap-1">
				{product.imageUrls.map((url, index) => (
					<img
						key={index}
						src={url}
						alt={`Product ${product._id} - ${index + 1}`}
						className="w-16 h-16 object-cover rounded-md"
					/>
				))}
			</div>

			{/* Product Name (not editable) */}
			<div className="flex items-center">
				<span className="block p-2">{product.name}</span>
			</div>

			{/* Ratings as vertical stack */}
			<div className="flex flex-col justify-between h-full">
				{(["nifar", "afia", "sijil", "naim"] as Reviewer[]).map((reviewer) => (
					<div key={reviewer} className="flex items-center mb-1">
						<span className="w-14 inline-block text-gray-600">
							{reviewer.charAt(0).toUpperCase() + reviewer.slice(1)}:
						</span>
						<StarRating
							value={product.ratings[reviewer]}
							onChange={(value) =>
								onRatingChange(product._id ?? "", reviewer, value)
							}
						/>
					</div>
				))}
			</div>

			{/* Comment */}
			<div className="h-full">
				<textarea
					value={product.comment}
					onChange={(e) => onCommentChange(product._id ?? "", e.target.value)}
					className="h-full w-full p-2 border border-gray-300 rounded-md"
					placeholder="Comments..."
				/>
			</div>
		</div>
	);
}
