#!/usr/bin/env node

// Test de endpoints de AI para verificar que funcionen correctamente

const BACKEND_URL = 'http://localhost:3001/api-v1';
const SUBTOPIC_ID = '46034048-7d5c-4bee-a7c3-0377e1097c61'; // El subtopic de los logs

console.log('🧪 [TEST] Probando endpoints de AI...\n');
console.log(`🔗 Backend URL: ${BACKEND_URL}`);
console.log(`📄 Subtopic ID: ${SUBTOPIC_ID}\n`);

async function testAIGameGeneration() {
  console.log('1️⃣ PROBANDO AI GAME GENERATION...');
  
  try {
    const url = `${BACKEND_URL}/ai-games/generate/${SUBTOPIC_ID}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameType: 'adaptive',
        difficulty: 'medium',
        customPrompt: 'Crear un juego educativo sobre: introducion a ai'
      })
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Game generado correctamente');
      console.log('📄 Estructura de respuesta:', JSON.stringify(data, null, 2));
      
      // Verificar estructura esperada por el frontend
      if (data.success && data.data) {
        const game = data.data.game || data.data;
        if (game && game.id && game.title) {
          console.log('🎉 ESTRUCTURA COMPATIBLE CON FRONTEND');
          console.log(`📚 Juego creado: "${game.title}" (ID: ${game.id})`);
        } else {
          console.log('⚠️ ESTRUCTURA NO COMPATIBLE - Faltan campos id/title');
        }
      } else {
        console.log('⚠️ ESTRUCTURA NO COMPATIBLE - Falta success/data');
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${response.status}`);
      console.log(`📄 Response: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('\n---\n');
}

async function testAIFeedbackGeneration() {
  console.log('2️⃣ PROBANDO AI FEEDBACK GENERATION...');
  
  try {
    const url = `${BACKEND_URL}/ai-writing-assistant/generate-feedback/${SUBTOPIC_ID}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Feedback generado correctamente');
      console.log('📄 Estructura de respuesta:', JSON.stringify(data, null, 2));
      
      // Verificar que tenga los campos esperados
      if (data.success && data.data) {
        console.log('🎉 ESTRUCTURA COMPATIBLE CON FRONTEND');
        console.log(`📚 Feedback creado para: "${data.data.title || 'Subtopic'}"`);
      } else {
        console.log('⚠️ ESTRUCTURA NO COMPATIBLE');
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${response.status}`);
      console.log(`📄 Response: ${errorText.substring(0, 300)}...`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('\n---\n');
}

async function testAIFeedbackRetrieval() {
  console.log('3️⃣ PROBANDO AI FEEDBACK RETRIEVAL...');
  
  try {
    const url = `${BACKEND_URL}/ai-feedback/subtopic/${SUBTOPIC_ID}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Feedback retrieval funcionando');
      console.log(`📊 Feedbacks encontrados: ${Array.isArray(data) ? data.length : 'No es array'}`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Error: ${response.status}`);
      console.log(`📄 Response: ${errorText.substring(0, 200)}...`);
    }
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }
  
  console.log('\n');
}

async function runTests() {
  console.log('🚀 INICIANDO TESTS DE ENDPOINTS AI...\n');
  
  await testAIGameGeneration();
  await testAIFeedbackGeneration();
  await testAIFeedbackRetrieval();
  
  console.log('🎯 RESUMEN:');
  console.log('✅ Si todos los tests pasan, el problema del dashboard está resuelto');
  console.log('❌ Si fallan, necesitamos investigar más los endpoints del backend');
  console.log('\n💡 PRÓXIMO PASO: Probar en el dashboard real');
}

runTests().catch(console.error);