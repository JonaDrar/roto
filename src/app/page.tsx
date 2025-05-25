
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TOTAL_QUESTIONS } from '@/lib/questions';
import { useToast } from "@/hooks/use-toast";
import { PlayCircle, RotateCcw } from 'lucide-react';


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

export default function StartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [nameInput, setNameInput] = useState('');
  const [userData, setUserData] = useLocalStorageState<UserData>('quizUserData', initialUserData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if(isClient) {
      // Pre-fill name if it exists from previous session, regardless of quiz state
      if (userData.name) {
        setNameInput(userData.name);
      }
      // If quiz was completed (score exists or currentQuestion > TOTAL_QUESTIONS), effectively reset for a new start page view
      // but allow name to persist.
      if (userData.score !== undefined || userData.currentQuestion > TOTAL_QUESTIONS) {
        // This logic is more to ensure the "Continue Quiz" button state is correct.
        // Actual reset happens on "Empezar Quiz" or "Empezar de Nuevo".
      }
    }
  }, [isClient, userData.name, userData.score, userData.currentQuestion]);


  const handleStartQuiz = (isNewStart: boolean) => {
    if (nameInput.trim() === '') {
      toast({
        title: "¡Espera!",
        description: "Por favor, ingresa tu nombre (o algo creativo).",
        variant: "destructive",
      });
      return;
    }
    setUserData({ // Always reset answers and currentQuestion
      name: nameInput.trim(),
      answers: {},
      currentQuestion: 1,
      score: undefined, // Explicitly clear score
    });
    router.push('/quiz/1');
  };
  
  const handleResumeQuiz = () => {
    if (userData.name && userData.currentQuestion > 0 && userData.currentQuestion <= TOTAL_QUESTIONS) {
      router.push(`/quiz/${userData.currentQuestion}`);
    } else {
      // This case should ideally not be met if button is shown correctly
      toast({ title: "Error", description: "No se puede continuar el quiz.", variant: "destructive" });
      setUserData(initialUserData); // Full reset if state is inconsistent
    }
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center mt-10">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">Cargando...</CardTitle>
          </CardHeader>
          <CardContent className="py-10">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canResume = userData.name && Object.keys(userData.answers).length > 0 && userData.currentQuestion <= TOTAL_QUESTIONS && userData.score === undefined;
  const isCompleted = userData.score !== undefined || userData.currentQuestion > TOTAL_QUESTIONS;

  return (
    <div className="flex flex-col items-center justify-center pt-10 sm:pt-12 animate-in fade-in-0 duration-500">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center p-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            ¿Estás listo?
          </h1>
          <CardDescription className="text-md sm:text-lg text-muted-foreground pt-2">
            Descubre tu nivel de "rotura" emocional. <br/> Contesta con honestidad... o no.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-md font-semibold">Tu Nombre (o apodo épico):</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: El Descorazonado risueño"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="text-base py-5"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6">
          <Button onClick={() => handleStartQuiz(true)} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
            <PlayCircle className="mr-2 h-5 w-5" />
            {isCompleted || !canResume ? 'Empezar Quiz' : 'Empezar de Nuevo'}
          </Button>
          {canResume && (
             <Button onClick={handleResumeQuiz} variant="outline" className="w-full text-lg py-6 border-primary text-primary hover:bg-primary/10">
                <RotateCcw className="mr-2 h-5 w-5" />
                Continuar Quiz ({Object.keys(userData.answers).length}/{TOTAL_QUESTIONS})
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
