// src/App.tsx
import { useState } from "react";
import type { ProductAPI, Reviewer } from "./types/types";
import Header from "./components/Header";
import { CatalogueRow } from "./components/CatalogueRow";
import { fetchProducts, saveProduct } from "./api/products";
import { useEffect } from "react";
import { LoginModal } from "./components/LoginModal";

export default function App() {
	const [products, setProducts] = useState<ProductAPI[]>([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [authError, setAuthError] = useState("");

	const [currentUser, setCurrentUser] = useState(() => {
		const userString = localStorage.getItem("user");
		return userString ? JSON.parse(userString) : null;
	});

	useEffect(() => {
		fetchProducts().then((data) => setProducts(data));

		// Check if user is already logged in
		const auth = localStorage.getItem("auth");
		if (auth) {
			setIsLoggedIn(true);
		}
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

	const handleLogin = async (username: string, password: string) => {
		try {
			const response = await fetch("http://localhost:3001/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			setCurrentUser(data.user);

			if (response.ok) {
				setIsLoggedIn(true);
				setShowLoginModal(false);
				setAuthError("");
				// Store the auth token (Basic Auth)
				localStorage.setItem("auth", btoa(`${username}:${password}`));
				// Store the user data (name, role, etc.)
				localStorage.setItem("user", JSON.stringify(data.user));
			} else {
				setAuthError(data.error || "Login failed");
			}
		} catch {
			setAuthError("Network error - please try again");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("auth");
		localStorage.removeItem("user");
		setCurrentUser(null);
		setIsLoggedIn(false);
	};

	const handleSave = async () => {
		try {
			if (!isLoggedIn || !currentUser) {
				setShowLoginModal(true);
				return;
			}

			const auth = localStorage.getItem("auth");
			if (!auth) {
				setIsLoggedIn(false);
				setCurrentUser(null);
				setShowLoginModal(true);
				return;
			}

			const authHeader = `Basic ${auth}`;

			await Promise.all(
				products.map(async (product) => {
					try {
						await saveProduct(product, authHeader);
					} catch (productError) {
						console.error(`Error saving product ${product._id}:`, productError);
						throw productError; // Re-throw to be caught by outer catch
					}
				})
			);
		} catch (error) {
			console.error("Error saving products:", {
				message: error.message,
				response: error.response?.data,
				status: error.response?.status,
			});

			if (error.response?.status === 401) {
				console.warn("Unauthorized - clearing auth and showing login modal");
				setIsLoggedIn(false);
				setCurrentUser(null);
				setShowLoginModal(true);
				localStorage.removeItem("auth");
				localStorage.removeItem("user");
			} else {
				// Handle other errors without logging out
				setAuthError("Failed to save products. Please try again.");
			}
		}
	};

	return (
		<div className="font-inter bg-gray-300 p-4 sm:p-6 md:p-8">
			<div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
				<Header />
				<div className="text-center">
					{isLoggedIn ? (
						<div className="bg-green-100 text-green-800 rounded">
							You are logged in as <strong>{currentUser?.name}</strong>
							<button
								onClick={handleLogout}
								className="bg-white hover:bg-blue-500 hover:text-white text-blue-700 font-semibold py-2 px-4 rounded shadow">
								Log out
							</button>
						</div>
					) : (
						<button
							onClick={() => setShowLoginModal(true)}
							className="bg-white hover:bg-blue-500 hover:text-white text-blue-700 font-semibold py-2 px-4 rounded shadow">
							Log in
						</button>
					)}
				</div>

				<div className="p-2 sm:p-6">
					<div className="grid grid-cols-3 gap-4 items-center border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
						<div className="font-bold text-blue-600 text-center">Image</div>
						<div className="font-bold text-blue-600 text-center">Rating</div>
						<div className="font-bold text-blue-600 text-center">Comments</div>
					</div>

					{products.map((product) => (
						<CatalogueRow
							key={product._id}
							product={product}
							onRatingChange={handleRatingChange}
							onCommentChange={handleCommentChange}
							currentUser={currentUser}
						/>
					))}

					<div className="mt-8 flex justify-center gap-4">
						{isLoggedIn ? (
							<button
								onClick={handleSave}
								className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
								Save All
							</button>
						) : (
							<button
								onClick={() => setShowLoginModal(true)}
								className="border border-blue-700 bg-white hover:border-blue-500 hover:bg-blue-500 hover:text-white text-blue-700 font-semibold py-2 px-4 rounded shadow">
								Log in
							</button>
						)}
					</div>
				</div>
			</div>

			{showLoginModal && (
				<LoginModal
					onLogin={handleLogin}
					onClose={() => setShowLoginModal(false)}
					error={authError}
				/>
			)}
		</div>
	);
}
