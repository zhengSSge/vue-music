<template>
  <transition name="slide">
    <MusicList></MusicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'src/components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { mapGetters } from 'vuex' // 取数据语法堂

  export default {
    data () {
      return {
        singerDateil: []
      }
    },
    computed: {
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
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.singerDateil = res.data.list
            console.log(this.singerDateil)
          }
        })
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
