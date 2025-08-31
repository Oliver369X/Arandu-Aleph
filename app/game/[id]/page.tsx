"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GameIframe } from '@/components/ui/game-iframe';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiService } from '@/lib/api';

interface AIGame {
  id: string;
  title: string;
  description?: string;
  gameType: string;
  difficulty: string;
  htmlContent: string;
  subtopicId: string;
  estimatedTime?: number;
}

interface GameSession {
  startTime: number;
  timeSpent: number;
  score: number;
  progress: number;
  completed: boolean;
  paused: boolean;
}

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const [game, setGame] = useState<AIGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [session, setSession] = useState<GameSession>({
    startTime: Date.now(),
    timeSpent: 0,
    score: 0,
    progress: 0,
    completed: false,
    paused: false
  });

  useEffect(() => {
    const loadGame = async () => {
      try {
        setIsLoading(true);
        
        // Intentar cargar el juego desde la API
        const response = await apiService.getAIGameById(gameId);
        if (response) {
          setGame(response);
          setError(null);
        } else {
          throw new Error('Juego no encontrado');
        }
      } catch (err) {
        console.error('Error cargando juego:', err);
        setError('No se pudo cargar el juego');
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      loadGame();
    }
  }, [gameId]);

  // Timer para actualizar tiempo transcurrido
  useEffect(() => {
    if (session.paused || session.completed) return;

    const interval = setInterval(() => {
      setSession(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.paused, session.completed]);

  const handleGameMessage = (message: any) => {
    switch (message.type) {
      case 'SCORE_UPDATE':
        setSession(prev => ({ ...prev, score: message.payload.score || 0 }));
        break;
        
      case 'GAME_COMPLETED':
        setSession(prev => ({ ...prev, completed: true, progress: 100 }));
        toast({
          title: "🎉 ¡Juego completado!",
          description: `Puntuación final: ${session.score}`,
        });
        break;
        
      case 'GAME_STARTED':
        setSession(prev => ({ ...prev, startTime: Date.now() }));
        break;
        
      case 'PROGRESS_UPDATE':
        setSession(prev => ({ ...prev, progress: message.payload.progress || 0 }));
        break;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    router.back();
  };

  const restartGame = () => {
    setSession({
      startTime: Date.now(),
      timeSpent: 0,
      score: 0,
      progress: 0,
      completed: false,
      paused: false
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Cargando juego...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Error al cargar el juego</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header compacto */}
      <header className="bg-black/90 border-b border-gray-800 px-4 py-3 flex items-center justify-between text-white z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Salir
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold">{game.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>Puntuación: {session.score}</span>
              <span>Tiempo: {formatTime(session.timeSpent)}</span>
              {session.progress > 0 && (
                <span>Progreso: {Math.round(session.progress)}%</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.completed && (
            <Button
              variant="secondary"
              size="sm"
              onClick={restartGame}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Jugar de nuevo
            </Button>
          )}
        </div>
      </header>

      {/* Contenido del juego - TODA LA PANTALLA */}
      <main className="flex-1 relative bg-black">
        {session.completed && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center text-white max-w-md">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">¡Juego Completado! 🎉</h2>
              <div className="space-y-3 mb-8 text-lg">
                <p><strong>Puntuación Final:</strong> {session.score}</p>
                <p><strong>Tiempo Total:</strong> {formatTime(session.timeSpent)}</p>
                {game.estimatedTime && (
                  <p className="text-yellow-200">
                    Tiempo estimado: {game.estimatedTime} minutos
                  </p>
                )}
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={restartGame} variant="secondary" size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Jugar de nuevo
                </Button>
                <Button onClick={handleBack} size="lg">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver al curso
                </Button>
              </div>
            </div>
          </div>
        )}

        {game?.htmlContent ? (
          <GameIframe
            htmlContent={game.htmlContent}
            onMessage={handleGameMessage}
            className="w-full h-full border-0"
            isFullscreen={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg">Cargando contenido del juego...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
