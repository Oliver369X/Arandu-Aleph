// Rutas de IA para ARANDU
export const AI_ROUTES = {
  // Generación de contenido
  GENERATE_CONTENT: '/api/ai/generate-content',
  GENERATE_LESSON_PLAN: '/api/ai/generate-lesson-plan',
  GENERATE_QUIZ: '/api/ai/generate-quiz',
  
  // Análisis de progreso
  ANALYZE_PROGRESS: '/api/ai/analyze-progress',
  PERSONALIZE_CONTENT: '/api/ai/personalize-content',
  
  // Páginas de IA
  LESSON_PLAN_PAGE: (moduleId: string) => `/lesson-plan/${moduleId}`,
  QUIZ_PAGE: (moduleId: string) => `/quiz/${moduleId}`,
  AI_ANALYSIS_PAGE: (userId: string) => `/ai-analysis/${userId}`,
  
  // Backend endpoints
  BACKEND_AI_FEEDBACK: (subtopicId: string) => `/api-v1/ai-writing-assistant/generate-feedback/${subtopicId}`,
  BACKEND_AI_ANALYSIS: '/api-v1/ai-analysis',
}

// Configuración de IA
export const AI_CONFIG = {
  // Tiempos de espera
  GENERATION_TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000, // 2 segundos
  
  // Configuración de contenido
  DEFAULT_QUIZ_QUESTIONS: 10,
  DEFAULT_LESSON_STEPS: 5,
  MAX_CONTENT_LENGTH: 2000,
  
  // Configuración de análisis
  ANALYSIS_INTERVAL: 24 * 60 * 60 * 1000, // 24 horas
  PROGRESS_THRESHOLD: 0.1, // 10% de cambio mínimo
  
  // Feature flags
  ENABLE_CONTENT_GENERATION: true,
  ENABLE_PROGRESS_ANALYSIS: true,
  ENABLE_PERSONALIZATION: true,
  ENABLE_QUIZ_GENERATION: true,
}

// Tipos de contenido generado por IA
export const AI_CONTENT_TYPES = {
  LESSON_PLAN: 'lesson_plan',
  QUIZ: 'quiz',
  EDUCATIONAL_CONTENT: 'educational_content',
  PROGRESS_ANALYSIS: 'progress_analysis',
  PERSONALIZATION: 'personalization',
} as const

// Estados de generación de IA
export const AI_GENERATION_STATES = {
  IDLE: 'idle',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error',
  RETRYING: 'retrying',
} as const

// Mensajes de IA
export const AI_MESSAGES = {
  GENERATING_CONTENT: 'Generando contenido personalizado con IA...',
  GENERATING_LESSON_PLAN: 'Generando plan de lección con IA...',
  GENERATING_QUIZ: 'Generando evaluación con IA...',
  ANALYZING_PROGRESS: 'Analizando tu progreso con IA...',
  PERSONALIZING_CONTENT: 'Personalizando contenido para ti...',
  
  SUCCESS_CONTENT: '¡Contenido generado exitosamente!',
  SUCCESS_LESSON_PLAN: '¡Plan de lección generado exitosamente!',
  SUCCESS_QUIZ: '¡Evaluación generada exitosamente!',
  SUCCESS_ANALYSIS: '¡Análisis completado exitosamente!',
  
  ERROR_GENERATION: 'Error al generar contenido. Inténtalo de nuevo.',
  ERROR_LESSON_PLAN: 'Error al generar plan de lección. Inténtalo de nuevo.',
  ERROR_QUIZ: 'Error al generar evaluación. Inténtalo de nuevo.',
  ERROR_ANALYSIS: 'Error al analizar progreso. Inténtalo de nuevo.',
  ERROR_NETWORK: 'Error de conexión. Verifica tu internet.',
  ERROR_TIMEOUT: 'Tiempo de espera agotado. Inténtalo de nuevo.',
}
