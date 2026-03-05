export interface FamilyProfile {
	description: string;
}

export interface Meal {
	id: string; // The week number can be part of this or kept separate
	day: string;
	name: string;
	description: string;
	recipe: string;
}

export interface WeeklyPlan {
	weekNumber: number;
	meals: Meal[];
}
