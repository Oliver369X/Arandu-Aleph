// Servicio de IA para ARANDU que conecta con SchoolAI
import { apiService } from './api';
import { DataAdapter } from './data-adapter';
import type { AIFeedback } from './api';

export interface LessonPlan {
  id: string;
  title: string;
  steps: LessonStep[];
  totalDuration: number;
  totalSteps: number;
  materialsNeeded: string[];
  learningObjectives: string[];
}

export interface LessonStep {
  id: string;
  stepNumber: number;
  title: string;
  content: string;
  duration: number;
  studentActivity: string;
  timeAllocation: string;
  materialsNeeded: string[];
  successIndicator: string;
}

export interface QuizQuestion {
  id: string;
  type: "single" | "multiple" | "text";
  question: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  passingScore: number;
  totalQuestions: number;
}

export class AIService {
  // ==================== GENERACIÓN DE CONTENIDO ====================

  /**
   * Genera un plan de lección para un subtema específico
   */
  async generateLessonPlan(subtopicId: string): Promise<LessonPlan | null> {
    try {
      const response = await apiService.generateAIFeedback(subtopicId);
      
      if (response.success && response.data) {
        const { subtopic, steps } = response.data;
        
        // Convertir AIFeedback a LessonStep
        const lessonSteps: LessonStep[] = steps.map(step => ({
          id: step.id,
          stepNumber: step.stepNumber,
          title: step.stepName,
          content: step.content,
          duration: step.timeMinutes,
          studentActivity: step.studentActivity || "Participación activa",
          timeAllocation: step.timeAllocation,
          materialsNeeded: step.materialsNeeded ? step.materialsNeeded.split(',').map(s => s.trim()) : [],
          successIndicator: step.successIndicator || "Comprensión demostrada",
        }));

        // Extraer materiales únicos
        const allMaterials = lessonSteps.flatMap(step => step.materialsNeeded);
        const uniqueMaterials = [...new Set(allMaterials)];

        // Extraer objetivos de aprendizaje de los indicadores de éxito
        const learningObjectives = lessonSteps
          .map(step => step.successIndicator)
          .filter(Boolean)
          .slice(0, 3); // Máximo 3 objetivos

        return {
          id: `lesson_${subtopicId}`,
          title: `Plan de Lección: ${subtopic.name}`,
          steps: lessonSteps,
          totalDuration: lessonSteps.reduce((sum, step) => sum + step.duration, 0),
          totalSteps: lessonSteps.length,
          materialsNeeded: uniqueMaterials,
          learningObjectives,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      return null;
    }
  }

  /**
   * Genera contenido educativo para un módulo
   */
  async generateEducationalContent(moduleId: string): Promise<{
    content: string;
    summary: string;
    keyPoints: string[];
    examples: string[];
  } | null> {
    try {
      // Obtener el módulo
      const moduleResponse = await apiService.getSubtopicById(moduleId);
      if (!moduleResponse.success || !moduleResponse.data) {
        return null;
      }

      // Generar feedback de IA para obtener contenido
      const aiResponse = await apiService.generateAIFeedback(moduleId);
      if (!aiResponse.success || !aiResponse.data) {
        return null;
      }

      const { steps } = aiResponse.data;
      
      // Verificar que steps existe y es un array
      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        console.warn('No steps found in AI response for module:', moduleId);
        return {
          content: 'Contenido educativo no disponible',
          summary: 'Resumen no disponible',
          keyPoints: [],
          examples: [],
        };
      }
      
      // Combinar contenido de todos los pasos
      const content = steps.map(step => step.content).join('\n\n');
      
      // Crear resumen basado en el primer paso
      const summary = steps[0]?.content.substring(0, 200) + '...' || '';
      
      // Extraer puntos clave de los indicadores de éxito
      const keyPoints = steps
        .map(step => step.successIndicator)
        .filter(Boolean)
        .slice(0, 5);
      
      // Generar ejemplos basados en el contenido
      const examples = steps
        .map(step => step.studentActivity)
        .filter(Boolean)
        .slice(0, 3);

      return {
        content,
        summary,
        keyPoints,
        examples,
      };
    } catch (error) {
      console.error('Error generating educational content:', error);
      return null;
    }
  }

  // ==================== GENERACIÓN DE EVALUACIONES ====================

  /**
   * Genera un quiz basado en el contenido de un módulo
   */
  async generateQuiz(moduleId: string, questionCount: number = 10): Promise<Quiz | null> {
    try {
      // Obtener el módulo
      const moduleResponse = await apiService.getSubtopicById(moduleId);
      if (!moduleResponse.success || !moduleResponse.data) {
        return null;
      }

      // Generar feedback de IA para obtener contenido
      const aiResponse = await apiService.generateAIFeedback(moduleId);
      if (!aiResponse.success || !aiResponse.data) {
        return null;
      }

      const { subtopic, steps } = aiResponse.data;
      
      // Verificar que steps existe y es un array
      if (!steps || !Array.isArray(steps) || steps.length === 0) {
        console.warn('No steps found in AI response for quiz generation:', moduleId);
        return null;
      }
      
      // Crear preguntas basadas en el contenido
      const questions: QuizQuestion[] = this.createQuestionsFromContent(steps, questionCount);

      return {
        id: `quiz_${moduleId}`,
        title: `Evaluación: ${subtopic.name}`,
        description: `Evaluación basada en el contenido de ${subtopic.name}`,
        questions,
        timeLimit: questionCount * 2, // 2 minutos por pregunta
        passingScore: 70,
        totalQuestions: questions.length,
      };
    } catch (error) {
      console.error('Error generating quiz:', error);
      return null;
    }
  }

  /**
   * Crea preguntas basadas en el contenido de IA
   */
  private createQuestionsFromContent(steps: AIFeedback[], count: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    
    // Verificar que steps es válido
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      console.warn('Invalid steps provided to createQuestionsFromContent');
      return [];
    }
    
    // Filtrar pasos que contengan preguntas o conceptos clave
    const questionSteps = steps.filter(step => 
      step.content.includes('?') || 
      step.content.includes('¿') ||
      step.successIndicator
    );

    for (let i = 0; i < Math.min(count, questionSteps.length); i++) {
      const step = questionSteps[i];
      
      // Crear pregunta basada en el contenido
      const question = this.extractQuestionFromContent(step.content);
      const options = this.generateOptionsFromContent(step.content);
      const explanation = step.successIndicator || "Respuesta basada en el contenido del módulo";
      
      questions.push({
        id: `q_${i}`,
        type: "single",
        question,
        options,
        correctAnswer: options[0], // Primera opción como correcta por defecto
        explanation,
        difficulty: this.determineDifficulty(step.content),
      });
    }

    // Si no hay suficientes preguntas, crear preguntas genéricas
    while (questions.length < count) {
      questions.push({
        id: `q_${questions.length}`,
        type: "single",
        question: `¿Qué aprendiste sobre el tema ${questions.length + 1}?`,
        options: [
          "Concepto fundamental del tema",
          "Aplicación práctica",
          "Teoría avanzada",
          "Ninguna de las anteriores"
        ],
        correctAnswer: "Concepto fundamental del tema",
        explanation: "Esta pregunta evalúa la comprensión básica del tema",
        difficulty: "easy",
      });
    }

    return questions;
  }

  /**
   * Extrae una pregunta del contenido
   */
  private extractQuestionFromContent(content: string): string {
    // Buscar preguntas existentes
    const questionMatch = content.match(/[¿?].*[?¿]/);
    if (questionMatch) {
      return questionMatch[0];
    }
    
    // Buscar frases que puedan convertirse en preguntas
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
      return `¿Qué significa: "${randomSentence.trim()}"?`;
    }
    
    return "¿Qué aprendiste sobre este tema?";
  }

  /**
   * Genera opciones para una pregunta
   */
  private generateOptionsFromContent(content: string): string[] {
    // Extraer palabras clave del contenido
    const words = content.split(/\s+/).filter(word => word.length > 4);
    const keyWords = words.slice(0, 4);
    
    return [
      keyWords[0] || "Opción correcta",
      keyWords[1] || "Opción relacionada",
      keyWords[2] || "Opción incorrecta",
      keyWords[3] || "Ninguna de las anteriores"
    ];
  }

  /**
   * Determina la dificultad basada en el contenido
   */
  private determineDifficulty(content: string): "easy" | "medium" | "hard" {
    const wordCount = content.split(/\s+/).length;
    const hasComplexTerms = /(teoría|método|algoritmo|fórmula|concepto)/i.test(content);
    
    if (wordCount < 20) return "easy";
    if (wordCount > 50 || hasComplexTerms) return "hard";
    return "medium";
  }

  // ==================== ANÁLISIS DE PROGRESO ====================

  /**
   * Analiza el progreso de un estudiante y genera recomendaciones
   */
  async analyzeStudentProgress(userId: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextSteps: string[];
  } | null> {
    try {
      console.log('🔍 [AIService] Analizando progreso para usuario:', userId);
      
      // Obtener progreso del usuario usando el nuevo endpoint
      const progressResponse = await apiService.getProgressByUser(userId);
      if (!progressResponse.success || !progressResponse.data) {
        console.log('⚠️ [AIService] No se pudo obtener progreso del usuario, retornando análisis por defecto');
        // Retornar análisis por defecto para evitar errores
        return {
          strengths: ["Usuario nuevo en la plataforma"],
          weaknesses: ["Aún no hay suficientes datos"],
          recommendations: ["Comenzar con cursos básicos", "Explorar la plataforma"],
          nextSteps: ["Inscribirse en un curso", "Completar el perfil"]
        };
      }

      const progress = progressResponse.data;
      console.log('✅ [AIService] Progreso obtenido, analizando', progress.length, 'registros');
      
      // Analizar fortalezas (módulos con alto progreso)
      const strengths = progress
        .filter(p => p.percentage >= 80)
        .slice(0, 3)
        .map(p => `Alto rendimiento en módulo ${p.subtopicId}`);

      // Analizar debilidades (módulos con bajo progreso)
      const weaknesses = progress
        .filter(p => p.percentage < 50)
        .slice(0, 3)
        .map(p => `Necesita mejorar en módulo ${p.subtopicId}`);

      // Generar recomendaciones
      const recommendations = [
        "Revisar módulos con bajo progreso",
        "Practicar ejercicios adicionales",
        "Buscar ayuda en temas difíciles",
      ];

      // Sugerir próximos pasos
      const nextSteps = [
        "Completar módulos pendientes",
        "Tomar evaluaciones de práctica",
        "Explorar contenido adicional",
      ];

      return {
        strengths,
        weaknesses,
        recommendations,
        nextSteps,
      };
    } catch (error) {
      console.error('❌ [AIService] Error analyzing student progress:', error);
      // Retornar análisis por defecto en caso de error para evitar crashes
      return {
        strengths: ["Usuario en la plataforma"],
        weaknesses: ["Error al analizar datos"],
        recommendations: ["Contactar soporte técnico", "Intentar más tarde"],
        nextSteps: ["Revisar conexión", "Recargar página"]
      };
    }
  }

  // ==================== PERSONALIZACIÓN ====================

  /**
   * Personaliza el contenido basado en el perfil del estudiante
   */
  async personalizeContent(
    moduleId: string, 
    userProfile: {
      learningStyle: string;
      difficulty: string;
      interests: string[];
    }
  ): Promise<{
    adaptedContent: string;
    learningPath: string[];
    resources: string[];
  } | null> {
    try {
      // Obtener contenido base
      const content = await this.generateEducationalContent(moduleId);
      if (!content) return null;

      // Adaptar contenido según el estilo de aprendizaje
      let adaptedContent = content.content;
      
      if (userProfile.learningStyle === "visual") {
        adaptedContent += "\n\n💡 Sugerencia: Usa diagramas y mapas mentales para visualizar los conceptos.";
      } else if (userProfile.learningStyle === "auditory") {
        adaptedContent += "\n\n💡 Sugerencia: Graba tu voz explicando los conceptos y escúchate.";
      } else if (userProfile.learningStyle === "kinesthetic") {
        adaptedContent += "\n\n💡 Sugerencia: Practica los conceptos con ejercicios físicos o manuales.";
      }

      // Crear ruta de aprendizaje personalizada
      const learningPath = [
        "Revisar conceptos básicos",
        "Practicar ejercicios",
        "Aplicar conocimientos",
        "Evaluar comprensión",
      ];

      // Sugerir recursos adicionales
      const resources = [
        "Videos explicativos",
        "Ejercicios interactivos",
        "Material de lectura adicional",
        "Tutoría personalizada",
      ];

      return {
        adaptedContent,
        learningPath,
        resources,
      };
    } catch (error) {
      console.error('Error personalizing content:', error);
      return null;
    }
  }

  // ==================== UTILIDADES ====================

  /**
   * Verifica si el servicio de IA está disponible
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Intentar hacer una llamada simple para verificar conectividad
      const response = await apiService.getAllAIFeedback();
      return response.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene estadísticas de uso de IA
   */
  async getUsageStats(): Promise<{
    totalGenerations: number;
    averageResponseTime: number;
    successRate: number;
  }> {
    try {
      const response = await apiService.getAllAIFeedback();
      if (response.success && response.data) {
        return {
          totalGenerations: response.data.length,
          averageResponseTime: 2.5, // Placeholder
          successRate: 95, // Placeholder
        };
      }
      
      return {
        totalGenerations: 0,
        averageResponseTime: 0,
        successRate: 0,
      };
    } catch (error) {
      return {
        totalGenerations: 0,
        averageResponseTime: 0,
        successRate: 0,
      };
    }
  }

  /**
   * Obtiene todos los feedback de IA para un subtopic específico
   */
  async getAIFeedbackBySubtopic(subtopicId: string): Promise<AIFeedback[]> {
    try {
      const response = await apiService.getAIFeedbackBySubtopicId(subtopicId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error getting AI feedback by subtopic:', error);
      return [];
    }
  }

  /**
   * Crea un nuevo paso de feedback de IA
   */
  async createAIFeedbackStep(feedbackData: {
    subtopicId: string;
    timeMinutes: number;
    stepNumber: number;
    stepName: string;
    content: string;
    studentActivity?: string;
    timeAllocation: string;
    materialsNeeded?: string;
    successIndicator?: string;
  }): Promise<AIFeedback | null> {
    try {
      const response = await apiService.createAIFeedbackStep(feedbackData);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating AI feedback step:', error);
      return null;
    }
  }

  /**
   * Actualiza un paso de feedback de IA existente
   */
  async updateAIFeedbackStep(id: string, feedbackData: Partial<AIFeedback>): Promise<AIFeedback | null> {
    try {
      const response = await apiService.updateAIFeedbackStep(id, feedbackData);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating AI feedback step:', error);
      return null;
    }
  }

  /**
   * Elimina un paso de feedback de IA
   */
  async deleteAIFeedbackStep(id: string): Promise<boolean> {
    try {
      const response = await apiService.deleteAIFeedbackStep(id);
      return response.success;
    } catch (error) {
      console.error('Error deleting AI feedback step:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
