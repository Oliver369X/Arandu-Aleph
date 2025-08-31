"use client"

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { GameIframe, GameMessage } from '@/components/ui/game-iframe'
import { AIGame, apiService } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { 
  X, 
  Clock, 
  Trophy, 
  Target, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface GamePlayerProps {
  gameId?: string;
  game?: AIGame;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (results: GameResults) => void;
}

interface GameResults {
  gameId: string;
  score?: number;
  timeSpent: number;
  completed: boolean;
  progress?: number;
}

interface GameSession {
  startTime: number;
  score: number;
  progress: number;
  timeSpent: number;
  completed: boolean;
  paused: boolean;
}

export function GamePlayer({ 
  gameId, 
  game: initialGame, 
  isOpen, 
  onClose, 
  onComplete 
}: GamePlayerProps) {
  const { user } = useAuth();
  const [game, setGame] = useState<AIGame | null>(initialGame || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [session, setSession] = useState<GameSession>({
    startTime: Date.now(),
    score: 0,
    progress: 0,
    timeSpent: 0,
    completed: false,
    paused: false
  });

  // Cargar datos del juego
  useEffect(() => {
    if (isOpen && gameId && !initialGame) {
      loadGame();
    } else if (isOpen && initialGame) {
      setGame(initialGame);
      resetSession();
    }
  }, [isOpen, gameId, initialGame]);

  // Timer para actualizar tiempo transcurrido
  useEffect(() => {
    if (!isOpen || session.paused || session.completed) return;

    const interval = setInterval(() => {
      setSession(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - prev.startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, session.paused, session.completed, session.startTime]);

  const loadGame = async () => {
    if (!gameId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.playAIGame(gameId);
      
      if (response.success && response.data) {
        setGame(response.data);
        resetSession();
      } else {
        setError('No se pudo cargar el juego');
      }
    } catch (error) {
      console.error('Error cargando juego:', error);
      setError('Error al cargar el juego');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSession = () => {
    setSession({
      startTime: Date.now(),
      score: 0,
      progress: 0,
      timeSpent: 0,
      completed: false,
      paused: false
    });
  };

  const handleGameMessage = useCallback((message: GameMessage) => {
    console.log('🎮 [GamePlayer] Mensaje del juego:', message);
    
    switch (message.type) {
      case 'GAME_STARTED':
        setSession(prev => ({ ...prev, startTime: Date.now() }));
        toast({
          title: "🎮 Juego iniciado",
          description: "¡Que tengas una buena partida!",
        });
        break;
        
      case 'SCORE_UPDATE':
        if (message.payload.score !== undefined) {
          setSession(prev => ({ ...prev, score: message.payload.score! }));
        }
        break;
        
      case 'TIME_UPDATE':
        if (message.payload.timeSpent !== undefined) {
          setSession(prev => ({ ...prev, timeSpent: message.payload.timeSpent! }));
        }
        break;
        
      case 'GAME_COMPLETED':
        const finalResults: GameResults = {
          gameId: game?.id || gameId || '',
          score: message.payload.score || session.score,
          timeSpent: message.payload.timeSpent || session.timeSpent,
          completed: true,
          progress: message.payload.progress || 100
        };
        
        setSession(prev => ({ 
          ...prev, 
          completed: true,
          score: finalResults.score || prev.score,
          progress: finalResults.progress || 100
        }));
        
        toast({
          title: "🎉 ¡Juego completado!",
          description: `Puntuación: ${finalResults.score || 0} - Tiempo: ${formatTime(finalResults.timeSpent)}`,
        });
        
        onComplete?.(finalResults);
        break;
        
      case 'GAME_READY':
        console.log('🎮 Juego listo para jugar');
        break;
    }
  }, [game?.id, gameId, session.score, session.timeSpent, onComplete]);

  const handleClose = () => {
    if (session.timeSpent > 0 && !session.completed) {
      // Guardar progreso parcial
      const partialResults: GameResults = {
        gameId: game?.id || gameId || '',
        score: session.score,
        timeSpent: session.timeSpent,
        completed: false,
        progress: session.progress
      };
      
      onComplete?.(partialResults);
    }
    
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const togglePause = () => {
    setSession(prev => ({ ...prev, paused: !prev.paused }));
  };

  const restartGame = () => {
    resetSession();
    // Recargar el iframe
    window.location.reload();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? 'max-w-full h-full m-0 rounded-none' 
            : 'max-w-6xl h-[90vh]'
        } p-0 overflow-hidden`}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold">
                {game?.title || 'Cargando juego...'}
              </DialogTitle>
              {game && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {game.gameType}
                  </Badge>
                  <Badge variant="outline">
                    {game.difficulty}
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Controles de juego */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(session.timeSpent)}</span>
              </div>
              
              {session.score > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="w-4 h-4" />
                  <span>{session.score}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePause}
                  disabled={session.completed}
                >
                  {session.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restartGame}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          {session.progress > 0 && (
            <div className="mt-2">
              <Progress value={session.progress} className="h-2" />
            </div>
          )}
        </DialogHeader>

        {/* Contenido del juego */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando juego...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive font-medium">⚠️ {error}</p>
                <Button 
                  variant="outline" 
                  onClick={loadGame}
                  className="mt-4"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          ) : game?.htmlContent ? (
            <div className="h-full">
              <GameIframe
                htmlContent={game.htmlContent}
                onMessage={handleGameMessage}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No hay contenido de juego disponible</p>
            </div>
          )}
          
          {/* Overlay de pausa */}
          {session.paused && !session.completed && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <Pause className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Juego pausado</h3>
                <Button onClick={togglePause}>
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              </div>
            </div>
          )}
          
          {/* Overlay de completado */}
          {session.completed && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center max-w-md">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">¡Juego completado! 🎉</h3>
                <div className="space-y-2 mb-6">
                  <p className="text-lg">
                    <strong>Puntuación:</strong> {session.score}
                  </p>
                  <p className="text-lg">
                    <strong>Tiempo:</strong> {formatTime(session.timeSpent)}
                  </p>
                  {game?.estimatedTime && (
                    <p className="text-sm text-muted-foreground">
                      Tiempo estimado: {game.estimatedTime} minutos
                    </p>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={restartGame} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jugar de nuevo
                  </Button>
                  <Button onClick={handleClose}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
