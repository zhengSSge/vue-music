import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 路由懒加载
const Recommend = (resolve) => {
  import('src/components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}

const Search = (resolve) => {
  import('src/components/search/search').then((search) => {
    resolve(search)
  })
}

const Singer = (resolve) => {
  import('src/components/singer/singer').then((singer) => {
    resolve(singer)
  })
}

const Rank = (resolve) => {
  import('src/components/rank/rank').then((rank) => {
    resolve(rank)
  })
}

const SingerDetail = (resolve) => {
  import('src/components/singer-detail/singer-detail').then((singerdetail) => {
    resolve(singerdetail)
  })
}

const Disc = (resolve) => {
  import('src/components/disc/disc').then((disc) => {
    resolve(disc)
  })
}

const Acti = (resolve) => {
  import('src/components/top-list/top-list').then((toplist) => {
    resolve(toplist)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      // 二级路由
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: Acti
        }
      ]
    }
  ]
})
