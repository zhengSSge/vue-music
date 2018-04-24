<template>
  <!--进度条基础组件-->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!--事件修饰符阻止浏览器默认行为-->
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="processTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  const PROGRESSBTNWIDTH = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
//      创建一个对象关联 touch事件
      this.touch = {}
    },
    methods: {
//      touch
      progressTouchStart (e) {
        this.touch.initiated = true // 表示初始化 已经开始点击
        this.touch.startX = e.touches[0].pageX // 获取点击到横向X坐标
        this.touch.left = this.$refs.progress.clientWidth // 记录:点击时进度条已经偏移了多少值
      },
//      touch 滑动
      progressTouchMove (e) {
        if (!this.touch.initiated) { // 如果都没有点击就进入move 直接退出
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX // 获取横向偏移量
        // 获取滑动距离 不能小于零 切划出 总div
        const fooSetWidth = Math.min(
          this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH, Math.max(
            0, this.touch.left + deltaX
          )
        )
        this._offsetW(fooSetWidth)
      },
//      touch 结束
      processTouchEnd () {
        this.touch.initiated = false
        this._triggerPercent()
      },
//      点击 前进后退
      progressClick (e) {
        const rect = this.$refs.progressBar.getBoundingClientRect() // 获取元素距离页面四周距离
        const offsetWidth = e.pageX - rect.left
        this._offsetW(offsetWidth)
        // this._offsetW(e.offsetX) 此方法获取不准确 改用上方
        this._triggerPercent()
      },
//      滑动动画
      _offsetW (fooSetWidth) {
        this.$refs.progress.style.width = `${fooSetWidth}px` // 设置进度条前进
        this.$refs.progressBtn.style[transform] = `translate3d(${fooSetWidth}px,0,0)` // 设置小球前进
      },
      _triggerPercent () {
        // 获取到已拖动的距离占总比 向外派发
        const percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH)
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTNWIDTH // 获取总进度条宽度
          const fooSetWidth = newPercent * barWidth // 获取偏移量
          this._offsetW(fooSetWidth)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height 30px
    .bar-inner
      position relative
      top 13px
      height 4px
      background rgba(0, 0, 0, 0.3)
      .progress
        position absolute
        height 100%
        background $color-theme
      .progress-btn-wrapper
        position absolute
        left -8px
        top -13px
        width 30px
        height 30px
        .progress-btn
          position relative
          top 7px
          left 7px
          box-sizing border-box
          width 16px
          height 16px
          border 3px solid $color-text
          border-radius 50%
          background $color-theme
</style>
