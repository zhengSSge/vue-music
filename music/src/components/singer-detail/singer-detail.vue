<template>
  <!--歌手详情页 照片 歌曲-->
  <transition name="slide">
    <MusicList :songs="songs" :title="title" :bgImage="bgImage"></MusicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'src/components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { mapGetters } from 'vuex' // 取数据语法糖
  import { createSong } from 'common/js/song' // 封装过滤数据

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
//      取出vuex中之前存入数据
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getDetail()
    },
    methods: {
      _getDetail () {
        if (!this.singer.id) {
//          刷新倒退
          this.$router.push('/singer')
          return
        }
//        请求歌手歌曲
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSings(res.data.list)
          }
        })
      },
      _normalizeSings (list) {
//        使用song类处理数据
        let res = []
        list.forEach((item) => {
//          es6的解构赋值。大括号中的key对应item的key  其值也是相对应的
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            res.push(createSong(musicData))
          }
        })
        return res
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
