import type React from "react";
import { useState } from "react";
import type { Meal, WeeklyPlan } from "../types";
import { RecipeModal } from "./RecipeModal";

interface BlackboardProps {
	plan: WeeklyPlan;
	currentWeek: number;
	onRegenerate: () => void;
	isLoading: boolean;
	onResetProfile: () => void;
}

export const Blackboard: React.FC<BlackboardProps> = ({
	plan,
	currentWeek,
	onRegenerate,
	isLoading,
	onResetProfile,
}) => {
	const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

	return (
		<div className="chalkboard-container">
			<div className="content-layer">
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
					}}
				>
					<button
						onClick={onResetProfile}
						style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
					>
						Edit Family
					</button>
					<h1 style={{ margin: 0 }}>Week {currentWeek} Menu</h1>
					<button
						onClick={onRegenerate}
						disabled={isLoading}
						style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
					>
						{isLoading ? "Thinking..." : "Regenerate"}
					</button>
				</div>

				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
						gap: "1.5rem",
						marginTop: "2rem",
						flex: 1,
					}}
				>
					{plan.meals.map((meal) => (
						<div
							key={meal.id || meal.day}
							onClick={() => setSelectedMeal(meal)}
							style={{
								border: "1px solid rgba(255,255,255,0.2)",
								padding: "1rem",
								borderRadius: "8px",
								cursor: "pointer",
								transition: "all 0.2s",
								backgroundColor: "rgba(255,255,255,0.02)",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
								e.currentTarget.style.transform = "translateY(-2px)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor =
									"rgba(255,255,255,0.02)";
								e.currentTarget.style.transform = "none";
							}}
						>
							<h3
								style={{
									textDecoration: "underline 2px dotted rgba(255,255,255,0.4)",
									marginBottom: "1rem",
								}}
							>
								{meal.day}
							</h3>
							<div
								style={{
									fontWeight: "bold",
									fontSize: "1.4rem",
									marginBottom: "0.5rem",
								}}
							>
								{meal.name}
							</div>
							<div style={{ fontSize: "1.1rem", opacity: 0.8 }}>
								{meal.description}
							</div>
						</div>
					))}
				</div>
			</div>

			{selectedMeal && (
				<RecipeModal
					meal={selectedMeal}
					onClose={() => setSelectedMeal(null)}
				/>
			)}
		</div>
	);
};
