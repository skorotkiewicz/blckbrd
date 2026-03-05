import type React from "react";
import { useState } from "react";
import type { FamilyProfile } from "../types";

interface OnboardingProps {
	initialDescription?: string;
	onSave: (profile: FamilyProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
	initialDescription = "",
	onSave,
}) => {
	const [description, setDescription] = useState(initialDescription);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (description.trim()) {
			onSave({ description: description.trim() });
		}
	};

	return (
		<div
			className="chalkboard-container"
			style={{ maxWidth: "600px", margin: "10vh auto" }}
		>
			<div className="content-layer">
				<h1>Family Meal Planner</h1>
				<p style={{ textAlign: "center", marginBottom: "2rem" }}>
					Welcome! Tell me a bit about your family so I can plan the perfect
					weekly menu for you.
				</p>

				<form
					onSubmit={handleSubmit}
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "1rem",
						flex: 1,
					}}
				>
					<label htmlFor="familyDesc" style={{ fontSize: "1.4rem" }}>
						Family details & dietary needs:
					</label>
					<textarea
						id="familyDesc"
						rows={5}
						placeholder="e.g., My daughter doesn't like mushrooms, I (father) eat everything, mother of my daughter has allergies to nuts..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<div style={{ marginTop: "auto", textAlign: "center" }}>
						<button type="submit" disabled={!description.trim()}>
							{initialDescription ? "Save Changes" : "Start Planning!"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
