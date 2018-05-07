<template>
  <!--搜索页面-->
  <div class="search">
    <!--搜索框div-->
    <div class="search-box-wrapper">
      <searchBox ref="searchBox" @query="onQueryChange"></searchBox>
    </div>
    <!--热搜div-->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--搜索数据展示div-->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest @beforeScroll="blurInput" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import searchBox from 'base/search-box/search-box'
  import suggest from 'src/components/suggest/suggest'
  import { getHotKey } from 'api/search'
  import { ERR_OK } from 'api/config'
//  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        hotKey: '',
        query: ''
      }
    },
    computer: {
    },
    created () {
      this._getHotKey()
    },
    methods: {
      addQuery (query) {
        this.$refs.searchBox.getQuery(query) // 调用搜索框组件下改变query的方法
      },
      onQueryChange (query) {
        this.query = query
      },
      blurInput() {
        this.$refs.searchBox.blurInput()
      },
      _getHotKey () {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10) // 遍历前十条
          }
        })
      }
    },
    components: {
      searchBox,
      suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
