import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'src/components/recommend/recommend'
import Search from 'src/components/search/search'
import Singer from 'src/components/singer/singer'
import Rank from 'src/components/rank/rank'
import SingerDetail from 'src/components/singer-detail/singer-detail'
import Disc from 'src/components/disc/disc'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer,
      // 二级路由
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    }
  ]
})
