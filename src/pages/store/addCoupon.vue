<template>
<div class="gArea">
    <div class="gInfo">添加优惠券</div>
    <el-form class="addCoupon" ref="addCouponForm" :model="addCoupon" label-width="120px">
        <el-form-item label="优惠券类型：" prop="expressCode">
            <el-select style="width:250px;" v-model="addCoupon.couponType" placeholder="请选择优惠券类型">
                <el-option label="满减优惠券" value="1"></el-option>
                <el-option label="无限制优惠券" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称：">
            <el-input v-model="addCoupon.couponName" style="width:250px;" placeholder="请填写优惠券名称"></el-input>
            <div><span class="help-info">优惠券名称最多可设置8个字</span></div>
        </el-form-item>
        <el-form-item label="参数设置：">
            <div v-if="addCoupon.couponType==1" style="display:flex;">
                <span style="color:#ff9800;margin-right:5px;">满 </span>
                <el-input v-model="addCoupon.saleTo" style="width:104px;display:inline-box;" class="expressSn" placeholder="">
                    <template slot="append">元</template>
                </el-input>
                <span style="color:#24df0a;margin-right:5px;margin-left:5px;"> 减 </span>
                <el-input v-model="addCoupon.cutDown" style="width:104px;display:inline-box;" class="expressSn" placeholder="">
                    <template slot="append">元</template>
                </el-input>
            </div>
            <div v-else style="display:flex;">
                <span style="color:#24df0a;margin-right:5px;"> 减免 </span>
                <el-input v-model="addCoupon.cutDown" style="width:216px;display:inline-box;" class="expressSn" placeholder="">
                    <template slot="append">元</template>
                </el-input>
            </div>
        </el-form-item>
        <el-form-item label="有效期：">
            <div style="display:flex;">
                <el-input style="width:190px;display:inline-box;" v-model="addCoupon.timelimit" class="expressSn" placeholder="">
                    <template slot="prepend">自领用起 </template>
                </el-input>
                <span style="color:#ff9800;margin-left:5px;">天内有效 </span>
            </div>
        </el-form-item>
        <el-form-item label="数量限制：">
            <div style="display:flex;">
                <div><el-radio class="radio" v-model="limitStatus" label="0">不限量</el-radio></div>
                <div style="margin-left:46px;"><el-radio class="radio" v-model="limitStatus" label="1" >限制总量</el-radio></div>
                <el-input :disabled="limitStatus == 0" style="width:140px;margin-left:10px;" v-model="addCoupon.istotallimit" class="expressSn" placeholder=""><template slot="append">张</template></el-input>
            </div>
        </el-form-item>
        <el-form-item label="状态：">
            <el-radio class="radio" style="margin-top:-1px;" v-model="addCoupon.status" label="1">开放领取</el-radio>
            <el-radio class="radio" style="margin-top:0px;" v-model="addCoupon.status" label="2">关闭领取</el-radio>
            <div v-if="addCoupon.status == 2">
                <span class="help-info">关闭领取的优惠券将不会显示在移动端的领取列表中</span>
            </div>
        </el-form-item>
        <el-form-item label="适用范围：">
            <el-radio-group v-model="range" @change="rangeChange">
                <el-radio :label="1">所有商品</el-radio>
                <el-radio :label="2">特定分类</el-radio>
            </el-radio-group>
              <el-select v-model="addCoupon.scope" placeholder="请选择" v-if="range==2" style="margin-left:6px;">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="优惠说明：">
            <el-input type="textarea" v-model="addCoupon.couponDesc" style="width:295px;" placeholder="请填写优惠说明，最多可填写100字"></el-input>
            <div><span class="help-info">优惠说明将显示在优惠券详情页中，请认真填写</span></div>
        </el-form-item>
    </el-form>
    <div style="margin-left:100px;">
        <el-button type="primary" @click="saveSetting">保存设置</el-button>
        <el-button type="success" @click="returnList" v-if="id">返回优惠券列表</el-button>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            addCoupon: {
                couponType: '1',
                couponName: '',
                saleTo: '',
                cutDown: '',
                timelimit: '',
                status: '1',
                couponDesc: '',
                istotallimit: '',
                scope: 0,
            },
            range: 1,
            limitStatus: '0',
            categoryOptions: [],
        }
    },

    mounted() {
        this.id = this.$route.query.id
        this.getCategoryApi()
    },

    watch: {
        limitStatus(value) {
            if(value==0) {
                this.addCoupon.istotallimit = 0
            }
        }
    },

    methods: {
        getCategoryApi() {
          this.$ajax.post('category/getCategory',{
            userId: sessionStorage.getItem('token'),
          }).then(e => {
            e.data.result.map(item => {
                this.categoryOptions.push({
                    value: item.id,
                    label: item.categoryName,
                })
            })
            if(this.id) {
                this.getCouponApi()
            }
          }).catch(e => {})
        },
        saveSetting() {
            if (this.validForm()) {
                this.addCoupon.saleTo=='' ? this.addCoupon.saleTo = 0 : ''
                this.addCoupon.istotallimit == '' ? this.addCoupon.istotallimit = 0 : ''
                if (this.id) {
                    this.$ajax.post('coupon/updateCoupon',{
                        userId: sessionStorage.getItem('token'),
                        id: this.id,
                        ...this.addCoupon,
                    }).then(e => {
                        if(e.data.message=='success') {
                            this.$MyMessage.success('编辑优惠券成功')
                        }
                    }).catch(e => {})
                } else {
                    this.$ajax.post('coupon/addCoupon',{
                        userId: sessionStorage.getItem('token'),
                        ...this.addCoupon,
                    }).then(e => {
                        if(e.data.message=='success') {
                            this.$MyMessage.success('添加优惠券成功')
                            this.$router.push({name:'CouponList'})
                        }
                    }).catch(e => {})
                }
            }
        },

        getCouponApi() {
            this.$ajax.post('coupon/getCouponById',{
                id: this.id,
            }).then(e => {
                e.data.result.couponType = String(e.data.result.couponType)
                e.data.result.status = String(e.data.result.status)
                this.addCoupon = e.data.result
                if(this.addCoupon.istotallimit) {
                    this.limitStatus = '1'
                }else {
                    this.limitStatus = '0'
                }
                if(this.addCoupon.scope) {
                    this.range = 2
                }else {
                    this.range = 1
                }
            }).catch(e => {})
        },

        validForm() {
            if (!this.addCoupon.couponName || this.addCoupon.couponName.length > 8) {
                this.$message.error('未填写优惠券名称或超过限制长度')
                return false
            } else if ((this.addCoupon.couponType == 1) && ((!Number(this.addCoupon.cutDown)) || (!Number(this.addCoupon.saleTo))) || ((this.addCoupon.couponType == 2) && (!Number(this.addCoupon.cutDown)))) {
                this.$message.error('满减金额格式不对')
                return false
            } else if ((this.addCoupon.couponType == 1) && (Number(this.addCoupon.saleTo) < Number(this.addCoupon.cutDown))) {
                this.$message.error('减免金额大于等于起始金额')
                return false
            } else if (!Number(this.addCoupon.timelimit)) {
                this.$message.error('有效期格式不对')
                return false
            } else if (Number(this.limitStatus) && !Number(this.addCoupon.istotallimit)) {
                this.$message.error('限制总量格式不对')
                return false
            } else if (!this.addCoupon.scope && this.range==2) {
                this.$message.error('没有选择特定分类')
                return false
            }else if (!this.addCoupon.couponDesc || this.addCoupon.couponDesc.length > 100) {
                this.$message.error('未填写优惠说明或超过限制长度')
                return false
            } else {
                return true
            }
        },
        returnList() {
            this.$router.push({ name: 'CouponList' })
        },
        rangeChange(value) {
            if(value==1) {
                this.addCoupon.scope = 0
            }
        },
    },
}
</script>

<style lang="less" scope>
.new-add {
    margin-left: 2px;
    cursor: pointer;
    text-decoration: underline;
    color: #f00;
}
.help-info {
    color: #0BBFF6;
}
</style>