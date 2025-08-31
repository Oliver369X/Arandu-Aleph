#!/usr/bin/env node

// Test simple para verificar que el arreglo del API funcione

import { apiService } from '../lib/api.js';

const TEACHER_ID = 'dfb96a80-56b6-4556-884d-65c53a0072b0';

console.log('🧪 [TEST] Probando arreglo del API...\n');
console.log(`👨‍🏫 Teacher ID: ${TEACHER_ID}\n`);

// Probar el método arreglado
async function testAPIFix() {
  try {
    console.log('🔄 Llamando apiService.getSubjectsByCreator()...');
    const result = await apiService.getSubjectsByCreator(TEACHER_ID);
    
    console.log('📊 Resultado completo:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Llamada exitosa');
      console.log(`📚 Subjects encontrados: ${result.data ? result.data.length : 0}`);
      
      if (result.data && result.data.length > 0) {
        console.log('🎉 ¡ARREGLO EXITOSO! El dashboard ahora debería mostrar los cursos');
        
        result.data.forEach((subject, index) => {
          console.log(`   ${index + 1}. ${subject.name}`);
          console.log(`      📝 Descripción: ${subject.description}`);
          console.log(`      🏷️ Categoría: ${subject.category}`);
        });
      } else {
        console.log('❌ Array vacío - El dashboard seguirá mostrando "No hay cursos"');
      }
    } else {
      console.log('❌ Error en la llamada:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando test:', error);
  }
}

testAPIFix();
