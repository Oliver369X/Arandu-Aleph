"use client"

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

export interface GameMessage {
  type: 'GAME_STARTED' | 'GAME_COMPLETED' | 'SCORE_UPDATE' | 'TIME_UPDATE' | 'GAME_READY';
  payload: {
    score?: number;
    timeSpent?: number;
    completed?: boolean;
    progress?: number;
    data?: any;
  };
}

interface GameIframeProps {
  htmlContent: string;
  onMessage?: (message: GameMessage) => void;
  onLoad?: () => void;
  className?: string;
}

export function GameIframe({ 
  htmlContent, 
  onMessage, 
  onLoad,
  className = "w-full h-full border-0 rounded-lg"
}: GameIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar que el mensaje viene del iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      try {
        const message: GameMessage = event.data;
        
        // Validar estructura del mensaje
        if (message && typeof message === 'object' && message.type && message.payload) {
          console.log('🎮 [GameIframe] Mensaje recibido:', message);
          onMessage?.(message);
        }
      } catch (error) {
        console.error('🎮 [GameIframe] Error procesando mensaje:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onMessage]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
    onLoad?.();
    
    // Enviar mensaje de inicialización al juego
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: 'PARENT_READY',
          payload: { timestamp: Date.now() }
        }, '*');
      } catch (error) {
        console.error('🎮 [GameIframe] Error enviando mensaje de inicialización:', error);
      }
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Error al cargar el juego');
  };

  // Procesar el HTML para asegurar compatibilidad
  const processedHtml = htmlContent
    // Asegurar que el HTML tenga viewport meta tag para móviles
    .replace(
      '<head>',
      '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">'
    )
    // Agregar estilos para prevenir scroll en el iframe
    .replace(
      '<body',
      '<body style="margin:0;padding:0;overflow:hidden;"'
    )
    // Agregar script para comunicación con el parent
    .replace(
      '</body>',
      `
      <script>
        // Función para enviar mensajes al parent
        function sendMessageToParent(type, payload) {
          try {
            window.parent.postMessage({ type, payload }, '*');
          } catch (error) {
            console.error('Error enviando mensaje al parent:', error);
          }
        }
        
        // Notificar que el juego está listo
        window.addEventListener('load', function() {
          sendMessageToParent('GAME_READY', { timestamp: Date.now() });
        });
        
        // Escuchar mensajes del parent
        window.addEventListener('message', function(event) {
          if (event.data.type === 'PARENT_READY') {
            console.log('Parent está listo para recibir mensajes');
          }
        });
        
        // Prevenir context menu
        document.addEventListener('contextmenu', function(e) {
          e.preventDefault();
        });
        
        // Prevenir selección de texto
        document.addEventListener('selectstart', function(e) {
          e.preventDefault();
        });
      </script>
      </body>`
    );

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Cargando juego...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-center">
            <p className="text-destructive font-medium">⚠️ {error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor, intenta recargar el juego
            </p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        srcDoc={processedHtml}
        className={className}
        sandbox="allow-scripts allow-same-origin allow-forms"
        onLoad={handleLoad}
        onError={handleError}
        title="Juego Educativo"
        style={{
          border: 'none',
          background: 'transparent'
        }}
      />
    </div>
  );
}
