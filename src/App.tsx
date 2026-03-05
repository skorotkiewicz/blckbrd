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
		isEditingProfile,
		hasLoadedProfile,
		saveProfile,
		editProfile,
		regeneratePlan,
	} = useMealPlan();

	if (!hasLoadedProfile) {
		return (
			<div
				style={{
					padding: "1rem",
					minHeight: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div className="loader" style={{ color: "white" }}>
					Loading Blackboard...
				</div>
			</div>
		);
	}

	if (!profile || isEditingProfile) {
		return (
			<Onboarding
				onSave={saveProfile}
				initialDescription={profile?.description || ""}
			/>
		);
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
					onResetProfile={editProfile}
				/>
			) : null}
		</div>
	);
}

export default App;
