import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    meta: { title: '404' },
    hidden: true
  },
  {
    path: '/refresh',
    name: 'Refresh',
    component: () => import('@/components/Common/refresh'),
    meta: { title: 'refresh' },
    hidden: true
  },
  // 仪表盘
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  // 个人中心
  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'profile',
      name: 'Profile',
      component: () => import('@/views/profile/index'),
      meta: { title: '个人中心' }
    }],
    hidden: true
  },
  // 消息
  {
    path: '/message',
    component: Layout,
    children: [{
      path: 'message',
      name: 'Message',
      component: () => import('@/views/message/message'),
      meta: { title: '消息通知' }
    }],
    hidden: true
  },
  // 发布课程
  {
    path: '/course-create',
    component: Layout,
    children: [{
      path: 'create',
      name: 'CourseCreate',
      component: () => import('@/views/course_add/educourse_add'),
      meta: { title: '发布课程', icon: 'publish' }
    }]
  },
  // 课程列表
  {
    path: '/course-list',
    component: Layout,
    children: [{
      path: 'list',
      name: 'CourseList',
      component: () => import('@/views/course_list/educourse_list'),
      meta: { title: '课程列表', icon: 'course' }
    }]
  },
  // 评论管理
  {
    path: '/comment',
    component: Layout,
    children: [{
      path: 'list',
      name: 'CommentList',
      component: () => import('@/views/comment/comment_list'),
      meta: { title: '评论管理', icon: 'comment' }
    }]
  },
  // 更新课程信息
  {
    path: '/course-update',
    component: Layout,
    hidden: true,
    children: [{
      path: 'update/:id',
      name: 'CourseUpdate',
      component: () => import('@/views/course_update/educourse_update'),
      meta: { title: '更新课程信息', icon: 'publish' }
    }]
  },
  // 评论管理
  {
    path: '/review',
    component: Layout,
    children: [{
      path: 'list',
      name: 'reviewList',
      component: () => import('@/views/course_review/courseReview.vue'),
      meta: { title: '课程评阅', icon: 'el-icon-chat-dot-round' }
    }],
    hidden: true
  },
  {
    path: '/exercise',
    component: Layout,
    children: [{
      path: 'list',
      name: 'exerciseList',
      component: () => import('@/views/course_exercise/exercise_list.vue'),
      meta: { title: '习题管理', icon: 'el-icon-edit-outline' }
    },
    ],
  },
  {
    path: '/exercise/view/:id',
    component: Layout,
    children: [{
      path: 'list',
      name: 'exerciseView',
      component: () => import('@/views/course_exercise/exerciseView.vue'),
      meta: { title: '查看习题' }
    }],
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
