// Endpoints de IA basados en Insomnia Collection
export const AI_ENDPOINTS = {
  // AI Writing Assistant - Generación de feedback
  GENERATE_FEEDBACK: (subtopicId: string) => 
    `/ai-writing-assistant/generate-feedback/${subtopicId}`,
  
  // AI Feedback Management
  AI_FEEDBACK: {
    BASE: '/ai-feedback',
    BY_ID: (id: string) => `/ai-feedback/${id}`,
    BY_SUBTOPIC: (subtopicId: string) => `/ai-feedback/subtopic/${subtopicId}`,
  },
  
  // Progress Management
  PROGRESS: {
    BASE: '/progress',
    BY_ID: (id: string) => `/progress/${id}`,
    BY_USER: (userId: string) => `/progress/usuario/${userId}`,
    BY_SUBTOPIC: (subtopicId: string) => `/progress/subtopic/${subtopicId}`,
  },
  
  // Class Assignments
  CLASS_ASSIGNMENTS: {
    BASE: '/class-assignments',
    BY_ID: (id: string) => `/class-assignments/${id}`,
    BY_TEACHER: (teacherId: string) => `/class-assignments/teacher/${teacherId}`,
    BY_GRADE: (gradeId: string) => `/class-assignments/grade/${gradeId}`,
    BY_SUBJECT: (subjectId: string) => `/class-assignments/subject/${subjectId}`,
  },
  
  // Subjects
  SUBJECTS: {
    BASE: '/subjects',
    BY_ID: (id: string) => `/subjects/${id}`,
    WITH_SUBTOPICS: '/subjects?include=subtopics',
    WITH_ASSIGNMENTS: '/subjects?include=assignments',
  },
  
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  
  // Users
  USERS: {
    BASE: '/usuario',
    BY_ID: (id: string) => `/usuario/${id}`,
    ASSIGN_ROLE: '/usuario/assign-rol',
  },
  
  // Roles
  ROLES: {
    BASE: '/roles',
    BY_ID: (id: string) => `/roles/${id}`,
  },
  
  // Grades
  GRADES: {
    BASE: '/grades',
    BY_ID: (id: string) => `/grades/${id}`,
  },
  
  // Schedules
  SCHEDULES: {
    BASE: '/schedules',
    BY_ID: (id: string) => `/schedules/${id}`,
  },
  
  // Subtopics
  SUBTOPICS: {
    BASE: '/subtopics',
    BY_ID: (id: string) => `/subtopics/${id}`,
    BY_SUBJECT: (subjectId: string) => `/subtopics/subject/${subjectId}`,
  },
} as const;

// Configuración de métodos HTTP para cada endpoint
export const AI_ENDPOINT_METHODS = {
  // AI Writing Assistant
  [AI_ENDPOINTS.GENERATE_FEEDBACK('')]: 'POST',
  
  // AI Feedback
  [AI_ENDPOINTS.AI_FEEDBACK.BASE]: 'GET',
  [`${AI_ENDPOINTS.AI_FEEDBACK.BASE}/*`]: 'POST',
  [`${AI_ENDPOINTS.AI_FEEDBACK.BY_ID('')}`]: 'PUT',
  [`${AI_ENDPOINTS.AI_FEEDBACK.BY_ID('')}`]: 'DELETE',
  
  // Progress
  [AI_ENDPOINTS.PROGRESS.BASE]: 'POST',
  [`${AI_ENDPOINTS.PROGRESS.BY_ID('')}`]: 'PUT',
  [`${AI_ENDPOINTS.PROGRESS.BY_ID('')}`]: 'DELETE',
  
  // Class Assignments
  [AI_ENDPOINTS.CLASS_ASSIGNMENTS.BASE]: 'GET',
  [`${AI_ENDPOINTS.CLASS_ASSIGNMENTS.BASE}/*`]: 'POST',
  [`${AI_ENDPOINTS.CLASS_ASSIGNMENTS.BY_ID('')}`]: 'PUT',
  [`${AI_ENDPOINTS.CLASS_ASSIGNMENTS.BY_ID('')}`]: 'DELETE',
  
  // Subjects
  [AI_ENDPOINTS.SUBJECTS.BASE]: 'POST',
  [`${AI_ENDPOINTS.SUBJECTS.BY_ID('')}`]: 'PUT',
  [`${AI_ENDPOINTS.SUBJECTS.BY_ID('')}`]: 'DELETE',
  
  // Authentication
  [AI_ENDPOINTS.AUTH.LOGIN]: 'POST',
  [AI_ENDPOINTS.AUTH.REGISTER]: 'POST',
  [AI_ENDPOINTS.AUTH.LOGOUT]: 'POST',
  
  // Users
  [AI_ENDPOINTS.USERS.BASE]: 'POST',
  [`${AI_ENDPOINTS.USERS.BY_ID('')}`]: 'DELETE',
  [AI_ENDPOINTS.USERS.ASSIGN_ROLE]: 'POST',
  
  // Roles
  [AI_ENDPOINTS.ROLES.BASE]: 'POST',
  
  // Grades
  [AI_ENDPOINTS.GRADES.BASE]: 'POST',
  
  // Schedules
  [AI_ENDPOINTS.SCHEDULES.BASE]: 'POST',
  
  // Subtopics
  [AI_ENDPOINTS.SUBTOPICS.BASE]: 'POST',
} as const;

// Headers requeridos para cada endpoint
export const AI_ENDPOINT_HEADERS = {
  // Headers comunes
  COMMON: {
    'Content-Type': 'application/json',
    'User-Agent': 'arandu-platform/1.0.0',
  },
  
  // Headers para autenticación
  AUTH: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}',
  },
  
  // Headers para AI
  AI: {
    'Content-Type': 'application/json',
    'X-AI-Version': '2.0',
    'X-Request-Type': 'ai-generation',
  },
} as const;

// Ejemplos de payloads basados en Insomnia
export const AI_PAYLOAD_EXAMPLES = {
  // Login
  LOGIN: {
    email: "janeDoe@example.com",
    password: "123456789"
  },
  
  // Create User
  CREATE_USER: {
    name: "Jane Doe",
    email: "janeDoe@example.com",
    password: "123456789",
    image: "https://example.com/avatar.jpg",
    bio: "Blockchain enthusiast"
  },
  
  // Create Role
  CREATE_ROLE: {
    name: "Teacher",
    description: "Classroom teacher with lesson planning access",
    permissions: "[create_lessons, view_progress, grade_students]"
  },
  
  // Assign Role
  ASSIGN_ROLE: {
    userId: "e0e7ad8c-16a6-4982-9e01-a0e8703861cd",
    roleId: "d53d5d2d-62bb-4380-82b8-5369bce33a08"
  },
  
  // Create Grade
  CREATE_GRADE: {
    name: "6",
    year: 2025
  },
  
  // Create Schedule
  CREATE_SCHEDULE: {
    assignmentId: "ed44f866-e890-4f16-a10a-e90037d7e5c0",
    dayOfWeek: "wednesday",
    startTime: "2025-08-22T14:00:00.000Z",
    endTime: "2025-08-22T15:30:00.000Z",
    quarter: "Q3-2025"
  },
  
  // Create Subject
  CREATE_SUBJECT: {
    name: "Physics",
    description: "Study of matter, energy, and the fundamental forces of nature."
  },
  
  // Create Subtopic
  CREATE_SUBTOPIC: {
    subjectId: "9ed30cfb-7b71-4a52-ad4e-9a6c0e6107dc",
    name: "Computational Physics",
    description: "Uses algorithms and simulations to solve physical problems from fluid dynamics to quantum systems."
  },
  
  // Create AI Feedback
  CREATE_AI_FEEDBACK: {
    subtopicId: "1f3b4770-d21c-4170-aa0d-993d99f5c90c",
    timeMinutes: 60,
    stepNumber: 1,
    stepName: "Introduction to Black Holes",
    content: "The lesson introduces students to the concept of black holes, their formation, and their significance in astrophysics.",
    studentActivity: "Students will discuss recent black hole discoveries in groups.",
    timeAllocation: 15,
    materialsNeeded: "Whiteboard, projector, slides on black hole formation",
    successIndicator: "Students can explain what a black hole is and describe its key properties."
  },
  
  // Create Progress
  CREATE_PROGRESS: {
    userId: "e0e7ad8c-16a6-4982-9e01-a0e8703861cd",
    subtopicId: "1f3b4770-d21c-4170-aa0d-993d99f5c90c",
    progressType: "learning",
    percentage: 75
  },
  
  // Class Assignment
  CLASS_ASSIGNMENT: {
    gradeId: "cb399190-b257-4324-9777-94229b887c1f",
    subjectId: "9ed30cfb-7b71-4a52-ad4e-9a6c0e6107dc",
    teacherId: "e0e7ad8c-16a6-4982-9e01-a0e8703861cd"
  },
} as const;

// Configuración de timeouts y reintentos
export const AI_ENDPOINT_CONFIG = {
  TIMEOUTS: {
    DEFAULT: 30000, // 30 segundos
    AI_GENERATION: 60000, // 60 segundos para generación de IA
    UPLOAD: 120000, // 2 minutos para uploads
  },
  
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 2000, // 2 segundos entre reintentos
    BACKOFF_MULTIPLIER: 2,
  },
  
  RATE_LIMITS: {
    AI_GENERATION: 10, // 10 requests por minuto
    API_CALLS: 100, // 100 requests por minuto
  },
} as const;

// URLs de ejemplo para testing
export const AI_TEST_URLS = {
  LOCAL: {
    BASE: 'http://localhost:3001/api-v1',
    AI_FEEDBACK: 'http://localhost:3001/api-v1/ai-writing-assistant/generate-feedback/5067a99b-330b-4341-9b8b-c2d91e9533ed',
    PROGRESS: 'http://localhost:3001/api-v1/progress',
    AI_FEEDBACK_MANAGEMENT: 'http://localhost:3001/api-v1/ai-feedback',
    CLASS_ASSIGNMENTS: 'http://localhost:3001/api-v1/class-assignments',
    SUBJECTS: 'http://localhost:3001/api-v1/subjects',
  },
  
  PRODUCTION: {
    BASE: 'https://api.schoolai.com/api-v1',
    AI_FEEDBACK: 'https://api.schoolai.com/api-v1/ai-writing-assistant/generate-feedback',
    PROGRESS: 'https://api.schoolai.com/api-v1/progress',
    AI_FEEDBACK_MANAGEMENT: 'https://api.schoolai.com/api-v1/ai-feedback',
    CLASS_ASSIGNMENTS: 'https://api.schoolai.com/api-v1/class-assignments',
    SUBJECTS: 'https://api.schoolai.com/api-v1/subjects',
  },
} as const;
