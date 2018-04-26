import { mapGetters } from 'vuex'

export const playlistMinxi = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      // 引用该 minxi 必须声明此函数 不然抛出异常
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
