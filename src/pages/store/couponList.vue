<template>
<div class="coupon-list gArea">
		<div class="gInfo">优惠券列表</div>
    <el-table :data="couponList" style="width: 98%" border stripe>
        <el-table-column label="优惠券名称" min-width="150" prop="couponName"></el-table-column>
        <el-table-column label="优惠券描述" min-width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.couponType == 1">
                  满<span style="color:#ff9800;"> {{scope.row.saleTo}} </span>元减 <span style="color:#ff9800;"> {{scope.row.cutDown}} </span>元优惠券
              </span>
              <span v-if="scope.row.couponType == 2">
                  <span style="color:#ff9800;"> {{scope.row.cutDown}} </span>元无限制优惠券
              </span>
            </template>
        </el-table-column>
        <el-table-column label="适用范围" min-width="100">
            <template slot-scope="scope">
                <span v-show="!scope.row.scope">全部</span>
                <span v-show="scope.row.scope">{{scope.row.scope}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="优惠券类型" width="120">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.couponType == 1">满减优惠券</el-tag>
              <el-tag type="primary" v-if="scope.row.couponType == 2">无限制优惠券</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="expire" label="有效期" min-width="180">
            <template slot-scope="scope">
              <span>自领取之后{{scope.row.timelimit}}天内有效</span>
            </template>
        </el-table-column>
        <el-table-column label="优惠券种类" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.is_marketing==0">普通优惠券</span>
              <span v-else>营销优惠券</span>
            </template>
        </el-table-column>
        <el-table-column prop="stock" label="总量" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.istotallimit==0">不限量</span>
              <span v-else>{{scope.row.istotallimit}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="优惠券状态" width="120">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status == 1">开放领取中</el-tag>
              <el-tag type="danger" v-if="scope.row.status == 2">已关闭领取</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="opt" label="操作" width="120">
            <template slot-scope="scope">
              <a size="small" @click="editCoupon(scope.row.id)">编辑 </a>&nbsp;
              <a size="small" @click="deleteCoupon(scope.row.id)">删除 </a>
            </template>
        </el-table-column>
    </el-table>
    <div class="my-pagination">
        <el-pagination :current-page="pageIndex" :page-size="pageSize" layout="total, prev, pager, next" :total="total" @current-change="handlePageChange">
        </el-pagination>
    </div>
    <el-button type="primary" style="margin-top:20px;" @click="addCouponBtn">添加优惠券</el-button>
    <el-dialog title="提示" :visible.sync="couponVisible">
      <span>
        <h3>确定删除该优惠券？</h3>
        <p class="danger">优惠券删除之后，优惠券不可被领取<br/>注：已经被领取的优惠券用户使用的时候不受影响。</p></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="couponVisible = false">取消</el-button>
        <el-button type="primary" @click="realDeleteCoupon">确定删除</el-button>
      </span>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialogVisible">
      <div style="max-height:350px;overflow:auto;" v-if="dialogFlag==1">
        <div v-for="item in detailArr" class="category">
          <span v-if="item.category==1" class="category1">
                  <span>{{item.name}}</span>
          <img :src="item.url" width="30" height="30">
          </span>
          <span v-else class="category2">
                  <span>{{item.name}}</span>
          <img :src="item.thumb_url+'?imageView2/1/w/25/h/25'" width="25" height="25">
          </span>
        </div>
      </div>
      <div style="max-height:350px;overflow:auto;" v-if="dialogFlag==2">
        <div v-for="item in detailGoodsArr" class="category" style="height:20px;">
           <span>{{item.goodsTitle}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
export default {
    data() {
        return {
            couponVisible: false,
            dialogVisible: false,
            detailArr: [],
            detailGoodsArr: [],
            dialogFlag: 1,

            couponList: [],
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            tryToEditId: 0,
            tryToDeleteId: 0,
            addCoupon: {
                type: '1',
                saleTo: '',
                cutdown: '',
                timeLimit: '',
                status: '1',
                displayorder: '1',
                isTotalLimit: '0',
                totalLimit: '',
            },
            categorySelectList: [],
        }
    },

    mounted() {
        this.getCouponList()
    },

    watch: {　　　　　　　
        addCoupon: {
            handler(curVal, oldVal) {
                if (curVal.isTotalLimit == 0) {
                    this.addCoupon.totalLimit = ''
                }
            },
            deep: true
        }　　　　
    },

    methods: {
        addCouponBtn() {
            this.$router.push({ name: 'AddCoupon' })
        },

        getCouponList() {
            this.$ajax.post('coupon/getCouponByUserId',{
            	userId: sessionStorage.getItem('token'),
            	pageNum: this.pageIndex,
            	pageSize: this.pageSize,
            }).then(e => {
            	this.couponList = e.data.result.list
            	this.total = e.data.result.total
            }).catch(e => {})
        },

        handlePageChange(pageIndex) {
            this.pageIndex = pageIndex
            this.getCouponList()
        },

        editCoupon(id) {
            this.$router.push({ name: 'AddCoupon', query: { id: id } })
        },

        deleteCoupon(id) {
            this.tryToDeleteId = id
            this.couponVisible = true
        },

        realDeleteCoupon() {
            this.$ajax.post('coupon/deleteCoupon',{
            	id: this.tryToDeleteId
            }).then(e => {
            	if(e.data.message=='success') {
            		this.$MyMessage.success('删除成功')
            		this.getCouponList()
            		this.couponVisible = false
            	}
            }).catch(e => {})
        },
    }
}
</script>
<style lang="less" scoped>
.el-pagination {
    float: right;
    margin-top: 20px;
}
.category {
    width: 100%;
    height: 30px;
    margin-bottom: 20px;
}
.category1 {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    line-height: 30px;
    color: #f00;
}
.category2 {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    line-height: 30px;
}
</style>
