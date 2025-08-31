// Script para probar la carga de roles desde el frontend
const API_BASE_URL = 'http://localhost:3001/api-v1';

async function testRoles() {
  try {
    console.log('🔍 Probando endpoint de roles...');
    
    const response = await fetch(`${API_BASE_URL}/roles`);
    const data = await response.json();
    
    console.log('📊 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log('\n✅ Roles encontrados:');
      data.data.forEach(role => {
        console.log(`  - ${role.name}: ${role.description}`);
      });
    } else {
      console.log('❌ No se pudieron cargar los roles');
      console.log('Error:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con el backend:', error.message);
    console.log('\n💡 Asegúrate de que el backend esté corriendo en http://localhost:3001');
  }
}

testRoles();
