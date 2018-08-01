<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
@import './common/common.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

* {
  margin: 0;
  padding: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

h1, 
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
  list-style: none;
}

li {
  list-style: none;
}

a {
  color: #42b983;
  text-decoration: none;
}


/*iconfont 更换图标代码*/
@font-face {
  font-family: 'iconfont';  /* project id 517586 */
  src: url('//at.alicdn.com/t/font_517586_z2dl4ptrfuyds4i.eot');
  src: url('//at.alicdn.com/t/font_517586_z2dl4ptrfuyds4i.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_517586_z2dl4ptrfuyds4i.woff') format('woff'),
  url('//at.alicdn.com/t/font_517586_z2dl4ptrfuyds4i.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_517586_z2dl4ptrfuyds4i.svg#iconfont') format('svg');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

/*滚轮重置*/
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0.2);
    -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:vertical {
    height: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
    width: 5px;
    background-color: rgba(125, 125, 125, 0.7);
    -webkit-border-radius: 6px;
}

/*elementui 一些样式的全局更改及配置*/
</style>
