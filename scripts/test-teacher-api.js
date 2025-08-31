#!/usr/bin/env node

// Script para probar la conexión entre frontend y backend
// y verificar si el endpoint de teacher subjects funciona

const BACKEND_URL = 'http://localhost:3001/api-v1';
const TEACHER_ID = 'dfb96a80-56b6-4556-884d-65c53a0072b0'; // ID del teacher de la base de datos

async function testTeacherAPI() {
  console.log('🧪 [TEST] Probando conexión frontend <-> backend\n');
  console.log(`🔗 Backend URL: ${BACKEND_URL}`);
  console.log(`👨‍🏫 Teacher ID: ${TEACHER_ID}\n`);

  try {
    // 1. Test de conectividad básica
    console.log('1️⃣ PROBANDO CONECTIVIDAD BÁSICA...');
    
    try {
      const healthResponse = await fetch(`${BACKEND_URL}/health`);
      if (healthResponse.ok) {
        console.log('✅ Backend responde correctamente');
      } else {
        console.log('⚠️ Backend responde pero con error:', healthResponse.status);
      }
    } catch (error) {
      console.log('❌ Backend no responde - ¿Está corriendo?');
      console.log('💡 Ejecutar: cd SchoolAI && npm run start');
      return;
    }

    // 2. Test del endpoint de subjects por creador
    console.log('\n2️⃣ PROBANDO ENDPOINT /subjects/creator/{teacherId}...');
    
    const subjectsURL = `${BACKEND_URL}/subjects/creator/${TEACHER_ID}`;
    console.log(`🔗 URL: ${subjectsURL}`);
    
    try {
      const subjectsResponse = await fetch(subjectsURL);
      
      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();
        console.log('✅ Endpoint funciona correctamente');
        console.log('📄 Respuesta completa del backend:', subjectsData);
        
        // El backend devuelve: { success: true, data: [...], count: n }
        const actualSubjects = subjectsData.success && subjectsData.data ? subjectsData.data : [];
        console.log(`📊 Subjects encontrados: ${Array.isArray(actualSubjects) ? actualSubjects.length : 'No es array'}`);
        
        if (Array.isArray(actualSubjects) && actualSubjects.length > 0) {
          console.log('\n📚 SUBJECTS DEL TEACHER:');
          actualSubjects.forEach((subject, index) => {
            console.log(`   ${index + 1}. ${subject.name}`);
            console.log(`      📝 Descripción: ${subject.description || 'Sin descripción'}`);
            console.log(`      🏷️ Categoría: ${subject.category || 'Sin categoría'}`);
            console.log(`      👤 CreatedBy: ${subject.createdBy}`);
            console.log(`      📅 Creado: ${subject.createdAt}`);
            console.log(`      🔢 Subtopics: ${subject.subtopics ? subject.subtopics.length : 0}`);
          });
        } else {
          console.log('❌ NO SE ENCONTRARON SUBJECTS PARA ESTE TEACHER');
          console.log('🔍 Posibles causas:');
          console.log('   - El teacher ID no coincide con ningún subject.createdBy');
          console.log('   - No hay subjects en la base de datos');
          console.log('   - Error en la consulta del backend');
        }
      } else {
        console.log(`❌ Error en endpoint: ${subjectsResponse.status} ${subjectsResponse.statusText}`);
        const errorText = await subjectsResponse.text();
        console.log(`📄 Response: ${errorText}`);
      }
    } catch (error) {
      console.log('❌ Error de conexión con endpoint:', error.message);
    }

    // 3. Test de todos los subjects (para comparación)
    console.log('\n3️⃣ PROBANDO ENDPOINT /subjects (todos los subjects)...');
    
    try {
      const allSubjectsResponse = await fetch(`${BACKEND_URL}/subjects`);
      
      if (allSubjectsResponse.ok) {
        const allSubjectsData = await allSubjectsResponse.json();
        console.log('✅ Endpoint /subjects funciona');
        console.log(`📊 Total subjects en la base de datos: ${Array.isArray(allSubjectsData) ? allSubjectsData.length : 'No es array'}`);
        
        if (Array.isArray(allSubjectsData) && allSubjectsData.length > 0) {
          console.log('\n📚 TODOS LOS SUBJECTS:');
          allSubjectsData.forEach((subject, index) => {
            console.log(`   ${index + 1}. ${subject.name}`);
            console.log(`      👤 CreatedBy: ${subject.createdBy || 'NULL'}`);
            console.log(`      🎯 ¿Es del teacher? ${subject.createdBy === TEACHER_ID ? '✅ SÍ' : '❌ NO'}`);
          });
        }
      } else {
        console.log(`❌ Error en /subjects: ${allSubjectsResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Error con /subjects:', error.message);
    }

    // 4. Test del dashboard completo (simulando lo que hace el frontend)
    console.log('\n4️⃣ SIMULANDO LLAMADA DEL DASHBOARD...');
    
    try {
      console.log('🔄 Simulando: apiService.getSubjectsByCreator(teacherId)');
      const dashboardResponse = await fetch(`${BACKEND_URL}/subjects/creator/${TEACHER_ID}`);
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        const actualDashboardSubjects = dashboardData.success && dashboardData.data ? dashboardData.data : [];
        console.log(`📊 Dashboard recibiría: ${Array.isArray(actualDashboardSubjects) ? actualDashboardSubjects.length : 0} subjects`);
        
        if (Array.isArray(actualDashboardSubjects) && actualDashboardSubjects.length > 0) {
          console.log('✅ EL DASHBOARD DEBERÍA MOSTRAR LOS CURSOS');
          console.log('🎉 PROBLEMA RESUELTO: El API fix debería funcionar');
        } else {
          console.log('❌ EL DASHBOARD MOSTRARÁ "No hay cursos disponibles"');
          console.log('🔧 POSIBLE SOLUCIÓN: Verificar que el usuario logueado tenga el ID correcto');
        }
      } else {
        console.log('❌ La llamada que hace el dashboard fallaría');
      }
    } catch (error) {
      console.log('❌ Error simulando dashboard:', error.message);
    }

    // 5. Recomendaciones
    console.log('\n🎯 RECOMENDACIONES:');
    console.log('1. Verificar que el usuario logueado en el frontend tenga ID:', TEACHER_ID);
    console.log('2. Verificar que el backend esté corriendo en puerto 3001');
    console.log('3. Si el API funciona pero el dashboard no muestra datos:');
    console.log('   - Revisar logs del navegador (DevTools Console)');
    console.log('   - Verificar que el hook useTeacherDashboard esté llamando la función correcta');
    console.log('   - Verificar que no haya errores de CORS');

  } catch (error) {
    console.error('❌ Error general en el test:', error);
  }
}

// Ejecutar el test
testTeacherAPI().catch(console.error);
