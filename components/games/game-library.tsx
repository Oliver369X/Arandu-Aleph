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
import { useHTMLGames } from '@/hooks/use-html-games'
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
  
  // Hook para juegos HTML pre-existentes
  const { 
    games: htmlGames, 
    isLoading: isLoadingHTMLGames, 
    loadGame: loadHTMLGame,
    error: htmlGamesError 
  } = useHTMLGames();
  
  const [filters, setFilters] = useState<GameFilters>({
    search: '',
    gameType: 'all',
    difficulty: 'all',
    sortBy: 'recent'
  });

  useEffect(() => {
    loadGames();
    loadPopularGames();
  }, [subtopicId, htmlGames]); // Recargar cuando cambien los juegos HTML

  // Debugging: Log del estado actual
  useEffect(() => {
    console.log('🎮 [GameLibrary] Estado actual:', {
      gamesCount: games.length,
      popularGamesCount: popularGames.length,
      popularGamesType: typeof popularGames,
      popularGamesIsArray: Array.isArray(popularGames)
    });
  }, [games, popularGames]);

  const loadGames = async () => {
    setIsLoading(true);
    try {
      let apiGames: AIGame[] = [];
      
      // Cargar juegos de la API si hay subtopicId
      if (subtopicId) {
        const response = await apiService.getAIGamesBySubtopic(subtopicId);
        if (response.success && response.data) {
          apiGames = response.data;
        }
      } else {
        const response = await apiService.getAIGames();
        if (response.success && response.data) {
          apiGames = response.data;
        }
      }
      
      // Combinar juegos de API con juegos HTML (solo si no hay subtopicId específico)
      let combinedGames = apiGames;
      if (!subtopicId) {
        combinedGames = [...apiGames, ...htmlGames];
        console.log(`🎮 [GameLibrary] Combinando ${apiGames.length} juegos de API con ${htmlGames.length} juegos HTML`);
      }
      
      setGames(combinedGames);
      
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
      if (response.success && response.data && Array.isArray(response.data)) {
        setPopularGames(response.data);
      } else {
        console.log('⚠️ getPopularGames no devolvió un array válido, usando array vacío');
        setPopularGames([]);
      }
    } catch (error) {
      console.error('Error cargando juegos populares:', error);
      // Asegurar que siempre sea un array
      setPopularGames([]);
    }
  };

  const handleGamePlay = async (game: AIGame) => {
    console.log('🎮 [GameLibrary] Iniciando juego:', game.title);
    
    let gameToPlay = game;
    
    // Si es un juego HTML sin contenido, cargarlo
    if (game.id.startsWith('html-') || (!game.htmlContent && htmlGames.find(hg => hg.id === game.id))) {
      console.log('🔄 [GameLibrary] Cargando contenido HTML para:', game.id);
      
      toast({
        title: "🎮 Preparando juego",
        description: "Cargando contenido del juego...",
      });
      
      const gameWithContent = await loadHTMLGame(game.id);
      if (gameWithContent) {
        gameToPlay = gameWithContent;
        console.log('✅ [GameLibrary] Contenido HTML cargado exitosamente');
      } else {
        toast({
          title: "❌ Error",
          description: "No se pudo cargar el contenido del juego",
          variant: "destructive"
        });
        return;
      }
    }
    
    setSelectedGame(gameToPlay);
    setIsPlayerOpen(true);
    onGameSelect?.(gameToPlay);
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
        <TabsList className={`grid w-full ${showGenerator && subtopicId ? 'grid-cols-4' : !subtopicId ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Todos ({games.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Populares ({popularGames.length})
          </TabsTrigger>
          {!subtopicId && (
            <TabsTrigger value="html" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Pre-hechos ({htmlGames.length})
            </TabsTrigger>
          )}
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

        {/* Tab: Juegos HTML pre-existentes */}
        {!subtopicId && (
          <TabsContent value="html" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Juegos Pre-hechos de Alta Calidad
                </CardTitle>
                <CardDescription>
                  Juegos educativos profesionales listos para usar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingHTMLGames ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Cargando juegos HTML...</p>
                  </div>
                ) : htmlGamesError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive font-medium">⚠️ {htmlGamesError}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      No se pudieron cargar los juegos HTML pre-existentes
                    </p>
                  </div>
                ) : htmlGames.length === 0 ? (
                  <div className="text-center py-8">
                    <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay juegos HTML disponibles
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {htmlGames.map(game => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onPlay={handleGamePlay}
                      />
                    ))}
                  </div>
                )}
                
                {htmlGames.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">✨ Juegos de Alta Calidad</p>
                        <ul className="text-blue-700 space-y-1 text-xs">
                          <li>• Desarrollados por expertos en educación y tecnología</li>
                          <li>• Incluyen gráficos 3D, animaciones y sonidos profesionales</li>
                          <li>• Optimizados para máximo engagement y aprendizaje</li>
                          <li>• Compatibles con todos los dispositivos modernos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

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
                  {Array.isArray(popularGames) ? popularGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={handleGamePlay}
                    />
                  )) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">
                        Error cargando juegos populares
                      </p>
                    </div>
                  )}
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
        game={selectedGame || undefined}
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
