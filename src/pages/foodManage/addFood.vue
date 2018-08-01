<template>
	<div class="gArea">
		<el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px">
			<div class="gInfo">菜品基本信息</div>
			<el-form-item label="菜品名称" prop="foodName">
				<el-input v-model="createForm.foodName" placeholder="请输入菜品名称，建议20字以内"></el-input>
			</el-form-item>
			<el-form-item label="菜品编号" prop="goodSsn">
        <el-input :disabled="true" v-model="createForm.goodSsn" placeholder="请生成菜品编号" readonly="readonly"></el-input>
        <el-button type="primary" @click="clickAutoGenerate">自动生成</el-button>
      </el-form-item>
      <el-form-item label="菜品分类" prop="cid">
        <el-select v-model="createForm.cid" placeholder="请选择分类">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <router-link to="categoryList"><i class="iconfont">&#xe61a;</i>设置类别</router-link>
      </el-form-item>
      <el-form-item label="菜品状态" prop="status">
        <el-tag  :type="returnFoodMap(createForm.status)">{{foodMap[createForm.status]}}</el-tag>
        <span class="gHelp">信息填写完整时候，才可以上架</span>
      </el-form-item>
      <div class="gDotted"></div>
      <div class="gInfo">菜品基本参数</div>
      <el-form-item label="本店价格" prop="productPrice">
        <el-input v-model="createForm.productPrice"></el-input> 元
      </el-form-item>
      <el-form-item label="市场售价" prop="marketPrice">
        <el-input v-model="createForm.marketPrice"></el-input> 元
        <span class="gHelp">市场售价为0，将不展示</span>
      </el-form-item>
      <el-form-item label="规格类型" prop="standard">
      	<template>
				  <el-radio v-model="createForm.standard" label="0">单规格商品</el-radio>
				  <el-radio v-model="createForm.standard" label="1">多规格商品</el-radio>
				</template>
				<span class="gHelp">选择"多规格商品"之后需要设置下方的商品规格</span>
      </el-form-item>
      <div class="gDotted"></div>
      <div v-if="createForm.standard==1">
      	<div class="gInfo">菜品规格</div>
      	<el-form-item label="规格项设置" prop="standardList">
      		<div v-for="(item,arrIndex) in standardList" class="specs_style">
      			<i class="iconfont delete_style gCursor" v-if="standardList.length>1" @click="deleteSpecs(arrIndex)">&#xe658;</i>
      			<el-form-item label="规格名称" label-width="70px">
      				<el-input v-model="item.standardName"></el-input>
      				<span class="gHelp">规格和规格项名称建议1~3个字，规格项最多添加五个</span>
      			</el-form-item>
      			<el-form-item label="规格项" label-width="70px" style="margin-top:20px;">
      				<el-input v-for="(value,index) in item.standardItemList" v-model="value.standardItem" :key="index" class="specs_item_style">
						    <template slot="append" v-if="item.standardItemList.length>1">
						    	<i class="iconfont gCursor" @click="deletestandardItemList(arrIndex,index)">&#xe62e;</i>
						    </template>
						  </el-input>
      				<el-button type="primary" size="small" @click="addstandardItemList(arrIndex)" v-if="item.standardItemList.length<5">
      					<i class="iconfont">&#xe62a;</i>添加规格项
      				</el-button>
      			</el-form-item>
      		</div>
      		<el-button type="warning" size="small" @click="addSpecs">添加规格</el-button>
      	</el-form-item>
      	<div class="gDotted"></div>
      </div>
      <div class="gInfo">菜品图文</div>
      <el-form-item label="菜品描述" prop="foodDesc">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="createForm.foodDesc" placeholder="请输入菜品描述，建议30~50字" style="width:600px;"></el-input>
      </el-form-item>
      <el-form-item label="菜品主图" prop="imgUrl">
				<el-upload
				  class="avatar-uploader"
				  action="uploadFoodImg"
				  :show-file-list="false"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload">
				  <img v-if="createForm.imgUrl" :src="createForm.imgUrl ? ('image'+createForm.imgUrl) : imageUrl" class="avatar">
				  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
      </el-form-item>
      <el-form-item>
				<el-button type="primary" @click="saveFood('createForm')">保存菜品</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { foodMap } from 'util/map.js'
	import Validator from 'util/validator.js'

	export default {
		data() {
			return {
				Validator: Validator,
				gid: '',
				detailDialog: true,
				foodMap: foodMap,
				createForm: {
					foodName: '',
					goodSsn: '',
					cid: '',
					status: 0,
					productPrice: '',
					marketPrice: '',
					standard: '0',
					foodDesc: '',
					imgUrl: '',
				},
				standardList: [{
					standardName: '',
					standardItemList: [{standardItem: ''}],
				}],
				categoryList:[],
				createRules: {
					foodName: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '菜品名称不能为空', 
							trigger: 'blur'  
						},
          ],
          goodSsn: [
            { 
            	required: true,
            	validator: Validator.trim,
							message: '没有生成菜品编号', 
							trigger: 'blur'  
						},
          ],
          cid: [
            { 
            	required: true,
							message: '没有选择菜品类别', 
							trigger: 'change'  
						},
          ],
          productPrice: [
            { 
            	required: true,
            	validator: Validator.float,
							message: '请填写本店价格', 
							trigger: 'change'  
						},
          ],
          marketPrice: [
            { 
            	required: true,
            	validator: Validator.float,
							message: '请填写市场售价，没有填零', 
							trigger: 'change'  
						},
          ],
          imgUrl: [
						{ 
							required: true,
							validator: (rule, value, callback) => {
		            if (this.createForm.imgUrl) {
		                callback();
		            } else {
		                callback(new Error('请上传房间图片'))
		            }
		          }, 
		        }
	        ],
				},
				imageUrl: '',
				goodsBanners: [],
			}
		},

		methods: {
			returnFoodMap(value) {
				if(value === 0) {
					return 'warning'
				}
				if(value === 1) {
					return 'success'
				}
				if(value === 2) {
					return 'info'
				}
			},

			clickAutoGenerate() {
				this.$ajax.post('foods/getFoodNumber',{}).then(e => this.createForm.goodSsn = e.data.result).catch(e => {})
			},

			getCategory() {
			  this.$ajax.post('category/getCategory',{
          userId: sessionStorage.getItem('token'),
        }).then(e => {
          e.data.result.map(item => {
          	this.categoryList.push({
          		id: item.id,
          		name: item.categoryName,
          	})
          })
        }).catch(e => {})
			},

			addSpecs() {
				this.standardList.push({
					standardName: '',
					standardItemList: [{standardItem:''}],
				})
			},

			deleteSpecs(index) {
				this.standardList.splice(index, 1)
			},

			addstandardItemList(index) {
				this.standardList[index].standardItemList.push({
					standardItem: '',
				})
			},

			deletestandardItemList(value, index) {
				this.standardList[value].standardItemList.splice(index, 1)
			},

     	standardValidator() {
     		let flag = true
     		this.standardList.map(item => {
     			if(item.standardName=='') {
     				flag = false
     			}
     			else {
     				item.standardItemList.map(value => {
     					if(value.standardItem=='') {
     						flag = false
     					}
     				})
     			}
     		})
     		return flag
     	},

      saveFood(formName) {
      	this.$refs[formName].validate((valid) => {
          if (valid) {
          	if(this.createForm.standard==0) {
          		this.setFood()
          	}else {
          		if(this.standardValidator()) {
          			this.setFood()
          		}
          	}
          }
        })
      },

      setFood() {
      	if(this.gid) {
	      	this.$ajax.post('foods/updateFood',{
	      		id: this.gid,
	      		userId: sessionStorage.getItem('token'),
				    ...this.createForm,
				    standardList: JSON.stringify(this.standardList)
	      	}).then(e => {
	      		if(e.data.message=='success') {
	      			this.$MyMessage.success('修改菜品成功')
	      		}
	      	}).catch(e => {})
      	}else {
      		this.$ajax.post('foods/addFood',{
	      		userId: sessionStorage.getItem('token'),
				    ...this.createForm,
				    standardList: JSON.stringify(this.standardList)
	      	}).then(e => {
	      		if(e.data.message=='success') {
	      			this.$MyMessage.success('添加菜品成功')
              this.$router.push({name:'FoodsList'})
	      		}
	      	}).catch(e => {})
      	}
      },

      handleAvatarSuccess(res, file) {
	    	this.createForm.imgUrl = res.result
        this.imageUrl = URL.createObjectURL(file.raw)
      },

      beforeAvatarUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt5M
      },

      getApi() {
      	if(this.gid) {
      		this.$ajax.post('foods/getFoodsById',{
	      		id: this.gid,
	      	}).then(e => {
		      		let ref = e.data.result
		      		this.createForm.foodName = ref.foodName
		      		this.createForm.goodSsn = ref.goodSsn
		      		this.createForm.cid = ref.cid
		      		this.createForm.status = ref.status
		      		this.createForm.productPrice = ref.productPrice
		      		this.createForm.marketPrice = ref.marketPrice ? ref.marketPrice : 0
		      		this.createForm.standard = String(ref.standard)
		      		this.createForm.foodDesc = ref.foodDesc
		      		this.createForm.imgUrl = ref.imgUrl
		      		this.standardList = ref.standardList
	      	}).catch(e => {})
      	}
      },
		},

		mounted() {
			this.gid = this.$route.query.gid
      this.getCategory()
      this.getApi()
		}
	}
</script>

<style lang="less" scoped>
	.el-input {
		width: 300px;
	}

	.el-tag {
		width: 80px;
		text-align: center;
	}

	.specs_style {
		position: relative;
		width: 800px;
		border: 1px solid #0BBFF6;
		padding: 20px;
		margin-top: 10px;
		margin-right: 20px;

		.delete_style {
			position: absolute;
			right: 10px;
			top: 0px;
		}
	}

	.specs_item_style {
		width: 100px;
		margin-right: 5px;
	}

	.img-item {
      position: relative;
      margin-right: 15px;
      display: inline-block;
      height: 110px;
      @border-width: 2px;
      @color-primary: #0BBFF6;
      border: @border-width solid transparent;
      &.active {
          border: @border-width solid @color-primary;
      }
      &.is-thumb:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          border-top: 40px solid @color-primary;
          border-right: 40px solid transparent;
      }
      &.is-thumb:after {
          content: '封';
          color: #fff;
          line-height: 1;
          position: absolute;
          top: 5px;
          left: 5px;
      }
      img {
          display: block;
          height: 100%;
      }
  }
</style>
<style lang="less">
	.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>