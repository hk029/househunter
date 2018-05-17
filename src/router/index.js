import Vue from 'vue'
import Router from 'vue-router'
import content from '@/components/content'
import aboutme from '@/components/aboutme'
import update from '@/components/update'
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
      path: '/bj',
      name: 'Content',
      component: content
    },
    {
      path: '/hz',
      name: 'Content',
      component: content
    },
    {
      path: '/aboutme',
      name: 'Aboutme',
      component: aboutme
    },
    {
      path: '/update',
      name: 'Update',
      component: update
    }
  ]
})
