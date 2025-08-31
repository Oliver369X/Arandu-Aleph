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
  const [forceFullscreen, setForceFullscreen] = useState(false);
  
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

  // Auto-pantalla completa para estudiantes
  useEffect(() => {
    if (isOpen && user) {
      const isStudent = user.roles?.some(role => role.toLowerCase().includes('student')) || 
                       user.roles?.some(role => role.toLowerCase().includes('estudiante')) ||
                       (!user.roles?.some(role => role.toLowerCase().includes('teacher')) && 
                        !user.roles?.some(role => role.toLowerCase().includes('profesor')));
      
      if (isStudent) {
        setForceFullscreen(true);
        
        // Mostrar notificación para estudiante
        toast({
          title: "🎮 Modo Estudiante",
          description: "El juego se abrirá en pantalla completa para una mejor experiencia de aprendizaje",
        });
        
        // Intentar entrar en pantalla completa automáticamente
        setTimeout(() => {
          enterFullscreen();
        }, 1500);
      }
    }
  }, [isOpen, user]);

  // Función para cerrar el modal (declarada antes de useEffect para evitar ReferenceError)
  const handleClose = async () => {
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
    
    // Salir de pantalla completa si está activa
    if (isFullscreen) {
      await exitFullscreen();
    }
    
    // Resetear estado de pantalla completa forzada
    setForceFullscreen(false);
    
    onClose();
  };

  // Listener para cambios de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreenActive = !!document.fullscreenElement;
      console.log('🎮 [GamePlayer] Cambio de pantalla completa:', { isFullscreenActive, element: document.fullscreenElement });
      
      setIsFullscreen(isFullscreenActive);
      
      // Si el estudiante sale de pantalla completa, intentar volver a entrar
      if (forceFullscreen && !isFullscreenActive && isOpen) {
        console.warn('🎮 [GamePlayer] Estudiante salió de pantalla completa, restaurando...');
        toast({
          title: "🎮 Pantalla Completa Requerida",
          description: "Volviendo a modo pantalla completa en 3 segundos...",
        });
        setTimeout(() => {
          if (isOpen && !document.fullscreenElement) {
            enterFullscreen();
          }
        }, 3000);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevenir F11 si es estudiante forzado
      if (forceFullscreen && event.key === 'F11') {
        event.preventDefault();
        toast({
          title: "🎮 Modo de Juego",
          description: "Usa el botón de pantalla completa del juego",
        });
      }
      
      // Esc para salir (solo si no es estudiante forzado)
      if (event.key === 'Escape' && !forceFullscreen) {
        handleClose();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [forceFullscreen, isOpen, handleClose]);

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

  const enterFullscreen = async () => {
    try {
      // Obtener el elemento del modal dialog
      const dialogElement = document.querySelector('[data-game-dialog]') as HTMLElement;
      
      if (dialogElement && dialogElement.requestFullscreen) {
        await dialogElement.requestFullscreen();
        console.log('✅ [GamePlayer] Pantalla completa activada en el modal');
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        console.log('✅ [GamePlayer] Pantalla completa activada en documento');
      }
      
      setIsFullscreen(true);
    } catch (error) {
      console.warn('🎮 [GamePlayer] No se pudo entrar en pantalla completa:', error);
      // Como fallback, maximizar el modal
      setIsFullscreen(true);
      
      toast({
        title: "⚠️ Pantalla Completa",
        description: "Usando modo maximizado. Para mejor experiencia, permite pantalla completa en tu navegador.",
      });
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.warn('🎮 [GamePlayer] No se pudo salir de pantalla completa:', error);
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = async () => {
    // Si es estudiante con pantalla completa forzada, mostrar advertencia
    if (forceFullscreen && isFullscreen) {
      toast({
        title: "⚠️ Modo de Juego",
        description: "Los juegos deben jugarse en pantalla completa para una mejor experiencia",
        variant: "destructive"
      });
      return;
    }

    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
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
    <>
      {/* Estilos globales para forzar pantalla completa CENTRADA */}
      {isOpen && (
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Forzar overlay a ocupar toda la pantalla */
            [data-radix-dialog-overlay] {
              position: fixed !important;
              inset: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              background: rgba(0, 0, 0, 0.95) !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 9998 !important;
            }
            
            /* Modal content completamente centrado */
            [data-radix-dialog-content] {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              max-width: none !important;
              max-height: none !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              border-radius: 0 !important;
              transform: none !important;
              z-index: 9999 !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            /* Asegurar que el dialog en sí ocupe toda la pantalla */
            [data-game-dialog] {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              max-width: none !important;
              max-height: none !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              border-radius: 0 !important;
              transform: none !important;
              z-index: 9999 !important;
            }
            
            /* Prevenir scroll del body */
            body {
              overflow: hidden !important;
            }
            
            /* Sobrescribir cualquier transform que pueda centrar el modal de manera incorrecta */
            [data-state="open"][data-radix-dialog-content] {
              animation: none !important;
              transform: none !important;
            }
          `
        }} />
      )}
      
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          data-game-dialog
          className="
            fixed inset-0 w-screen h-screen max-w-none max-h-none 
            m-0 p-0 rounded-none border-none overflow-hidden 
            bg-background z-[9999] flex flex-col
          "
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: 'none',
            maxHeight: 'none',
            margin: 0,
            padding: 0,
            transform: 'none'
          }}
        >
        {/* Header */}
        <DialogHeader className={`${
          isFullscreen 
            ? 'px-4 py-2 border-b bg-black/80 text-white backdrop-blur supports-[backdrop-filter]:bg-black/60' 
            : 'px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
        }`}>
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
                  title={forceFullscreen ? "Pantalla completa requerida" : (isFullscreen ? "Salir de pantalla completa" : "Pantalla completa")}
                  className={forceFullscreen ? "text-primary bg-primary/10" : ""}
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
        <div className={`relative w-full ${
          isFullscreen 
            ? 'flex-1' 
            : 'flex-1'
        }`} style={{
          ...(isFullscreen && {
            height: 'calc(100vh - 60px)', // Restar altura del header compacto
            minHeight: 'calc(100vh - 60px)',
            width: '100vw',
            background: 'transparent'
          })
        }}>
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
            <div className="w-full h-full" style={{
              ...(isFullscreen && {
                width: '100%',
                height: '100%',
                minWidth: '100%',
                minHeight: '100%'
              })
            }}>
              <GameIframe
                htmlContent={game.htmlContent}
                onMessage={handleGameMessage}
                className={`w-full h-full ${isFullscreen ? 'rounded-none' : 'rounded-lg'}`}
                isFullscreen={isFullscreen}
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
    </>
  );
}
