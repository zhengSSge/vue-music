<template>
  <!--轮播组件-->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <!--slot插槽-->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{ active: currentPageIndex === index }" v-for="(item, index) in dots"
            :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'

  export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._inintSlider()
      }, 20)
      if (this.autoPlay) {
        this._play()
      }
//      变换页面监听视图宽度/更新
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth (isResize) {
//        获取到元素的图片数量
        this.children = this.$refs.sliderGroup.children
        let width = 0
//        获取到轮播显示div宽度
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let childs = this.children[i]
          addClass(childs, 'slider-item')
          childs.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
//        留出滚动宽度所以*2
        if (this.loop && !isResize) {
          width += sliderWidth * 2
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _inintSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', () => {
//          获取到当前第几个子元素
          let pageIndex = this.slider.getCurrentPage().pageX
//          如果是循环播放需要-1  因为循环左右留位了
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearInterval(this.timer)
            this._play()
          }
        })
      },
      _initDots () {
//        获取轮播图片length
        this.dots = new Array(this.children.length)
//        this.dots = this.children.length
      },
      _play () {
//        播放函数
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    destroyed () {
//      组件销毁
      clearInterval(this.timer)
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
