// API Service para conectar ARANDU Frontend con SchoolAI Backend
import { config } from './config';

const API_BASE_URL = config.api.baseUrl;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  originalResponse?: any; // Para casos especiales como login
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  subtopics?: Subtopic[];
  assignments?: ClassAssignment[];
}

export interface Subtopic {
  id: string;
  name: string;
  description?: string;
  subjectId: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order?: number;
  progress?: Progress;
}

export interface Progress {
  id: string;
  userId: string;
  subtopicId: string;
  progressType: string;
  percentage: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassAssignment {
  id: string;
  gradeId: string;
  subjectId: string;
  teacherId: string;
  grade?: Grade;
  subject?: Subject;
  teacher?: User;
  schedules?: Schedule[];
}

export interface Grade {
  id: string;
  name: string;
  year: number;
}

export interface Schedule {
  id: string;
  assignmentId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  quarter: string;
}

export interface AIFeedback {
  id: string;
  subtopicId: string;
  timeMinutes: number;
  stepNumber: number;
  stepName: string;
  content: string;
  studentActivity?: string;
  timeAllocation: string;
  materialsNeeded?: string;
  successIndicator?: string;
  status?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIGame {
  id: string;
  subtopicId: string;
  gameType: 'wordsearch' | 'quiz' | 'memory' | 'puzzle' | 'crossword' | 'matching' | 'threejs' | 'pixijs' | 'adaptive';
  agentType: 'specialized' | 'free';
  title: string;
  description: string;
  instructions: string;
  htmlContent: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  isActive: boolean;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  subtopic?: Subtopic;
}

export interface GameGenerationRequest {
  gameType?: 'wordsearch' | 'quiz' | 'memory' | 'puzzle' | 'crossword' | 'matching' | 'threejs' | 'pixijs' | 'adaptive';
  difficulty?: 'easy' | 'medium' | 'hard';
  customPrompt?: string;
  focus?: string;
  targetAge?: string;
  language?: 'es' | 'en';
}

export interface GameStatistics {
  totalJuegos: number;
  juegosPorTipo: Array<{
    gameType: string;
    _count: { gameType: number };
  }>;
  totalJugadas: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('arandu_token') : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔍 [apiService] Haciendo request a:', url);
    console.log('🔍 [apiService] Opciones del request:', { method: options.method, body: options.body });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log('🔍 [apiService] Enviando fetch...');
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('🔍 [apiService] Respuesta HTTP recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      const data = await response.json();
      console.log('🔍 [apiService] Datos JSON parseados:', data);

      if (!response.ok) {
        console.log('❌ [apiService] Response no OK:', response.status, response.statusText);
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      console.log('✅ [apiService] Response OK, retornando datos');
      return {
        success: true,
        data,
        // Incluir la respuesta completa para casos especiales como login
        originalResponse: data
      };
    } catch (error) {
      console.error('❌ [apiService] Error en fetch:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // ==================== AUTENTICACIÓN ====================

  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('🔍 [apiService] Iniciando login...', { email, password: '***' });
    console.log('🔍 [apiService] URL base:', this.baseURL);
    
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    console.log('🔍 [apiService] Respuesta del request:', response);

    if (response.success && response.originalResponse) {
      console.log('✅ [apiService] Login exitoso, procesando datos...');
      
      // El backend devuelve: { success: true, data: { ... }, token: "..." }
      const backendResponse = response.originalResponse;
      console.log('🔍 [apiService] Respuesta completa del backend:', backendResponse);
      
      const userData = backendResponse.data;
      const token = backendResponse.token;
      
      console.log('🔍 [apiService] Datos del usuario:', userData);
      console.log('🔍 [apiService] Token extraído:', token ? 'Presente' : 'Faltante');
      
      this.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('arandu_token', token || '');
        localStorage.setItem('arandu_user', JSON.stringify(userData));
        console.log('🔍 [apiService] Datos guardados en localStorage');
      }
      
      const result = {
        success: true,
        token: token,
        user: userData,
      };
      
      console.log('✅ [apiService] Retornando resultado exitoso:', result);
      return result;
    }

    console.log('❌ [apiService] Login falló:', response.error);
    return {
      success: false,
      error: response.error || 'Login failed',
    };
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/usuario', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('arandu_user') : null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return { success: true, data: user };
      } catch (error) {
        // Si hay error parseando, hacer request al servidor
      }
    }
    
    // Fallback: obtener usuario del servidor
    return this.request<User>('/usuario/me');
  }

  async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/usuario', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/usuario/password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('arandu_token');
      localStorage.removeItem('arandu_user');
    }
  }

  // ==================== USUARIOS ====================

  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/usuario');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/usuario/${id}`);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/usuario/email/${email}`);
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return this.request(`/usuario/${id}`, {
      method: 'DELETE',
    });
  }

  async assignRole(userId: string, roleId: string): Promise<ApiResponse> {
    return this.request('/usuario/assign-rol', {
      method: 'POST',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  async removeRole(userId: string, roleId: string): Promise<ApiResponse> {
    return this.request('/usuario/remove-rol', {
      method: 'DELETE',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  // ==================== ROLES ====================

  async getRoles(): Promise<ApiResponse<any[]>> {
    console.log('🔍 [apiService] Obteniendo roles...');
    console.log('🔍 [apiService] URL completa:', `${this.baseURL}/roles`);
    
    const result = await this.request<any[]>('/roles');
    console.log('🔍 [apiService] Resultado de getRoles:', result);
    
    return result;
  }

  async getRoleById(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/roles/${id}`);
  }

  async createRole(roleData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async updateRole(roleData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/roles', {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== GRADOS ====================

  async getGrades(): Promise<ApiResponse<Grade[]>> {
    return this.request<Grade[]>('/grades');
  }

  async getGradeById(id: string): Promise<ApiResponse<Grade>> {
    return this.request<Grade>(`/grades/${id}`);
  }

  async createGrade(gradeData: Partial<Grade>): Promise<ApiResponse<Grade>> {
    return this.request<Grade>('/grades', {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  }

  async updateGrade(gradeData: Partial<Grade>): Promise<ApiResponse<Grade>> {
    return this.request<Grade>('/grades', {
      method: 'PUT',
      body: JSON.stringify(gradeData),
    });
  }

  async deleteGrade(id: string): Promise<ApiResponse> {
    return this.request(`/grades/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== MATERIAS (CURSOS) ====================

  async getSubjects(): Promise<ApiResponse<Subject[]>> {
    return this.request<Subject[]>('/subjects');
  }

  // ==================== SUBTEMAS (MÓDULOS) ====================

  async getSubtopics(subjectId?: string): Promise<ApiResponse<Subtopic[]>> {
    const endpoint = subjectId ? `/subtopics?subjectId=${subjectId}` : '/subtopics';
    return this.request<Subtopic[]>(endpoint);
  }

  async getSubtopicsBySubjectId(subjectId: string): Promise<ApiResponse<Subtopic[]>> {
    return this.getSubtopics(subjectId);
  }

  async getSubtopicById(id: string): Promise<ApiResponse<Subtopic>> {
    return this.request<Subtopic>(`/subtopics/${id}`);
  }

  async createSubtopic(subtopicData: Partial<Subtopic>): Promise<ApiResponse<Subtopic>> {
    return this.request<Subtopic>('/subtopics', {
      method: 'POST',
      body: JSON.stringify(subtopicData),
    });
  }

  async updateSubtopic(subtopicData: Partial<Subtopic>): Promise<ApiResponse<Subtopic>> {
    return this.request<Subtopic>('/subtopics', {
      method: 'PUT',
      body: JSON.stringify(subtopicData),
    });
  }

  async deleteSubtopic(id: string): Promise<ApiResponse> {
    return this.request(`/subtopics/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== ASIGNACIONES DE CLASE ====================

  async getClassAssignments(): Promise<ApiResponse<ClassAssignment[]>> {
    return this.request<ClassAssignment[]>('/class-assignments');
  }

  // ==================== HORARIOS ====================

  async getSchedules(): Promise<ApiResponse<Schedule[]>> {
    return this.request<Schedule[]>('/schedules');
  }

  async getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>(`/schedules/${id}`);
  }

  async createSchedule(scheduleData: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async updateSchedule(scheduleData: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return this.request<Schedule>('/schedules', {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  async deleteSchedule(id: string): Promise<ApiResponse> {
    return this.request(`/schedules/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROGRESO ====================

  async getProgress(): Promise<ApiResponse<Progress[]>> {
    return this.request<Progress[]>('/progress');
  }

  // ==================== IA Y FEEDBACK ====================

  async getAIFeedback(): Promise<ApiResponse<AIFeedback[]>> {
    return this.request<AIFeedback[]>('/ai-feedback');
  }

  async getAIFeedbackById(id: string): Promise<ApiResponse<AIFeedback>> {
    return this.request<AIFeedback>(`/ai-feedback/${id}`);
  }

  async createAIFeedback(feedbackData: Partial<AIFeedback>): Promise<ApiResponse<AIFeedback>> {
    return this.request<AIFeedback>('/ai-feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async updateAIFeedback(feedbackData: Partial<AIFeedback>): Promise<ApiResponse<AIFeedback>> {
    return this.request<AIFeedback>('/ai-feedback', {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteAIFeedback(id: string): Promise<ApiResponse> {
    return this.request(`/ai-feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== AI WRITING ASSISTANT ====================

  async generateAIFeedback(subtopicId: string): Promise<ApiResponse<{
    subtopic: Subject;
    steps: AIFeedback[];
  }>> {
    console.log('🔍 [apiService] Generando AI Feedback para subtopic:', subtopicId);
    return this.request<{
      subtopic: Subject;
      steps: AIFeedback[];
    }>(`/ai-writing-assistant/generate-feedback/${subtopicId}`, {
      method: 'POST',
    });
  }

  // ==================== AI FEEDBACK MANAGEMENT ====================

  async getAllAIFeedback(): Promise<ApiResponse<AIFeedback[]>> {
    console.log('🔍 [apiService] Obteniendo todos los AI Feedback');
    return this.request<AIFeedback[]>('/ai-feedback');
  }

  async getAIFeedbackBySubtopicId(subtopicId: string): Promise<ApiResponse<AIFeedback[]>> {
    console.log('🔍 [apiService] Obteniendo AI Feedback por subtopic:', subtopicId);
    return this.request<AIFeedback[]>(`/ai-feedback/subtopic/${subtopicId}`);
  }

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
  }): Promise<ApiResponse<AIFeedback>> {
    console.log('🔍 [apiService] Creando paso de AI Feedback:', feedbackData);
    return this.request<AIFeedback>('/ai-feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async updateAIFeedbackStep(id: string, feedbackData: Partial<AIFeedback>): Promise<ApiResponse<AIFeedback>> {
    console.log('🔍 [apiService] Actualizando paso de AI Feedback:', id);
    return this.request<AIFeedback>(`/ai-feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feedbackData),
    });
  }

  async deleteAIFeedbackStep(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando paso de AI Feedback:', id);
    return this.request(`/ai-feedback/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PROGRESS MANAGEMENT ====================

  async getAllProgress(): Promise<ApiResponse<Progress[]>> {
    console.log('🔍 [apiService] Obteniendo todo el progreso');
    return this.request<Progress[]>('/progress');
  }

  async getProgressByUser(userId: string): Promise<ApiResponse<Progress[]>> {
    console.log('🔍 [apiService] Obteniendo progreso por usuario:', userId);
    return this.request<Progress[]>(`/progress/usuario/${userId}`);
  }

  async getProgressBySubtopic(subtopicId: string): Promise<ApiResponse<Progress[]>> {
    console.log('🔍 [apiService] Obteniendo progreso por subtopic:', subtopicId);
    return this.request<Progress[]>(`/progress/subtopic/${subtopicId}`);
  }

  async createProgress(progressData: {
    userId: string;
    subtopicId: string;
    progressType: string;
    percentage: number;
  }): Promise<ApiResponse<Progress>> {
    console.log('🔍 [apiService] Creando progreso:', progressData);
    return this.request<Progress>('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async updateProgress(id: string, progressData: Partial<Progress>): Promise<ApiResponse<Progress>> {
    console.log('🔍 [apiService] Actualizando progreso:', id);
    return this.request<Progress>(`/progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async deleteProgress(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando progreso:', id);
    return this.request(`/progress/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== CLASS ASSIGNMENTS ====================

  async getAllClassAssignments(): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo todas las asignaciones de clase');
    return this.request<ClassAssignment[]>('/class-assignments');
  }

  async getClassAssignmentsByTeacher(teacherId: string): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo asignaciones por profesor:', teacherId);
    return this.request<ClassAssignment[]>(`/class-assignments/teacher/${teacherId}`);
  }

  async getClassAssignmentsByGrade(gradeId: string): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo asignaciones por grado:', gradeId);
    return this.request<ClassAssignment[]>(`/class-assignments/grade/${gradeId}`);
  }

  async getClassAssignmentsBySubject(subjectId: string): Promise<ApiResponse<ClassAssignment[]>> {
    console.log('🔍 [apiService] Obteniendo asignaciones por materia:', subjectId);
    return this.request<ClassAssignment[]>(`/class-assignments/subject/${subjectId}`);
  }

  async createClassAssignment(assignmentData: {
    gradeId: string;
    subjectId: string;
    teacherId: string;
  }): Promise<ApiResponse<ClassAssignment>> {
    console.log('🔍 [apiService] Creando asignación de clase:', assignmentData);
    return this.request<ClassAssignment>('/class-assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  }

  async updateClassAssignment(id: string, assignmentData: Partial<ClassAssignment>): Promise<ApiResponse<ClassAssignment>> {
    console.log('🔍 [apiService] Actualizando asignación de clase:', id);
    return this.request<ClassAssignment>(`/class-assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  }

  async deleteClassAssignment(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando asignación de clase:', id);
    return this.request(`/class-assignments/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== SUBJECTS MANAGEMENT ====================

  async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
    console.log('🔍 [apiService] Obteniendo todas las materias');
    return this.request<Subject[]>('/subjects');
  }

  async getSubjectById(id: string): Promise<ApiResponse<Subject>> {
    console.log('🔍 [apiService] Obteniendo materia por ID:', id);
    return this.request<Subject>(`/subjects/${id}`);
  }

  async createSubject(subjectData: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<Subject>> {
    console.log('🔍 [apiService] Creando materia:', subjectData);
    return this.request<Subject>('/subjects', {
      method: 'POST',
      body: JSON.stringify(subjectData),
    });
  }

  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<ApiResponse<Subject>> {
    console.log('🔍 [apiService] Actualizando materia:', id);
    return this.request<Subject>(`/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData),
    });
  }

  async deleteSubject(id: string): Promise<ApiResponse> {
    console.log('🔍 [apiService] Eliminando materia:', id);
    return this.request(`/subjects/${id}`, {
      method: 'DELETE',
    });
  }

  async getSubjectsWithSubtopics(): Promise<ApiResponse<Subject[]>> {
    console.log('🔍 [apiService] Obteniendo materias con subtopics');
    return this.request<Subject[]>('/subjects?include=subtopics');
  }

  async getSubjectsWithAssignments(): Promise<ApiResponse<Subject[]>> {
    console.log('🔍 [apiService] Obteniendo materias con asignaciones');
    return this.request<Subject[]>('/subjects?include=assignments');
  }

  // ==================== UTILIDADES ====================

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('arandu_token', token);
    }
  }

  async getSubjectsByTeacherId(teacherId: string): Promise<Subject[]> {
    try {
      console.log('🔍 [apiService] Obteniendo materias para profesor:', teacherId);
      // Usar endpoint de subjects general como fallback
      const response = await this.request<Subject[]>('/subjects');
      if (response.success && response.data) {
        console.log('✅ [apiService] Materias encontradas:', response.data.length);
        // Por ahora retornar todas las materias, en el futuro filtrar por profesor
        return response.data;
      }
      return []
    } catch (error) {
      console.error('❌ [apiService] Error fetching teacher subjects:', error)
      return []
    }
  }

  // Teacher-specific endpoints
  async getStudentsByTeacherId(teacherId: string): Promise<User[]> {
    try {
      console.log('🔍 [apiService] Obteniendo estudiantes para profesor:', teacherId);
      // Usar endpoint de usuarios y filtrar por rol estudiante como fallback
      const response = await this.request<User[]>('/usuario');
      if (response.success && response.data) {
        // Filtrar solo estudiantes
        const students = response.data.filter(user => 
          user.roles && user.roles.some(role => 
            role.toLowerCase().includes('student') || role.toLowerCase().includes('estudiante')
          )
        );
        console.log('✅ [apiService] Estudiantes encontrados:', students.length);
        return students;
      }
      return []
    } catch (error) {
      console.error('❌ [apiService] Error fetching teacher students:', error)
      return []
    }
  }

  async getCourseContentByTeacherId(teacherId: string): Promise<any[]> {
    try {
      console.log('🔍 [apiService] Obteniendo contenido para profesor:', teacherId);
      // Usar subjects como contenido del curso
      const response = await this.request<any[]>('/subjects');
      if (response.success && response.data) {
        console.log('✅ [apiService] Contenido encontrado:', response.data.length, 'materias');
        return response.data;
      }
      return []
    } catch (error) {
      console.error('❌ [apiService] Error fetching teacher content:', error)
      return []
    }
  }

  async getRecentActivityByTeacherId(teacherId: string): Promise<any[]> {
    try {
      console.log('🔍 [apiService] Obteniendo actividad reciente para profesor:', teacherId);
      // Generar actividad mock por ahora
      const mockActivity = [
        {
          id: '1',
          type: 'student_progress',
          description: 'Juan Pérez completó el módulo de Matemáticas',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Juan Pérez'
        },
        {
          id: '2', 
          type: 'assignment_submitted',
          description: 'María García entregó la tarea de Física',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'María García'
        },
        {
          id: '3',
          type: 'new_enrollment',
          description: 'Carlos López se inscribió en tu curso',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user: 'Carlos López'
        }
      ];
      console.log('✅ [apiService] Actividad reciente generada:', mockActivity.length, 'eventos');
      return mockActivity;
    } catch (error) {
      console.error('❌ [apiService] Error fetching teacher activity:', error)
      return []
    }
  }

  // ==================== AI GAMES ====================

  async getAIGames(): Promise<ApiResponse<AIGame[]>> {
    console.log('🎮 [apiService] Obteniendo juegos AI');
    return this.request<AIGame[]>('/ai-games');
  }

  async getAIGameById(id: string): Promise<ApiResponse<AIGame>> {
    console.log('🎮 [apiService] Obteniendo juego AI por ID:', id);
    return this.request<AIGame>(`/ai-games/${id}`);
  }

  async getAIGamesBySubtopic(subtopicId: string): Promise<ApiResponse<AIGame[]>> {
    console.log('🎮 [apiService] Obteniendo juegos AI por subtopic:', subtopicId);
    return this.request<AIGame[]>(`/ai-games/subtopic/${subtopicId}`);
  }

  async getAIGamesByType(gameType: string): Promise<ApiResponse<AIGame[]>> {
    console.log('🎮 [apiService] Obteniendo juegos AI por tipo:', gameType);
    return this.request<AIGame[]>(`/ai-games/tipo/${gameType}`);
  }

  async generateAIGame(subtopicId: string, request: GameGenerationRequest): Promise<ApiResponse<{ game: AIGame; generationInfo: any }>> {
    console.log('🤖 [apiService] Generando juego AI para subtopic:', subtopicId, request);
    return this.request<{ game: AIGame; generationInfo: any }>(`/ai-games/generate/${subtopicId}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async playAIGame(id: string): Promise<ApiResponse<AIGame>> {
    console.log('🎯 [apiService] Obteniendo juego AI para jugar:', id);
    return this.request<AIGame>(`/ai-games/${id}/play`);
  }

  async getPopularGames(limit: number = 10): Promise<ApiResponse<AIGame[]>> {
    console.log('🔥 [apiService] Obteniendo juegos populares, límite:', limit);
    return this.request<AIGame[]>(`/ai-games/populares?limit=${limit}`);
  }

  async getGameStatistics(): Promise<ApiResponse<GameStatistics>> {
    console.log('📊 [apiService] Obteniendo estadísticas de juegos');
    return this.request<GameStatistics>('/ai-games/estadisticas');
  }

  async createAIGame(gameData: Partial<AIGame>): Promise<ApiResponse<AIGame>> {
    console.log('➕ [apiService] Creando juego AI:', gameData);
    return this.request<AIGame>('/ai-games', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async updateAIGame(gameData: Partial<AIGame> & { id: string }): Promise<ApiResponse<AIGame>> {
    console.log('✏️ [apiService] Actualizando juego AI:', gameData.id);
    return this.request<AIGame>('/ai-games', {
      method: 'PUT',
      body: JSON.stringify(gameData),
    });
  }

  async deleteAIGame(id: string): Promise<ApiResponse> {
    console.log('🗑️ [apiService] Eliminando juego AI:', id);
    return this.request(`/ai-games/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
