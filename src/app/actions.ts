"use server";

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
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, percentage: score }),
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to save result');
    return { success: true, message: "Resultado guardado correctamente." };
  } catch (error) {
    console.error("Error al guardar resultado:", error);
    return { success: false, message: "Error al guardar resultado." };
  }
}

export async function getRankings(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/ranking`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch ranking');
    const data = await res.json();

    return data.map((entry: any, index: number) => ({
      id: entry.id?.toString() || `${entry.name}-${index}`,
      name: entry.name,
      score: entry.rotura_percentage || entry.score,
      createdAt: new Date(entry.created_at),
      rank: index + 1
    }));
  } catch (error) {
    console.error("Error al obtener ranking:", error);
    return [];
  }
}