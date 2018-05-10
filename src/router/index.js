import Vue from 'vue'
import Router from 'vue-router'
import content from '@/components/content'
import index from '@/components/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: index
    },
    {
      path: '/beijing',
      name: 'Content',
      component: content
    },
    {
      path: '/hangzhou',
      name: 'Content',
      component: content
    }
  ]
})
