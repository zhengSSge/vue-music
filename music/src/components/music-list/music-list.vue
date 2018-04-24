<template>
  <!--明星照片下拉放大 组件-->
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgImg" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length>0" ref="playWrapper" @click="randomPlays">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      @scroll="scroll"
      :data="songs"
      :probeType="probeType"
      :listEnScroll="listEnScroll"
      class="list" ref="list"
    >
      <div class="song-list-wrapper">
        <!--歌手全部歌曲组件-->
        <songList @select="select" :songs="songs"></songList>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import songList from 'base/song-list/song-list'
  import loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex' // 异步

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    data () {
      return {
        scrollY: 0
      }
    },
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: function () { return [] }
      },
      title: {
        type: String,
        default: ''
      }
    },
    created () {
      this.probeType = 3
      this.listEnScroll = true
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight // 图片到顶部距离
      this.minTransalteY = -this.$refs.bgImage.clientHeight + RESERVED_HEIGHT // 滚动到顶部留出title
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    computed: {
      bgImg () {
        return `background-image:url(${this.bgImage})`
      }
    },
    methods: {
//      点击歌曲列表派出select事件 selectPlay操作vuex
      select (item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
//      随机播放
      randomPlays(){
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([ // 映射
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY (newVal) {
        let zIndex = 0
        let scale = 1
        let blur = 0
        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }
//        模糊涂层
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
//        参1参2 谁大返回谁
        let translateY = Math.max(this.minTransalteY, newVal)
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
//        y轴滚动距离 小于 img到顶部的距离
        if (newVal < this.minTransalteY) {
          zIndex = 10
//        将图片设置为固定的高度(title高) 并提升z-index
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.playWrapper.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playWrapper.style.display = 'block'
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex
      }
    },
    components: {
      scroll,
      songList,
      loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
