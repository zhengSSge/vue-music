<template>
  <!--歌手排行歌曲列表页-->
  <transition name="rank">
    <musicList :title="title" :bgImage="bgImage"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from 'src/components/music-list/music-list'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        return this.topList.picUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._getTopList()
    },
    methods: {
      _getTopList () {
        if (!this.topList.id) {
          this.$router.push(
            {
              path: '/ranks'
            }
          )
        }
      }
    },
    components: {
      musicList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .rank-enter-active, .rank-leave-active
    transition: all 0.3s

  .rank-enter, .rank-leave-to
    transform: translate3d(100%, 0, 0)
</style>
