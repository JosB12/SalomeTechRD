// Mock Users
export const mockUsers = [
  {
    id: 1,
    name: 'Juan Estudiante',
    email: 'student@example.com',
    password: 'password',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Estudiante&background=random'
  },
  {
    id: 2,
    name: 'Maria Capacitadora',
    email: 'trainer@example.com',
    password: 'password',
    role: 'trainer',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Capacitadora&background=random'
  },
  {
    id: 3,
    name: 'Carlos Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Admin&background=random'
  }
]

// Mock Courses
export const mockCourses = [
  {
    id: 1,
    trainerId: 2,
    title: 'Fundamentos de Pedagogía Moderna',
    description: 'Un curso completo sobre los fundamentos de la pedagogía moderna y su aplicación en el aula.',
    objectives: [
      'Comprender los principios básicos de la pedagogía moderna',
      'Aplicar metodologías actuales en el aula',
      'Desarrollar estrategias de enseñanza efectivas'
    ],
    subject: 'Pedagogía',
    level: 'Principiante',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    createdAt: '2023-01-15T00:00:00.000Z'
  },
  {
    id: 2,
    trainerId: 2,
    title: 'Tecnología Educativa en el Aula Digital',
    description: 'Aprende a integrar herramientas tecnológicas en tus clases para mejorar el aprendizaje.',
    objectives: [
      'Conocer las principales herramientas digitales para educación',
      'Integrar la tecnología en el plan de estudios',
      'Evaluar el impacto de las herramientas digitales'
    ],
    subject: 'Tecnología Educativa',
    level: 'Intermedio',
    thumbnail: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=800&auto=format&fit=crop',
    createdAt: '2023-02-20T00:00:00.000Z'
  },
  {
    id: 3,
    trainerId: 2,
    title: 'Educación Inclusiva: Estrategias y Prácticas',
    description: 'Estrategias para crear un ambiente inclusivo y adaptado a las necesidades de todos los estudiantes.',
    objectives: [
      'Identificar las necesidades de estudiantes diversos',
      'Diseñar planes de estudio inclusivos',
      'Implementar adaptaciones curriculares efectivas'
    ],
    subject: 'Educación Inclusiva',
    level: 'Avanzado',
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop',
    createdAt: '2023-03-10T00:00:00.000Z'
  },
  {
    id: 4,
    trainerId: 2,
    title: 'Evaluación Formativa en Educación',
    description: 'Métodos y técnicas de evaluación formativa para mejorar el proceso de aprendizaje.',
    objectives: [
      'Comprender los principios de la evaluación formativa',
      'Diseñar instrumentos de evaluación efectivos',
      'Implementar estrategias de retroalimentación constructiva'
    ],
    subject: 'Evaluación Educativa',
    level: 'Intermedio',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    createdAt: '2023-04-05T00:00:00.000Z'
  },
  {
    id: 5,
    trainerId: 2,
    title: 'Gestión del Aula y Clima Escolar',
    description: 'Estrategias para crear un ambiente positivo de aprendizaje y manejar eficazmente el aula.',
    objectives: [
      'Desarrollar técnicas de gestión del aula',
      'Crear un clima escolar positivo',
      'Resolver conflictos de manera constructiva'
    ],
    subject: 'Gestión Educativa',
    level: 'Principiante',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    createdAt: '2023-05-12T00:00:00.000Z'
  },
  {
    id: 6,
    trainerId: 2,
    title: 'Neurociencia Aplicada al Aprendizaje',
    description: 'Fundamentos de neurociencia y su aplicación en estrategias de enseñanza efectivas.',
    objectives: [
      'Comprender los principios básicos de la neurociencia educativa',
      'Aplicar estrategias basadas en neurociencia',
      'Optimizar el aprendizaje mediante conocimientos neurocientíficos'
    ],
    subject: 'Neurociencia Educativa',
    level: 'Avanzado',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    createdAt: '2023-06-18T00:00:00.000Z'
  }
]

// Mock Modules
export const mockModules = [
  {
    id: 1,
    courseId: 1,
    title: 'Introducción a la Pedagogía Moderna',
    description: 'Fundamentos y principios básicos de la pedagogía moderna',
    order: 1
  },
  {
    id: 2,
    courseId: 1,
    title: 'Estrategias Didácticas Contemporáneas',
    description: 'Exploración de metodologías y estrategias de enseñanza actuales',
    order: 2
  },
  {
    id: 3,
    courseId: 1,
    title: 'Evaluación del Aprendizaje',
    description: 'Métodos de evaluación efectivos para el aula moderna',
    order: 3
  },
  {
    id: 4,
    courseId: 2,
    title: 'Herramientas Digitales para Educadores',
    description: 'Conoce las herramientas digitales más relevantes para el aula',
    order: 1
  },
  {
    id: 5,
    courseId: 2,
    title: 'Integración de Tecnología en el Currículum',
    description: 'Estrategias para integrar la tecnología en tus clases diarias',
    order: 2
  },
  {
    id: 6,
    courseId: 3,
    title: 'Fundamentos de la Educación Inclusiva',
    description: 'Principios básicos de la inclusión en entornos educativos',
    order: 1
  }
]

// Mock Lessons
export const mockLessons = [
  {
    id: 1,
    moduleId: 1,
    title: 'Evolución de la Pedagogía en el Siglo XXI',
    type: 'video',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 15,
    order: 1
  },
  {
    id: 2,
    moduleId: 1,
    title: 'Principales Corrientes Pedagógicas Contemporáneas',
    type: 'text',
    content: `
      <h2>Corrientes Pedagógicas Contemporáneas</h2>
      
      <p>La pedagogía moderna se ha diversificado en múltiples corrientes. A continuación, exploraremos las más influyentes:</p>
      
      <h3>1. Constructivismo</h3>
      <p>Basado en las teorías de Piaget y Vygotsky, propone que el conocimiento se construye activamente por el estudiante.</p>
      
      <h3>2. Pedagogía Crítica</h3>
      <p>Inspirada en Paulo Freire, busca empoderar a los estudiantes para cuestionar y transformar las estructuras sociales.</p>
      
      <h3>3. Aprendizaje Basado en Proyectos</h3>
      <p>Metodología que involucra a los estudiantes en proyectos complejos y significativos para desarrollar conocimientos y habilidades.</p>
    `,
    duration: 20,
    order: 2
  },
  {
    id: 3,
    moduleId: 1,
    title: 'La Neurociencia y su Impacto en la Pedagogía',
    type: 'video',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 18,
    order: 3
  },
  {
    id: 4,
    moduleId: 2,
    title: 'Aprendizaje Basado en Proyectos',
    type: 'video',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 22,
    order: 1
  },
  {
    id: 5,
    moduleId: 2,
    title: 'Aula Invertida: Fundamentos y Aplicación',
    type: 'pdf',
    content: 'https://example.com/aula-invertida.pdf',
    duration: 25,
    order: 2
  },
  {
    id: 6,
    moduleId: 4,
    title: 'Herramientas de Colaboración Digital para el Aula',
    type: 'video',
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: 20,
    order: 1
  }
]

// Mock Enrollments
export const mockEnrollments = [
  {
    id: 1,
    userId: 1,
    courseId: 1,
    progress: 30,
    lastActivity: '2023-09-15T14:30:00.000Z'
  },
  {
    id: 2,
    userId: 1,
    courseId: 2,
    progress: 15,
    lastActivity: '2023-09-18T10:45:00.000Z'
  },
  {
    id: 3,
    userId: 1,
    courseId: 5,
    progress: 60,
    lastActivity: '2023-09-20T16:20:00.000Z'
  }
]