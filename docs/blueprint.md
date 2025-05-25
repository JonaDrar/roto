# **App Name**: ¿Qué tan roto estás?

## Core Features:

- Name Input: The user provides their name to personalize the experience and track their emotional score.
- Quiz Flow: Displays one emotionally reflective question per page, for a total of 12 questions. Each question allows a "yes" or "no" response.
- Answer Storage: Stores responses locally using the browser's localStorage API to allow navigation between pages and calculate the final score.
- Rotura Index Calculation: After completing the quiz, the app calculates the "Rotura Index" as a percentage based on how many responses indicate emotional neglect or distress.
- Result Display: Shows the user's personalized result with a percentage, a humorous or supportive message, and stores the result in a remote PostgreSQL database along with their name and timestamp.
- Public Ranking: Displays a leaderboard ranking all users from most to least "roto", based on their Rotura Index.

## Style Guidelines:

- Primary color: Deep navy blue (#1E3A8A) – conveys depth and seriousness.
- Background color: Soft gray (#F3F4F6) – creates a calm, neutral environment.
- Accent color: Bright sky blue (#60A5FA) – adds a touch of playfulness to highlight actions or key moments.
- Clean and modern sans-serif font for readability and a slightly playful tone.
- Full-width, centered content with intuitive progression between steps.
- Smooth fade and slide transitions between questions and results to create a seamless experience.