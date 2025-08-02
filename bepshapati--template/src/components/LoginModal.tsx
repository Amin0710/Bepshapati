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
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
				<div className="flex justify-between items-start mb-4">
					<h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700">
						✕
					</button>
				</div>

				<p className="mb-6 text-gray-600">Please login to save changes</p>

				{error && (
					<div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Username
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Password
							</label>
							<input
								type="password"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="mt-6 flex justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
