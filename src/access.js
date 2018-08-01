import { router } from './router'
import { getToken, removeToken } from 'util/auth'


router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    removeToken()
    next()
  } else {
      if (getToken()) {
        next()
      } else {
        next({ name: 'Login' })
      }
  }
})