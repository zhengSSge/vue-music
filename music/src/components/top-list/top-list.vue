<template>
  <!--歌手排行歌曲列表页-->
  <transition name="rank">
    <musicList :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from 'src/components/music-list/music-list'
  import { getMusicList } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { mapGetters } from 'vuex'
  import { createSong } from 'common/js/song'

  export default {
    computed: {
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    created () {
      this._getMusicList()
    },
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push(
            {
              path: '/rank'
            }
          )
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
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
