
"use server";

// This is a mock in-memory store. In a real application, you'd use a database.
let mockLeaderboard: { id: string; name: string; score: number; createdAt: Date }[] = [
    { id: "1", name: "Elena Ejemplo", score: 85, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: "2", name: "Carlos Pruebas", score: 92, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "3", name: "Ana Demo", score: 50, createdAt: new Date() },
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt: Date;
  rank?: number;
}

export async function saveResult(
  name: string,
  score: number
): Promise<{ success: boolean; message?: string }> {
  console.log(`Server Action: Saving result for ${name} with score ${score}`);
  // Simulate saving to a database
  // Prevent duplicate entries for the same user if they replay quickly, update instead (simplified)
  const existingEntryIndex = mockLeaderboard.findIndex(entry => entry.name.toLowerCase() === name.toLowerCase());
  if (existingEntryIndex !== -1) {
    // Update if new score is higher or simply update timestamp
    if (score >= mockLeaderboard[existingEntryIndex].score) {
         mockLeaderboard[existingEntryIndex] = { ...mockLeaderboard[existingEntryIndex], score, createdAt: new Date() };
    }
  } else {
    const newEntry = { id: String(Date.now()) + name, name, score, createdAt: new Date() };
    mockLeaderboard.push(newEntry);
  }
  
  // In a real app, handle potential errors during DB operation
  return { success: true, message: "Resultado guardado (simulado)." };
}

export async function getRankings(): Promise<LeaderboardEntry[]> {
  console.log("Server Action: Fetching rankings");
  // Simulate fetching from a database
  // Sort by score descending, then by date ascending for ties
  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return sortedLeaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
