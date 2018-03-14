<template>
  <!--歌手页组件-->
  <div class="singer" ref="singer">
    <Listview :data="singers"></Listview>
  </div>
</template>

<script>
  import Listview from 'base/listview/listview'
  import { getSingerList } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'

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
      }
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
