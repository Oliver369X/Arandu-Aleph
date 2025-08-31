"use client"

import { useState, useEffect } from 'react';
import { AIGame } from '@/lib/api';

interface GameManifest {
  generatedAt: string;
  version: string;
  games: HTMLGameInfo[];
}

interface HTMLGameInfo {
  id: string;
  title: string;
  description: string;
  gameType: string;
  difficulty: string;
  estimatedTime: number;
  subject: string;
  subtopic: string;
  path: string;
  processed: boolean;
}

interface UseHTMLGamesReturn {
  games: AIGame[];
  manifest: GameManifest | null;
  isLoading: boolean;
  error: string | null;
  loadGame: (gameId: string) => Promise<AIGame | null>;
  refreshGames: () => void;
}

export function useHTMLGames(): UseHTMLGamesReturn {
  const [games, setGames] = useState<AIGame[]>([]);
  const [manifest, setManifest] = useState<GameManifest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadManifest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🎮 [useHTMLGames] Cargando manifest de juegos HTML...');
      
      const response = await fetch('/games/games-manifest.json');
      
      if (!response.ok) {
        throw new Error(`Error cargando manifest: ${response.status}`);
      }
      
      const manifestData: GameManifest = await response.json();
      console.log(`📋 [useHTMLGames] Manifest cargado: ${manifestData.games.length} juegos`);
      
      setManifest(manifestData);
      
      // Convertir juegos HTML a formato AIGame
      const aiGames: AIGame[] = manifestData.games.map(htmlGame => ({
        id: htmlGame.id,
        title: htmlGame.title,
        description: htmlGame.description,
        gameType: htmlGame.gameType as any,
        difficulty: htmlGame.difficulty as any,
        estimatedTime: htmlGame.estimatedTime,
        subtopicId: 'html-game-' + htmlGame.id,
        isActive: true,
        agentType: 'specialized',
        playCount: 0,
        createdAt: manifestData.generatedAt,
        htmlContent: '', // Se carga bajo demanda
        subtopic: {
          id: 'html-subtopic-' + htmlGame.id,
          name: htmlGame.subtopic,
          description: htmlGame.description,
          subjectId: 'html-subject-' + htmlGame.subject.toLowerCase(),
          subject: {
            id: 'html-subject-' + htmlGame.subject.toLowerCase(),
            name: htmlGame.subject
          }
        }
      }));
      
      setGames(aiGames);
      console.log(`✅ [useHTMLGames] ${aiGames.length} juegos HTML convertidos a formato AIGame`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ [useHTMLGames] Error cargando juegos HTML:', errorMessage);
      setError(errorMessage);
      setGames([]);
      setManifest(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGame = async (gameId: string): Promise<AIGame | null> => {
    try {
      console.log(`🎮 [useHTMLGames] Cargando contenido del juego: ${gameId}`);
      
      if (!manifest) {
        throw new Error('Manifest no cargado');
      }
      
      const htmlGameInfo = manifest.games.find(g => g.id === gameId);
      if (!htmlGameInfo) {
        throw new Error(`Juego ${gameId} no encontrado en manifest`);
      }
      
      // Cargar el HTML del juego
      const gameResponse = await fetch(`/${htmlGameInfo.path}`);
      if (!gameResponse.ok) {
        throw new Error(`Error cargando juego ${gameId}: ${gameResponse.status}`);
      }
      
      const htmlContent = await gameResponse.text();
      console.log(`📄 [useHTMLGames] Contenido HTML cargado para ${gameId}: ${Math.round(htmlContent.length / 1024)}KB`);
      
      // Actualizar el juego en el estado con el contenido HTML
      const gameWithContent = games.find(g => g.id === gameId);
      if (gameWithContent) {
        const updatedGame = { ...gameWithContent, htmlContent };
        
        // Actualizar en el estado
        setGames(prev => prev.map(g => g.id === gameId ? updatedGame : g));
        
        return updatedGame;
      }
      
      return null;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error(`❌ [useHTMLGames] Error cargando juego ${gameId}:`, errorMessage);
      return null;
    }
  };

  const refreshGames = () => {
    loadManifest();
  };

  useEffect(() => {
    loadManifest();
  }, []);

  return {
    games,
    manifest,
    isLoading,
    error,
    loadGame,
    refreshGames
  };
}
