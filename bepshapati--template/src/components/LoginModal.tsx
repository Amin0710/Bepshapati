import { useState } from "react";

interface LoginModalProps {
	onLogin: (username: string, password: string) => void;
	onClose: () => void;
	error: string;
}

export function LoginModal({ onLogin, onClose, error }: LoginModalProps) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onLogin(username, password);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-bold mb-4 text-gray-800">
					Login Required
				</h2>
				<p className="mb-4 text-gray-600">Please login to save changes</p>

				{error && <p className="text-red-500 mb-4">{error}</p>}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="username">
							Username
						</label>
						<input
							id="username"
							type="text"
							className="w-full p-2 border border-gray-300 rounded"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 mb-2" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							type="password"
							className="w-full p-2 border border-gray-300 rounded"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
