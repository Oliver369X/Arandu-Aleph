// Adaptador de datos para convertir entre SchoolAI y ARANDU
import type { Subject, Subtopic, Progress, User, ClassAssignment, AIFeedback } from './api';

// Re-export AIFeedback for use in components
export type { AIFeedback };

// Interfaces de ARANDU (frontend)
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  instructor: {
    name: string;
    email: string;
    image?: string;
  };
  price: number;
  rating: number;
  studentsCount: number;
  totalStudents?: number;
  duration: number;
  modules: Module[];
  thumbnail: string;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  completed?: boolean;
  progress?: number;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedModules: string[];
  currentModule: string;
  progressPercentage: number;
  lastAccessed: string;
  totalModules: number;
  completedModulesCount: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  recipient: User;
  courseId: string;
  tokenId: string;
  blockchainNetwork: string;
  transactionHash: string;
  issuedAt: string;
  verified: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: QuizQuestion[];
  timeLimit: number;
  passingScore: number;
  attempts: number;
  currentAttempt: number;
}

export interface QuizQuestion {
  id: string;
  type: "single" | "multiple";
  question: string;
  options: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation?: string;
}

export class DataAdapter {
  // ==================== CONVERSIÓN DE CURSOS ====================

  /**
   * Convierte un Subject de SchoolAI a un Course de ARANDU
   */
  static subjectToCourse(subject: Subject, teacher?: User): Course {
    return {
      id: subject.id,
      title: subject.name,
      description: subject.description || "Sin descripción",
      instructor: {
        name: teacher?.name || "Instructor",
        email: teacher?.email || "",
        image: teacher?.image,
      },
      modules: subject.subtopics?.map(this.subtopicToModule) || [],
      category: this.mapCategory(subject.name),
      level: this.mapLevel(subject.name),
      price: 0, // Gratuito por defecto
      rating: 4.5, // Rating por defecto
      studentsCount: subject.assignments?.length || 0,
      duration: this.calculateDuration(subject.subtopics),
      thumbnail: this.getCourseThumbnail(subject.name),
      createdAt: subject.createdAt || new Date().toISOString(),
      updatedAt: subject.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Convierte un array de Subjects a Courses
   */
  static subjectsToCourses(subjects: Subject[], teachers?: User[]): Course[] {
    return subjects.map((subject) => {
      const teacher = teachers?.find(t => 
        subject.assignments?.some(a => a.teacherId === t.id)
      );
      return this.subjectToCourse(subject, teacher);
    });
  }

  // ==================== CONVERSIÓN DE MÓDULOS ====================

  /**
   * Convierte un Subtopic de SchoolAI a un Module de ARANDU
   */
  static subtopicToModule(subtopic: Subtopic): Module {
    return {
      id: subtopic.id,
      title: subtopic.name,
      description: subtopic.description || "Sin descripción",
      content: subtopic.content || "",
      videoUrl: subtopic.videoUrl,
      duration: subtopic.duration || 30,
      order: subtopic.order || 1,
      completed: subtopic.progress?.percentage === 100,
      progress: subtopic.progress?.percentage || 0,
    };
  }

  /**
   * Convierte un array de Subtopics a Modules
   */
  static subtopicsToModules(subtopics: Subtopic[]): Module[] {
    return subtopics.map(this.subtopicToModule);
  }

  // ==================== CONVERSIÓN DE PROGRESO ====================

  /**
   * Convierte Progress de SchoolAI a CourseProgress de ARANDU
   */
  static progressToCourseProgress(
    progress: Progress[],
    courseId: string,
    modules: Module[]
  ): CourseProgress {
    const courseProgress = progress.filter(p => 
      modules.some(m => m.id === p.subtopicId)
    );

    const completedModules = courseProgress
      .filter(p => p.percentage === 100)
      .map(p => p.subtopicId);

    const currentModule = courseProgress
      .filter(p => p.percentage > 0 && p.percentage < 100)
      .sort((a, b) => b.percentage - a.percentage)[0]?.subtopicId || "";

    const totalProgress = courseProgress.reduce((sum, p) => sum + p.percentage, 0);
    const averageProgress = courseProgress.length > 0 ? totalProgress / courseProgress.length : 0;

    return {
      userId: courseProgress[0]?.userId || "",
      courseId,
      completedModules,
      currentModule,
      progressPercentage: Math.round(averageProgress),
      lastAccessed: courseProgress[0]?.updatedAt || new Date().toISOString(),
      totalModules: modules.length,
      completedModulesCount: completedModules.length,
    };
  }

  /**
   * Convierte múltiples Progress a un array de CourseProgress
   */
  static progressArrayToCourseProgress(
    progress: Progress[],
    courses: Course[]
  ): CourseProgress[] {
    const courseProgressMap = new Map<string, Progress[]>();

    // Agrupar progreso por curso
    progress.forEach(p => {
      const course = courses.find(c => 
        c.modules.some(m => m.id === p.subtopicId)
      );
      if (course) {
        if (!courseProgressMap.has(course.id)) {
          courseProgressMap.set(course.id, []);
        }
        courseProgressMap.get(course.id)!.push(p);
      }
    });

    // Convertir cada grupo a CourseProgress
    return Array.from(courseProgressMap.entries()).map(([courseId, courseProgress]) => {
      const course = courses.find(c => c.id === courseId)!;
      return this.progressToCourseProgress(courseProgress, courseId, course.modules);
    });
  }

  // ==================== CONVERSIÓN DE USUARIOS ====================

  /**
   * Convierte User de SchoolAI al formato de ARANDU
   */
  static userToAranduUser(user: User): any {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: this.mapRole(user.roles),
      avatar: user.image,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // ==================== CONVERSIÓN DE IA FEEDBACK ====================

  /**
   * Convierte AIFeedback de SchoolAI a formato de lección
   */
  static aiFeedbackToLesson(feedback: AIFeedback[]): any {
    const sortedFeedback = feedback.sort((a, b) => a.stepNumber - b.stepNumber);
    
    return {
      steps: sortedFeedback.map(f => ({
        id: f.id,
        stepNumber: f.stepNumber,
        title: f.stepName,
        content: f.content,
        duration: f.timeMinutes,
        studentActivity: f.studentActivity,
        timeAllocation: f.timeAllocation,
        materialsNeeded: f.materialsNeeded,
        successIndicator: f.successIndicator,
      })),
      totalDuration: sortedFeedback.reduce((sum, f) => sum + f.timeMinutes, 0),
      totalSteps: sortedFeedback.length,
    };
  }

  // ==================== CONVERSIÓN DE EVALUACIONES ====================

  /**
   * Crea un Quiz basado en el progreso y feedback de IA
   */
  static createQuizFromProgress(
    courseId: string,
    modules: Module[],
    aiFeedback: AIFeedback[]
  ): Quiz {
    const questions: QuizQuestion[] = aiFeedback
      .filter(f => f.content.includes("?") || f.content.includes("¿"))
      .slice(0, 10)
      .map((f, index) => ({
        id: `q_${index}`,
        type: "single" as const,
        question: this.extractQuestionFromContent(f.content),
        options: this.generateOptionsFromContent(f.content),
        correctAnswer: "Opción correcta", // Esto se generaría con IA
        explanation: f.successIndicator,
      }));

    return {
      id: `quiz_${courseId}`,
      title: `Evaluación: ${modules[0]?.title || "Curso"}`,
      courseId,
      questions,
      timeLimit: 30, // 30 minutos
      passingScore: 70,
      attempts: 3,
      currentAttempt: 1,
    };
  }

  // ==================== FUNCIONES AUXILIARES ====================

  /**
   * Mapea categorías basado en el nombre del curso
   */
  static mapCategory(courseName: string): string {
    const name = courseName.toLowerCase();
    
    if (name.includes("matemática") || name.includes("álgebra") || name.includes("cálculo")) {
      return "Matemáticas";
    }
    if (name.includes("ciencia") || name.includes("física") || name.includes("química")) {
      return "Ciencias";
    }
    if (name.includes("programación") || name.includes("código") || name.includes("desarrollo")) {
      return "Tecnología";
    }
    if (name.includes("historia") || name.includes("geografía")) {
      return "Humanidades";
    }
    if (name.includes("inglés") || name.includes("español") || name.includes("idioma")) {
      return "Idiomas";
    }
    
    return "General";
  }

  /**
   * Mapea niveles basado en el nombre del curso
   */
  static mapLevel(courseName: string): "Principiante" | "Intermedio" | "Avanzado" {
    const name = courseName.toLowerCase();
    
    if (name.includes("básico") || name.includes("introducción") || name.includes("fundamentos")) {
      return "Principiante";
    }
    if (name.includes("avanzado") || name.includes("experto") || name.includes("master")) {
      return "Avanzado";
    }
    
    return "Intermedio";
  }

  /**
   * Mapea roles de SchoolAI a ARANDU
   */
  static mapRole(roles: string[]): "student" | "teacher" | "institution" {
    if (roles.includes("admin")) {
      return "institution";
    }
    if (roles.includes("teacher")) {
      return "teacher";
    }
    return "student";
  }

  /**
   * Calcula la duración total de un curso
   */
  static calculateDuration(subtopics?: Subtopic[]): number {
    if (!subtopics) return 0;
    return subtopics.reduce((total, subtopic) => total + (subtopic.duration || 30), 0);
  }

  /**
   * Obtiene el thumbnail del curso basado en la categoría
   */
  static getCourseThumbnail(courseName: string): string {
    const category = this.mapCategory(courseName);
    
    const thumbnails: Record<string, string> = {
      "Matemáticas": "/placeholder-math.jpg",
      "Ciencias": "/placeholder-science.jpg",
      "Tecnología": "/placeholder-tech.jpg",
      "Humanidades": "/placeholder-humanities.jpg",
      "Idiomas": "/placeholder-languages.jpg",
      "General": "/placeholder-course.jpg",
    };
    
    return thumbnails[category] || "/placeholder-course.jpg";
  }

  /**
   * Extrae una pregunta del contenido de IA
   */
  static extractQuestionFromContent(content: string): string {
    // Buscar preguntas en el contenido
    const questionMatch = content.match(/[¿?].*[?¿]/);
    if (questionMatch) {
      return questionMatch[0];
    }
    
    // Si no hay pregunta, crear una basada en el contenido
    return `¿Qué aprendiste sobre ${content.substring(0, 50)}...?`;
  }

  /**
   * Genera opciones para una pregunta
   */
  static generateOptionsFromContent(content: string): string[] {
    // Opciones genéricas basadas en el contenido
    return [
      "Opción A: Concepto correcto",
      "Opción B: Concepto relacionado",
      "Opción C: Concepto incorrecto",
      "Opción D: Ninguna de las anteriores",
    ];
  }

  // ==================== CONVERSIÓN INVERSA ====================

  /**
   * Convierte un Course de ARANDU a un Subject de SchoolAI
   */
  static courseToSubject(course: Course): Partial<Subject> {
    return {
      name: course.title,
      description: course.description,
      // Otros campos se manejarían en el backend
    };
  }

  /**
   * Convierte un Module de ARANDU a un Subtopic de SchoolAI
   */
  static moduleToSubtopic(module: Module, subjectId: string): Partial<Subtopic> {
    return {
      name: module.title,
      description: module.description,
      subjectId,
      content: module.content,
      videoUrl: module.videoUrl,
      duration: module.duration,
      order: module.order,
    };
  }

  /**
   * Convierte CourseProgress de ARANDU a Progress de SchoolAI
   */
  static courseProgressToProgress(
    courseProgress: CourseProgress,
    modules: Module[]
  ): Partial<Progress>[] {
    return modules.map(module => ({
      userId: courseProgress.userId,
      subtopicId: module.id,
      progressType: "learning",
      percentage: courseProgress.completedModules.includes(module.id) ? 100 : 0,
      completedAt: courseProgress.completedModules.includes(module.id) 
        ? courseProgress.lastAccessed 
        : undefined,
    }));
  }
}
