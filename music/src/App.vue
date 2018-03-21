<template>
  <!--项目呈现页-->
  <div id="app">
    <Mheader></Mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
  import Mheader from 'src/components/m-header/m-header'
  import Tab from 'src/components/tab/tab'
  import Player from 'src/components/player/player'

  export default {
    components: {
      Tab,
      Mheader,
      Player
    }
  }
</script>

<style>
</style>
