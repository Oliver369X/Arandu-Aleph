#!/usr/bin/env node

// Script para integrar juegos HTML existentes en el sistema

const fs = require('fs');
const path = require('path');

const GAMES_DIR = path.join(__dirname, '../../SchoolAI/src/components/AIGame/examples/juegos');
const OUTPUT_DIR = path.join(__dirname, '../public/games');

// Mapeo de juegos existentes
const existingGames = [
  {
    file: 'Ethereum Learning.html',
    title: 'Aventura Ethereum',
    description: 'Aprende sobre blockchain y Ethereum en un mundo 3D interactivo',
    gameType: 'threejs',
    difficulty: 'medium',
    estimatedTime: 15,
    subject: 'Blockchain',
    subtopic: 'Ethereum Básico'
  },
  {
    file: 'fotosintesis.html', 
    title: 'Laboratorio de Fotosíntesis',
    description: 'Experimenta con la fotosíntesis en un laboratorio virtual 3D',
    gameType: 'threejs',
    difficulty: 'easy',
    estimatedTime: 12,
    subject: 'Biología',
    subtopic: 'Fotosíntesis'
  },
  {
    file: 'gameAI.html',
    title: 'Aventura de Aprendizaje con IA',
    description: 'Enseña a un robot amigo sobre inteligencia artificial',
    gameType: 'threejs', 
    difficulty: 'medium',
    estimatedTime: 20,
    subject: 'Inteligencia Artificial',
    subtopic: 'Conceptos Básicos de IA'
  },
  {
    file: 'gameBlokchin.html',
    title: 'Explorador de Blockchain',
    description: 'Descubre cómo funciona la tecnología blockchain',
    gameType: 'quiz',
    difficulty: 'medium', 
    estimatedTime: 10,
    subject: 'Blockchain',
    subtopic: 'Fundamentos de Blockchain'
  },
  {
    file: 'sopo_letra.html',
    title: 'Sopa de Letras Educativa',
    description: 'Encuentra palabras relacionadas con el tema de estudio',
    gameType: 'wordsearch',
    difficulty: 'easy',
    estimatedTime: 8,
    subject: 'General',
    subtopic: 'Vocabulario'
  }
];

console.log('🎮 [IntegrateGames] Iniciando integración de juegos HTML...\n');

async function processGame(gameInfo) {
  const sourceFile = path.join(GAMES_DIR, gameInfo.file);
  const targetFile = path.join(OUTPUT_DIR, gameInfo.file);
  
  console.log(`📄 Procesando: ${gameInfo.title}`);
  
  if (!fs.existsSync(sourceFile)) {
    console.log(`   ❌ Archivo no encontrado: ${sourceFile}`);
    return null;
  }
  
  try {
    // Leer el archivo HTML
    let htmlContent = fs.readFileSync(sourceFile, 'utf8');
    console.log(`   📊 Tamaño original: ${Math.round(htmlContent.length / 1024)}KB`);
    
    // Procesar el HTML para compatibilidad con iframe
    htmlContent = processHTMLForIframe(htmlContent, gameInfo);
    
    // Crear directorio de salida si no existe
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Escribir archivo procesado
    fs.writeFileSync(targetFile, htmlContent);
    console.log(`   ✅ Procesado y guardado: ${targetFile}`);
    console.log(`   📊 Tamaño final: ${Math.round(htmlContent.length / 1024)}KB\n`);
    
    return {
      ...gameInfo,
      htmlContent,
      processed: true,
      path: `games/${gameInfo.file}`
    };
    
  } catch (error) {
    console.log(`   ❌ Error procesando ${gameInfo.file}:`, error.message);
    return null;
  }
}

function processHTMLForIframe(html, gameInfo) {
  let processed = html;
  
  console.log('   🔧 Aplicando mejoras de compatibilidad...');
  
  // 1. Agregar viewport si no existe
  if (!processed.includes('viewport')) {
    processed = processed.replace(
      /<head>/i,
      '<head>\\n<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">'
    );
    console.log('   ✅ Viewport agregado');
  }
  
  // 2. Agregar estilos para iframe
  if (!processed.includes('margin:0') && !processed.includes('overflow:hidden')) {
    processed = processed.replace(
      /<body([^>]*)>/i,
      '<body$1 style="margin:0;padding:0;overflow:hidden;">'
    );
    console.log('   ✅ Estilos de body agregados');
  }
  
  // 3. Agregar script de comunicación con parent
  const communicationScript = `
<script>
  // Sistema de comunicación con parent frame
  function sendMessageToParent(type, payload) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type, payload }, '*');
        console.log('📤 [Game] Mensaje enviado al parent:', type, payload);
      }
    } catch (error) {
      console.error('❌ [Game] Error enviando mensaje al parent:', error);
    }
  }
  
  // Notificar que el juego está listo
  window.addEventListener('load', function() {
    setTimeout(function() {
      sendMessageToParent('GAME_READY', { 
        timestamp: Date.now(),
        title: '${gameInfo.title}',
        gameType: '${gameInfo.gameType}'
      });
    }, 1000);
  });
  
  // Escuchar mensajes del parent
  window.addEventListener('message', function(event) {
    if (event.data.type === 'PARENT_READY') {
      console.log('✅ [Game] Parent frame está listo');
    }
  });
  
  // Sistema de eventos de juego personalizable
  let gameStarted = false;
  let gameScore = 0;
  let gameStartTime = Date.now();
  
  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      gameStartTime = Date.now();
      sendMessageToParent('GAME_STARTED', { timestamp: gameStartTime });
    }
  }
  
  function updateScore(score) {
    gameScore = score;
    sendMessageToParent('SCORE_UPDATE', { score: gameScore });
  }
  
  function completeGame(finalScore = null) {
    const timeSpent = Math.floor((Date.now() - gameStartTime) / 1000);
    sendMessageToParent('GAME_COMPLETED', { 
      score: finalScore || gameScore,
      timeSpent: timeSpent,
      completed: true,
      progress: 100
    });
  }
  
  // Auto-detección de eventos comunes
  document.addEventListener('click', function() {
    if (!gameStarted) startGame();
  });
  
  document.addEventListener('keydown', function() {
    if (!gameStarted) startGame();
  });
  
  // Prevenir context menu y selección
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
  document.addEventListener('selectstart', function(e) { e.preventDefault(); });
  
  // Exponer funciones globalmente para uso en juegos
  window.gameAPI = {
    start: startGame,
    updateScore: updateScore,
    complete: completeGame,
    sendMessage: sendMessageToParent
  };
  
  console.log('🎮 [Game] Sistema de comunicación inicializado');
</script>`;
  
  // Insertar antes del cierre de body
  processed = processed.replace(
    /<\/body>/i,
    communicationScript + '\\n</body>'
  );
  
  console.log('   ✅ Script de comunicación agregado');
  
  // 4. Optimizar tamaño si es muy grande
  if (processed.length > 500000) { // > 500KB
    console.log('   ⚠️ Archivo muy grande, aplicando optimizaciones...');
    
    // Minificar comentarios largos
    processed = processed.replace(/<!--[\s\S]*?-->/g, '');
    
    // Minificar espacios en blanco excesivos
    processed = processed.replace(/\s+/g, ' ');
    
    console.log('   ✅ Optimizaciones aplicadas');
  }
  
  return processed;
}

async function generateGameManifest(processedGames) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    games: processedGames.filter(game => game !== null).map(game => ({
      id: game.file.replace('.html', ''),
      title: game.title,
      description: game.description, 
      gameType: game.gameType,
      difficulty: game.difficulty,
      estimatedTime: game.estimatedTime,
      subject: game.subject,
      subtopic: game.subtopic,
      path: game.path,
      processed: game.processed
    }))
  };
  
  const manifestPath = path.join(OUTPUT_DIR, 'games-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`📋 Manifest generado: ${manifestPath}`);
  console.log(`📊 Total de juegos procesados: ${manifest.games.length}`);
  
  return manifest;
}

async function main() {
  console.log(`📁 Directorio de juegos: ${GAMES_DIR}`);
  console.log(`📁 Directorio de salida: ${OUTPUT_DIR}\n`);
  
  // Verificar que existe el directorio de juegos
  if (!fs.existsSync(GAMES_DIR)) {
    console.log('❌ Directorio de juegos no encontrado:', GAMES_DIR);
    process.exit(1);
  }
  
  // Procesar cada juego
  const processedGames = [];
  
  for (const gameInfo of existingGames) {
    const result = await processGame(gameInfo);
    processedGames.push(result);
  }
  
  // Generar manifest
  const manifest = await generateGameManifest(processedGames);
  
  console.log('\n🎉 ¡Integración completada!');
  console.log('\n📋 Resumen:');
  manifest.games.forEach(game => {
    console.log(`   • ${game.title} (${game.gameType}) - ${game.difficulty}`);
  });
  
  console.log('\n💡 Próximos pasos:');
  console.log('   1. Los juegos están listos en public/games/');
  console.log('   2. El manifest está disponible para el sistema');
  console.log('   3. Los juegos incluyen comunicación parent-iframe');
  console.log('   4. Usa el manifest para cargar juegos dinámicamente');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processGame, generateGameManifest };
