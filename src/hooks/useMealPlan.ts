import { useEffect, useState } from "react";
import { generateMealPlan } from "../api/llm";
import type { FamilyProfile, WeeklyPlan } from "../types";
import { getCurrentWeek } from "../utils/date";

const PROFILE_KEY = "blckbrd_family_profile";
const PLAN_PREFIX = "blckbrd_plan_week_";

export const useMealPlan = () => {
	const [profile, setProfile] = useState<FamilyProfile | null>(null);
	const [currentPlan, setCurrentPlan] = useState<WeeklyPlan | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const currentWeek = getCurrentWeek();

	// Load profile on mount
	useEffect(() => {
		const savedProfile = localStorage.getItem(PROFILE_KEY);
		if (savedProfile) {
			try {
				setProfile(JSON.parse(savedProfile));
			} catch (e) {
				console.error("Failed to parse profile", e);
			}
		}
	}, []);

	// When profile is available, load or generate plan
	useEffect(() => {
		if (!profile) return;

		const loadPlan = async () => {
			const planKey = `${PLAN_PREFIX}${currentWeek}`;
			const savedPlan = localStorage.getItem(planKey);

			if (savedPlan) {
				try {
					setCurrentPlan(JSON.parse(savedPlan));
					return;
				} catch (e) {
					console.error("Failed to parse saved plan", e);
				}
			}

			// Generate new plan
			setIsLoading(true);
			setError(null);
			try {
				const newPlan = await generateMealPlan(profile, currentWeek);
				localStorage.setItem(planKey, JSON.stringify(newPlan));
				setCurrentPlan(newPlan);
			} catch (err: any) {
				setError(err.message || "Failed to generate meal plan");
			} finally {
				setIsLoading(false);
			}
		};

		loadPlan();
	}, [profile, currentWeek]);

	const saveProfile = (newProfile: FamilyProfile) => {
		localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
		setProfile(newProfile);
		// Setting profile will trigger the useEffect to generate/load plan
	};

	const clearProfile = () => {
		localStorage.removeItem(PROFILE_KEY);
		setProfile(null);
		setCurrentPlan(null);
	};

	const regeneratePlan = async () => {
		if (!profile) return;
		const planKey = `${PLAN_PREFIX}${currentWeek}`;
		localStorage.removeItem(planKey);
		setCurrentPlan(null);
		setIsLoading(true);
		setError(null);
		try {
			const newPlan = await generateMealPlan(profile, currentWeek);
			localStorage.setItem(planKey, JSON.stringify(newPlan));
			setCurrentPlan(newPlan);
		} catch (err: any) {
			setError(err.message || "Failed to generate meal plan");
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
		saveProfile,
		clearProfile,
		regeneratePlan,
	};
};
