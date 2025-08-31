"use client"

import { useEffect, useRef, useState, useMemo } from 'react'
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
  isFullscreen?: boolean;
}

export function GameIframe({ 
  htmlContent, 
  onMessage, 
  onLoad,
  className = "w-full h-full border-0 rounded-lg",
  isFullscreen = false
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
    console.log('🎮 [GameIframe] Iframe cargado completamente');
    setIsLoading(false);
    setError(null);
    onLoad?.();
    
    // Debug: Verificar contenido del iframe
    setTimeout(() => {
      if (iframeRef.current?.contentDocument) {
        const doc = iframeRef.current.contentDocument;
        console.log('🔍 [GameIframe] Contenido del iframe:', {
          title: doc.title,
          bodyContent: doc.body?.innerHTML?.substring(0, 200) + '...',
          hasScripts: doc.querySelectorAll('script').length,
          hasErrors: doc.querySelector('.error') !== null
        });
      }
    }, 1000);
    
    // Enviar mensaje de inicialización al juego
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage({
          type: 'PARENT_READY',
          payload: { timestamp: Date.now() }
        }, '*');
        console.log('📤 [GameIframe] Mensaje PARENT_READY enviado al juego');
      } catch (error) {
        console.error('🎮 [GameIframe] Error enviando mensaje de inicialización:', error);
      }
    }
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Error al cargar el juego');
  };

  // Procesar HTML de manera optimizada con memoización
  const processedHtml = useMemo(() => {
    // Verificar que htmlContent existe y no es undefined
    if (!htmlContent || typeof htmlContent !== 'string') {
      console.warn('🚨 [GameIframe] htmlContent es undefined o no válido');
      return '<html><body><div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;">⚠️ Contenido de juego no disponible</div></body></html>';
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 [GameIframe] Procesando HTML...', {
        originalSize: Math.round(htmlContent.length / 1024) + 'KB',
        hasViewport: htmlContent.includes('viewport'),
        hasBodyStyles: htmlContent.includes('margin:0') || htmlContent.includes('overflow:hidden'),
      });
    }
    
    let html = htmlContent;
    
    // Solo agregar viewport si no existe
    if (!html.includes('viewport')) {
      html = html.replace(
        '<head>',
        '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">'
      );
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [GameIframe] Viewport agregado');
      }
    }
    
    // Agregar estilos completos para ocupar toda la pantalla
    const fullScreenStyles = `
      <style>
        * { box-sizing: border-box; }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background: transparent !important;
        }
        body > div:first-child,
        body > main:first-child,
        body > section:first-child,
        .game-container,
        .quiz-container,
        .quiz,
        [class*="container"],
        [class*="wrapper"] {
          width: 100% !important;
          height: 100vh !important;
          min-height: 100vh !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 20px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }
        ${isFullscreen ? `
          body > * {
            font-size: 1.2em !important;
          }
          .question {
            font-size: 1.4em !important;
            margin-bottom: 30px !important;
          }
          .options {
            gap: 15px !important;
          }
          .option {
            padding: 15px 25px !important;
            font-size: 1.1em !important;
            min-height: 60px !important;
          }
          .progress-bar {
            height: 8px !important;
            font-size: 1em !important;
          }
          .score, .timer {
            font-size: 1.3em !important;
            font-weight: bold !important;
          }
        ` : ''}
      </style>
    `;
    
    // Insertar estilos después del head
    if (html.includes('</head>')) {
      html = html.replace('</head>', fullScreenStyles + '</head>');
    } else if (html.includes('<head>')) {
      html = html.replace('<head>', '<head>' + fullScreenStyles);
    } else {
      html = fullScreenStyles + html;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [GameIframe] Estilos de pantalla completa agregados');
    }
    
    // Agregar script para comunicación con el parent (optimizado)
    const communicationScript = `
      <script>
        // Sistema de comunicación optimizado
        (function() {
          let isReady = false;
          
          function sendMessageToParent(type, payload) {
            if (window.parent && window.parent !== window) {
              try {
                window.parent.postMessage({ type, payload }, '*');
              } catch (error) {
                console.error('[Game] Error enviando mensaje:', error);
              }
            }
          }
          
          function notifyReady() {
            if (!isReady) {
              isReady = true;
              sendMessageToParent('GAME_READY', { timestamp: Date.now() });
            }
          }
          
          // Múltiples listeners para asegurar notificación
          if (document.readyState === 'complete') {
            setTimeout(notifyReady, 100);
          } else {
            window.addEventListener('load', () => setTimeout(notifyReady, 100));
          }
          
          // Listener para mensajes del parent
          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'PARENT_READY') {
              console.log('[Game] Parent listo');
            }
          });
          
          // Prevenir interacciones no deseadas
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('selectstart', e => e.preventDefault());
          
          // Función para forzar ocupar toda la pantalla
          function forceFullSize() {
            const html = document.documentElement;
            const body = document.body;
            
            // Forzar tamaños en html y body
            html.style.cssText = 'width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important;';
            body.style.cssText = 'width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important;background:transparent!important;';
            
            // Encontrar el contenedor principal del juego
            const containers = [
              document.querySelector('.game-container'),
              document.querySelector('.quiz-container'),
              document.querySelector('.quiz'),
              document.querySelector('[class*="container"]'),
              document.querySelector('[class*="wrapper"]'),
              body.firstElementChild
            ].filter(Boolean);
            
            containers.forEach(container => {
              if (container && container.tagName !== 'SCRIPT') {
                container.style.cssText += 'width:100%!important;height:100vh!important;min-height:100vh!important;max-width:none!important;margin:0!important;padding:20px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;';
              }
            });
            
            console.log('[Game] Tamaño forzado aplicado');
          }
          
          // Aplicar después de que el DOM esté listo
          if (document.readyState === 'complete') {
            setTimeout(forceFullSize, 100);
          } else {
            window.addEventListener('load', () => {
              setTimeout(forceFullSize, 100);
              // Re-aplicar después de un tiempo para asegurar
              setTimeout(forceFullSize, 1000);
            });
          }
          
          // Re-aplicar cuando se redimensiona
          window.addEventListener('resize', forceFullSize);
          
          // API global para el juego
          window.gameAPI = {
            sendMessage: sendMessageToParent,
            notifyStart: () => sendMessageToParent('GAME_STARTED', {}),
            notifyComplete: (data) => sendMessageToParent('GAME_COMPLETED', data),
            updateScore: (score) => sendMessageToParent('SCORE_UPDATE', { score }),
            forceFullSize: forceFullSize
          };
        })();
      </script>
      </body>`;
    
    return html.replace('</body>', communicationScript);
  }, [htmlContent]);

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
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-presentation"
        onLoad={handleLoad}
        onError={handleError}
        title="Juego Educativo"
        style={{
          border: 'none',
          background: 'transparent',
          borderRadius: isFullscreen ? '0' : undefined,
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
      />
    </div>
  );
}
