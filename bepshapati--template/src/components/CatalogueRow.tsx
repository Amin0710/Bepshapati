//CatalogueRowProps
import { StarRating } from "./StarRating";
import type { ProductAPI, Reviewer } from "../types/types";
import ImageCarousel from "./ImageCarousel";

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
		<div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-gray-300">
			{/* Combined Product images and name */}
			<div className="flex flex-col">
				<ImageCarousel imageUrls={product.imageUrls} />
				{/* Product Name (not editable) - now placed under the image */}
				<div className="flex items-center justify-center mt-2 max-w-[300px]">
					<span className="block p-2 truncate">{product.name}</span>
				</div>
			</div>

			{/* Ratings as vertical stack */}
			<div className="flex flex-col justify-between">
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
