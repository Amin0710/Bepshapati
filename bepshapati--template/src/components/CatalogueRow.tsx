//CatalogueRowProps
import { StarRating } from "./StarRating";
import type { ProductAPI, Reviewer } from "../types/types";
import ImageCarousel from "./ImageCarousel";
import { useEffect, useState } from "react";

interface CatalogueRowProps {
	product: ProductAPI;
	onRatingChange: (id: string, field: Reviewer, value: number) => void;
	onCommentChange: (id: string, comment: string) => void;
	currentUser: { username: string; name: string } | null;
}

export function CatalogueRow({
	product,
	onRatingChange,
	onCommentChange,
	currentUser,
}: CatalogueRowProps) {
	const [userRatingValue, setUserRatingValue] = useState<string | number>("");

	useEffect(() => {
		if (currentUser) {
			const rating = product.ratings[currentUser.username as Reviewer];
			setUserRatingValue(rating ?? "");
		} else {
			setUserRatingValue("");
		}
	}, [currentUser, product.ratings]);

	const handleTempRatingChange = (
		id: string,
		field: Reviewer,
		value: number
	) => {
		onRatingChange(id, field, value);
		setUserRatingValue(value || "");
	};

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
			<div className="flex flex-col justify-between pr-2">
				{(["nifar", "afia", "sijil", "naim", "average"] as const).map(
					(reviewer) => (
						<div key={reviewer} className="flex items-center mb-2">
							<span className="w-20 inline-block text-gray-600 font-medium text-right pr-2">
								{reviewer === "average"
									? "Average:"
									: reviewer.charAt(0).toUpperCase() + reviewer.slice(1) + ":"}
							</span>
							<StarRating
								value={
									reviewer === "average"
										? (() => {
												const ratings = Object.values(product.ratings);
												const filtered = ratings.filter((v) => v > 0);
												const avg =
													filtered.length > 0
														? filtered.reduce((a, b) => a + b, 0) /
														  filtered.length
														: 0;
												return parseFloat(avg.toFixed(2));
										  })()
										: product.ratings[reviewer]
								}
								readOnly
							/>
						</div>
					)
				)}

				{/* Current User's Rating */}
				{currentUser && (
					<div className="flex items-center mt-1 text-gray-700 text-sm">
						<span className="mr-2">Your rating:</span>
						<input
							type="number"
							min={0}
							max={10}
							step={0.5} // This allows 0.5 increments
							value={userRatingValue}
							onChange={(e) => {
								let newRating = Number(e.target.value);
								// Ensure value stays within bounds and is multiple of 0.5
								newRating = Math.max(0, Math.min(10, newRating));
								newRating = Math.round(newRating * 2) / 2; // Round to nearest 0.5

								handleTempRatingChange(
									product._id ?? "",
									currentUser.username as Reviewer,
									newRating
								);
							}}
							className="w-16 px-1 py-0.5 border rounded text-gray-800 text-sm"
						/>
					</div>
				)}
			</div>

			{/* Comment */}
			<div className="h-full flex items-center">
				<textarea
					value={product.comment}
					onChange={(e) => onCommentChange(product._id ?? "", e.target.value)}
					className="h-[65%] w-full p-2 border border-gray-300 rounded-md"
					placeholder="Comments..."
				/>
			</div>
		</div>
	);
}
