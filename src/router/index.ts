import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import StudentDashboard from '@/views/student/Dashboard.vue'
import CourseList from '@/views/student/CourseList.vue'
import CourseDetails from '@/views/student/CourseDetails.vue'
import LessonView from '@/views/student/LessonView.vue'
import TrainerDashboard from '@/views/trainer/Dashboard.vue'
import TrainerCourses from '@/views/trainer/Courses.vue'
import TrainerCourseDetails from '@/views/trainer/CourseDetails.vue'
import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminCourses from '@/views/admin/Courses.vue'
import AdminCourseForm from '@/views/admin/CourseForm.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/student',
      name: 'student-dashboard',
      component: StudentDashboard,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/student/courses',
      name: 'student-courses',
      component: CourseList,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/student/courses/:id',
      name: 'student-course-details',
      component: CourseDetails,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/student/lessons/:id',
      name: 'student-lesson-view',
      component: LessonView,
      meta: { requiresAuth: true, role: 'student' }
    },
    {
      path: '/trainer',
      name: 'trainer-dashboard',
      component: TrainerDashboard,
      meta: { requiresAuth: true, role: 'trainer' }
    },
    {
      path: '/trainer/courses',
      name: 'trainer-courses',
      component: TrainerCourses,
      meta: { requiresAuth: true, role: 'trainer' }
    },
    {
      path: '/trainer/courses/:id',
      name: 'trainer-course-details',
      component: TrainerCourseDetails,
      meta: { requiresAuth: true, role: 'trainer' }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/courses',
      name: 'admin-courses',
      component: AdminCourses,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/courses/new',
      name: 'admin-new-course',
      component: AdminCourseForm,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/courses/:id/edit',
      name: 'admin-edit-course',
      component: AdminCourseForm,
      meta: { requiresAuth: true, role: 'admin' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.meta.role as string | undefined

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresAuth && requiredRole && authStore.userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (authStore.userRole === 'student') {
      next('/student')
    } else if (authStore.userRole === 'trainer') {
      next('/trainer')
    } else if (authStore.userRole === 'admin') {
      next('/admin')
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router