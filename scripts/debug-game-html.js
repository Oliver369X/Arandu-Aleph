#!/usr/bin/env node

/**
 * 🕵️ Debug: Ver el HTML completo de un juego
 * Para entender por qué las opciones del quiz no se muestran
 */

const API_BASE = 'http://localhost:3001/api-v1';
const fs = require('fs');
const path = require('path');

async function getGameHTML(gameId) {
  console.log(`\n🔍 Obteniendo HTML del juego: ${gameId}`);
  console.log('=' .repeat(60));
  
  try {
    const response = await fetch(`${API_BASE}/ai-games/${gameId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const game = await response.json();
    
    console.log('✅ Juego obtenido:');
    console.log(`   📌 ID: ${game.id}`);
    console.log(`   📝 Título: ${game.title}`);
    console.log(`   🎮 Tipo: ${game.gameType}`);
    console.log(`   🤖 Agente: ${game.agentType}`);
    console.log(`   📏 HTML Size: ${game.htmlContent ? game.htmlContent.length : 0} chars`);
    
    if (!game.htmlContent) {
      console.error('❌ No hay htmlContent en el juego');
      return;
    }
    
    // Análisis del contenido HTML
    const html = game.htmlContent;
    console.log('\n🔬 ANÁLISIS DEL HTML:');
    console.log(`   📄 Tamaño total: ${html.length} caracteres`);
    console.log(`   🏷️ Contiene <div>: ${html.includes('<div>') ? '✅' : '❌'}`);
    console.log(`   🏷️ Contiene <button>: ${html.includes('<button>') ? '✅' : '❌'}`);
    console.log(`   🏷️ Contiene <input>: ${html.includes('<input>') ? '✅' : '❌'}`);
    console.log(`   🏷️ Contiene "option": ${html.includes('option') ? '✅' : '❌'}`);
    console.log(`   🏷️ Contiene "answer": ${html.includes('answer') ? '✅' : '❌'}`);
    console.log(`   🏷️ Contiene "choice": ${html.includes('choice') ? '✅' : '❌'}`);
    console.log(`   🎨 Contiene CSS <style>: ${html.includes('<style>') ? '✅' : '❌'}`);
    console.log(`   📜 Contiene JavaScript <script>: ${html.includes('<script>') ? '✅' : '❌'}`);
    
    // Buscar elementos específicos del quiz
    const questionMatches = html.match(/pregunta|question/gi) || [];
    const optionMatches = html.match(/opci[óo]n|option|respuesta|answer/gi) || [];
    const buttonMatches = html.match(/<button[^>]*>/gi) || [];
    const inputMatches = html.match(/<input[^>]*>/gi) || [];
    
    console.log('\n📊 ELEMENTOS ENCONTRADOS:');
    console.log(`   ❓ Menciones "pregunta/question": ${questionMatches.length}`);
    console.log(`   📝 Menciones "opción/answer": ${optionMatches.length}`);
    console.log(`   🔘 Elementos <button>: ${buttonMatches.length}`);
    console.log(`   📝 Elementos <input>: ${inputMatches.length}`);
    
    if (buttonMatches.length > 0) {
      console.log('\n🔘 BOTONES ENCONTRADOS:');
      buttonMatches.slice(0, 5).forEach((btn, i) => {
        console.log(`   ${i + 1}. ${btn.substring(0, 100)}...`);
      });
    }
    
    if (inputMatches.length > 0) {
      console.log('\n📝 INPUTS ENCONTRADOS:');
      inputMatches.slice(0, 5).forEach((input, i) => {
        console.log(`   ${i + 1}. ${input.substring(0, 100)}...`);
      });
    }
    
    // Guardar el HTML completo para inspección
    const outputDir = path.join(__dirname, '..', 'debug-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, `game-${gameId}.html`);
    fs.writeFileSync(outputFile, html, 'utf8');
    console.log(`\n💾 HTML completo guardado en: ${outputFile}`);
    
    // Crear una versión de debug con estilos visibles
    const debugHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debug: ${game.title}</title>
    <style>
        /* Estilos de debugging para hacer visible todo */
        * {
            border: 1px dashed #ccc !important;
            background: rgba(255, 0, 0, 0.1) !important;
            color: #000 !important;
            margin: 2px !important;
            padding: 5px !important;
        }
        
        body {
            background: #fff !important;
            color: #000 !important;
            font-family: Arial, sans-serif !important;
        }
        
        button {
            background: #4CAF50 !important;
            color: white !important;
            border: 2px solid #000 !important;
            padding: 10px !important;
            margin: 5px !important;
            cursor: pointer !important;
            display: block !important;
        }
        
        input {
            background: #fff !important;
            color: #000 !important;
            border: 2px solid #000 !important;
            padding: 5px !important;
            margin: 5px !important;
        }
        
        .hidden {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
    </style>
</head>
<body>
    <div style="background: yellow; padding: 20px; color: black;">
        <h1>🔍 DEBUG MODE - ${game.title}</h1>
        <p>Este HTML ha sido modificado para mostrar todos los elementos visibles</p>
    </div>
    
    <div style="border: 3px solid red; margin: 10px;">
        <h2>CONTENIDO ORIGINAL DEL JUEGO:</h2>
        ${html}
    </div>
    
    <script>
        console.log('🐞 Debug Mode: Haciendo todos los elementos visibles');
        
        // Forzar visibilidad de todos los elementos
        setTimeout(() => {
            document.querySelectorAll('*').forEach(el => {
                const computed = window.getComputedStyle(el);
                if (computed.display === 'none') {
                    el.style.display = 'block';
                    console.log('Mostrando elemento oculto:', el);
                }
                if (computed.visibility === 'hidden') {
                    el.style.visibility = 'visible';
                    console.log('Haciendo visible elemento:', el);
                }
                if (computed.opacity === '0' || computed.opacity < 0.1) {
                    el.style.opacity = '1';
                    console.log('Aumentando opacidad:', el);
                }
            });
        }, 100);
    </script>
</body>
</html>
    `;
    
    const debugFile = path.join(outputDir, `game-${gameId}-debug.html`);
    fs.writeFileSync(debugFile, debugHtml, 'utf8');
    console.log(`🐞 Versión debug guardada en: ${debugFile}`);
    
    // Extraer snippet del contenido para mostrar
    console.log('\n📄 SNIPPET DEL HTML:');
    console.log('=' .repeat(40));
    console.log(html.substring(0, 1000) + '...');
    console.log('=' .repeat(40));
    
    return game;
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    return null;
  }
}

async function main() {
  // Usar el ID del juego que sabemos que existe
  const gameId = process.argv[2] || 'a2bc8458-7c71-4b03-8b3c-656e30ba30cf';
  
  console.log('🕵️ GAME HTML DEBUGGER');
  console.log(`🎯 Analizando juego: ${gameId}`);
  
  const game = await getGameHTML(gameId);
  
  if (game) {
    console.log('\n✅ Análisis completado');
    console.log('💡 Para ver el juego en modo debug, abre el archivo game-XXX-debug.html');
    console.log('📁 Los archivos están en: debug-output/');
  } else {
    console.log('\n❌ No se pudo analizar el juego');
  }
}

if (require.main === module) {
  main().catch(console.error);
}
