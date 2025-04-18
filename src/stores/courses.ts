import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockCourses, mockModules, mockLessons, mockEnrollments } from '@/data/mockData'
import { useAuthStore } from './auth'

export const useCourseStore = defineStore('courses', () => {
  const courses = ref(mockCourses)
  const modules = ref(mockModules)
  const lessons = ref(mockLessons)
  const enrollments = ref(mockEnrollments)
  const authStore = useAuthStore()
  
  // Get all courses
  const getAllCourses = computed(() => courses.value)
  
  // Get courses by level
  const getCoursesByLevel = (level: string) => {
    return courses.value.filter(course => course.level === level)
  }
  
  // Get courses by subject
  const getCoursesBySubject = (subject: string) => {
    return courses.value.filter(course => course.subject === subject)
  }
  
  // Get courses for current user (student)
  const getEnrolledCourses = computed(() => {
    if (!authStore.user) return []
    
    const userEnrollments = enrollments.value.filter(
      enrollment => enrollment.userId === authStore.user?.id
    )
    
    return userEnrollments.map(enrollment => {
      const course = courses.value.find(c => c.id === enrollment.courseId)
      return {
        ...course,
        progress: enrollment.progress
      }
    })
  })
  
  // Get courses for current trainer
  const getTrainerCourses = computed(() => {
    if (!authStore.user) return []
    
    return courses.value.filter(course => course.trainerId === authStore.user?.id)
  })
  
  // Get a single course by ID
  const getCourseById = (id: number) => {
    return courses.value.find(course => course.id === id)
  }
  
  // Get modules for a course
  const getModulesByCourseId = (courseId: number) => {
    return modules.value.filter(module => module.courseId === courseId)
  }
  
  // Get lessons for a module
  const getLessonsByModuleId = (moduleId: number) => {
    return lessons.value.filter(lesson => lesson.moduleId === moduleId)
  }
  
  // Get a single lesson by ID
  const getLessonById = (id: number) => {
    return lessons.value.find(lesson => lesson.id === id)
  }
  
  // Get students for a course (for trainers)
  const getStudentsByCourseId = (courseId: number) => {
    const courseEnrollments = enrollments.value.filter(
      enrollment => enrollment.courseId === courseId
    )
    
    // In a real app, this would fetch user data from API
    // For demo purposes, we're using simplified data
    return courseEnrollments.map(enrollment => ({
      userId: enrollment.userId,
      progress: enrollment.progress,
      lastActivity: enrollment.lastActivity
    }))
  }
  
  // Enroll in a course
  const enrollInCourse = (courseId: number) => {
    if (!authStore.user) return false
    
    const exists = enrollments.value.some(
      e => e.userId === authStore.user?.id && e.courseId === courseId
    )
    
    if (exists) return false
    
    enrollments.value.push({
      id: enrollments.value.length + 1,
      userId: authStore.user.id,
      courseId,
      progress: 0,
      lastActivity: new Date().toISOString()
    })
    
    return true
  }
  
  // Update course progress
  const updateProgress = (courseId: number, lessonId: number, completed: boolean) => {
    if (!authStore.user) return false
    
    const enrollment = enrollments.value.find(
      e => e.userId === authStore.user?.id && e.courseId === courseId
    )
    
    if (!enrollment) return false
    
    // In a real app, this would be more complex
    // For simplicity, we'll just increment progress by 10%
    if (completed && enrollment.progress < 100) {
      enrollment.progress = Math.min(100, enrollment.progress + 10)
      enrollment.lastActivity = new Date().toISOString()
    }
    
    return true
  }
  
  // Add a new course (admin only)
  const addCourse = (course: any) => {
    const newCourse = {
      id: courses.value.length + 1,
      trainerId: course.trainerId,
      title: course.title,
      description: course.description,
      objectives: course.objectives,
      subject: course.subject,
      level: course.level,
      thumbnail: course.thumbnail || 'https://placehold.co/600x400',
      createdAt: new Date().toISOString()
    }
    
    courses.value.push(newCourse)
    return newCourse.id
  }
  
  // Add a module to a course (admin only)
  const addModule = (module: any) => {
    const newModule = {
      id: modules.value.length + 1,
      courseId: module.courseId,
      title: module.title,
      description: module.description,
      order: module.order
    }
    
    modules.value.push(newModule)
    return newModule.id
  }
  
  // Add a lesson to a module (admin only)
  const addLesson = (lesson: any) => {
    const newLesson = {
      id: lessons.value.length + 1,
      moduleId: lesson.moduleId,
      title: lesson.title,
      type: lesson.type,
      content: lesson.content,
      duration: lesson.duration,
      order: lesson.order
    }
    
    lessons.value.push(newLesson)
    return newLesson.id
  }
  
  return {
    getAllCourses,
    getCoursesByLevel,
    getCoursesBySubject,
    getEnrolledCourses,
    getTrainerCourses,
    getCourseById,
    getModulesByCourseId,
    getLessonsByModuleId,
    getLessonById,
    getStudentsByCourseId,
    enrollInCourse,
    updateProgress,
    addCourse,
    addModule,
    addLesson
  }
})