// Configuración de roles para ARANDU
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Palabras clave para identificar roles
export const ROLE_KEYWORDS = {
  TEACHER: ['teacher', 'profesor', 'professor', 'instructor', 'educator'],
  ADMIN: ['admin', 'administrator', 'supervisor', 'manager'],
  STUDENT: ['student', 'estudiante', 'alumno', 'learner']
} as const;

// Función para determinar el rol del usuario
export const determineUserRole = (user: any): UserRole => {
  // Verificar si el usuario tiene roles asignados
  if (user.roles && user.roles.length > 0) {
    for (const role of user.roles) {
      const roleLower = role.toLowerCase();
      
      // Verificar si es profesor
      if (ROLE_KEYWORDS.TEACHER.some(keyword => roleLower.includes(keyword))) {
        return ROLES.TEACHER;
      }
      
      // Verificar si es admin
      if (ROLE_KEYWORDS.ADMIN.some(keyword => roleLower.includes(keyword))) {
        return ROLES.ADMIN;
      }
    }
    // Si no coincide con profesor o admin, es estudiante
    return ROLES.STUDENT;
  }
  
  // Si no tiene roles asignados, verificar por email o nombre
  const emailLower = user.email?.toLowerCase() || '';
  const nameLower = user.name?.toLowerCase() || '';
  
  // Verificar si es profesor por email o nombre
  if (ROLE_KEYWORDS.TEACHER.some(keyword => 
    emailLower.includes(keyword) || nameLower.includes(keyword)
  )) {
    return ROLES.TEACHER;
  }
  
  // Verificar si es admin por email o nombre
  if (ROLE_KEYWORDS.ADMIN.some(keyword => 
    emailLower.includes(keyword) || nameLower.includes(keyword)
  )) {
    return ROLES.ADMIN;
  }
  
  // Por defecto, es estudiante
  return ROLES.STUDENT;
};

// Función para obtener la ruta del dashboard según el rol
export const getDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.TEACHER:
      return '/dashboard/teacher';
    case ROLES.STUDENT:
    default:
      return '/dashboard/student';
  }
};

// Función para verificar si un usuario es profesor
export const isTeacher = (user: any): boolean => {
  const role = determineUserRole(user);
  return role === ROLES.TEACHER || role === ROLES.ADMIN;
};

// Función para verificar si un usuario es estudiante
export const isStudent = (user: any): boolean => {
  const role = determineUserRole(user);
  return role === ROLES.STUDENT;
};
