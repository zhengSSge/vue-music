<template>
  <!--搜索框组件-->
  <div class="search-box">
    <i class=""></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import { debounce } from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data () {
      return {
        query: '' // v-model 双向数据绑定 输入显示小叉子 无数据不显示
      }
    },
    created () {
      this.$watch('query', debounce((newQuery) => { // watch 监听 == watch: {}
        this.$emit('query', newQuery)
      }, 200)) // 两百毫秒内多次调用query的话 是不会抛出事件的
    },
    methods: {
      clear () {
        this.query = ''
      },
      blurInput() {
        this.$refs.query.blur()
      },
      getQuery (query) {
        this.query = query
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
