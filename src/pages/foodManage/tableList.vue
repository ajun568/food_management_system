<template>
  <div class="gArea">
    <el-radio-group @change="searchOrder" v-model="orderTypesChecked" class="gMt">
      <el-radio-button v-for="(type, index) in orderTypes" :label="type" :key="type">{{index}}</el-radio-button>
    </el-radio-group>
    <div style="clear:both;"></div>
    <div class="table">
      <div v-for="item in tableData" class="table-box bg-blue-light">
        <div class="table-info">编号：{{item.num}}</div>
        <div class="table-info">名称：{{item.tablName}}</div>
        <div class="table-info">类型：{{orderTypesMap[item.tableType]}}</div>
        <div class="option-panel">
          <div class="edit-btn" @click="editTable(item.id)">
            编辑
          </div>
          <div class="del-btn" @click="delTable(item.id)">
            删除
          </div>
        </div>
      </div>
      <div v-if="total == 0 && !unmount" style="color:rgb(255, 152, 47);margin-top:20px;font-size:16px;">无此类型餐桌，请添加餐桌</div>
    </div>
    <div style="clear:both;"></div>
    <div v-if="total > 0" class="my-pagination">
      <el-pagination :page-sizes="[15,25, 50, 100]" :current-page="pageIndex" :page-size="pageSize" layout="total,sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handlePageChange">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="dialogDeleteTableVisible" size="tiny">
      <span>
            <h3>确定删除餐桌？</h3>
            <p class="danger">注：删除餐桌之后，堂吃用户填写该删除的桌号将无法下单。</p></span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDeleteTableVisible = false">取消</el-button>
            <el-button type="primary" @click="realDeleteTable">删除该餐桌</el-button>
      </span>
    </el-dialog>
    <el-dialog title="餐桌二维码" :visible.sync="qrcodeDialogVisible">
      <div class="qrcode" style="text-align:center;">
        <img :src="qrcodeURL">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrcodeDialogVisible = false">取 消</el-button>
        <a class="el-button el-button--primary" :href="qrcodeDownURL">下载餐桌二维码</a>
      </div>
    </el-dialog>
    <el-dialog title="错误提示" size="tiny" :visible.sync="errorDialogVisible">
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorDialogVisible = false">取 消</el-button>
        <a class="el-button el-button--primary" href="#/setting/authorize">去配置</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data() {
    return {
      orderTypesChecked: -1,
      orderTypes: { '全部': -1, '1~2人桌': 0, '3~4人桌': 1, '5~6人桌': 2, '7~8人桌': 3, '包厢': 4, '吧台': 5, '其他': 6 },
      orderTypesMap: { 0: '1~2人桌', 1: '3~4人桌', 2: '5~6人桌', 3: '7~8人桌', 4: '包厢', 5: '吧台', 6: '其他' },

      dialogDeleteTableVisible: false,
      qrcodeDialogVisible: false,
      errorDialogVisible: false,
      qrcodeDeskNum: 0,
      qrcodeURL: '',
      qrcodeDownURL: '',
      tryToDelId: 0,
      unmount: true,
      tableData: [{
        num: 1,
        tablName: '1号桌',
        tableType: 0,
      }],

      // 分页相关参数
      orderBy: 'createtime',
      orderType: 'desc',
      pageIndex: 1,
      pageSize: 25,
      total: 0,
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.$ajax.post('table/getAllTables',{
        userId: sessionStorage.getItem('token'),
        tableType: this.orderTypesChecked==-1 ? '' : this.orderTypesChecked,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
      }).then(e => {
        this.tableData = e.data.result.list
      }).catch(e => {})
    },
    handlePageChange(pageIndex) {
      this.pageIndex = pageIndex
      this.getTableList()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.pageIndex = 1
      this.getTableList()
    },
    searchOrder(sort) {
      this.orderBy = 'createtime'
      this.orderType = 'desc'
      this.pageIndex = 1
      this.getTableList()
    },
    editTable(id) {
      this.$router.push({ name: 'AddTable', query: { id } })
    },
    delTable(id) {
      this.tryToDelId = id
      this.dialogDeleteTableVisible = true
    },
    realDeleteTable() {
      this.$ajax.post('table/deleteTable',{
        id: this.tryToDelId,
      }).then(e => {
        if(e.data.message=='success') {
          this.$MyMessage.success('删除成功')
          this.dialogDeleteTableVisible = false
          this.getTableList()
        }
      }).catch(e => {})
    },
  }
}

</script>
<style lang="less" scoped>
.table {
  width: 1100px;
  max-width: 1100px;
  height: auto;
  overflow: hidden;
}

.table-box {
  float: left;
  margin-right: 20px;
  margin-top: 20px;
  padding-top: 5px;
  width: 200px;
  border-radius: 4px;
  color: white;
  .table-info {
    padding: 4px 0 4px 10px;
  }
  .option-panel {
    margin-top: 10px;
    width: 100%;
    height: 30px;
    background-color: #eee;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .edit-btn {
    width: 50%;
    float: left;
    background-color: #eee;
    height: 30px;
    border-bottom-left-radius: 4px;
    color: #1db2d7;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .edit-btn:hover {
    color: #27a0d2;
  }
  .del-btn {
    width: 33%;
    float: left;
    background-color: #eee;
    height: 30px;
    border-bottom-right-radius: 4px;
    color: #f68670;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .del-btn:hover {
    color: red;
  }
}

.bg-blue-light {
  background-color: #58b7ff;
}

.el-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
