#!/usr/bin/env node

/**
 * 🧪 Script para probar el endpoint de juegos
 * Ayuda a debuggear por qué la página /game/[id] no carga los juegos
 */

const API_BASE = 'http://localhost:3001/api-v1';

async function testGameEndpoint(gameId) {
  console.log('\n🔬 TESTING GAME ENDPOINT');
  console.log('=' .repeat(50));
  console.log(`🎯 Game ID: ${gameId}`);
  console.log(`🌐 Base URL: ${API_BASE}`);
  
  // Lista de endpoints a probar
  const endpoints = [
    `/ai-games/${gameId}`,
    `/ai-games/id/${gameId}`,
    `/games/${gameId}`,
    `/ai-games/${gameId}/play`,
    `/ai-games/${gameId}/details`
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing: ${API_BASE}${endpoint}`);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ SUCCESS!');
        console.log('   📦 Response structure:');
        console.log(`      - Type: ${typeof data}`);
        console.log(`      - Keys: ${Object.keys(data || {}).join(', ')}`);
        
        if (data && typeof data === 'object') {
          console.log('   📋 Data preview:');
          console.log(`      - ID: ${data.id || 'N/A'}`);
          console.log(`      - Title: ${data.title || 'N/A'}`);
          console.log(`      - Has htmlContent: ${!!data.htmlContent}`);
          console.log(`      - Success field: ${data.success}`);
          console.log(`      - Data field exists: ${!!data.data}`);
          
          if (data.data) {
            console.log('   📋 Nested data preview:');
            console.log(`      - Nested ID: ${data.data.id || 'N/A'}`);
            console.log(`      - Nested Title: ${data.data.title || 'N/A'}`);
            console.log(`      - Nested htmlContent: ${!!data.data.htmlContent}`);
          }
        }
        
        // Si encontramos uno que funciona, detallamos más
        if (data && (data.htmlContent || (data.data && data.data.htmlContent))) {
          console.log('\n🎉 ENDPOINT FUNCIONAL ENCONTRADO!');
          console.log(`   🔗 Usar: ${API_BASE}${endpoint}`);
          return { endpoint, data };
        }
        
      } else {
        console.log(`   ❌ Failed: ${response.status}`);
        try {
          const errorData = await response.text();
          console.log(`   📄 Error response: ${errorData.substring(0, 200)}`);
        } catch (e) {
          console.log('   📄 Could not read error response');
        }
      }
      
    } catch (error) {
      console.log(`   💥 Network error: ${error.message}`);
    }
  }
  
  console.log('\n❌ No se encontró un endpoint funcional');
  return null;
}

async function getAllGames() {
  console.log('\n📋 LISTING ALL GAMES');
  console.log('=' .repeat(30));
  
  const endpoints = [
    '/ai-games',
    '/ai-games/all',
    '/games',
    '/ai-games/list'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing list endpoint: ${API_BASE}${endpoint}`);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ SUCCESS!');
        
        if (Array.isArray(data)) {
          console.log(`   📊 Found ${data.length} games`);
          if (data.length > 0) {
            console.log('   🎮 First game:');
            console.log(`      - ID: ${data[0].id}`);
            console.log(`      - Title: ${data[0].title}`);
          }
        } else if (data && data.data && Array.isArray(data.data)) {
          console.log(`   📊 Found ${data.data.length} games in data field`);
          if (data.data.length > 0) {
            console.log('   🎮 First game:');
            console.log(`      - ID: ${data.data[0].id}`);
            console.log(`      - Title: ${data.data[0].title}`);
          }
        } else {
          console.log('   📦 Response structure:');
          console.log(`      - Type: ${typeof data}`);
          console.log(`      - Keys: ${Object.keys(data || {}).join(', ')}`);
        }
        
        return data;
      }
      
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
    }
  }
  
  return null;
}

async function testWithRecentGame() {
  console.log('\n🔍 TRYING TO FIND A RECENT GAME ID');
  console.log('=' .repeat(40));
  
  // Intentar obtener lista de juegos para usar un ID real
  const games = await getAllGames();
  
  if (games) {
    let gamesList = games;
    if (games.data && Array.isArray(games.data)) {
      gamesList = games.data;
    }
    
    if (Array.isArray(gamesList) && gamesList.length > 0) {
      const firstGame = gamesList[0];
      console.log(`\n🎯 Testing with real game ID: ${firstGame.id}`);
      return await testGameEndpoint(firstGame.id);
    }
  }
  
  return null;
}

async function main() {
  console.log('🚀 GAME ENDPOINT DEBUGGER');
  console.log('=' .repeat(60));
  console.log('Este script ayuda a debuggear por qué no cargan los juegos\n');
  
  // Obtener gameId del argumento o usar uno de prueba
  const gameId = process.argv[2];
  
  if (gameId) {
    console.log(`💡 Testing with provided Game ID: ${gameId}`);
    await testGameEndpoint(gameId);
  } else {
    console.log('💡 No Game ID provided, will try to find one...');
    await testWithRecentGame();
  }
  
  console.log('\n🔧 DEBUGGING TIPS:');
  console.log('- Asegúrate de que el backend esté corriendo en puerto 3001');
  console.log('- Verifica que la base de datos tenga juegos');
  console.log('- Revisa los logs del backend cuando hagas requests');
  console.log('- Usa las DevTools > Network tab para ver requests fallidos');
  console.log('\n💡 USO:');
  console.log('node scripts/test-game-endpoint.js [gameId]');
  console.log('node scripts/test-game-endpoint.js abc123-def456-789');
}

if (require.main === module) {
  main().catch(console.error);
}
