<template>
  <div class="left-side">
    <div class="left-side-inner">
      <div style="height:60px;"></div>
      <el-menu class="menu-box" router :default-active="$route.path">
        <div v-for="(item, index) in nav_menu_data" :key="index">
          <el-menu-item class="menu-list" v-if="typeof item.child === 'undefined'" :index="item.path">
            <i 
              class="iconfont" 
              aria-hidden="true"
              v-html="item.icon">
            </i>
            <span v-text="item.title" class="text"></span>
          </el-menu-item>
          <el-submenu :index="item.path" v-else>
            <template slot="title">
              <i 
                class="iconfont" 
                aria-hidden="true"
                v-html="item.icon">
              </i>
              <span v-text="item.title" class="text"></span>
            </template>
            <el-menu-item class="menu-list" v-for="(sub_item, sub_index) in item.child" :index="sub_item.path" :key="sub_index">
              <span v-text="sub_item.title" class="text"></span>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav_menu_data: [
        {
          title: "主页",
          path: "/",
          icon: "&#xe667;"
        },
        {
          title: "门店管理",
          path: "/store",
          icon: "&#xe606;",
          child: [{
            title: "门店设置",
            path: "/subbranch"
          }]
        }, 
        {
          title: "分类管理",
          path: "/category",
          icon: "&#xe66b;",
          child: [{
            title: "添加分类",
            path: "/addCategory"
          }, {
            title: "分类列表",
            path: "/categoryList"
          }]
        }, 
        {
          title: "菜品管理",
          path: "/foods",
          icon: "&#xe603;",
          child: [{
            title: "添加菜品",
            path: "addFood"
          },{
            title: "菜品列表",
            path: "foodsList"
          }]
        },
        {
          title: "餐桌管理",
          path: "/table",
          icon: "&#xeaaf;",
          child: [{
            title: "添加餐桌",
            path: "addTable"
          },{
            title: "餐桌列表",
            path: "tableList"
          }]
        },
        {
          title: "营销管理",
          path: "/marketing",
          icon: "&#xe63f;",
          child: [{
            title: "添加优惠券",
            path: "addCoupon"
          },{
            title: "优惠券列表",
            path: "couponList"
          }]
        },
      ]
    }
  }
}
</script>

<style lang="less" scoped>
@sidebar-bg: #283444;
.left-side {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 220px;
  height: 100%;
  overflow-y: auto;
  background-color: @sidebar-bg;
}
</style>

<style lang="less">
@sidebar-bg: #283444;
.left-side {
  .menu-box {
    background-color: @sidebar-bg;
    .menu-list,
    .el-submenu__title {
      width: 220px;
      height: 45px;
      line-height: 45px;
      color: #fff;
      background-color: @sidebar-bg;
      .icon {
        width: 16px;
        font-size: 14px;
      }
      .text {
        margin-left: 10px;
      }
      &.is-active,
      &:hover {
        background-color: #353f4f;
        color: #65cea7;
      }
    }
  }
}
</style>
