// Tester para verificar endpoints de IA
import { apiService } from './api';
import { AI_TEST_URLS, AI_PAYLOAD_EXAMPLES } from './ai-endpoints';

export class AIEndpointTester {
  private results: Array<{
    endpoint: string;
    method: string;
    success: boolean;
    error?: string;
    responseTime: number;
  }> = [];

  /**
   * Ejecuta tests para todos los endpoints de IA
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 [AIEndpointTester] Iniciando tests de endpoints de IA...');
    
    // Test de autenticación
    await this.testAuthentication();
    
    // Test de AI Writing Assistant
    await this.testAIWritingAssistant();
    
    // Test de AI Feedback Management
    await this.testAIFeedbackManagement();
    
    // Test de Progress Management
    await this.testProgressManagement();
    
    // Test de Class Assignments
    await this.testClassAssignments();
    
    // Test de Subjects
    await this.testSubjects();
    
    // Mostrar resultados
    this.showResults();
  }

  /**
   * Test de autenticación
   */
  private async testAuthentication(): Promise<void> {
    console.log('🔐 [AIEndpointTester] Testing autenticación...');
    
    const startTime = Date.now();
    try {
      const response = await apiService.login(
        AI_PAYLOAD_EXAMPLES.LOGIN.email,
        AI_PAYLOAD_EXAMPLES.LOGIN.password
      );
      
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/auth/login',
        method: 'POST',
        success: response.success,
        error: response.error,
        responseTime,
      });
      
      if (response.success) {
        console.log('✅ [AIEndpointTester] Login exitoso');
      } else {
        console.log('❌ [AIEndpointTester] Login falló:', response.error);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/auth/login',
        method: 'POST',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
      console.log('❌ [AIEndpointTester] Error en login:', error);
    }
  }

  /**
   * Test de AI Writing Assistant
   */
  private async testAIWritingAssistant(): Promise<void> {
    console.log('🤖 [AIEndpointTester] Testing AI Writing Assistant...');
    
    const testSubtopicId = '5067a99b-330b-4341-9b8b-c2d91e9533ed';
    const startTime = Date.now();
    
    try {
      const response = await apiService.generateAIFeedback(testSubtopicId);
      
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: `/ai-writing-assistant/generate-feedback/${testSubtopicId}`,
        method: 'POST',
        success: response.success,
        error: response.error,
        responseTime,
      });
      
      if (response.success) {
        console.log('✅ [AIEndpointTester] AI Feedback generado exitosamente');
      } else {
        console.log('❌ [AIEndpointTester] AI Feedback falló:', response.error);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: `/ai-writing-assistant/generate-feedback/${testSubtopicId}`,
        method: 'POST',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
      console.log('❌ [AIEndpointTester] Error en AI Feedback:', error);
    }
  }

  /**
   * Test de AI Feedback Management
   */
  private async testAIFeedbackManagement(): Promise<void> {
    console.log('📝 [AIEndpointTester] Testing AI Feedback Management...');
    
    // Test GET all AI feedback
    const startTime = Date.now();
    try {
      const response = await apiService.getAllAIFeedback();
      
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/ai-feedback',
        method: 'GET',
        success: response.success,
        error: response.error,
        responseTime,
      });
      
      if (response.success) {
        console.log('✅ [AIEndpointTester] GET AI Feedback exitoso');
      } else {
        console.log('❌ [AIEndpointTester] GET AI Feedback falló:', response.error);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/ai-feedback',
        method: 'GET',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
      console.log('❌ [AIEndpointTester] Error en GET AI Feedback:', error);
    }
  }

  /**
   * Test de Progress Management
   */
  private async testProgressManagement(): Promise<void> {
    console.log('📊 [AIEndpointTester] Testing Progress Management...');
    
    // Test GET all progress
    const startTime = Date.now();
    try {
      const response = await apiService.getAllProgress();
      
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/progress',
        method: 'GET',
        success: response.success,
        error: response.error,
        responseTime,
      });
      
      if (response.success) {
        console.log('✅ [AIEndpointTester] GET Progress exitoso');
      } else {
        console.log('❌ [AIEndpointTester] GET Progress falló:', response.error);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/progress',
        method: 'GET',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
      console.log('❌ [AIEndpointTester] Error en GET Progress:', error);
    }
  }

  /**
   * Test de Class Assignments
   */
  private async testClassAssignments(): Promise<void> {
    console.log('👥 [AIEndpointTester] Testing Class Assignments...');
    
    // Test GET all class assignments
    const startTime = Date.now();
    try {
      const response = await apiService.getAllClassAssignments();
      
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/class-assignments',
        method: 'GET',
        success: response.success,
        error: response.error,
        responseTime,
      });
      
      if (response.success) {
        console.log('✅ [AIEndpointTester] GET Class Assignments exitoso');
      } else {
        console.log('❌ [AIEndpointTester] GET Class Assignments falló:', response.error);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/class-assignments',
        method: 'GET',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
      console.log('❌ [AIEndpointTester] Error en GET Class Assignments:', error);
    }
  }

  /**
   * Test de Subjects
   */
  private async testSubjects(): Promise<void> {
    console.log('📚 [AIEndpointTester] Testing Subjects...');
    
    // Test GET all subjects
    const startTime = Date.now();
    try {
      const response = await apiService.getAllSubjects();
      
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/subjects',
        method: 'GET',
        success: response.success,
        error: response.error,
        responseTime,
      });
      
      if (response.success) {
        console.log('✅ [AIEndpointTester] GET Subjects exitoso');
      } else {
        console.log('❌ [AIEndpointTester] GET Subjects falló:', response.error);
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: '/subjects',
        method: 'GET',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime,
      });
      console.log('❌ [AIEndpointTester] Error en GET Subjects:', error);
    }
  }

  /**
   * Muestra los resultados de los tests
   */
  private showResults(): void {
    console.log('\n📋 [AIEndpointTester] Resultados de los tests:');
    console.log('='.repeat(80));
    
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const total = this.results.length;
    const averageResponseTime = this.results.reduce((acc, r) => acc + r.responseTime, 0) / total;
    
    console.log(`✅ Exitosos: ${successful}/${total}`);
    console.log(`❌ Fallidos: ${failed}/${total}`);
    console.log(`⏱️  Tiempo promedio de respuesta: ${averageResponseTime.toFixed(2)}ms`);
    console.log('');
    
    // Mostrar detalles de cada test
    this.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      const time = `${result.responseTime}ms`;
      console.log(`${index + 1}. ${status} ${result.method} ${result.endpoint} (${time})`);
      
      if (!result.success && result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    console.log('='.repeat(80));
    
    if (failed === 0) {
      console.log('🎉 ¡Todos los endpoints de IA están funcionando correctamente!');
    } else {
      console.log(`⚠️  ${failed} endpoint(s) fallaron. Revisa los errores arriba.`);
    }
  }

  /**
   * Test específico para un endpoint
   */
  async testSpecificEndpoint(endpoint: string, method: string = 'GET'): Promise<boolean> {
    console.log(`🧪 [AIEndpointTester] Testing endpoint específico: ${method} ${endpoint}`);
    
    const startTime = Date.now();
    try {
      let response;
      
      switch (endpoint) {
        case '/ai-feedback':
          response = await apiService.getAllAIFeedback();
          break;
        case '/progress':
          response = await apiService.getAllProgress();
          break;
        case '/class-assignments':
          response = await apiService.getAllClassAssignments();
          break;
        case '/subjects':
          response = await apiService.getAllSubjects();
          break;
        default:
          throw new Error(`Endpoint no soportado: ${endpoint}`);
      }
      
      const responseTime = Date.now() - startTime;
      const success = response.success;
      
      console.log(`${success ? '✅' : '❌'} ${method} ${endpoint} (${responseTime}ms)`);
      
      if (!success && response.error) {
        console.log(`   Error: ${response.error}`);
      }
      
      return success;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.log(`❌ ${method} ${endpoint} (${responseTime}ms)`);
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
}

// Instancia global del tester
export const aiEndpointTester = new AIEndpointTester();

// Función de conveniencia para ejecutar tests
export async function testAIEndpoints(): Promise<void> {
  await aiEndpointTester.runAllTests();
}

// Función para test específico
export async function testSpecificAIEndpoint(endpoint: string, method: string = 'GET'): Promise<boolean> {
  return await aiEndpointTester.testSpecificEndpoint(endpoint, method);
}
