<template>
  <!--核心组件之播放-->
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <!--唱片区域-->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--歌词区域-->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current' : currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <!--当前显示-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active' : currentLineShow === 'cd'}"></span>
            <span class="dot" :class="{'active' : currentLineShow === 'lyric'}"></span>
          </div>
          <!--拖拽区域-->
          <div class="progress-wrapper">
            <span class="time time-l">{{_format(currenTime)}}</span>
            <div class="progress-bar-wrapper">
              <progressBar
                :percent="percent"
                @percentChange="onProgressBarChange"
              ></progressBar>
            </div>
            <span class="time time-r">{{_format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="currentRem" class="icon-prev"></i>
            </div>
            <!--暂停/播放-->
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="currentAdd" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progressCircle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="playIconMi"></i>
          </progressCircle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="updataTime"
           @ended="end"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import animations from 'create-keyframe-animation' // 写js的方式写动画
  import { prefixStyle } from 'common/js/dom'
  import progressBar from 'base/progress-bar/progress-bar'
  import progressCircle from 'base/progress-circle/progress-circle'
  import { playMode } from 'common/js/config'
  import { shuffle } from 'common/js/util'
  import Lyric from 'lyric-parser'
  import scroll from 'base/scroll/scroll'

  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    data () {
      return {
        songReady: false,
        currenTime: 0,
        radius: 32, // 小播放器大小
        currentLyric: null, // 歌词数据
        currentLineNum: 0, // 歌词高亮
        currentLineShow: 'cd', // 当前显示cd
        playingLyric: '' // cd 页展示歌词
      }
    },
    computed: {
      cdCls () {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon () { // 暂停播放样式
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      playIconMi () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      percent () { // 播放比例 当前时间除以歌曲总时长
        return this.currenTime / this.currentSong.duration
      },
      iconMode () { // 取当前播放状态 匹配对应样式
        return this.mode === playMode.sequence ? 'icon-sequence'
          : this.mode === playMode.loop ? 'icon-loop'
            : 'icon-random'
      },
      ...mapGetters([ // 获取vuex中数据，映射
        'fullScreen', // 播放器收起
        'playlist', // 当前歌手所有歌曲数据
        'currentSong', // 当前歌曲数据
        'playing', // 是否播放
        'currentIndex', // 当前播放歌曲下标
        'mode', // 播放模式
        'sequenceList' // 原始数据
      ])

    },
    created () {
      this.touch = {}
    },
    methods: {
      back () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      enter (el, done) {
        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      togglePlaying () { // 切换播放状态
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      end () { // 播放结束后自动下一首
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.currentAdd()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      currentAdd () { // 下一首
        if (!this.songReady) { // 防止快速下一曲报红
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) { // 暂停时playing为false 取反进入
            this.togglePlaying()
          }
        }

        this.songReady = false
      },
      currentRem () { // 上一首
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex
          if (index === 0) {
            index = this.playlist.length - 1
          } else {
            index = this.currentIndex - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
        }
        this.songReady = false
      },
      ready () {
        this.songReady = true
      },
      error () {
        alert('开通会员方可播放该歌曲,自动为您切换一下首')
        this.songReady = true
        this.currentAdd()
      },
      updataTime (e) {
        this.currenTime = e.target.currentTime
      },
      onProgressBarChange (percent) { // 歌曲进度同步
        const currenTime = this.currentSong.duration * percent // 总时间乘播放比得正确事件
        this.$refs.audio.currentTime = currenTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) { // 歌词时间与歌曲同步
          this.currentLyric.seek(currenTime * 1000)
        }
      },
      changeMode () { // 点击切换模式 设置vuex
        const modes = (this.mode + 1) % 3 // 下标到第三位变成0
        this.setPlayMode(modes) // 修改后写入vuex
        let list = null
        if (this.mode === 2) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.reserGurrentIndex(list)
        this.setPlayList(list)
      },
      reserGurrentIndex (list) { // 切换模式 保持本首歌曲不受影响
        let index = list.findIndex((itme) => {
          return itme.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      getLyric () { // 获取歌词
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric) // Lyric插件处理歌词
          if (this.playing) { // 如果歌曲播放 同事播放歌词
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      handleLyric ({lineNum, txt}) { // 歌词改变回调
        this.currentLineNum = lineNum // 将当前歌词播放到第几行传给currentLineNum
        if (lineNum > 5) { // 第五行以后 歌词滚动到中部
          const lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else { // 置于顶部
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart (e) {
        this.touch.initiated = true
        const touch = e.touches[0]
        this.touch.pageX = touch.pageX // 鼠标点击到元素横向坐标
        this.touch.pageY = touch.pageY // 鼠标点击到元素纵向坐标
      },
      middleTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.pageX // 当前横向滑动位置 - 首次点击横向位置 = 滚动的距离
        const deltaY = touch.pageY - this.touch.pageY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const time = 300
        const left = this.currentLineShow === 'cd' ? 0 : -window.innerWidth // 左边距 cd 0 歌词 -375
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) // 需要向左滚动的距离
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth) // 获取滑动占屏幕比例
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent // 显示隐藏模糊度
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
      middleTouchEnd () {
        let offsetWidth
        let opacity
        if (this.currentLineShow === 'cd') { // 如果当前是cd页 向左偏移比例大于百分之十就变成lyric页
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentLineShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) { // 如果当前是lyric页 滑动比例小于百分之90才会移动
            offsetWidth = 0
            this.currentLineShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity // 显示隐藏
        this.$refs.middleL.style[transitionDuration] = `${time}ms` // 渐变
        this.touch.initiated = false
      },
      _format (interVal) { // 时间戳解析 y:mm
        interVal = interVal | 0
        const minute = interVal / 60 | 0 // 分
        const second = this._pad(interVal % 60) // 秒
        return `${minute}:${second}`
      },
      _pad (num, n = 2) { // 不满补位
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      _getPosAndScale () {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      ...mapMutations({ // vuex更新/增
        setFullScreen: 'SET_FULL_SCREEN', // 更改展示状态
        setPlayingState: 'SET_PLAYING_STATE', // 更改播放状态
        setCurrentIndex: 'SET_CURRENT_INDEX', // 更改播放曲目
        setPlayMode: 'SET_PLAY_MODE', // 更改播放模式
        setPlayList: 'SET_PLAYLIST' // 切换模式切换数据
      })
    },
    watch: {
      // 监听第一个参数是新值 第二个参数是旧值
      currentSong (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        setTimeout(() => {
          newPlaying ? audio.play() : audio.pause()
        }, 1000)
      }
    },
    components: {
      progressBar,
      progressCircle,
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

    @keyframes rotate
      0%
        transform: rotate(0)
      100%
        transform: rotate(360deg)
</style>
