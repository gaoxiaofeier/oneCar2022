<!--
 * @Descripttion: 
 * @version: X3版本
 * @Author: GaoFei
 * @Date: 2020-02-19 23:22:10
 * @LastEditors: GaoFei
 * @LastEditTime: 2022-02-13 10:58:46
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App' 
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
/* 解决element-ui的table表格控件表头与内容列不对齐问题 */
.el-table th.gutter {
  display: table-cell !important;
}
</style>
