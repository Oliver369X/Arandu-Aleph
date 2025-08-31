// Configuración de la aplicación ARANDU
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api-v1',
    timeout: 10000, // 10 segundos
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'ARANDU',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  },

  // Feature Flags
  features: {
    enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
    enableBlockchain: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN === 'true',
    enableAIFeedback: process.env.NEXT_PUBLIC_ENABLE_AI_FEEDBACK === 'true',
    enableRealTimeChat: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_CHAT === 'true',
  },

  // Blockchain Configuration
  blockchain: {
    network: process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK || 'mantle',
    chainId: parseInt(process.env.NEXT_PUBLIC_BLOCKCHAIN_CHAIN_ID || '5001'),
    contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '',
  },

  // AI Configuration
  ai: {
    enabled: process.env.NEXT_PUBLIC_AI_ENABLED === 'true',
    model: 'gemini-2.0-flash-exp',
    maxRetries: 3,
    timeout: 30000, // 30 segundos
  },

  // Analytics
  analytics: {
    id: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
    enabled: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },

  // UI Configuration
  ui: {
    theme: {
      default: 'system',
      options: ['light', 'dark', 'system'] as const,
    },
    language: {
      default: 'es',
      options: ['es', 'en'] as const,
    },
  },

  // Storage Keys
  storage: {
    token: 'arandu_token',
    user: 'arandu_user',
    theme: 'arandu_theme',
    language: 'arandu_language',
  },

  // Routes
  routes: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    dashboard: '/dashboard',
    courses: '/courses',
    profile: '/profile',
    certificates: '/certificates',
    community: '/community',
    blockchain: '/blockchain',
  },

  // API Endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/usuario',
      me: '/usuario/me',
      refresh: '/usuario/token',
    },
    users: {
      list: '/usuario',
      get: (id: string) => `/usuario/${id}`,
      update: '/usuario',
      delete: (id: string) => `/usuario/${id}`,
    },
    courses: {
      list: '/subjects',
      get: (id: string) => `/subjects/${id}`,
      create: '/subjects',
      update: '/subjects',
      delete: (id: string) => `/subjects/${id}`,
    },
    modules: {
      list: '/subtopics',
      get: (id: string) => `/subtopics/${id}`,
      create: '/subtopics',
      update: '/subtopics',
      delete: (id: string) => `/subtopics/${id}`,
    },
    progress: {
      list: '/progress',
      get: (id: string) => `/progress/${id}`,
      create: '/progress',
      update: '/progress',
      delete: (id: string) => `/progress/${id}`,
      byUser: (userId: string) => `/progress/usuario/${userId}`,
      bySubtopic: (subtopicId: string) => `/progress/subtopic/${subtopicId}`,
      completed: '/progress/completado',
    },
    ai: {
      feedback: {
        list: '/ai-feedback',
        get: (id: string) => `/ai-feedback/${id}`,
        create: '/ai-feedback',
        update: '/ai-feedback',
        delete: (id: string) => `/ai-feedback/${id}`,
      },
      generate: (subtopicId: string) => `/ai-writing-assistant/generate-feedback/${subtopicId}`,
    },
  },

  // Error Messages
  errors: {
    network: 'Error de conexión. Verifica tu conexión a internet.',
    unauthorized: 'No tienes permisos para acceder a este recurso.',
    notFound: 'El recurso solicitado no fue encontrado.',
    serverError: 'Error interno del servidor. Intenta más tarde.',
    validation: 'Los datos proporcionados no son válidos.',
    timeout: 'La solicitud tardó demasiado. Intenta nuevamente.',
  },

  // Success Messages
  messages: {
    login: 'Inicio de sesión exitoso.',
    register: 'Registro exitoso. Bienvenido a ARANDU.',
    update: 'Datos actualizados correctamente.',
    delete: 'Elemento eliminado correctamente.',
    create: 'Elemento creado correctamente.',
    save: 'Cambios guardados correctamente.',
  },

  // Validation Rules
  validation: {
    email: {
      required: 'El email es requerido.',
      format: 'El email debe tener un formato válido.',
    },
    password: {
      required: 'La contraseña es requerida.',
      minLength: 'La contraseña debe tener al menos 8 caracteres.',
      strength: 'La contraseña debe contener mayúsculas, minúsculas y números.',
    },
    name: {
      required: 'El nombre es requerido.',
      minLength: 'El nombre debe tener al menos 2 caracteres.',
    },
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // File Upload
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxFiles: 5,
  },

  // Cache Configuration
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 100, // máximo 100 items en cache
  },

  // Real-time Configuration
  realtime: {
    enabled: false,
    reconnectAttempts: 5,
    reconnectDelay: 1000, // 1 segundo
  },
} as const

// Tipos para la configuración
export type Config = typeof config
export type Theme = Config['ui']['theme']['options'][number]
export type Language = Config['ui']['language']['options'][number]

// Utilidades de configuración
export const isDevelopment = config.app.environment === 'development'
export const isProduction = config.app.environment === 'production'
export const isTest = config.app.environment === 'test'

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`
}

// Función para verificar si una característica está habilitada
export const isFeatureEnabled = (feature: keyof Config['features']): boolean => {
  return config.features[feature]
}

// Función para obtener el valor de una variable de entorno con fallback
export const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || fallback
}
