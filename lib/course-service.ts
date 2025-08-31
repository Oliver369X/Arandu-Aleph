// Servicio de cursos para ARANDU que conecta con SchoolAI
import { apiService } from './api';
import { DataAdapter, type Course, type Module, type CourseProgress } from './data-adapter';
import type { Subject, Subtopic, Progress } from './api';

export class CourseService {
  // ==================== CURSOS ====================

  /**
   * Obtiene todos los cursos (subjects) del backend
   */
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiService.getAllSubjects();
      if (response.success && response.data) {
        // Obtener profesores para asignar a los cursos
        const teachersResponse = await apiService.getUsers();
        const teachers = teachersResponse.success ? teachersResponse.data : [];
        
        return DataAdapter.subjectsToCourses(response.data, teachers);
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  /**
   * Obtiene un curso específico por ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const response = await apiService.getSubjectById(id);
      if (response.success && response.data) {
        // Obtener profesores
        const teachersResponse = await apiService.getUsers();
        const teachers = teachersResponse.success ? teachersResponse.data : [];
        
        // Buscar el profesor asignado a este curso
        const teacher = teachers.find(t => 
          response.data.assignments?.some(a => a.teacherId === t.id)
        );
        
        return DataAdapter.subjectToCourse(response.data, teacher);
      }
      return null;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo curso
   */
  async createCourse(courseData: Partial<Course>): Promise<Course | null> {
    try {
      const subjectData = DataAdapter.courseToSubject(courseData as Course);
      const response = await apiService.createSubject(subjectData);
      
      if (response.success && response.data) {
        return DataAdapter.subjectToCourse(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  /**
   * Actualiza un curso existente
   */
  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course | null> {
    try {
      const subjectData = DataAdapter.courseToSubject(courseData as Course);
      const response = await apiService.updateSubject({ ...subjectData, id });
      
      if (response.success && response.data) {
        return DataAdapter.subjectToCourse(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error updating course:', error);
      return null;
    }
  }

  /**
   * Elimina un curso
   */
  async deleteCourse(id: string): Promise<boolean> {
    try {
      const response = await apiService.deleteSubject(id);
      return response.success;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }

  // ==================== MÓDULOS ====================

  /**
   * Obtiene los módulos de un curso específico
   */
  async getCourseModules(courseId: string): Promise<Module[]> {
    try {
      const response = await apiService.getSubtopics(courseId);
      if (response.success && response.data) {
        return DataAdapter.subtopicsToModules(response.data);
      }
      return [];
    } catch (error) {
      console.error('Error fetching course modules:', error);
      return [];
    }
  }

  /**
   * Obtiene un módulo específico por ID
   */
  async getModuleById(id: string): Promise<Module | null> {
    try {
      const response = await apiService.getSubtopicById(id);
      if (response.success && response.data) {
        return DataAdapter.subtopicToModule(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error fetching module:', error);
      return null;
    }
  }

  /**
   * Crea un nuevo módulo
   */
  async createModule(courseId: string, moduleData: Partial<Module>): Promise<Module | null> {
    try {
      const subtopicData = DataAdapter.moduleToSubtopic(moduleData as Module, courseId);
      const response = await apiService.createSubtopic(subtopicData);
      
      if (response.success && response.data) {
        return DataAdapter.subtopicToModule(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error creating module:', error);
      return null;
    }
  }

  /**
   * Actualiza un módulo existente
   */
  async updateModule(id: string, moduleData: Partial<Module>): Promise<Module | null> {
    try {
      const subtopicData = DataAdapter.moduleToSubtopic(moduleData as Module, '');
      const response = await apiService.updateSubtopic({ ...subtopicData, id });
      
      if (response.success && response.data) {
        return DataAdapter.subtopicToModule(response.data);
      }
      return null;
    } catch (error) {
      console.error('Error updating module:', error);
      return null;
    }
  }

  /**
   * Elimina un módulo
   */
  async deleteModule(id: string): Promise<boolean> {
    try {
      const response = await apiService.deleteSubtopic(id);
      return response.success;
    } catch (error) {
      console.error('Error deleting module:', error);
      return false;
    }
  }

  // ==================== PROGRESO ====================

  /**
   * Obtiene el progreso de un usuario en todos los cursos
   */
  async getUserProgress(userId: string): Promise<CourseProgress[]> {
    try {
      console.log('🔍 [CourseService] Obteniendo progreso para usuario:', userId);
      const response = await apiService.getProgressByUser(userId);
      
      if (response.success && response.data) {
        console.log('✅ [CourseService] Progreso obtenido exitosamente:', response.data.length, 'registros');
        // Obtener todos los cursos para mapear el progreso
        const coursesResponse = await this.getCourses();
        return DataAdapter.progressArrayToCourseProgress(response.data, coursesResponse);
      } else {
        console.log('⚠️ [CourseService] No se encontró progreso para el usuario o respuesta fallida');
        return [];
      }
    } catch (error) {
      console.error('❌ [CourseService] Error fetching user progress:', error);
      // Retornar array vacío para evitar loops infinitos
      return [];
    }
  }

  /**
   * Obtiene el progreso de un usuario en un curso específico
   */
  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgress | null> {
    try {
      const response = await apiService.getProgressByUser(userId);
      if (response.success && response.data) {
        const course = await this.getCourseById(courseId);
        if (course) {
          return DataAdapter.progressToCourseProgress(response.data, courseId, course.modules);
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      return null;
    }
  }

  /**
   * Marca un módulo como completado
   */
  async completeModule(userId: string, moduleId: string): Promise<boolean> {
    try {
      const progressData = {
        userId,
        subtopicId: moduleId,
        progressType: 'learning',
        percentage: 100,
        completedAt: new Date().toISOString(),
      };

      const response = await apiService.createProgress(progressData);
      return response.success;
    } catch (error) {
      console.error('Error completing module:', error);
      return false;
    }
  }

  /**
   * Actualiza el progreso de un módulo
   */
  async updateModuleProgress(
    userId: string, 
    moduleId: string, 
    percentage: number
  ): Promise<boolean> {
    try {
      const progressData = {
        userId,
        subtopicId: moduleId,
        progressType: 'learning',
        percentage,
        completedAt: percentage === 100 ? new Date().toISOString() : undefined,
      };

      const response = await apiService.createProgress(progressData);
      return response.success;
    } catch (error) {
      console.error('Error updating module progress:', error);
      return false;
    }
  }

  // ==================== BÚSQUEDA Y FILTROS ====================

  /**
   * Busca cursos por término
   */
  async searchCourses(query: string): Promise<Course[]> {
    try {
      const courses = await this.getCourses();
      const searchTerm = query.toLowerCase();
      
      return courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching courses:', error);
      return [];
    }
  }

  /**
   * Filtra cursos por categoría
   */
  async getCoursesByCategory(category: string): Promise<Course[]> {
    try {
      const courses = await this.getCourses();
      return courses.filter(course => course.category === category);
    } catch (error) {
      console.error('Error filtering courses by category:', error);
      return [];
    }
  }

  /**
   * Filtra cursos por nivel
   */
  async getCoursesByLevel(level: "Principiante" | "Intermedio" | "Avanzado"): Promise<Course[]> {
    try {
      const courses = await this.getCourses();
      return courses.filter(course => course.level === level);
    } catch (error) {
      console.error('Error filtering courses by level:', error);
      return [];
    }
  }

  /**
   * Obtiene cursos recomendados para un usuario
   */
  async getRecommendedCourses(userId: string): Promise<Course[]> {
    try {
      const userProgress = await this.getUserProgress(userId);
      const allCourses = await this.getCourses();
      
      // Filtrar cursos que el usuario no ha completado
      const completedCourseIds = userProgress
        .filter(p => p.progressPercentage === 100)
        .map(p => p.courseId);
      
      return allCourses.filter(course => !completedCourseIds.includes(course.id));
    } catch (error) {
      console.error('Error getting recommended courses:', error);
      return [];
    }
  }

  // ==================== ESTADÍSTICAS ====================

  /**
   * Obtiene estadísticas de un curso
   */
  async getCourseStats(courseId: string): Promise<{
    totalStudents: number;
    averageProgress: number;
    completionRate: number;
  }> {
    try {
      const progressResponse = await apiService.getProgress();
      if (progressResponse.success && progressResponse.data) {
        const courseProgress = progressResponse.data.filter(p => {
          // Filtrar progreso relacionado con este curso
          // Esto requeriría una relación más directa en el backend
          return true; // Placeholder
        });

        const totalStudents = new Set(courseProgress.map(p => p.userId)).size;
        const averageProgress = courseProgress.length > 0 
          ? courseProgress.reduce((sum, p) => sum + p.percentage, 0) / courseProgress.length 
          : 0;
        const completionRate = courseProgress.length > 0
          ? (courseProgress.filter(p => p.percentage === 100).length / courseProgress.length) * 100
          : 0;

        return {
          totalStudents,
          averageProgress: Math.round(averageProgress),
          completionRate: Math.round(completionRate),
        };
      }
      
      return {
        totalStudents: 0,
        averageProgress: 0,
        completionRate: 0,
      };
    } catch (error) {
      console.error('Error getting course stats:', error);
      return {
        totalStudents: 0,
        averageProgress: 0,
        completionRate: 0,
      };
    }
  }

  // ==================== UTILIDADES ====================

  /**
   * Obtiene las categorías disponibles
   */
  async getCategories(): Promise<string[]> {
    try {
      const courses = await this.getCourses();
      const categories = new Set(courses.map(course => course.category));
      return Array.from(categories);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  /**
   * Obtiene los niveles disponibles
   */
  async getLevels(): Promise<("Principiante" | "Intermedio" | "Avanzado")[]> {
    return ["Principiante", "Intermedio", "Avanzado"];
  }

  // Teacher-specific methods
  async getTeacherCourses(teacherId: string): Promise<Course[]> {
    try {
      const subjects = await apiService.getSubjectsByTeacherId(teacherId)
      return subjects.map(subject => DataAdapter.subjectToCourse(subject))
    } catch (error) {
      console.error('Error fetching teacher courses:', error)
      return []
    }
  }
}

export const courseService = new CourseService();
