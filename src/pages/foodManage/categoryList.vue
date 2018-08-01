<template>
	<div class="gArea">
		<div class="gInfo">菜品分类列表</div>
		<div class="gMg">
			<el-table
	      :data="tableData"
	      style="width:98%"
	      border
	      v-loading.body="loading"> 
	      <el-table-column
	        prop="categoryName"
	        label="类别名称"
	        min-width="120">
	      </el-table-column>
	      <el-table-column
	        prop="enable"
	        label="状态"
	        min-width="120">
		      <template slot-scope="scope">
		          <el-tag  type="danger" v-if="scope.row.enable == 0">不显示</el-tag>
		          <el-tag  type="success" v-if="scope.row.enable == 1">显示中</el-tag>
		      </template>
	      </el-table-column>
	      <el-table-column
	        prop="myOrder"
	        label="排序"
	        min-width="120">
	      </el-table-column>
	      <el-table-column
	        prop="action"
	        min-width="120"
	        label="操作">
		      <template slot-scope="scope">
	          <a size="small" @click="editCategory(scope.row.id)">编辑</a>
	          <a size="small" style="color:#ff9800" @click="deleteCategory(scope.row.id)">删除</a>
		      </template>
	      </el-table-column>
		  </el-table>
		  <div class="gMt">
        <el-button type="success" @click="goAddCategory">添加分类</el-button>
      </div>
		</div>

	  <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <span>
        <h3>确定删除该分类？</h3>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="realDeleteCategory">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
	export default {
    data() {
      return {
        dialogVisible:false,
        loading: false,
        tableData:[],
        tryToDelId:0,
      }
    },
    mounted() {
      this.getCategoryList()
    },

    methods: {
      getCategoryList(){
          this.loading = true
          this.$ajax.post('category/getCategory',{
            userId: sessionStorage.getItem('token'),
          }).then(e => {
            this.loading = false
            this.tableData = e.data.result
          }).catch(e => {})
      },

      deleteApi(options) {
        this.$ajax.post('category/category',{
          type: 'DELETE',
          userId: sessionStorage.getItem('token'),
          id: this.tryToDelId,
        }).then(e => {
          if(e.data.message=='success') {
            this.$MyMessage.success('删除成功')
            this.getCategoryList()
          }
        }).catch(e => {})
      },

      editCategory(id) {
          this.$router.push({ name: 'AddCategory', query: { id: id }})
      },

      deleteCategory(id) {
          this.dialogVisible = true
          this.tryToDelId = id
      },

      realDeleteCategory(){
          this.dialogVisible = false
          this.deleteApi()
      },

      goAddCategory(){
          this.$router.push({ name: 'AddCategory'})
      },

      handleClose(){
          this.dialogVisible = false
      },
    }
  }
</script>

<style lang="less" scoped>
	
</style>