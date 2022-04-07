import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/admininfo',
    name: 'Admin',
    alwaysShow: true,
    meta: { title: '个人中心', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'admininfo',
        name: 'Admininfo',
        component: () => import('@/views/admininfo/index'),
        meta: { title: '个人信息', icon: 'el-icon-document' }
      }
    ]
  },

  {
    path: '/users',
    component: Layout,
    redirect: '/users/usersinfo',
    name: 'Users',
    alwaysShow: true,
    meta: { title: '用户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'usersinfo',
        name: 'Usersinfo',
        component: () => import('@/views/users/index'),
        meta: { title: '用户', icon: 'el-icon-document' }
      }
    ]
  },
  {
    path: '/movie_type',
    component: Layout,
    redirect: '/movie_type/index',
    name: 'Movie_type',
    alwaysShow: true,
    meta: { title: '电影类型管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/movie_type/index'),
        meta: { title: '电影类型', icon: 'el-icon-files' }
      }
    ]
  },
  {
    path: '/screening_room',
    component: Layout,
    redirect: '/screening_room/index',
    name: 'Screening_room',
    alwaysShow: true,
    meta: { title: '放映厅管理', icon: 'el-icon-location' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/screening_room/index'),
        meta: { title: '放映厅', icon: 'el-icon-data-board' }
      }
    ]
  },
  {
    path: '/hotfilm',
    component: Layout,
    redirect: '/hotfilm/index',
    name: 'Hotfilm',
    alwaysShow: true,
    meta: { title: '热映电影管理', icon: 'el-icon-video-camera-solid' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/hotfilm/index'),
        meta: { title: '热映电影', icon: 'el-icon-film' }
      }
    ]
  },
  {
    path: '/upcoming_movies',
    component: Layout,
    redirect: '/upcoming_movies/index',
    name: 'Upcoming_movies',
    alwaysShow: true,
    meta: { title: '即将上映管理', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/upcoming_movies/index'),
        meta: { title: '即将上映', icon: 'el-icon-film' }
      }
    ]
  },
  {
    path: '/goods_category',
    component: Layout,
    redirect: '/goods_category/index',
    name: 'Goods_category',
    alwaysShow: true,
    meta: { title: '商品分类管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/goods_category/index'),
        meta: { title: '商品分类', icon: 'el-icon-files' }
      }
    ]
  },
  {
    path: '/goods_info',
    component: Layout,
    redirect: '/goods_info/index',
    name: 'Goods_info',
    alwaysShow: true,
    meta: { title: '商品信息管理', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/goods_info/index'),
        meta: { title: '商品信息', icon: 'el-icon-present' }
      }
    ]
  },
  {
    path: '/goods_orders',
    component: Layout,
    redirect: '/goods_orders/index',
    name: 'Goods_orders',
    alwaysShow: true,
    meta: { title: '商品订单管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/goods_orders/index'),
        meta: { title: '商品订单', icon: 'el-icon-document-checked' }
      }
    ]
  },
  {
    path: '/movie_tickets',
    component: Layout,
    redirect: '/movie_tickets/completed',
    name: 'Movie_tickets',
    alwaysShow: true,
    meta: { title: '影票订单管理', icon: 'el-icon-s-ticket' },
    children: [
      {
        path: 'completed',
        name: 'Completed',
        component: () => import('@/views/completed_tickets/index'),
        meta: { title: '已完成订单', icon: 'el-icon-document-checked' }
      },
      {
        path: 'unfinished',
        name: 'Unfinished',
        component: () => import('@/views/unfinished/index'),
        meta: { title: '未完成订单', icon: 'el-icon-document-remove' }
      },
      {
        path: 'canceled',
        name: 'Canceled',
        component: () => import('@/views/canceled/index'),
        meta: { title: '已取消订单', icon: 'el-icon-document-delete' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/call_center',
    name: 'System',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'call_center',
        name: 'Call_center',
        component: () => import('@/views/call_center/index'),
        meta: { title: '客服中心', icon: 'el-icon-service' }
      },
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/system/index'),
        meta: { title: '轮播图管理', icon: 'el-icon-picture-outline' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/chart',
    name: 'Statistics',
    alwaysShow: true,
    meta: { title: '统计中心', icon: 'el-icon-s-marketing' },
    children: [
      {
        path: 'chart',
        name: 'Chart',
        component: () => import('@/views/chart/index'),
        meta: { title: '销售统计', icon: 'el-icon-pie-chart' }
      }
    ]
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
