<template>
    <div class="gArea">
        <el-form :model="restaurantSetting" :rules="rules" ref="restaurantSetting" label-width="130px" class="demo-ruleForm">
            <div class="gInfo">门店设置·</div>
            <el-form-item label="门店名称" prop="shopName">
                <el-input v-model="restaurantSetting.shopName" placeholder="请输入门店名称"></el-input>
                <span class="help-info">&nbsp;&nbsp;名称将会显示在移动端首页</span>
            </el-form-item>
            <el-form-item label="门店公告">
                <el-input v-model="restaurantSetting.announcement" placeholder="请输入门店公告"></el-input>
                <span class="help-info">&nbsp;&nbsp;公告将会显示在移动端首页</span>
            </el-form-item>
            <el-form-item label="门店头像" prop="imgUrl">
                <el-upload
                  class="avatar-uploader"
                  action="uploadStoreImg"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="restaurantSetting.imgUrl" :src="restaurantSetting.imgUrl ? ('image'+restaurantSetting.imgUrl) : imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="门店状态" prop="status">
                <el-tag v-if="restaurantSetting.status==1" type="success">正常营业</el-tag>
                <el-tag v-if="restaurantSetting.status==2" >暂停营业</el-tag>
                <el-tag v-if="restaurantSetting.status==-1" type="info">暂未开通</el-tag>
                <el-button v-if="restaurantSetting.status==2 || restaurantSetting.status==1" type="primary" icon="edit" @click="editShopOpen">修改</el-button>
                <span v-else>-</span>
                <span class="help-info">&nbsp;&nbsp;门店营业状态决定客户能否下单</span>
            </el-form-item>
            <el-form-item label="客服电话" prop="phone">
                <el-input v-model="restaurantSetting.phone" placeholder="请输入客服电话"></el-input>
                <span class="help-info">&nbsp;&nbsp;客服电话将会在个人中心展示</span>
            </el-form-item>
            <el-form-item label="营业时间" required>
                <el-checkbox-group style="margin-bottom:15px;" v-model="restaurantSetting.openWeekdays">
                    <el-checkbox v-for="day in openWeekdayList" :label="day" :key="day">{{day}}</el-checkbox>
                </el-checkbox-group>
                <div style="width:490px;overflow:hidden" v-for="(period, index) in restaurantSetting.timeList">
                    <el-col :span="9">
                        <el-form-item :prop="'timeList.' + index + '.beginTime'" :rules="{required: true, message: '开始时间不能为空', trigger: 'change'}">
                            <el-time-select style="width:175px;" v-model="period.beginTime" :picker-options="{start: '00:00',step: '00:15',end: '24:00'}" placeholder="选择开始时间">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">&nbsp;&nbsp;至</el-col>
                    <el-col :span="9">
                        <el-form-item :prop="'timeList.' + index + '.endTime'" :rules="{required: true, message: '结束时间不能为空', trigger: 'change'}">
                            <el-time-select style="width:175px;" v-model="period.endTime" :picker-options="{start: '00:00',step: '00:15',end: '24:00',minTime: period.beginTime}" placeholder="选择结束时间">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <a @click="delPeriod(index)" v-if="restaurantSetting.timeList.length>1">删除</a>
                    </el-col>
                </div>
                <div style="clear:both;"></div>
                <div>
                    <a @click="addPeriod()">添加时间段</a>
                </div>
            </el-form-item>
            <el-form-item label="门店地区" required prop="selectedAreaOptions">
                <el-cascader filterable :options="areaArr" v-model="restaurantSetting.selectedAreaOptions" @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item style="margin-bottom:0" label="详细地址" prop="address">
                <el-input v-model="restaurantSetting.address" placeholder="请输入详细地址" @blur="queryMap()"></el-input>&nbsp;
                <el-button type="success" @click="queryMap()">搜索地图</el-button>
            </el-form-item>
            <el-form-item>
                <div class="amap-page-container" id="container"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveFoodsConfig()">保存门店设置</el-button>
            </el-form-item>
        </el-form>
    <el-dialog
          title="确认操作"
          :visible.sync="dialogEditShopOpen">
          <div  v-show="restaurantSetting.status==1">
            <span>
                <p class="danger">目前门店正常营业中，确定修改为暂停营业？暂停营业之后，用户将无法下单！</p>
              </span>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditShopOpen = false">取消</el-button>
                <el-button type="primary" @click="realEditShopOpen(2)">确定暂停营业</el-button>
              </div>
          </div>
          <div v-show="restaurantSetting.status==2">
              <span>
                <p class="danger">目前店铺暂停营业中，确定修改为正常营业？</p>
              </span>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogEditShopOpen = false">取消</el-button>
                <el-button type="primary" @click="realEditShopOpen(1)">确定正常营业</el-button>
              </div>
          </div>
    </el-dialog>
    </div>
</template>
<script>
import VueAMap from 'vue-amap'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
import $ from 'jquery'
import Validator from 'util/validator.js'
import { chinaArea } from 'util/area.js'

VueAMap.initAMapApiLoader({
    key: 'd930effb6e97e4bd089f0f3a6da9e908',
    plugin: ['AMap.ToolBar', 'AMap.OverView', 'AMap.MapType', 'AMap.Geolocation', 'AMap.DistrictSearch', 'AMap.Geocoder'],
    v: '1.4.4'
});

export default {
    data() {
        return {
            Validator: Validator,
            id: '',
            map: null,
            districtSearch: null,
            markerList: [],
            customAddedMaker: null,
            options: [],
            loading: false,
            dialogEditShopOpen:false,
            addressList: [],
            activeName: 'shopSettingTab',
            openWeekdayList: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            selectCityCode: '',
            areaArr: [],

            restaurantSetting: {
                shopName: '',
                announcement: '',
                phone: '',
                selectedAreaOptions: [],
                address: '',
                inglat: '',
                openWeekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                timeList: [
                    { beginTime: '06:00', endTime: '22:00' }
                ],
                status:-1,
                imgUrl: '',
            },
            imgUrl: '',
            rules: {
                shopName: [
                    { 
                        required: true, 
                        validator: Validator.trim, 
                        message: '请输入门店名称', 
                        trigger: 'blur' 
                    },
                ],
                imgUrl: [
                    { 
                        required: true,
                        validator: (rule, value, callback) => {
                            if (this.restaurantSetting.imgUrl) {
                                callback();
                            } else {
                                callback(new Error('请上传门店图片'))
                            }
                        }, 
                    }
                ],
                phone: [
                    { 
                        required: true, 
                        validator: Validator.strictMobile, 
                        message: '请输入客服电话', 
                        trigger: 'blur' 
                    },
                ],
                selectedAreaOptions: [
                    { 
                        required: true, 
                        validator: Validator.requiredArray, 
                        message: '请选择地区', 
                        trigger: 'change' 
                    }
                ],
                address: [
                    { 
                        required: true,
                        validator: Validator.trim,  
                        message: '请输入详细地址', 
                        trigger: 'blur' 
                    }
                ],
            }
        };
    },
    mounted() {
        this.getApi()
        var self = this;
        $('body').delegate(".set-detail-address", "click", function(item) {
            self.restaurantSetting.address = $(this).attr('_address');
            self.restaurantSetting.inglat = $(this).attr('_inglat');
        });

        lazyAMapApiLoaderInstance.load().then(() => {
            this.map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 16,
                center: [116.397428, 39.90923]
            });
            this.map.addControl(new AMap.ToolBar());

            this.districtSearch = new AMap.DistrictSearch({
                level: 'country',
                subdistrict: 1
            });

            var _onClick = (e) => {
                if (this.customAddedMaker) {
                    this.map.remove(this.customAddedMaker);
                }
                this.customAddedMaker = new AMap.Marker({
                    position: e.inglat,
                    map: this.map
                })


                var self = this;
                var geocoder_CallBack = (result) => {
                    var pois = result.regeocode.pois[0];
                    this.customAddedMaker.content = `<div style="width:200px;">${pois.name}<br/>地址：${pois.address}<br/><a class="set-detail-address" _inglat="${pois.location.lng},${pois.location.lat}" _address="${pois.address}">设为详细地址</a></div>`;

                    var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });

                    function markerClick(e) {
                        infoWindow.setContent(e.target.content);
                        infoWindow.open(self.map, e.target.getPosition());
                    }

                    this.customAddedMaker.on('click', markerClick);
                    this.customAddedMaker.emit('click', { target: this.customAddedMaker });
                    self.map.setFitView();
                }
                var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                geocoder.getAddress(e.inglat, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        geocoder_CallBack(result);
                    }
                });
            };

            this.map.on('click', _onClick);
        });

        this.areaMap()
    },
    methods: {
        getApi() {
            this.$ajax.post('setting/getMySetting',{
                userId: sessionStorage.getItem('token')
            }).then(e => {
                if(e.data.message=='success') {
                    this.id = e.data.result.id
                    if(e.data.result.shopName) {
                        let ref = e.data.result
                        this.restaurantSetting.shopName = ref.shopName
                        this.restaurantSetting.announcement = ref.announcement
                        this.restaurantSetting.phone = ref.phone
                        this.restaurantSetting.address = ref.address
                        this.restaurantSetting.selectedAreaOptions = ref.inglat.split('-')
                        this.restaurantSetting.openWeekdays = ref.openWeekdays.split('#')
                        this.restaurantSetting.imgUrl = ref.imgUrl
                        this.restaurantSetting.status = ref.status
                        this.restaurantSetting.timeList = ref.timeList
                    }
                }
            }).catch(e => {})
        },
        areaMap() {
          chinaArea.forEach((item, index) => {
            this.areaArr.push({
              value: item.province_name,
              label: item.province_name,
            })
            if (item.city) {
              this.areaArr[index].children = []
              item.city.forEach((value, num) => {
                this.areaArr[index].children.push({
                  value: value.city_name,
                  label: value.city_name,
                })
                if (value.area) {
                  this.areaArr[index].children[num].children = []
                  value.area.forEach(ref => {
                    this.areaArr[index].children[num].children.push({
                      value: ref,
                      label: ref,
                    })
                  })
                }
              })
            }
          })
        },
        handleChange(item) {
            var self = this
            this.map.setCity(item[2])
            this.districtSearch.search(item[2], function(status, result) {
                self.selectCityCode = result.districtList[0].citycode
            })
        },
        queryMap() {
            var self = this;
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                pageIndex: 1,
                city: self.selectCityCode
            })

            if (this.customAddedMaker) {
                this.map.remove(this.customAddedMaker)
            }

            placeSearch.search(this.restaurantSetting.address, function(status, result) {
                self.map.remove(self.markerList)
                var pois = result.poiList.pois
                var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) })

                function markerClick(e) {
                    infoWindow.setContent(e.target.content)
                    infoWindow.open(self.map, e.target.getPosition())
                }

                for (var i = 0; i < pois.length; i++) {
                    var marker = new AMap.Marker({
                        position: [pois[i].location.M, pois[i].location.O],
                        map: self.map,
                        content: '<div class="marker">' + (i + 1) + '</div>'
                    });
                    marker.content = `<div style="width:200px;">${pois[i].name}<br/>地址：${pois[i].address}<br/><a class="set-detail-address"  _address="${pois[i].address}" _inglat="${pois[i].location.lng},${pois[i].location.lat}">设为详细地址</a></div>`;

                    marker.on('click', markerClick)
                    if (i == 0) {
                        self.restaurantSetting.inglat = `${pois[i].location.lng},${pois[i].location.lat}`;

                        marker.emit('click', { target: marker })
                    }
                    self.markerList.push(marker)
                }
                self.map.setFitView()
            });
        },
        addPeriod() {
            this.restaurantSetting.timeList.push({ beginTime: '08:00', endTime: '20:00' })
        },
        delPeriod(index) {
            this.restaurantSetting.timeList.splice(index, 1)
        },

        saveFoodsConfig(status) {
            this.$refs['restaurantSetting'].validate(valid => {
                if (valid) {
                    if(status) {
                        this.restaurantSetting.status = status
                    }
                    this.$ajax.post('setting/updateSetting',{
                        id: this.id,
                        userId: sessionStorage.getItem('token'),
                        shopName: this.restaurantSetting.shopName,
                        announcement: this.restaurantSetting.announcement,
                        imgUrl: this.restaurantSetting.imgUrl,
                        status: this.restaurantSetting.status==-1 ? 1 : this.restaurantSetting.status,
                        phone: this.restaurantSetting.phone,
                        openWeekdays: this.restaurantSetting.openWeekdays.join('#'),
                        inglat: this.restaurantSetting.selectedAreaOptions.join('-'),
                        address: this.restaurantSetting.address,
                        timeList: JSON.stringify(this.restaurantSetting.timeList)
                    }).then(e => {
                        if(e.data.message=='success') {
                            this.$MyMessage.success('门店设置成功')
                            this.getApi()
                        }
                    }).catch(e => {})
                }
            })
        },
        editShopOpen(){
            this.dialogEditShopOpen = true
        },
        realEditShopOpen(state){
            this.saveFoodsConfig(state)
            this.dialogEditShopOpen = false
        },
        handleAvatarSuccess(res, file) {
            this.restaurantSetting.imgUrl = res.result
            this.imageUrl = URL.createObjectURL(file.raw)
        },

        beforeAvatarUpload(file) {
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
              this.$MyMessage.error('上传头像图片大小不能超过 2MB!')
            }
            return isLt5M
        },
    }
};
</script>
<style lang="less">
.amap-page-container {
    margin-top: 20px;
    width: 490px;
    height: 400px;
    border: 1px solid silver
}

.marker {
    width: 19px;
    height: 33px;
    top: 0;
    left: 0;
    background: url('https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png');
    color: #fff;
    text-align: center;
    line-height: 20px;
    font-size: 10px;
}
.help-info {
    color: #0BBFF6;
}
</style>
<style lang="less" scoped>
.el-cascader {
    width: 400px;
}

.el-input {
    width: 400px;
}

.el-date-editor--date {
    width: 180px !important;
}
.dialog-footer{
    text-align:right;
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