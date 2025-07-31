// src/components/Header.tsx
export default function Header() {
	return (
		<header className="bg-indigo-600 p-4 sm:p-6 text-white text-center rounded-t-xl">
			<h1 className="text-2xl sm:text-3xl font-bold text-red-100">
				Product Catalogue Sheet
			</h1>
			<p className="mt-2 text-sm sm:text-base opacity-90">
				Organize your product details with ease.
			</p>
		</header>
	);
}
