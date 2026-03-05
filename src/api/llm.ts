import type { FamilyProfile, WeeklyPlan } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MODEL = import.meta.env.VITE_MODEL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const generateMealPlan = async (
	profile: FamilyProfile,
	weekNumber: number,
): Promise<WeeklyPlan> => {
	if (!BASE_URL || !MODEL || !API_KEY) {
		throw new Error(
			"Missing require environment variables (VITE_BASE_URL, VITE_MODEL, VITE_API_KEY)",
		);
	}

	const prompt = `
You are an expert family chef. Create a 7-day dinner meal plan for week number ${weekNumber}.
The family profile and dietary restrictions are: "${profile.description}".

Instructions:
1. Provide exacly 7 meals, one for each day of the week (Monday through Sunday).
2. For each meal, provide a name, a brief description, and a full recipe.
3. You MUST respond with ONLY valid JSON matching this schema:
{
  "weekNumber": ${weekNumber},
  "meals": [
    {
      "id": "unique-string-uuid",
      "day": "Monday",
      "name": "Meal Name",
      "description": "Short description of the meal.",
      "recipe": "Full recipe instructions here...\\nStep 1...\\nStep 2..."
    }
  ]
}
Do not include markdown code blocks or any other text outside the JSON.
`;

	const response = await fetch(`${BASE_URL}/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${API_KEY}`,
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [{ role: "user", content: prompt }],
			temperature: 0.7,
			response_format: { type: "json_object" },
		}),
	});

	if (!response.ok) {
		const errText = await response.text();
		throw new Error(
			`Failed to generate meal plan: ${response.status} ${errText}`,
		);
	}

	const data = await response.json();
	const content = data.choices[0]?.message?.content;

	if (!content) {
		throw new Error("No content returned from LLM");
	}

	try {
		const parsed = JSON.parse(content) as WeeklyPlan;
		// ensure week numbers match
		parsed.weekNumber = weekNumber;
		return parsed;
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new Error(
			`Failed to parse LLM response as JSON: ${content} - Error: ${msg}`,
			{ cause: err },
		);
	}
};
