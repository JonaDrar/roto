
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { saveResult } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Award, BarChart3, RotateCcw } from 'lucide-react';
import { TOTAL_QUESTIONS } from '@/lib/questions';

interface UserData {
  name: string;
  answers: Record<number, 'yes' | 'no'>;
  currentQuestion: number;
  score?: number;
}

const initialUserData: UserData = {
  name: '',
  answers: {},
  currentQuestion: 1,
};


export default function ResultsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useLocalStorageState<UserData>('quizUserData', initialUserData);
  const [roturaIndex, setRoturaIndex] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;

    if (!userData.name || Object.keys(userData.answers).length < TOTAL_QUESTIONS) {
      router.replace('/');
      return;
    }

    if (userData.score !== undefined) { // If score is already calculated and stored
        setRoturaIndex(userData.score);
    } else {
        const yesAnswers = Object.values(userData.answers).filter(ans => ans === 'yes').length;
        const score = Math.round((yesAnswers / TOTAL_QUESTIONS) * 100);
        setRoturaIndex(score);
        setUserData(prev => ({ ...prev, score, currentQuestion: TOTAL_QUESTIONS + 1 }));

        saveResult(userData.name, score)
          .then(response => {
            if (response.success) {
              // Toast might be too intrusive here, let's assume it's fine.
              toast({ title: "Resultado Guardado", description: "Tu puntuación se ha guardado en el ranking (simulado)." });
            } else {
              toast({ title: "Error al Guardar", description: response.message || "No se pudo guardar el resultado.", variant: "destructive" });
            }
          })
          .catch(() => {
            toast({ title: "Error de Red", description: "No se pudo conectar para guardar el resultado.", variant: "destructive" });
          });
    }
  }, [isClient, userData.name, userData.answers, userData.score, setUserData, router, toast]);

  useEffect(() => {
    if (roturaIndex === null) return;

    if (roturaIndex <= 25) {
      setResultMessage("Estás más puro que agua de manantial. ¡Qué envidia! 😉");
    } else if (roturaIndex <= 50) {
      setResultMessage("Tienes tus cositas, como todos. Unos memes y a seguir. 😂");
    } else if (roturaIndex <= 75) {
      setResultMessage("Ok, necesitas un respiro y quizás un amigo con chocolate. 🍫🫂");
    } else {
      setResultMessage("Bienvenido al club de los rotos con estilo. ¡Hay café y stickers! ☕💔");
    }
  }, [roturaIndex]);

  const handlePlayAgain = () => {
    // Keep name, reset rest. Name might have been updated in localStorage if user changed it on start page.
    setUserData(prev => ({ ...initialUserData, name: prev.name || '' })); 
    router.push('/');
  };

  const handleViewRanking = () => {
    router.push('/ranking');
  };
  
  if (!isClient || roturaIndex === null || !userData.name) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">Calculando Resultados...</CardTitle>
          </CardHeader>
          <CardContent className="py-10">
            <div className="animate-pulse space-y-8">
              <div className="h-20 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
              <div className="flex justify-around mt-6">
                <div className="h-12 bg-muted rounded w-36"></div>
                <div className="h-12 bg-muted rounded w-36"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-8 sm:pt-12 animate-in fade-in-0 zoom-in-90 duration-500">
      <Card className="w-full max-w-lg shadow-2xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground text-center p-8 relative">
          <Award className="absolute top-4 left-4 h-8 w-8 opacity-30" />
          <Award className="absolute top-6 right-6 h-10 w-10 opacity-20 transform rotate-12" />
          <Award className="absolute bottom-3 left-8 h-6 w-6 opacity-40 transform -rotate-12" />
          <CardTitle className="text-3xl sm:text-4xl font-extrabold">¡Resultado Final, {userData.name}!</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6 sm:p-8 space-y-6">
          <p className="text-md sm:text-lg text-muted-foreground">Tu Índice de Rotura es:</p>
          <p className="text-6xl sm:text-7xl font-bold text-accent drop-shadow-lg">
            {roturaIndex}%
          </p>
          <p className="text-lg sm:text-xl font-medium text-foreground px-4 py-4 bg-secondary rounded-lg shadow-inner">
            {resultMessage}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 p-6 bg-muted/30 border-t">
          <Button onClick={handlePlayAgain} className="w-full sm:w-auto text-md sm:text-lg py-5" variant="outline">
            <RotateCcw className="mr-2 h-5 w-5" /> Jugar de Nuevo
          </Button>
          <Button onClick={handleViewRanking} className="w-full sm:w-auto text-md sm:text-lg py-5 bg-primary hover:bg-primary/90">
            <BarChart3 className="mr-2 h-5 w-5" /> Ver Ranking
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
