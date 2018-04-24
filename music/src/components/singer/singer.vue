<template>
  <!--歌手页组件排名组件 1-->
  <div class="singer" ref="singer">
    <Listview @select="selectSinger" :data="singers"></Listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import Listview from 'base/listview/listview'
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex' // 存数据语法糖

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
//      listview组件冒出被点击事件 并把当前被点击数据传递过来
//      接收到id并push二级路由
      selectSinger (singer) {
        this.$router.push(
          {
            path: `/singer/${singer.id}`
          }
        )
//        把数据存入vuex
        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normaliszSinger(res.data.list)
          }
        })
      },
      _normaliszSinger (list) {
//        总数
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
//          热门歌手只取前十条
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
                id: item.Fsinger_mid, // 图片
                name: item.Fsinger_name // 姓名
              })
            )
          }
//          按照字母排序
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        })
//         为了得到有序列表，我们需要处理 map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME){
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          // charCodeAt方法返回 字符 Unicode 编码
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
//        合并
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      Listview
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
