<template>
  <!--封装滑动-->
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
//      速度
      probeType: {
        type: Number,
        default: 1
      },
//      点击
      click: {
        type: Boolean,
        default: true
      },
//      监听
      listenScroll: {
        type: Boolean,
        default: false
      },
//      数据
      data: {
        type: Array,
        default: null
      },
      listEnScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll () {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listEnScroll) { // 如果监听，向外派发一个事件
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        if (this.pullup) { // 上拉刷新
          this.scroll.on('scrollEnd', () => { // 滚动结束派发 scrollEnd 它只派发一次
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) { // 如果y 小于 maxScrollY 说明快到底部了
              this.$emit('scrollToEnd') // 然后派发事件
            }
          })
        }
      },
//      禁用 better-scroll
      disable () {
        this.scroll && this.scroll.disable()
      },
//      启用 better-scroll，默认开启
      enable () {
        this.scroll && this.scroll.enable()
      },
//      强制 scroll 重新计算
      refresh () {
        this.scroll && this.scroll.refresh()
      },
//      滚动到某个位置
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
//      滚动到某个元素
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
