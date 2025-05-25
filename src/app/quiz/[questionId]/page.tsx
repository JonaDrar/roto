
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import { questions, TOTAL_QUESTIONS, Question as QuestionType } from '@/lib/questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';

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

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const questionIdParam = params.questionId as string;

  const [userData, setUserData] = useLocalStorageState<UserData>('quizUserData', initialUserData);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionType | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-in fade-in-0 slide-in-from-right-12 duration-500');
  const [questionId, setQuestionId] = useState<number | null>(null);


  useEffect(() => {
    setIsClient(true);
    const id = parseInt(questionIdParam);
    if (!isNaN(id)) {
      setQuestionId(id);
    } else {
      // Handle invalid questionIdParam early, e.g., redirect or show error
      router.replace('/');
    }
  }, [questionIdParam, router]);

  useEffect(() => {
    if (!isClient || questionId === null) return;

    if (isNaN(questionId) || questionId < 1 || questionId > TOTAL_QUESTIONS) {
      router.replace('/');
      return;
    }
    
    if (userData.name === '') {
        router.replace('/');
        return;
    }
    
    const q = questions.find(q => q.id === questionId);
    setCurrentQuestionData(q || null);
    
    // Only update userData.currentQuestion if it's different from the current route's questionId
    // This prevents a loop if setUserData causes a re-render but questionId hasn't changed.
    if (userData.currentQuestion !== questionId) {
        setUserData(prev => ({ ...prev, currentQuestion: questionId }));
    }
    
    // Reset animation class for incoming question
    setAnimationClass('animate-in fade-in-0 slide-in-from-right-12 duration-500');

  }, [isClient, questionId, router, userData.name, userData.currentQuestion, setUserData]);


  const handleAnswer = (answer: 'yes' | 'no') => {
    if (questionId === null) return;
    setUserData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));

    setAnimationClass('animate-out fade-out-0 slide-out-to-left-12 duration-300');
    setTimeout(() => {
      if (questionId < TOTAL_QUESTIONS) {
        router.push(`/quiz/${questionId + 1}`);
      } else {
        router.push('/results');
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (questionId !== null && questionId > 1) {
      setAnimationClass('animate-out fade-out-0 slide-out-to-right-12 duration-300');
      setTimeout(() => {
        router.push(`/quiz/${questionId - 1}`);
      }, 300);
    }
  };

  if (!isClient || !currentQuestionData || !userData.name || questionId === null) {
    return (
        <div className="flex flex-col items-center justify-center mt-10">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">Cargando Pregunta...</CardTitle>
          </CardHeader>
          <CardContent className="py-10">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-muted rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="flex justify-around mt-6">
                <div className="h-12 bg-muted rounded w-28"></div>
                <div className="h-12 bg-muted rounded w-28"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressValue = (questionId / TOTAL_QUESTIONS) * 100;

  return (
    <div className={`pt-8 sm:pt-12 ${animationClass}`}>
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary text-center">
            Pregunta {questionId} de {TOTAL_QUESTIONS}
          </CardTitle>
          <Progress value={progressValue} aria-label={`Progreso: ${progressValue}%`} className="w-full mt-3 h-3" />
          <CardDescription className="text-center pt-5 text-muted-foreground text-md">
            Hola {userData.name}, reflexiona y responde:
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[120px] flex items-center justify-center p-6">
          <p className="text-lg sm:text-xl text-center font-medium text-foreground">
            {currentQuestionData.text}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6 border-t">
          <Button onClick={() => handleAnswer('yes')} className="w-full sm:w-auto text-lg px-10 py-6 bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            Sí
          </Button>
          <Button onClick={() => handleAnswer('no')} className="w-full sm:w-auto text-lg px-10 py-6" variant="outline" size="lg">
            No
          </Button>
        </CardFooter>
        {questionId > 1 && (
             <div className="px-6 pb-4 flex justify-start">
                <Button onClick={handlePrevious} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
                </Button>
            </div>
        )}
      </Card>
    </div>
  );
}
