import type React from "react";
import type { Meal } from "../types";

interface RecipeModalProps {
	meal: Meal | null;
	onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ meal, onClose }) => {
	if (!meal) return null;

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0,0,0,0.7)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				zIndex: 100,
				padding: "1rem",
			}}
		>
			<div
				className="chalkboard-container"
				style={{
					margin: 0,
					width: "100%",
					maxWidth: "800px",
					maxHeight: "90vh",
					overflowY: "auto",
				}}
			>
				<div className="content-layer">
					<button
						onClick={onClose}
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							fontSize: "1.5rem",
							border: "none",
						}}
					>
						✕
					</button>
					<h2>{meal.name}</h2>
					<p
						style={{
							fontStyle: "italic",
							textAlign: "center",
							marginBottom: "2rem",
						}}
					>
						{meal.description}
					</p>
					<div
						style={{
							whiteSpace: "pre-wrap",
							fontSize: "1.6rem",
							lineHeight: "1.4",
						}}
					>
						{meal.recipe}
					</div>
				</div>
			</div>
		</div>
	);
};
