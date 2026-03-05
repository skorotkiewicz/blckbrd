import React from "react";
import { Blackboard } from "./components/Blackboard";
import { Onboarding } from "./components/Onboarding";
import { useMealPlan } from "./hooks/useMealPlan";

function App() {
	const {
		profile,
		currentPlan,
		currentWeek,
		isLoading,
		error,
		saveProfile,
		clearProfile,
		regeneratePlan,
	} = useMealPlan();

	if (!profile) {
		return <Onboarding onSave={saveProfile} />;
	}

	return (
		<div style={{ padding: "1rem", minHeight: "100vh" }}>
			{error && (
				<div
					className="chalkboard-container"
					style={{ minHeight: "auto", marginBottom: "2rem" }}
				>
					<div className="error-text">Oops! The chalk broke... {error}</div>
				</div>
			)}

			{isLoading && !currentPlan ? (
				<div
					className="chalkboard-container"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<div className="loader">Writing menu on the board...</div>
				</div>
			) : currentPlan ? (
				<Blackboard
					plan={currentPlan}
					currentWeek={currentWeek}
					onRegenerate={regeneratePlan}
					isLoading={isLoading}
					onResetProfile={clearProfile}
				/>
			) : null}
		</div>
	);
}

export default App;
