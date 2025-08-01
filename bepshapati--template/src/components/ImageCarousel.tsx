import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function ImageCarousel({ imageUrls }: { imageUrls: string[] }) {
	const [sliderRef, instanceRef] = useKeenSlider({
		loop: true,
		slides: {
			perView: 1,
			spacing: 10,
		},
	});

	return (
		<div className="relative group">
			<div
				ref={sliderRef}
				className="keen-slider max-w-[400px] max-h-[400px] rounded-md overflow-hidden">
				{imageUrls.map((url, index) => (
					<div className="keen-slider__slide" key={index}>
						<img
							src={url}
							alt={`Image ${index + 1}`}
							className="max-w-[400px] max-h-[400px] object-cover"
						/>
					</div>
				))}
			</div>

			{/* Navigation Arrows */}
			<button
				onClick={() => instanceRef.current?.prev()}
				className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
				aria-label="Previous image">
				&larr;
			</button>
			<button
				onClick={() => instanceRef.current?.next()}
				className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
				aria-label="Next image">
				&rarr;
			</button>

			{/* Dots Indicator */}
			<div className="flex justify-center gap-1 mt-2 max-w-[300px]">
				{imageUrls.map((_, idx) => (
					<button
						key={idx}
						onClick={() => instanceRef.current?.moveToIdx(idx)}
						className="w-2 h-2 rounded-full bg-gray-500 hover:bg-gray-300 transition-colors"
						aria-label={`Go to image ${idx + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
