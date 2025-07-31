import { useState } from "react";

interface StarRatingProps {
	value: number;
	onChange: (value: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
	const [hover, setHover] = useState(0);

	return (
		<div className="flex space-x-1">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
				<button
					key={star}
					type="button"
					className={`text-lg ${
						star <= (hover || value) ? "text-yellow-400" : "text-gray-300"
					}`}
					onClick={() => onChange(star)}
					onMouseEnter={() => setHover(star)}
					onMouseLeave={() => setHover(0)}>
					★
				</button>
			))}
		</div>
	);
}
