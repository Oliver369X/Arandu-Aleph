# 🎮 Estrategia de Integración: AI Games en ARANDU

## 📋 **Análisis del Frontend Actual**

### ✅ **Estructura Existente:**
- **Framework**: Next.js 14 con TypeScript
- **UI**: shadcn/ui components + Tailwind CSS
- **Estado**: React hooks + Context API
- **API**: Servicio centralizado en `lib/api.ts`
- **Autenticación**: Sistema de roles implementado
- **Rutas**: App Router con páginas dinámicas

### ✅ **Componentes Clave Identificados:**
- `CoursePlayer` - Reproductor de cursos con tabs
- `StudentDashboard` - Dashboard principal del estudiante
- `TeacherDashboard` - Dashboard del profesor
- `DataAdapter` - Adaptador de datos SchoolAI ↔ ARANDU

## 🎯 **Plan de Integración**

### **Fase 1: Extensión de API y Tipos**

#### 1.1 Agregar Tipos AIGame
```typescript
// lib/api.ts - Nuevos tipos
export interface AIGame {
  id: string;
  subtopicId: string;
  gameType: 'wordsearch' | 'quiz' | 'memory' | 'puzzle' | 'crossword' | 'matching' | 'threejs' | 'pixijs' | 'adaptive';
  agentType: 'specialized' | 'free';
  title: string;
  description: string;
  instructions: string;
  htmlContent: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  isActive: boolean;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  subtopic?: Subtopic;
}

export interface GameGenerationRequest {
  gameType?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  customPrompt?: string;
  language?: 'es' | 'en';
}
```

#### 1.2 Servicios API
```typescript
// lib/api.ts - Nuevos métodos
export const apiService = {
  // ... métodos existentes ...

  // AI Games
  async getAIGames(): Promise<ApiResponse<AIGame[]>>
  async getAIGameById(id: string): Promise<ApiResponse<AIGame>>
  async getAIGamesBySubtopic(subtopicId: string): Promise<ApiResponse<AIGame[]>>
  async generateAIGame(subtopicId: string, request: GameGenerationRequest): Promise<ApiResponse<AIGame>>
  async playAIGame(id: string): Promise<ApiResponse<AIGame>>
  async getPopularGames(limit?: number): Promise<ApiResponse<AIGame[]>>
  async getGameStatistics(): Promise<ApiResponse<any>>
}
```

### **Fase 2: Componentes de Juegos**

#### 2.1 Componente GamePlayer
```typescript
// components/games/game-player.tsx
export function GamePlayer({ 
  gameId, 
  subtopicId, 
  onComplete, 
  onClose 
}: GamePlayerProps) {
  // Renderiza el HTML del juego en un iframe seguro
  // Maneja comunicación con el juego
  // Tracking de progreso y tiempo
}
```

#### 2.2 Componente GameLibrary
```typescript
// components/games/game-library.tsx
export function GameLibrary({ 
  subtopicId, 
  difficulty, 
  onGameSelect 
}: GameLibraryProps) {
  // Lista de juegos disponibles
  // Filtros por tipo y dificultad
  // Generación de nuevos juegos
}
```

#### 2.3 Componente GameGenerator
```typescript
// components/games/game-generator.tsx
export function GameGenerator({ 
  subtopicId, 
  onGameGenerated 
}: GameGeneratorProps) {
  // Interfaz para generar juegos
  // Selección de tipo y dificultad
  // Preview del juego generado
}
```

### **Fase 3: Integración en CoursePlayer**

#### 3.1 Nueva Tab "Juegos"
```typescript
// components/pages/course-player.tsx
<Tabs>
  <TabsList>
    <TabsTrigger value="overview">Resumen</TabsTrigger>
    <TabsTrigger value="content">Contenido</TabsTrigger>
    <TabsTrigger value="games">🎮 Juegos</TabsTrigger> {/* NUEVO */}
    <TabsTrigger value="resources">Recursos</TabsTrigger>
    <TabsTrigger value="ai-feedback">IA Feedback</TabsTrigger>
  </TabsList>
  
  <TabsContent value="games">
    <GameLibrary 
      subtopicId={currentModule?.id} 
      onGameSelect={handleGameSelect}
    />
  </TabsContent>
</Tabs>
```

#### 3.2 Modal de Juego
```typescript
// Modal fullscreen para jugar
<Dialog open={isGameOpen} onOpenChange={setIsGameOpen}>
  <DialogContent className="max-w-full h-full">
    <GamePlayer 
      gameId={selectedGame?.id}
      onComplete={handleGameComplete}
      onClose={() => setIsGameOpen(false)}
    />
  </DialogContent>
</Dialog>
```

### **Fase 4: Dashboard de Estudiante**

#### 4.1 Sección de Juegos
```typescript
// components/pages/student-dashboard.tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      🎮 Juegos Educativos
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {popularGames.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  </CardContent>
</Card>
```

#### 4.2 Estadísticas de Juegos
```typescript
// Agregar métricas de juegos
const gameStats = {
  gamesPlayed: 15,
  favoriteType: 'quiz',
  totalTimeSpent: 120, // minutos
  averageScore: 85
}
```

### **Fase 5: Dashboard de Profesor**

#### 5.1 Generador de Juegos
```typescript
// components/pages/teacher-dashboard.tsx
<Card>
  <CardHeader>
    <CardTitle>🎮 Crear Juegos para Estudiantes</CardTitle>
  </CardHeader>
  <CardContent>
    <GameGenerator 
      subtopicId={selectedSubtopic}
      onGameGenerated={handleNewGame}
    />
  </CardContent>
</Card>
```

#### 5.2 Analytics de Juegos
```typescript
// Estadísticas de uso de juegos por estudiantes
<Card>
  <CardHeader>
    <CardTitle>📊 Analytics de Juegos</CardTitle>
  </CardHeader>
  <CardContent>
    <GameAnalytics courseId={courseId} />
  </CardContent>
</Card>
```

## 🛠️ **Implementación Técnica**

### **Estructura de Archivos**
```
arandu-platform/
├── components/
│   ├── games/
│   │   ├── game-player.tsx          # Reproductor de juegos
│   │   ├── game-library.tsx         # Biblioteca de juegos
│   │   ├── game-generator.tsx       # Generador de juegos
│   │   ├── game-card.tsx           # Tarjeta de juego
│   │   ├── game-analytics.tsx      # Analytics de juegos
│   │   └── game-types.tsx          # Tipos de juegos
│   └── ui/
│       └── game-iframe.tsx         # Iframe seguro para juegos
├── lib/
│   ├── game-service.ts             # Servicio de juegos
│   └── game-adapter.ts             # Adaptador de datos
└── app/
    └── games/
        ├── page.tsx                # Página principal de juegos
        ├── [id]/
        │   └── page.tsx           # Página individual de juego
        └── generate/
            └── page.tsx           # Página de generación
```

### **Seguridad del Iframe**
```typescript
// components/ui/game-iframe.tsx
export function GameIframe({ htmlContent, onMessage }: GameIframeProps) {
  return (
    <iframe
      srcDoc={htmlContent}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full border-0"
      onLoad={handleLoad}
    />
  );
}
```

### **Comunicación Juego ↔ Frontend**
```typescript
// Protocolo de mensajes
interface GameMessage {
  type: 'GAME_STARTED' | 'GAME_COMPLETED' | 'SCORE_UPDATE' | 'TIME_UPDATE';
  payload: {
    score?: number;
    timeSpent?: number;
    completed?: boolean;
    progress?: number;
  };
}

// En el juego (HTML)
window.parent.postMessage({
  type: 'GAME_COMPLETED',
  payload: { score: 85, timeSpent: 300, completed: true }
}, '*');

// En el frontend
useEffect(() => {
  const handleMessage = (event: MessageEvent<GameMessage>) => {
    if (event.data.type === 'GAME_COMPLETED') {
      handleGameComplete(event.data.payload);
    }
  };
  
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

## 🎨 **UX/UI Design**

### **Game Card Design**
```typescript
<Card className="group hover:shadow-lg transition-all duration-300">
  <CardHeader className="pb-2">
    <div className="flex items-center justify-between">
      <Badge variant="secondary">{game.gameType}</Badge>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        {game.estimatedTime}min
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <h3 className="font-semibold mb-2">{game.title}</h3>
    <p className="text-sm text-muted-foreground mb-4">
      {game.description}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="text-sm">{game.playCount}</span>
        </div>
        <Badge variant={getDifficultyVariant(game.difficulty)}>
          {game.difficulty}
        </Badge>
      </div>
      <Button size="sm" onClick={() => onPlay(game)}>
        <Play className="w-4 h-4 mr-1" />
        Jugar
      </Button>
    </div>
  </CardContent>
</Card>
```

### **Game Generator UI**
```typescript
<Card>
  <CardHeader>
    <CardTitle>🎮 Generar Nuevo Juego</CardTitle>
    <CardDescription>
      Crea un juego educativo personalizado para este tema
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Tipo de Juego</Label>
      <Select value={gameType} onValueChange={setGameType}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar tipo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="adaptive">🧠 Automático (IA decide)</SelectItem>
          <SelectItem value="quiz">❓ Quiz</SelectItem>
          <SelectItem value="wordsearch">🔤 Sopa de Letras</SelectItem>
          <SelectItem value="memory">🧠 Memoria</SelectItem>
          <SelectItem value="puzzle">🧩 Rompecabezas</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div>
      <Label>Dificultad</Label>
      <RadioGroup value={difficulty} onValueChange={setDifficulty}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="easy" id="easy" />
          <Label htmlFor="easy">🟢 Fácil</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="medium" id="medium" />
          <Label htmlFor="medium">🟡 Medio</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hard" id="hard" />
          <Label htmlFor="hard">🔴 Difícil</Label>
        </div>
      </RadioGroup>
    </div>
    
    <Button 
      onClick={handleGenerate} 
      disabled={isGenerating}
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Generar Juego
        </>
      )}
    </Button>
  </CardContent>
</Card>
```

## 📱 **Responsive Design**

### **Mobile-First Approach**
```typescript
// Adaptación móvil
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {games.map(game => (
    <GameCard key={game.id} game={game} />
  ))}
</div>

// Game Player móvil
<Dialog>
  <DialogContent className="max-w-full h-full p-0 sm:p-6">
    <div className="h-full flex flex-col">
      <DialogHeader className="px-4 py-2 sm:px-0">
        <DialogTitle>{game.title}</DialogTitle>
      </DialogHeader>
      <div className="flex-1 overflow-hidden">
        <GameIframe htmlContent={game.htmlContent} />
      </div>
    </div>
  </DialogContent>
</Dialog>
```

## 🚀 **Plan de Implementación**

### **Sprint 1: Fundación (2-3 días)**
1. ✅ Extender `lib/api.ts` con métodos AIGame
2. ✅ Crear tipos TypeScript
3. ✅ Implementar `GameIframe` component
4. ✅ Crear `GameCard` component básico

### **Sprint 2: Componentes Core (3-4 días)**
1. ✅ Implementar `GamePlayer` component
2. ✅ Crear `GameLibrary` component
3. ✅ Desarrollar `GameGenerator` component
4. ✅ Integrar en `CoursePlayer`

### **Sprint 3: Dashboards (2-3 días)**
1. ✅ Agregar sección de juegos en `StudentDashboard`
2. ✅ Implementar generador en `TeacherDashboard`
3. ✅ Crear analytics básicos
4. ✅ Testing y refinamiento

### **Sprint 4: Polish & Deploy (1-2 días)**
1. ✅ Responsive design
2. ✅ Optimizaciones de rendimiento
3. ✅ Testing completo
4. ✅ Deploy y documentación

## 🎯 **Puntos Clave de Integración**

1. **Reutilizar infraestructura existente**: API service, auth, routing
2. **Mantener consistencia UI**: Usar componentes shadcn/ui existentes
3. **Seguridad**: Iframe sandboxed para juegos HTML
4. **Performance**: Lazy loading de juegos, cache de datos
5. **UX**: Transiciones suaves, feedback visual, mobile-friendly

**¡Esta estrategia aprovecha al máximo la infraestructura existente mientras agrega la funcionalidad de juegos de manera orgánica! 🎮✨**
