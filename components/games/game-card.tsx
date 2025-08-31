"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Users, 
  Play, 
  Star,
  Brain,
  Gamepad2,
  Zap,
  Target,
  Puzzle,
  BookOpen,
  MoreVertical
} from 'lucide-react'
import { AIGame } from '@/lib/api'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface GameCardProps {
  game: AIGame;
  onPlay?: (game: AIGame) => void;
  onEdit?: (game: AIGame) => void;
  onDelete?: (game: AIGame) => void;
  showActions?: boolean;
  className?: string;
}

const gameTypeIcons = {
  wordsearch: BookOpen,
  quiz: Brain,
  memory: Zap,
  puzzle: Puzzle,
  crossword: Target,
  matching: Gamepad2,
  threejs: Star,
  pixijs: Star,
  adaptive: Brain
};

const gameTypeLabels = {
  wordsearch: 'Sopa de Letras',
  quiz: 'Quiz',
  memory: 'Memoria',
  puzzle: 'Rompecabezas',
  crossword: 'Crucigrama',
  matching: 'Emparejar',
  threejs: '3D Interactivo',
  pixijs: '2D Interactivo',
  adaptive: 'Adaptativo'
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  hard: 'bg-red-100 text-red-800 border-red-200'
};

const difficultyLabels = {
  easy: '🟢 Fácil',
  medium: '🟡 Medio',
  hard: '🔴 Difícil'
};

export function GameCard({ 
  game, 
  onPlay, 
  onEdit, 
  onDelete, 
  showActions = false,
  className = ""
}: GameCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const GameIcon = gameTypeIcons[game.gameType] || Gamepad2;
  
  const handlePlay = async () => {
    if (onPlay && !isLoading) {
      setIsLoading(true);
      try {
        await onPlay(game);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <GameIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <Badge variant="secondary" className="text-xs w-fit">
                {gameTypeLabels[game.gameType]}
              </Badge>
              {game.agentType === 'free' && (
                <Badge variant="outline" className="text-xs w-fit mt-1">
                  ✨ IA Avanzada
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{game.estimatedTime}min</span>
            </div>
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(game)}>
                      ✏️ Editar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(game)}
                      className="text-destructive"
                    >
                      🗑️ Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
              {game.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {game.description}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{game.playCount} jugadas</span>
                </div>
                {game.subtopic && (
                  <Badge variant="outline" className="text-xs">
                    {game.subtopic.name}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`text-xs ${difficultyColors[game.difficulty]}`}
              >
                {difficultyLabels[game.difficulty]}
              </Badge>
              
              <Button 
                size="sm" 
                onClick={handlePlay}
                disabled={isLoading}
                className="h-8 px-3"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    Jugar
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Indicador de actividad reciente */}
          {game.playCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Jugado recientemente</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
