<template>
  <!--封装滑动-->
  <!--wrapper是父容器，它会有固定的高度。content是父容器的第一个子元素，它的高度会随着内容的大小而撑高。那么，当 content 的高度不超过父容器的高度，是不能滚动的，而它一旦超过了父容器的高度，我们就可以滚动内容区了，这就是 better-scroll 的滚动原理。-->
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
        if (this.pullup) { // 是否派发滚动到底部事件，用于上拉加载
          this.scroll.on('scrollEnd', () => { // 滚动结束派发 scrollEnd 它只派发一次
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) { // 如果y 小于 maxScrollY 说明快到底部了
              this.$emit('scrollToEnd') // 然后派发事件
            }
          })
        }
        /**
         this.scroll.on('touchend', (pos) => { // 是否派发顶部下拉事件，用于下拉刷新
          if (pos.y > 50) {
            console.log('下拉刷新')
          }
        })
         */
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
