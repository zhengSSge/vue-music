<template>
  <transition name="slide">
    <musicList :title="title" :bgImage="bgImage" :songs="songs"></musicList>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from 'src/components/music-list/music-list'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { mapGetters } from 'vuex'
  import { songList } from 'common/js/song'

  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSongList()
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push({
            path: '/recommend'
          })
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs (list) {
        console.log(list)
        let ret = []
        list.forEach((musicData) => {
          if (musicData.id && musicData.album.id) {
            ret.push(songList(musicData))
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
