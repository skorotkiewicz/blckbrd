import { useEffect, useState } from "react";
import { generateMealPlan } from "../api/llm";
import type { FamilyProfile, WeeklyPlan } from "../types";
import { getCurrentWeek } from "../utils/date";

export const useMealPlan = () => {
	const [profile, setProfile] = useState<FamilyProfile | null>(null);
	const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

	const currentWeek = getCurrentWeek();

	// Load profile on mount
	useEffect(() => {
		const loadProfile = async () => {
			try {
				const res = await fetch("/api/profile");
				if (res.ok) {
					const data = await res.json();
					if (data?.description) {
						setProfile(data);
					} else {
						setIsEditingProfile(true);
					}
				} else {
					setIsEditingProfile(true);
				}
			} catch (e) {
				console.error("Failed to load profile", e);
				setIsEditingProfile(true);
			} finally {
				setHasLoadedProfile(true);
			}
		};
		loadProfile();
	}, []);

	// When profile is available, load or generate plan
	useEffect(() => {
		if (!profile || isEditingProfile) return;

		const loadPlan = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await fetch(`/api/plan/${currentWeek}`);
				if (res.ok) {
					const savedPlan = await res.json();
					if (savedPlan?.meals && savedPlan.meals.length > 0) {
						setCurrentPlan(savedPlan);
						setIsLoading(false);
						return;
					}
				}

				// Generate new plan if not found
				const newPlan = await generateMealPlan(profile, currentWeek);

				// Save it to API
				await fetch(`/api/plan/${currentWeek}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newPlan),
				});

				setCurrentPlan(newPlan);
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : String(err);
				setError(msg || "Failed to generate meal plan");
			} finally {
				setIsLoading(false);
			}
		};

		loadPlan();
	}, [profile, currentWeek, isEditingProfile]);

	const saveProfile = async (newProfile: FamilyProfile) => {
		try {
			await fetch("/api/profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newProfile),
			});
			setProfile(newProfile);
			setIsEditingProfile(false);
		} catch (e) {
			console.error("Failed to save profile", e);
		}
	};

	const editProfile = () => {
		setIsEditingProfile(true);
	};

	const regeneratePlan = async () => {
		if (!profile) return;
		setIsLoading(true);
		setError(null);
		try {
			const newPlan = await generateMealPlan(profile, currentWeek);
			await fetch(`/api/plan/${currentWeek}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPlan),
			});
			setCurrentPlan(newPlan);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : String(err);
			setError(msg || "Failed to generate meal plan");
		} finally {
			setIsLoading(false);
		}
	};

	return {
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
	};
};
