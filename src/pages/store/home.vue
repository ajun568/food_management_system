<template>
  <div class="gArea" style="margin-bottom:30px;">
    <div class="gMt">
      <span class="gInfo">个人中心设置</span>
    </div>
    <div class="personal">
      <section class="phone">
        <div class="p-header">
        </div>
        <div class="warp">
          <div class="p-item">
            <span>订单概览</span>
            <span class="expand">查看全部</span>
          </div>
          <div class="p-nav">
          </div>
          <div class="p-item" v-if="form[0]&&form[0].isopen" :class="{blank: form[0].isblock}">
            <i class="iconfont" aria-hidden="true">&#xe63f;</i>&nbsp;
            <span>{{form[0].title}}</span>
            <span class="expand"><i class="iconfont" aria-hidden="true">&#xe616;</i></span>
          </div>
          <div class="p-item" v-if="form[1]&&form[1].isopen" :class="{blank: form[1].isblock}">
            <i class="iconfont" aria-hidden="true">&#xe614;</i>&nbsp;
            <span>{{form[1].title}}</span>
            <span class="expand"><i class="iconfont" aria-hidden="true">&#xe616;</i></span>
          </div>
          <div class="p-item" v-if="form[2]&&form[2].isopen" :class="{blank: form[2].isblock}">
            <i class="iconfont" aria-hidden="true">&#xe659;</i>&nbsp;
            <span>{{form[2].title}}</span>
            <span class="expand"><i class="iconfont" aria-hidden="true">&#xe616;</i></span>
          </div>
          <div class="p-item" v-if="form[3]&&form[3].isopen" :class="{blank: form[3].isblock}">
            <i class="iconfont" aria-hidden="true">&#xe661;</i>&nbsp;
            <span>{{form[3].title}}</span>
            <span class="expand"><i class="iconfont" aria-hidden="true">&#xe616;</i></span>
          </div>
          <div class="p-item" v-if="form[4]&&form[4].isopen" :class="{blank: form[4].isblock}">
            <i class="iconfont" aria-hidden="true">&#xe637;</i>&nbsp;
            <span>{{form[4].title}}</span>
            <span class="expand"><i class="iconfont" aria-hidden="true">&#xe616;</i></span>
          </div>
        </div>
      </section>
      <section class="ctrl-panel">
        <div class="c-header">控制面板</div>
        <div class="c-item" v-for="(el,key) in form">
          <span style="width: 100px;display: inline-block;"> {{el.homeName}}</span>
          <span>
            <el-switch
            v-model="el.isopen"
            active-text=""
            inactive-text="">
            </el-switch>
            </span> &nbsp;&nbsp;&nbsp;
          <span>标题</span>&nbsp;
          <span><el-input v-model="el.title" style="width:180px;"></el-input></span> &nbsp;&nbsp;
          <span v-if="key !== 'order' && key !== 'distribution'">切块</span>
          <span v-if="key !== 'order' && key !== 'distribution'">&nbsp;
            <el-switch
            v-model="el.isblock"
            active-text=""
            inactive-text="">
            </el-switch>
            </span>
        </div>
        <div class="c-footer">
          <el-button type="primary" @click="handleSaveConfig">保存设置</el-button>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
const isNull = o => o == undefined || o == '' || o == []
export default {
  data() {
    return {
      form: [],
    }
  },
  mounted() {
    this.getProfileMenu()
  },
  methods: {
    getProfileMenu() {
      this.$ajax.post('home/getHome',{
        userId: sessionStorage.getItem('token')
      }).then(e => {
        if(e.data.message=='success') {
          e.data.result.forEach(item => {
            if(item.isblock) {
              item.isblock = true
            } else {
              item.isblock = false
            }
            if(item.isopen) {
              item.isopen = true
            }else {
              item.isopen = false
            }
          })
          this.form = e.data.result
        }
      }).catch(e => {})
    },
    handleSaveConfig() {
      this.form.forEach(item => {
        if(item.isblock) {
          item.isblock = 1
        } else {
          item.isblock = 0
        }
        if(item.isopen) {
          item.isopen = 1
        }else {
          item.isopen = 0
        }
      })
      this.$ajax.post('home/updateHome',{
        'homeList': JSON.stringify(this.form)
      }).then(e => {
        this.form.forEach(item => {
          if(item.isblock) {
            item.isblock = true
          } else {
            item.isblock = false
          }
          if(item.isopen) {
            item.isopen = true
          }else {
            item.isopen = false
          }
        })
    }).catch(e => {})
    }
  }
}

</script>
<style lang="less" scoped>
.personal {
  width: 900px;
  min-height: 620px;
  margin: 20px auto 0;
  position: relative;
  .phone {
    display: inline-block;
    background-color: #f5f5f5;
    min-height: 620px;
    width: 350px;
    .p-header {
      position: absolute;
      width: 350px;
      top: 0;
      height: 162px;
      background: url('../../assets/top.png');
      background-size: 350px 162px;
    }

    .warp {
      position: absolute;
      top: 172px;
      .p-nav {
        width: 336px;
        height: 100px;
        margin: -1px 5px 0 6px;
        background: url('../../assets/nav.png');
        background-size: 336px 100px;
        border-bottom: 1px solid #eee;
        margin-bottom: 5px;
      }
      .p-item {
        width: 336px;
        height: 45px;
        line-height: 45px;
        text-indent: 10px;
        margin: 0 7px;
        background-color: #fff;
        border-bottom: 1px solid #eee;
        .expand {
          position: absolute;
          right: 15px;
        }
      }
      .p-item.blank {
        margin-bottom: 13px;
      }
    }
  }
  .ctrl-panel {
    float: right;
    .c-header {
      height: 20px;
      width: 540px;
      text-indent: 20px;
      font-size: 16px;
      background-color: #fff;
    }
    .c-item {
      margin: 20px;
      font-size: 16px;
    }
    .c-footer {
      text-align: center;
      margin-top: 30px;
    }
  }
}

</style>
