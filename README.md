# Blackboard

A minimalistic, elegant, and local-first family meal planner.

Blackboard brings the classic kitchen chalkboard to your browser. Tell it about your family's preferences and dietary restrictions, and it will use your preferred LLM to generate a customized 7-day meal plan—complete with full recipes.

## Features

- **Chalkboard Aesthetic**: A highly realistic and interactive UI, built with pure CSS.
- **AI-Powered Planning**: Automatically curates a weekly meal plan tailored precisely to your family's tastes and allergies.
- **Local File System Storage**: Leverages a custom Vite plugin to store your family profile and meal plans securely on your local disk (`src/data/`).
- **Recipe Cards**: Click on any weekly meal to instantly bring up the full cooking instructions.
- **Week-Aware**: Automatically tracks the current ISO week number to keep you organized.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (or Node.js with npm/yarn/pnpm)

### Environment Variables

Create a `.env` file in the root directory of the project with your LLM configuration:

```env
VITE_BASE_URL=http://192.168.0.124:8888/v1
VITE_MODEL=qwen2.5:7b
VITE_API_KEY=your_dummy_or_real_api_key
```

### Installation

1. Install dependencies:
```bash
bun install
```

2. Start the development server:
```bash
bun dev
```

Your app will run locally. The first time you launch Blackboard, you'll be prompted to enter a brief description of your household and dietary needs to calibrate the menu generation. Enjoy!
