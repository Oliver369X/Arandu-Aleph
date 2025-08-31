#!/usr/bin/env node

// Simular exactamente lo que hace el dashboard del profesor

const BACKEND_URL = 'http://localhost:3001/api-v1';
const TEACHER_ID = 'dfb96a80-56b6-4556-884d-65c53a0072b0';

console.log('🎯 [SIMULATION] Simulando hook useTeacherDashboard...\n');

// Simular la función request del API (simplificada)
async function simulateApiRequest(endpoint) {
  const url = `${BACKEND_URL}${endpoint}`;
  console.log('🔍 Haciendo request a:', url);
  
  try {
    const response = await fetch(url);
    console.log('📊 Response status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📄 Data recibida:', JSON.stringify(data, null, 2));
      
      return {
        success: true,
        data
      };
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Simular la función getSubjectsByCreator arreglada
async function simulateGetSubjectsByCreator(teacherId) {
  console.log('🔍 Simulando getSubjectsByCreator para teacher:', teacherId);
  const response = await simulateApiRequest(`/subjects/creator/${teacherId}`);
  
  // Este es el arreglo que implementé
  if (response.success && response.data && response.data.success && Array.isArray(response.data.data)) {
    console.log('✅ Subjects extraídos del backend:', response.data.data.length);
    return {
      success: true,
      data: response.data.data // Extraer el array real
    };
  } else if (response.success && response.data && !response.data.success) {
    console.log('❌ Backend devolvió error:', response.data.error);
    return {
      success: false,
      error: response.data.error || 'Error desconocido del backend'
    };
  } else {
    console.log('❌ Error de conexión o formato:', response);
    return response;
  }
}

// Simular getTeacherDashboardData
async function simulateGetTeacherDashboardData(teacherId) {
  console.log('🎯 Simulando getTeacherDashboardData...');
  
  try {
    // Simular la llamada que hace el dashboard
    const coursesResponse = await simulateGetSubjectsByCreator(teacherId);
    
    const courses = coursesResponse.success && coursesResponse.data ? coursesResponse.data : [];
    
    console.log('📚 Cursos extraídos:', courses.length);
    
    if (courses.length > 0) {
      console.log('\n✅ CURSOS ENCONTRADOS:');
      courses.forEach((course, index) => {
        console.log(`   ${index + 1}. ${course.name}`);
        console.log(`      📝 ${course.description || 'Sin descripción'}`);
        console.log(`      🏷️ ${course.category || 'Sin categoría'}`);
        console.log(`      💰 $${course.price || 0}`);
      });
      
      console.log('\n🎉 RESULTADO: El dashboard DEBERÍA mostrar estos cursos');
    } else {
      console.log('\n❌ RESULTADO: El dashboard mostrará "No hay cursos disponibles"');
    }
    
    return {
      courses,
      students: [],
      recentActivity: [],
      statistics: {
        totalCourses: courses.length,
        totalStudents: 0,
        monthlyRevenue: 0,
        avgProgress: 0,
        completionRate: 0,
        averageRating: 4.8,
        newEnrollmentsThisWeek: 0,
        certificatesIssued: 0
      }
    };
  } catch (error) {
    console.error('❌ Error en simulación:', error);
    return {
      courses: [],
      students: [],
      recentActivity: [],
      statistics: {}
    };
  }
}

// Ejecutar simulación
async function runSimulation() {
  console.log('🚀 INICIANDO SIMULACIÓN DEL DASHBOARD...\n');
  
  const result = await simulateGetTeacherDashboardData(TEACHER_ID);
  
  console.log('\n📊 RESULTADO FINAL:');
  console.log(`✅ Cursos que mostraría el dashboard: ${result.courses.length}`);
  console.log(`📈 Estadísticas calculadas: totalCourses = ${result.statistics.totalCourses}`);
  
  if (result.courses.length > 0) {
    console.log('\n🎉 ¡ÉXITO! El problema del dashboard ha sido resuelto');
    console.log('💡 El profesor ahora debería ver sus cursos en el frontend');
  } else {
    console.log('\n❌ PROBLEMA PERSISTENTE: El dashboard seguirá vacío');
  }
  
  console.log('\n🔄 PRÓXIMO PASO: Probar en el navegador');
  console.log('   1. Ir a http://localhost:3000/dashboard/teacher');
  console.log('   2. Login como: hola@hola.com');
  console.log('   3. Verificar que se muestren los cursos');
}

runSimulation().catch(console.error);
