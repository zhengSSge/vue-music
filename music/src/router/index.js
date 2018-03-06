import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'src/components/recommend/recommend'
import Search from 'src/components/search/search'
import Singer from 'src/components/singer/singer'
import Rank from 'src/components/rank/rank'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/rank',
      component: Rank
    }
  ]
})
