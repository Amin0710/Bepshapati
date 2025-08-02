import { useState } from "react";

interface StarRatingProps {
	value: number;
	onChange?: (value: number) => void;
	readOnly?: boolean;
}

export function StarRating({
	value,
	onChange,
	readOnly = false,
}: StarRatingProps) {
	const [hover, setHover] = useState<number | null>(null);
	const fullStars = Math.floor(value);
	const showHalfStar = value % 1 >= 0.5;

	return (
		<div className="flex items-center space-x-1">
			{[...Array(10)].map((_, i) => {
				const starValue = i + 1;
				const isActive =
					hover !== null
						? starValue <= hover
						: starValue <= fullStars ||
						  (showHalfStar && starValue === fullStars + 1);
				const isHalfActive = showHalfStar && starValue === fullStars + 1;

				return (
					<button
						key={i}
						type="button"
						className={`relative text-xl w-6 h-6 ${
							onChange && !readOnly ? "cursor-pointer" : "cursor-default"
						}`}
						onClick={() => !readOnly && onChange?.(starValue)}
						onMouseEnter={() => !readOnly && onChange && setHover(starValue)}
						onMouseLeave={() => !readOnly && onChange && setHover(null)}
						disabled={readOnly}>
						{/* Gray background star (always shows) */}
						<span className="text-gray-300 absolute inset-0">★</span>

						{/* Yellow star (fills based on value/hover) */}
						<span
							className={`absolute inset-0 ${
								isActive ? "text-yellow-400" : "text-transparent"
							}`}
							style={{ clipPath: isHalfActive ? "inset(0 50% 0 0)" : "none" }}>
							★
						</span>
					</button>
				);
			})}
		</div>
	);
}
