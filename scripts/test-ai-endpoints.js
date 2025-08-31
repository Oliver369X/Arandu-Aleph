#!/usr/bin/env node

/**
 * Script para testing de endpoints de IA
 * Uso: node scripts/test-ai-endpoints.js
 */

const { testAIEndpoints, testSpecificAIEndpoint } = require('../lib/ai-endpoint-tester');

async function main() {
  console.log('🤖 ARANDU - AI Endpoints Tester');
  console.log('='.repeat(50));
  
  // Verificar argumentos de línea de comandos
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Test específico
    const endpoint = args[0];
    const method = args[1] || 'GET';
    
    console.log(`🧪 Testing endpoint específico: ${method} ${endpoint}`);
    const success = await testSpecificAIEndpoint(endpoint, method);
    
    if (success) {
      console.log('✅ Endpoint funcionando correctamente');
      process.exit(0);
    } else {
      console.log('❌ Endpoint falló');
      process.exit(1);
    }
  } else {
    // Test completo
    console.log('🧪 Ejecutando tests completos de endpoints de IA...');
    await testAIEndpoints();
  }
}

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Error no manejado:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

// Ejecutar el script
main().catch((error) => {
  console.error('❌ Error en el script:', error);
  process.exit(1);
});
