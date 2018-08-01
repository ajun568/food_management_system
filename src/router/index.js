import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken, removeToken } from 'util/auth.js'

//路由懒加载
const LazyLoading = file => () => import(`pages/${file}.vue`)

Vue.use(VueRouter)

export const router = new VueRouter({
    routes: [
        {
        	name: 'Login', 
        	path: '/login',
        	component: LazyLoading('login/login'),
        },{
            path: '/',
            component: LazyLoading('index'),
            children: [{
                name: 'Home',
                path: '/',
                component: LazyLoading('store/home'),
            },{
                name: 'Subbranch',
                path: '/subbranch',
                component: LazyLoading('store/Subbranch'),
            },{
                name: 'AddCategory',
                path: '/addCategory',
                component: LazyLoading('foodManage/addCategory'),
            },{
                name: 'CategoryList',
                path: '/categoryList',
                component: LazyLoading('foodManage/categoryList'),
            },{
                name: 'AddFood',
                path: '/addFood',
                component: LazyLoading('foodManage/addFood'),
            },{
                name: 'FoodsList',
                path: '/foodsList',
                component: LazyLoading('foodManage/foodsList'),
            },{
                name: 'AddTable',
                path: '/addTable',
                component: LazyLoading('foodManage/addTable'),
            },{
                name: 'TableList',
                path: '/tableList',
                component: LazyLoading('foodManage/tableList'),
            },{
                name: 'AddCoupon',
                path: '/addCoupon',
                component: LazyLoading('store/addCoupon'),
            },{
                name: 'CouponList',
                path: '/couponList',
                component: LazyLoading('store/couponList'),
            }],
        },
    ]
})

router.beforeEach((to, from, next) => {
    let userInfo = sessionStorage.getItem('token');
  if(userInfo) {
    next();
  } else {
    if(to.path == '/login' || to.path == '/register') {
        next();
    } else {
        next('/login');
    }
  }
})

export default router