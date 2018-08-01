<template>
  <div class="gArea">
    <div class="gInfo">添加菜品分类</div>
    <el-form :model="addCategoryForm" :rules="addCategoryRules" ref="addCategoryForm" label-width="100px">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="addCategoryForm.categoryName" placeholder="请输入分类名称，建议5个字以内"></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-radio v-model="addCategoryForm.enable" label="1">是</el-radio>
        <el-radio v-model="addCategoryForm.enable" label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="分类排序" prop="categorySort">
        <el-input-number v-model="addCategoryForm.myOrder" controls-position="right" :min="0" :max="9999999"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addFoodCategory('addCategoryForm')">{{id?'修改菜品分类':'添加菜品分类'}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
    	id: '',
      addCategoryForm: {
        categoryName: '',
        enable: '0',
        myOrder: 0,
      },
      addCategoryRules: {
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    getApi() {
      this.$ajax.post('category/category',{
      	type: this.id ? 'UPDATE' : 'ADD',
        userId: sessionStorage.getItem('token'),
      	id: this.id ? this.id : '',
      	categoryName: this.addCategoryForm.categoryName,
      	enable: Number(this.addCategoryForm.enable),
      	myOrder: this.addCategoryForm.myOrder,
      }).then(e => {
        if(e.data.message=='success') {
          if(this.id) {
            this.$MyMessage.success('修改成功')
          }else {
            this.$MyMessage.success('添加成功')
            this.$router.push({name:'CategoryList'})
          }
        }else {
          this.$MyMessage.error(e.data.message)
        }
      }).catch(e => {})
    },

    getCategoryApi() {
      if(this.id) {
        this.$ajax.post('category/getCategory',{
          userId: sessionStorage.getItem('token'),
        }).then(e => {
          e.data.result.map(item => {
            if(item.id == this.id) {
              this.addCategoryForm = {
                id: item.id,
                categoryName: item.categoryName,
                enable: item.enable + '',
                myOrder: item.myOrder,
              }
            }
          })
        }).catch(e => {})
      }
    },

    addFoodCategory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getApi()
        }
      })
    },
  },

  mounted() {
  	this.id = this.$route.query.id
    this.getCategoryApi()
  },
}

</script>
<style lang="less" scoped>
.el-input {
  width: 250px;
}

</style>
