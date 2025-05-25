
import { getRankings, LeaderboardEntry } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Medal, Trophy, UserCircle2 } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

function getMedal(rank: number | undefined) {
  if (!rank) return <span className="text-sm text-muted-foreground">-</span>;
  if (rank === 1) return <Medal className="h-6 w-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />;
  if (rank === 3) return <Medal className="h-6 w-6 text-orange-500" />;
  return <span className="font-semibold">{rank}</span>;
}

export default async function RankingPage() {
  const rankings = await getRankings();

  return (
    <div className="pt-8 sm:pt-12 w-full">
      <Card className="w-full shadow-2xl animate-in fade-in-0 duration-500">
        <CardHeader className="text-center p-6">
          <Trophy className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-primary mb-3 sm:mb-4" />
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-primary">
            Ranking de Rotura
          </CardTitle>
          <CardDescription className="text-md sm:text-lg text-muted-foreground pt-2">
            ¿Quién es el más gloriosamente roto de todos?
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {rankings.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 text-lg">Nadie ha jugado todavía. ¡Sé el primero en romper el hielo (y quizás algo más)!</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="w-[70px] sm:w-[80px] text-center font-semibold text-base">Puesto</TableHead>
                    <TableHead className="font-semibold text-base">Nombre</TableHead>
                    <TableHead className="text-right font-semibold text-base">Índice</TableHead>
                    <TableHead className="text-right font-semibold text-base hidden sm:table-cell">Hace</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankings.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-secondary/50 transition-colors text-sm sm:text-base">
                      <TableCell className="font-medium text-center py-3">{getMedal(entry.rank)}</TableCell>
                      <TableCell className="py-3 flex items-center gap-2">
                        <UserCircle2 className="h-5 w-5 text-muted-foreground shrink-0 hidden sm:inline-block" /> 
                        {entry.name}
                      </TableCell>
                      <TableCell className="text-right font-bold text-accent text-md sm:text-lg py-3">{entry.score}%</TableCell>
                      <TableCell className="text-right text-xs sm:text-sm text-muted-foreground py-3 hidden sm:table-cell">
                        {formatDistanceToNowStrict(new Date(entry.createdAt), { locale: es, addSuffix: false })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const revalidate = 60; // Revalidate rankings every 60 seconds
