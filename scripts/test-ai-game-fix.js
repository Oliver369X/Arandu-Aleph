#!/usr/bin/env node

// Test específico para verificar AI Game generation y parsing

const BACKEND_URL = 'http://localhost:3001/api-v1';
const SUBTOPIC_ID = '46034048-7d5c-4bee-a7c3-0377e1097c61';

console.log('🎮 [TEST] Verificando AI Game generation y parsing...\n');

async function testAIGameStructure() {
  try {
    console.log('🔄 Generando juego AI...');
    const response = await fetch(`${BACKEND_URL}/ai-games/generate/${SUBTOPIC_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameType: 'adaptive',
        difficulty: 'medium', 
        customPrompt: 'Crear un juego educativo sobre: introducion a ai'
      })
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta del backend recibida');
      console.log('📋 Estructura:', JSON.stringify(data, null, 2).substring(0, 500) + '...');
      
      // Simular el parsing del frontend (ARREGLADO)
      if (data.success && data.data) {
        const newGame = data.data.game || data.data;
        
        console.log('\n🔍 ANÁLISIS DEL PARSING:');
        console.log(`📊 data.success: ${data.success}`);
        console.log(`📊 data.data existe: ${!!data.data}`);
        console.log(`📊 data.data.game existe: ${!!data.data.game}`);
        console.log(`📊 newGame será: ${newGame === data.data ? 'data.data' : 'data.data.game'}`);
        
        if (newGame && newGame.id && newGame.title) {
          console.log('\n🎉 ¡PARSING EXITOSO!');
          console.log(`📚 Juego: "${newGame.title}" (ID: ${newGame.id})`);
          console.log(`🎲 Tipo: ${newGame.gameType || 'No especificado'}`);
          console.log(`⭐ Dificultad: ${newGame.difficulty || 'No especificado'}`);
          
          console.log('\n✅ EL DASHBOARD DEBERÍA FUNCIONAR AHORA');
        } else {
          console.log('\n❌ PARSING FALLÓ - Faltan campos críticos');
          console.log(`📊 newGame.id: ${newGame?.id}`);
          console.log(`📊 newGame.title: ${newGame?.title}`);
        }
      } else {
        console.log('\n❌ ESTRUCTURA INESPERADA');
        console.log(`📊 data.success: ${data.success}`);
        console.log(`📊 data.data: ${!!data.data}`);
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error HTTP: ${response.status}`);
      console.log(`📄 Response: ${errorText.substring(0, 200)}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
}

async function runTest() {
  console.log('🚀 PROBANDO ARREGLO DEL AI GAME PARSING...\n');
  await testAIGameStructure();
  
  console.log('\n📋 RESUMEN:');
  console.log('Si el parsing fue exitoso, el problema del dashboard está completamente resuelto.');
  console.log('El frontend ahora debería mostrar correctamente tanto juegos como feedbacks.');
}

runTest().catch(console.error);
