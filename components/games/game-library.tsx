"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameCard } from './game-card'
import { GamePlayer } from './game-player'
import { GameGenerator } from './game-generator'
import { AIGame, apiService } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { 
  Search, 
  Filter, 
  Plus, 
  Gamepad2, 
  TrendingUp, 
  Clock,
  Loader2,
  RefreshCw,
  Sparkles
} from 'lucide-react'

interface GameLibraryProps {
  subtopicId?: string;
  onGameSelect?: (game: AIGame) => void;
  showGenerator?: boolean;
  className?: string;
}

interface GameFilters {
  search: string;
  gameType: string;
  difficulty: string;
  sortBy: 'recent' | 'popular' | 'title' | 'difficulty';
}

export function GameLibrary({ 
  subtopicId, 
  onGameSelect, 
  showGenerator = true,
  className = "" 
}: GameLibraryProps) {
  const { user } = useAuth();
  const [games, setGames] = useState<AIGame[]>([]);
  const [popularGames, setPopularGames] = useState<AIGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<AIGame | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [filters, setFilters] = useState<GameFilters>({
    search: '',
    gameType: 'all',
    difficulty: 'all',
    sortBy: 'recent'
  });

  useEffect(() => {
    loadGames();
    loadPopularGames();
  }, [subtopicId]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      let response;
      
      if (subtopicId) {
        response = await apiService.getAIGamesBySubtopic(subtopicId);
      } else {
        response = await apiService.getAIGames();
      }
      
      if (response.success && response.data) {
        setGames(response.data);
      }
    } catch (error) {
      console.error('Error cargando juegos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los juegos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularGames = async () => {
    try {
      const response = await apiService.getPopularGames(6);
      if (response.success && response.data) {
        setPopularGames(response.data);
      }
    } catch (error) {
      console.error('Error cargando juegos populares:', error);
    }
  };

  const handleGamePlay = (game: AIGame) => {
    setSelectedGame(game);
    setIsPlayerOpen(true);
    onGameSelect?.(game);
  };

  const handleGameComplete = (results: any) => {
    console.log('🎮 Juego completado:', results);
    // Actualizar estadísticas locales
    if (selectedGame) {
      setGames(prev => prev.map(g => 
        g.id === selectedGame.id 
          ? { ...g, playCount: g.playCount + 1 }
          : g
      ));
    }
  };

  const handleNewGameGenerated = (newGame: AIGame) => {
    setGames(prev => [newGame, ...prev]);
    toast({
      title: "🎮 Juego generado",
      description: `${newGame.title} está listo para jugar`,
    });
  };

  // Filtrar y ordenar juegos
  const filteredGames = games
    .filter(game => {
      if (filters.search && !game.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !game.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.gameType !== 'all' && game.gameType !== filters.gameType) {
        return false;
      }
      if (filters.difficulty !== 'all' && game.difficulty !== filters.difficulty) {
        return false;
      }
      return game.isActive;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return b.playCount - a.playCount;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const diffOrder = { easy: 1, medium: 2, hard: 3 };
          return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const gameTypeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'quiz', label: '❓ Quiz' },
    { value: 'wordsearch', label: '🔤 Sopa de Letras' },
    { value: 'memory', label: '🧠 Memoria' },
    { value: 'puzzle', label: '🧩 Rompecabezas' },
    { value: 'crossword', label: '📝 Crucigrama' },
    { value: 'matching', label: '🔗 Emparejar' },
    { value: 'threejs', label: '🎯 3D Interactivo' },
    { value: 'pixijs', label: '🎨 2D Interactivo' },
    { value: 'adaptive', label: '🧠 Adaptativo' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎮 Biblioteca de Juegos</h2>
          <p className="text-muted-foreground">
            {subtopicId 
              ? 'Juegos educativos para este tema'
              : 'Explora todos los juegos educativos disponibles'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadGames}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          
          {showGenerator && subtopicId && (
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Generar Juego
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Todos ({games.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Populares ({popularGames.length})
          </TabsTrigger>
          {showGenerator && subtopicId && (
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generar
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Todos los juegos */}
        <TabsContent value="all" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar juegos..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
                
                <Select 
                  value={filters.gameType} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, gameType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de juego" />
                  </SelectTrigger>
                  <SelectContent>
                    {gameTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filters.difficulty} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las dificultades</SelectItem>
                    <SelectItem value="easy">🟢 Fácil</SelectItem>
                    <SelectItem value="medium">🟡 Medio</SelectItem>
                    <SelectItem value="hard">🔴 Difícil</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={filters.sortBy} 
                  onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="popular">Más populares</SelectItem>
                    <SelectItem value="title">Título A-Z</SelectItem>
                    <SelectItem value="difficulty">Dificultad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Estadísticas de filtros */}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>Mostrando {filteredGames.length} de {games.length} juegos</span>
                {filters.search && (
                  <Badge variant="secondary">
                    Búsqueda: "{filters.search}"
                  </Badge>
                )}
                {filters.gameType !== 'all' && (
                  <Badge variant="secondary">
                    Tipo: {gameTypeOptions.find(o => o.value === filters.gameType)?.label}
                  </Badge>
                )}
                {filters.difficulty !== 'all' && (
                  <Badge variant="secondary">
                    Dificultad: {filters.difficulty}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lista de juegos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando juegos...</p>
              </div>
            </div>
          ) : filteredGames.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron juegos</h3>
                <p className="text-muted-foreground mb-4">
                  {games.length === 0 
                    ? 'Aún no hay juegos disponibles para este tema'
                    : 'Intenta ajustar los filtros de búsqueda'
                  }
                </p>
                {showGenerator && subtopicId && games.length === 0 && (
                  <Button onClick={() => setActiveTab('generate')}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar primer juego
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={handleGamePlay}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Juegos populares */}
        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Juegos Más Populares
              </CardTitle>
              <CardDescription>
                Los juegos más jugados por la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              {popularGames.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aún no hay suficientes datos para mostrar juegos populares
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={handleGamePlay}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Generar juego */}
        {showGenerator && subtopicId && (
          <TabsContent value="generate">
            <GameGenerator
              subtopicId={subtopicId}
              onGameGenerated={handleNewGameGenerated}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Game Player Modal */}
      <GamePlayer
        game={selectedGame}
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setSelectedGame(null);
        }}
        onComplete={handleGameComplete}
      />
    </div>
  );
}
