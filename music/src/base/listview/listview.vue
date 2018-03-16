<template>
  <!--歌手组件-->
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listEnScroll="listEnScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" :key="group.id" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li v-for="item in group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!--右侧元素-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(items, index) in shortcutList"
            :key="index"
            :class="{'current':currentIndex===index}"
            :date-index="index">
          {{items}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import { getData } from 'common/js/dom'

  const ANCHOR_HEIGHT = 18

  export default {
    data () {
      return {
        scrollY: -1, // 接收scroll传递过来的 Y(竖轴)滚动位置（当前位置）
        currentIndex: 0, // 高亮index
        listHeight: [] // 字母每一个元素距离顶部高度
      }
    },
    props: {
      data: {
        type: Array
      }
    },
    created () {
      this.touch = {} // Start /move 互通数据
      this.listEnScroll = true // 启动监听
      this.probeType = 3 // 启动监听
    },
    computed: {
//      计算属性
      shortcutList () {
        return this.data.map((group) => {
//          右侧仅显示单一文字
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
//          移动端点击事件 使左侧滚动到右侧对应位置
      onShortcutTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        this.touch.anchorIndex = anchorIndex // touch加入anchorIndex 记录touch时右侧下标(第几个元素)

        let firstTouch = e.touches[0] // 取到鼠标第一次touch时的 Y点坐标
        this.touch.y1 = firstTouch.pageY

        this._scrollTo(anchorIndex) // 滑动
      },
//          移动端滑动事件
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0] // 取到鼠标第一次Move的 Y点坐标
        this.touch.y2 = firstTouch.clientY

        let delte = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // Y(竖轴)点击偏移值 除去一个元素高=18后取整 得到偏移滑动了几个元素
        let anchorIndex = parseInt(this.touch.anchorIndex) + delte

        this._scrollTo(anchorIndex)
      },
      scroll (pos) {
//        接收scroll传递过来的 Y(竖轴)滚动位置（当前位置）
        this.scrollY = pos.y
      },
      _scrollTo (index) {
        console.log(index !== 0)
//      右侧子元素坐标index==null==false取反为true (相当于点在了无效区域) && index不等于0 (相当于点击在了有效区域)
        if (!index && index !== 0) {
//        不是零且是null return
          return
        }
        this.scrollY = -this.listHeight[index] // 向下滚动是负数
        // 使左侧scroll滚动至与右侧下标相符的方位    /   dom元素           滑动时间
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight () {
        // 字母每一个元素距离顶部高度
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height) // 第一个元素高度0
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight // 依次累加获取每一个元素的高度
          this.listHeight.push(height)
        }
      }
    },
//      监听
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
//        newY 向下滚动是负数 向上滚动是正数
        const listHeight = this.listHeight
//        滚动到顶部 向上滚动
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
//        滚动到中部           length - 1 因为顶部多出一个
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i] // 下限 数字值低
          let height2 = listHeight[i + 1] // 上一个元素的下限是这个元素的上限
          //  当前scroll位置与右侧匹配
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            return
          }
        }
//        滚动到低部        length - 2 因为顶/地部分别多出一个
        this.currentIndex = listHeight.length - 2
      }
    },
    components: {
      scroll
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
