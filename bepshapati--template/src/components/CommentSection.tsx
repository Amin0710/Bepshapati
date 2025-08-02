import { useState, useEffect } from "react";
import { showError, showSuccess } from "./Notification";

interface CommentSectionProps {
	product: {
		_id?: string;
		comment?: string;
	};
	currentUser: {
		name: string;
		username: string;
	};
	onSaveComment: (id: string, comment: string) => Promise<void>;
	onCommentAdded?: () => void;
}

export function CommentSection({
	product,
	currentUser,
	onSaveComment,
	onCommentAdded,
}: CommentSectionProps) {
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [localComments, setLocalComments] = useState(product.comment || ""); // Local state

	// Update local comments when product prop changes
	useEffect(() => {
		setLocalComments(product.comment || "");
	}, [product.comment]);

	const handleAddComment = async () => {
		const trimmed = newComment.trim();
		if (!trimmed || !product._id) return;

		setIsSubmitting(true);
		const timestamp = new Date().toLocaleString();
		const formattedComment = localComments
			? `${localComments}\n\n---\n\n[${timestamp}] ${currentUser.name}:\n${trimmed}`
			: `[${timestamp}] ${currentUser.name}:\n${trimmed}`;

		try {
			await onSaveComment(product._id, formattedComment);
			setNewComment("");
			setLocalComments(formattedComment); // Update local state immediately
			showSuccess("Comment added!");
			onCommentAdded?.(); // Notify parent if needed
		} catch (error) {
			console.error("Failed to save comment:", error);
			showError("Failed to save comment. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
			handleAddComment();
		}
	};

	return (
		<div className="w-full">
			{localComments && ( // Use localComments instead of product.comment
				<div className="bg-gray-50 p-2 rounded-md whitespace-pre-line text-sm mb-4">
					{localComments.split("\n\n---\n\n").map((comment, index) => (
						<div key={index} className="mb-1 last:mb-0">
							{comment}
						</div>
					))}
				</div>
			)}
			<div className="flex flex-col space-y-2">
				<textarea
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Add your comment..."
					className="border rounded p-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
					rows={3}
					disabled={isSubmitting}
				/>
				<button
					onClick={handleAddComment}
					disabled={!newComment.trim() || isSubmitting}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded self-end disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
					{isSubmitting ? "Saving..." : "Add Comment"}
				</button>
			</div>
		</div>
	);
}
