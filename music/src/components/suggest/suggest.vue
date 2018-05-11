<template>
  <!--搜索结果展示页-->
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="suggest"
          @beforeScroll="beforeScroll"
          :beforeScroll="beforeScrollTow"
          ref="scroll"
  >
    <ul class="suggest-list">
      <li @click="select(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <noResult title="抱歉，暂无搜索结果"></noResult>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import scroll from 'base/scroll/scroll'
  import loading from 'base/loading/loading'
  import noResult from 'base/no-result/no-result'
  import { search } from 'api/search'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  import Singer from 'common/js/singer'
  import { mapMutations, mapActions } from 'vuex'
  import { playlistMinxi } from 'common/js/mixin'

  const TYPE_SINGER = 'singer' // 歌手状态
  const perpage = 20 // 请求数据

  export default {
    mixins: [playlistMinxi],
    props: {
      query: { // 用户输入数据
        type: String,
        default: ''
      },
      showSinger: { // 是否显示歌手
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        page: 1, // 请求页数
        result: [], // 请求数据
        pullup: true, // 是否开启上拉刷新
        hasMore: true, // 是否大于总数据
        beforeScrollTow: true // 开启滚动input失去焦点
      }
    },
    methods: {
      handlePlaylist (playlist) { // 从新计算底部距离
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.scroll.$el.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      search () {
        this.hasMore = true
        this.page = 1
        this.$refs.scroll.scrollTo(0, 0) // 第一次加载初始化到顶部
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data) // 处理数据
            this._checkMore(res.data)
          }
        })
      },
      getIconCls (item) { // 如果有状态代表是歌手并赋上图标
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) { // 歌曲信息拼接
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      suggest () { // 滚动到底部触发改事件
        if (!this.hasMore) { // 已有数据大于总数据不再继续加载
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            let ret = this.result.concat(this._genResult(res.data))

            let json = [] // 去除重复歌手
            for (let key in ret) {
              if (ret[key].singername) {
                json.push(key)
              }
            }
            if (json.length) {
              let i = 0
              if (ret[json[i]].singername === ret[json[i++]].singername) {
                ret.splice([json[i++]], 1)
              }
            }

            this.result = ret
            this._checkMore(res.data)
          }
        })
      },
      select (item) { // 歌手跳转
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.singer(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('selectQuery')
      },
      beforeScroll () {
        this.$emit('beforeScroll')
      },
      _checkMore (data) { // 已有数据大于总数据不再继续加载
        // 没有数据 或者 已加载数据大于总数 返回false
        if (!data.song.list.length || (data.song.curnum + data.song.curpage * perpage) >= data.song.totalnum) {
          this.hasMore = false
        }
      },
      refresh () {
        this.$refs.scroll.refresh()
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) { // 满足条件 把zhida，push进ret 并添加一个状态
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        singer: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query () {
        this.search()
      }
    },
    components: {
      scroll,
      loading,
      noResult
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
