<template>
  <div>
    <el-menu
      class="g-nav-bar"
      mode="horizontal"
      background-color="#283143"
      text-color="#fff">
      <div class="g-navbar-title">{{navbarTitle}}：<span>{{navbarTitleContent}}</span></div>
      <div class="g-navbar-work">
        <MyDropdown :openItemArr="openItemArr" @openItemClick="openItemClick">
          <div slot="title">我的工作台</div>
        </MyDropdown>
      </div>
    </el-menu>
  </div>
</template>

<script>
  import $ from 'jquery'
  import MyDropdown from 'components/MyDropdown/MyDropdown'

  export default {
    data() {
      return {
        navbarTitle: '标题',
        navbarTitleContent: '餐饮管理系统',

        //展开项数组
        openItemArr:[
          {
            title: '我的主页',
            icon: '&#xe667;',
          }, 
          {
            title: '门店信息',
            icon: '&#xe62d;',
          }, 
          {
            title: '退出系统',
            icon: '&#xe815;',
          }
        ],
      };
    },

    components: {
      MyDropdown,
    },

    mounted() {
      //移除element ui样式的蓝框
      $(".g-navbar-title").removeAttr("tabindex")
      $(".g-navbar-work").removeAttr("tabindex")
    },

    methods: {
      openItemClick(value,index) {
        if(index==0) {
          this.$router.push({name:'Home'})
        }
        if(index==1) {
          this.$router.push({name:'Subbranch'})
        }
        if(index==2) {
          sessionStorage.removeItem('token')
          this.$router.push({name:'Login'})
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .g-nav-bar {
    position: relative;
    height: 60px;
    margin-left: 220px;
    .g-navbar-title {
      position: absolute;
      left: 50px;
      color: #fff;
      font-size: 18px;
      line-height: 60px;
    }

    .g-navbar-work {
      position: absolute;
      right: 40px;
      width: 150px;

      .is-active {
        color: #fff;
      }
    }
  }
</style>

<style lang="less">

</style>