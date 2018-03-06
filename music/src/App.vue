<template>
  <!--项目呈现页-->
  <div id="app">
    <Mheader></Mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--<player></player>-->
  </div>
</template>

<script>
import Mheader from 'src/components/m-header/m-header'
import Tab from 'src/components/tab/tab'

export default {
  components: {
    Tab,
    Mheader
  }
}
</script>

<style>
</style>
