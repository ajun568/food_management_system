<template>
  <div class="gArea">
    <el-form 
    	:model="queryForm" 
    	ref="queryForm" 
    	class="query-form" 
    	label-width="100px" 
    	style="display:flex;padding-top:40px;">
      <el-form-item label="菜品类别">
        <el-select v-model="queryForm.cateId" placeholder="请选择分类">
          <el-option v-for="item in firstCategoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品状态" style="height:41px;">
        <el-checkbox-group v-model="queryForm.statusList">
          <el-checkbox label="待上架"></el-checkbox>
          <el-checkbox label="已上架"></el-checkbox>
          <el-checkbox label="已下架"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button 
        	type="primary" 
        	style="margin-left:15px;margin-bottom:20px;" 
        	@click="searchGoods"><i class="iconfont">&#xe60c;</i> 查询菜品
        </el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="goodSsn" label="菜品编号" min-width="130">
          <template slot-scope="scope">
            <a size="small" @click="editGoods(scope.row.id)">{{scope.row.goodSsn}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="foodName" label="菜品名称" min-width="130"></el-table-column>
        <el-table-column prop="imgUrl" label="菜品图片" width="140">
          <template slot-scope="scope">
            <img style="margin-top:10px;margin-bottom:10px;width:100px;height:100px;" class="goods-cover" :src="'image'+scope.row.imgUrl"/>
          </template>
        </el-table-column>
        <el-table-column prop="cname" label="类别" min-width="100"></el-table-column>
        </el-table-column>
        <el-table-column prop="productPrice" label="售价价格（¥）" width="110">
          <template slot-scope="scope">
            <span class="price">¥{{scope.row.productPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <el-tag type="warning" v-if="scope.row.status == 0">{{foodMap[scope.row.status]}}</el-tag>
            <el-tag type="success" v-if="scope.row.status == 1">{{foodMap[scope.row.status]}}</el-tag>
            <el-tag type="danger" v-if="scope.row.status == 2">{{foodMap[scope.row.status]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="action" width="220" label="操作">
          <template slot-scope="scope">
            <el-button @click="editGoods(scope.row.id)" size="mini" type="success" icon="edit">编辑</el-button>
            <el-button v-if="scope.row.status==1" @click="stopSaleGoods(scope.row.id)" size="mini" type="warning" icon="arrow-down">下架</el-button>
            <el-button v-if="scope.row.status!=1" @click="startSaleGoods(scope.row.id)" size="mini" type="warning" icon="arrow-up">上架</el-button>
            <el-button v-if="scope.row.status!=1" @click="delGoods(scope.row.id)" size="mini" type="danger" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="my-pagination">
        <el-pagination :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total" @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { foodMap } from 'util/map.js';
import moment from 'moment';

export default {
  data() {
    return {
      foodMap: foodMap,
      loading: true,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      firstCategoryList: [{ name: '不限', id: 0 }],
      queryForm: {
        goodsName: '',
        cateId: 0,
        statusList: ['待上架', '已上架', '已下架'],
      },
    }
  },
  mounted() {
    this.getGoodsList()
    this.getCategory()
  },

  methods: {

    searchGoods() {
      this.pageIndex = 1;
      this.getGoodsList();
    },
    getCategory() {
      this.$ajax.post('category/getCategory',{
        userId: sessionStorage.getItem('token'),
      }).then(e => {
        e.data.result.map(item => {
          this.firstCategoryList.push({
            id: item.id,
            name: item.categoryName,
          })
        })
      }).catch(e => {})
    },

    editGoods(gid) {
      this.$router.push({ name: 'AddFood', query: { gid } })
    },
    statusApi(gid,status) {
      this.$ajax.post('foods/updateFoodStatus',{
        id: gid,
        status: status,
      }).then(e => {
        if(e.data.message=='success') {
          this.$MyMessage.success('操作成功')
          this.getGoodsList()
        }
      }).catch(e => {})
    },
    startSaleGoods(gid) {
      this.statusApi(gid,1)
    },
    stopSaleGoods(gid) {
      this.statusApi(gid,2)
    },
    delGoods(gid) {
      this.$ajax.post('foods/deleteFood',{
        id: gid,
      }).then(e => {
        if(e.data.message=='success') {
          this.getGoodsList()
          this.$MyMessage.success('删除成功')
        }
      }).catch(e => {})
    },
    getGoodsList() {
      this.loading = true
      let ref = []
      this.queryForm.statusList.map(item => {
        if(item=='待上架') {
          ref.push(0)
        }
        if(item=='已上架') {
          ref.push(1)
        }
        if(item=='已下架') {
          ref.push(2)
        }
      })
      this.$ajax.post('foods/getAllFoods',{
        userId: sessionStorage.getItem('token'),
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        cid: this.queryForm.cateId ? this.queryForm.cateId : '',
        statusList: JSON.stringify(ref.sort())
      }).then(e => {
        this.tableData = e.data.result.list
        this.total = e.data.result.total
        this.loading = false
      }).catch(e => {})
    },
    handlePageChange(pageIndex) {
      this.pageIndex = pageIndex
      this.getGoodsList()
    },
    handleClickSearch() {
      this.pageNum = 1
      this.getShopList()
    },
  }
}

</script>
<style lang="less" scoped>
.el-input {
  &.el-date-editor {
    width: 300px;
  }
  display: inline-block;
  width: 300px;
}

.el-checkbox-group {
  display: inline;
}

.el-autocomplete {
  width: 300px;
}

.el-pagination {
  float: right;
  margin-top: 20px;
}

.price {
  color: #ff9800;
  ;
}

.query-form {
	margin: 20px 20px 20px 0;
  background-color: #f2f2f2;

  .el-input {
    width: 320px;
  }
  .el-select {
    width: 320px;
  }
}

</style>