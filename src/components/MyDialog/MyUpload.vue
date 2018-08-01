<template>
<div 
    @click="openDialog" 
    class="my-upload-inner">
    <el-button 
        icon="el-icon-plus" 
        class="vertical-fix" 
        :style="btnStyle" 
        @click="getHistory(1, upload == 'image' ? pagPageSize : pagPageSizeVideo);">
    </el-button>
    <my-dialog 
        minWidth="1050px" 
        ref="dialog" 
        top="15%" 
        :tag="upload=='image' ? '上传图片' : '上传视频'" 
        :visible.sync="dialogVisible" 
        width="1050px" 
        @onClose="closeDialog({type:'模态框关闭'})" 
        :canCloseButton="false" 
        zIndex="999">

        <!-- 图片上传 -->
        <div 
            slot="body" 
            v-if="upload=='image'">
            <el-tabs 
                :activeName="activeName" 
                style="margin-top:-20px;" 
                @tab-click="tabChange">
                <el-tab-pane 
                    label="历史记录" 
                    name="history_image" 
                    :disabled="onUpload">
                    <span v-for="image of historyImages">
                        <my-image
                            :id="image.id"
                            :src="image.src"
                            :width="80"
                            :height="80"
                            :canBorder="false"
                            :class="image.active?'active':''"
                            :clickEvent="toggleHistory"
                            :style="{
                                border: 'solid 1px #ddd',
                                margin: '10px 10px 10px 10px',
                                display: 'inline-block',
                                cursor: 'pointer',
                            }">
                        </my-image>
                    </span>
                    <span v-if="historyImages.length==0">还没有上传过图片哦</span>
                    <div class="block" v-bind:style="paginationStyle">
                        <el-pagination 
                            :page-size="paginationData.pageSize" 
                            :page-sizes="paginationData.pageSizes" 
                            :current-page.sync="paginationData.curPage" 
                            @current-change="onIndexChange" 
                            @size-change="onSizeChange" 
                            layout="total, sizes, prev, pager, next" 
                            :total="paginationData.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane 
                    label="本地上传" 
                    name="new_image">
                    <span 
                        v-for="image of uploadImages">
                        <my-image
                            :id="image.id"
                            :src="!image.src.includes('__MSIE9_HTTPS_') ? image.src : 'https://weapp-1253522117.image.myqcloud.com//image/20170919/905c26e7a60e7869.png?imageView2/1/w/160/h/90'"
                            :canLabel="true"
                            :canProgress="true"
                            :progress="image.progress"
                            :canDimmer="true"
                            :iconFunction="['close']"
                            :style="{marginLeft:'10px'}"
                            @onClose="deleteUploadImage">
                        </my-image>
                    </span>
                    <form 
                        class="myupload-form" 
                        ref="form" 
                        :action="action" 
                        method="POST" 
                        enctype="multipart/form-data">
                        <el-button 
                            icon="el-icon-plus" 
                            v-show="!(!imageSelectMultiple && uploadImages.length) && imageSelectOnce > uploadImages.length + uploadHistoryImageArray.length"
                            :style="upload=='image'?blockStyle:btnStyle" 
                            class="vertical-fix" 
                            @click="addUpload" 
                            style="margin-left: 10px;">
                        </el-button>
                        <input 
                            class="myupload-input" 
                            type="file" 
                            name="file" 
                            :multiple="multiple" 
                            :accept="accept" 
                            ref="input" 
                            @change="inputChange">
                    </form>
                    <p 
                        v-if="IE9.length" 
                        id="myupload-help-info" 
                        class="help-info" 
                        ref="info">{{IE9}}
                    </p>
                    <p class="upload_info">
                        支持 {{getAccept}} 等 {{getAcceptLength}} 种格式　｜　长宽不超过 {{imageMaxWidth}}, {{imageMaxHeight}}　｜　大小不超过 {{imageMaxSizeKB}} (KB)
                    </p>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 视频 -->
        <div slot="body" v-if="upload=='video'">
            <el-tabs :activeName="activeName" style="margin-top:-20px;" @tab-click="tabChange">
                <el-tab-pane label="历史记录" name="history_video" :disabled="onUpload">
                    <span v-if="upload=='video'" v-for="video of historyVideos" style="position: relative;">
                        <my-image
                            :id="video.id"
                            :src="video.src"
                            :dataURL="video.src"
                            :width="158"
                            :height="90"
                            :canBorder="false"
                            :class="video.active?'active':''"
                            :clickEvent="toggleHistory"
                            :style="{
                                border: 'solid 1px #ddd',
                                margin: '10px 10px 25px 10px',
                                display: 'inline-block',
                                cursor: 'pointer',
                            }">
                        </my-image>
                        <span style="position: absolute; bottom: -10px; left: 10px; width: 158px; line-height: 20px; text-align: center; background: #f2f2f2; ">{{video.name}}</span>
                    </span>
                    <span v-if="historyVideos.length==0">还没有上传视频哦</span>
                    <div class="block" v-bind:style="paginationStyle">
                        <el-pagination :page-size="paginationData.pageSize" :page-sizes="paginationData.pageSizes" :current-page.sync="paginationData.curPage" @current-change="onIndexChange" @size-change="onSizeChange" layout="total, sizes, prev, pager, next" :total="paginationData.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="本地上传" name="new_video">
                    <span v-for="video of uploadVideos">
                        <my-image version="video"
                            :cleanSRC="true"
                            :src="video.src ? video.src : 'https://weapp-1253522117.image.myqcloud.com//image/20170919/905c26e7a60e7869.png?imageView2/1/w/160/h/90'"
                            :id="video.id"
                            :dataURL="video.dataURL"
                            :width="160"
        					:height="90"
                            :canLabel="true"
                            :canProgress="true"
                            :progress="video.progress"
                            :progressWidth="45"
                            :progressShadow="160"
                            :canDimmer="true"
                            :iconFunction="['view','close']"
                            :style="{marginLeft:'10px'}"
                            @onClose="deleteUploadVideo(video.dataURL)">
                        </my-image>
                    </span>
                    <form class="myupload-form" ref="form" :action="action" method="POST" enctype="multipart/form-data">
                        <el-button icon="el-icon-plus" v-show="!(!videoSelectMultiple && uploadVideos.length) && videoSelectOnce > uploadVideos.length + uploadHistoryVideoArray.length" :style="btnStyle" class="vertical-fix" @click="addUpload" style="margin-left: 10px;"></el-button>
                        <input class="myupload-input" type="file" name="file" :multiple="multiple" :accept="accept" ref="input" @change="inputChange">
                    </form>
                    <p class="upload_info">
                        支持 {{getAccept}} 等 {{getAcceptLength}} 种格式｜　大小不超过 {{videoMaxSizeKB/1024}} (MB)
                    </p>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 尾部 -->
        <span slot="foot" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="handleConfirm" :disabled="onUpload">确 认</el-button>
        </span>
    </my-dialog>
</div>

</template>

<script>

import $ from 'jquery'
import { Yijun } from 'util/Yijun.js'
import MyImage from 'components/MyDialog/MyImage'
import { getPath } from 'util/getPath.js'
import MyDialog from 'components/MyDialog/MyDialog'

export default {
    data() {
        return {

        }
    },
    components: {
        MyImage,
        MyDialog,
    },
    props: {
        // 图片检查接口
        imageSelectAccept: {
            type: Array,
            default: () => ['image/png', 'image/jpeg', 'image/gif', 'image/bmp']
        },
        imageSelectMultiple: {
            type: Boolean,
            default: true
        },
        imageSelectOnce: {
            type: Number,
            default: 10
        },
        imageMaxWidth: {
            type: Number,
            default: 3000
        },
        imageMaxHeight: {
            type: Number,
            default: 3000
        },
        imageMaxSizeKB: {
            type: Number,
            default: 3024
        },

        // 视频检查接口
        videoSelectAccept: {
            type: Array,
            default: () => ['video/mp4', ]
        },
        videoSelectMultiple: {
            type: Boolean,
            default: false
        },
        videoSelectOnce: {
            type: Number,
            default: 1
        },
        videoMaxSizeKB: {
            type: Number,
            default: 25600
        },

        //配置
        upload: {
            type: String,
            default: 'image'
        },

        canModal: {
            type: Boolean,
            default: true
        },

        // 翻页接口
        pagPageSize: {
            type: Number,
            default: 40,
        },
        pagPageSizeVideo: {
            type: Number,
            default: 18,
        },

        // actions&init
        extraData: {
            type: Object,
            default: () => {}
        },
        action: String,
        onSuccess: {
            type: Function,
            default: () => {}
        },
        deleteImage: Function,

        // 样式
        btnStyle: {
            type: Object,
            default: () => {}
        },

        // 关联的对象，上传成功之后的透传，方便多个处理
        relatedObj:{
            type:Object,
            default:()=>{}
        }
    },
    data() {
        return {

            IE9: '',
            // 上传框
            activeName: this.upload == 'image' ? 'new_image' : 'history_video',
            dialogVisible: false,
            historyImages: [],
            historyVideos: [],
            active: false,
            onUpload: false,
            uploadImages: [], // 对话框存在本地上传图片数量
            uploadedImages: [], // 对话框存在已激活历史图片数量
            uploadHistoryImageArray: [], // 对话框上传历史图片任务组
            uploadNewImageArray: [], // 对话框上传本地图片任务组
            uploadVideos: [], // 对话框存在本地上传视频数量
            uploadedVideos: [], // 对话框存在已激活历史视频数量
            uploadHistoryVideoArray: [], // 对话框上传历史视频任务组
            uploadNewVideoArray: [], // 对话框上传本地视频任务组
            multiple: this.upload == 'image' ? this.imageSelectMultiple : this.videoSelectMultiple,
            accept: this.upload == 'image' ? this.imageSelectAccept : this.videoSelectAccept,
            selectOnce: this.upload == 'image' ? this.imageSelectMultiple ? this.imageSelectOnce : 1 : this.videoSelectMultiple ? this.videoSelectOnce : 1,
            intervals: [],

            // 翻页信息
            paginationData: {
                total: 0,
                pageSize: this.upload == 'image' ? this.pagPageSize : this.pagPageSizeVideo,
                pageSizes: [~~(this.upload == 'image' ? this.pagPageSize / 2 : this.pagPageSizeVideo / 2), this.upload == 'image' ? this.pagPageSize : this.pagPageSizeVideo, this.upload == 'image' ? this.pagPageSize * 2 : this.pagPageSizeVideo * 2],
                curPage: 1,
                curPageSize: this.upload == 'image' ? this.pagPageSize : this.pagPageSizeVideo, // 保留切换pageSize前的状态
                lastPageSize: this.upload == 'image' ? this.pagPageSize : this.pagPageSizeVideo, //
            },

            // 样式
            blockStyle: {
                height: '100px',
                width: '100px',
                display: 'inline-block',
                cursor: 'pointer',
            },
            paginationStyle: {
                marginTop: '10px',
                textAlign: 'center',
            },
            deleteStyle: {
                position: 'absolute',
                margin: '10px',
                border: 'none',
                height: '205px',
                width: '205px',
                opacity: '0.14',
            },

            uploadImagesWidth: '',
            uploadImagesHeight: '',
        }
    },
    beforeCreate() {
        this.IE9 = ''
    },
    mounted() {
        // if (window.navigator.userAgent.indexOf('MSIE 9.0')!=-1) {}
    },
    watch: {
        activeName(n, o) {
            console.log(n);
        }
    },
    computed: {
        getAccept() {
                return this.accept.map(x => x.split('/')[1]).join(', ');
            },
            getAcceptLength() {
                return this.accept.length;
            }
    },
    methods: {

        /* 对话框处理 */
            openDialog() {
                (!this.dialogVisible) && (this.dialogVisible = true);
            },
            closeDialog(e) {
                // elementui dialog beforeclose 默认参数传事件
                if (typeof(e) == 'function' || e.type) setTimeout(() => {
                    this.dialogVisible = false;
                }, 10);
                this.uploadImages = []
                this.uploadedImages = []
                this.uploadNewImageArray = []
                this.uploadHistoryImageArray = []
                this.historyImages.map(x => x.active = false)
                this.uploadVideos = []
                this.uploadedVideos = []
                this.uploadNewVideoArray = []
                this.uploadHistoryVideoArray = []
                this.historyVideos.map(x => x.active = false)
                this.intervals.map(x => {
                    clearInterval(x)
                })
            },
            handleConfirm() {
                this.uploadConfirm(this.uploadHistoryImageArray)
                this.uploadConfirm(this.uploadNewImageArray)
                this.uploadConfirm(this.uploadHistoryVideoArray)
                this.uploadConfirm(this.uploadNewVideoArray)
                this.closeDialog({ type: '确认上传关闭' })
            },
            uploadConfirm(funcArray) {
                funcArray.map(x => x.cb())
            },
            tabChange(data) {
                this.uploadImages = []
                this.uploadedImages = []
                this.uploadNewImageArray = []
                this.uploadHistoryImageArray = []
                this.historyImages.map(x => x.active = false)
                this.uploadVideos = []
                this.uploadedVideos = []
                this.uploadNewVideoArray = []
                this.uploadHistoryVideoArray = []
                this.historyVideos.map(x => x.active = false)
                this.intervals.map(x => {
                    clearInterval(x)
                })
            },

            /* 上传文件处理 */
            addUpload() {
                this.$refs.input.click();
            },
            deleteUploadImage(e) {
                if (this.upload == 'image') {
                    var index = this.uploadImages.findIndex(x => x.src == e.src)
                    if (index != -1) this.uploadImages.splice(index, 1)
                    var index = this.uploadNewImageArray.findIndex(x => x.src == e.src)
                    if (index != -1) this.uploadNewImageArray.splice(index, 1)
                }
            },
            deleteUploadVideo(dataURL) {
                if (this.upload == 'video') {
                    var index = this.uploadVideos.findIndex(x => x.dataURL == dataURL)
                    if (index != -1) this.uploadVideos.splice(index, 1)
                    var index = this.uploadNewVideoArray.findIndex(x => x.dataURL == dataURL);
                    if (index != -1) this.uploadNewVideoArray.splice(index, 1);
                }
            },
            inputChange(e) {

                console.log('e-----------------------', e);

                // 检查input选择文件长度
                if (this.upload == 'image') {
                    console.log((e.target.files && e.target.files.length || 1), JSON.stringify(this.uploadImages), this.uploadImages.length, this.uploadHistoryImageArray.length, this.selectOnce);
                    if ((e.target.files && e.target.files.length || 1) + this.uploadImages.length + this.uploadHistoryImageArray.length > this.selectOnce) {
                        this.$notify.error({
                            message: '一次性最多上传 ' + this.selectOnce + ' 张图片'
                        });
                        return false;
                    }
                } else if (this.upload == 'video') {
                    if ((e.target.files && e.target.files.length || 1) + this.uploadVideos.length + this.uploadHistoryVideoArray.length > this.selectOnce) {
                        this.$notify.error({
                            message: '一次性最多上传 ' + this.selectOnce + ' 个视频'
                        });
                        return false;
                    }
                }

                console.log('e.target', e.target);

                // 获取路径
                if (e.target.files) {
                    console.error(e.target.files,'--------------')
                    getPath(e.target).then(srcs => {
                        console.log('srcs','-------11111---------',srcs);
                        // 调用上传
                        for (let i = 0, max = srcs.length; i < max; i++) {
                            new Promise((resolve, reject) => {
                                this.onUpload = true;
                                this.handleInputChange(e.target.files[i], srcs[i], e)
                                    .then(() => {
                                        setTimeout(() => {
                                            this.onUpload = false
                                        }, 300);
                                        resolve();
                                    })
                                    .catch((err) => {
                                        console.log('err', err);
                                        setTimeout(() => {
                                            this.onUpload = false
                                        }, 300);
                                        reject();
                                    });
                            }).catch((err) => {})
                        }
                    })
                } else {
                    // IE9
                    // HTTPS+IE9本地滤镜 第一次未能成功解决的BUG :-D
                    let src = '__MSIE9_HTTPS_'+Yijun.randomID()
                    this.upload == 'image'
                    ?   this.uploadImages.push({
                            src: src,
                            progress: 0,
                            id: src,
                            size: src,
                        })
                    :   this.uploadVideos.push({
                            dataURL: src,
                            progress: 0,
                            id: src,
                            size: src,
                        })

                    let handle = this.uploadImages.find(x => x.id==src) || this.uploadVideos.find(x => x.id==src)
                    this.fakeProgress(src)
                    let self = this
                    $(this.$refs.form).ajaxForm({
                        url: this.action,
                        data: {},
                        success (result, status) {
                            result = eval('('+result+')')
                            if (result.code >= 0) {
                                if (self.upload=='image') {
                                    console.log('IE9 image');
                                    self.uploadNewImageArray.push({
                                        src: result.data.url,
                                        cb: () => {
                                            let id = self.onSuccess(result.data,self.relatedObj)
                                            self.$emit('onSuccessEmit', result.data)
                                            handle['id'] = id
                                        }
                                    })
                                    ;(handle['progress'] = 100) && ( handle['src'] = result.data.url );
                                } else if (self.upload=='video') {
                                    console.log('IE9 video');
                                    self.uploadNewVideoArray.push({
                                        cb: () => {
                                            let id = self.onSuccess(result.data,self.relatedObj)
                                            self.$emit('onSuccessEmit', result.data)
                                            handle['id'] = id
                                        }
                                    })
                                    ;(handle['progress'] = 100) && ( handle['dataURL'] = result.data.url ) && ( handle['src'] = result.data.cover );
                                }
                            }
                            // self.$refs.input.value = null
                            // 诡异交互方式以避开IE9
                            // handle && (handle['progress'] = 100)
                            // self.$refs.input.value = null
                            // // that.IE9 = '已从本地上传图片！上传完成后，请从“我的图片”栏目选择需要设定的图片！'
                            // that.getHistoryImages()
                        },
                    }).submit()
                }
            },
            handleInputChange(file, src, e) {
                return new Promise((resolve, reject) => {

                    let canUpload = true
                    this.progress = 0

                    if (this.upload == 'image') {

                        let image = new Image(),
                            canUpload = true;

                        image.src = src;
                        image.onload = () => {

                            this.uploadImagesWidth = image.width
                            this.uploadImagesHeight = image.height
                            file['width'] = image.width
                            file['height'] = image.height
                            // 暂时关闭大小校验;
                            // if (image.width > this.imageMaxWidth || image.height > this.imageMaxHeight) {
                            //     canUpload = false;
                            //     this.$notify.error({
                            //         message: '图片宽不超过 ' + this.imageMaxWidth + ' 像素，高不超过 ' + this.imageMaxHeight + ' 像素'
                            //     });
                            //     reject();
                            // }
                            console.log('file.size, this.imageMaxSizeKB*1024', file.size, this.imageMaxSizeKB*1024);
                            if (file.size > this.imageMaxSizeKB * 1024) {
                                canUpload = false;
                                this.$notify.error({
                                    message: '图片大小不大于 ' + this.imageMaxSizeKB + ' KB'
                                });
                                reject();
                            }
                            if (this.uploadImages.findIndex(x => x.size == file.size) != -1) {
                                canUpload = false;
                                this.$notify.error({
                                    message: file.name + ' 图片已上传'
                                });
                                reject();
                            }
                            if (!this.accept.includes(file.type)) {
                                canUpload = false;
                                this.$notify.error({
                                    message: '格式错误，目前支持格式：'+ JSON.stringify(this.accept)
                                });
                                reject();
                            }
                            const imageInfoCheckList = [
                                // () => {
                                //     if (image.width != image.height) {
                                //         this.$notify.info({ message: '推荐使用正方型图片' });
                                //     }
                                // },
                                // () => {
                                //     this.$notify.info({ message: file.name+'图片大小为：'+(file.size/1024).toFixed(2)+' kb' });
                                // }
                            ];
                            let execImageInfoCheck = setInterval(() => {
                                imageInfoCheckList.length ?
                                    imageInfoCheckList.shift()() :
                                    clearInterval(execImageInfoCheck);
                            }, 50);

                            canUpload
                                && this.uploadImages.push({
                                    src: src,
                                    progress: 0,
                                    id: 'unkown',
                                    size: file.size
                                });

                            canUpload
                                && this.uploadFile(file, src)
                                .then(val => {
                                    resolve();
                                }).catch((err) => {
                                    console.log(err);
                                }) || reject(file.name + ' 上传失败！');
                        }

                    } else if (this.upload == 'video') {

                        if (file.size > this.videoMaxSizeKB * 1024) {
                            canUpload = false;
                            this.$notify.error({
                                message: '视频大小不大于 ' + this.videoMaxSizeKB/1024 + ' MB'
                            });
                            reject();
                        }
                        if (!this.accept.includes(file.type)) {
                            canUpload = false;
                            this.$notify.error({
                                message: '视频格式错误，目前支持格式：'+ JSON.stringify(this.accept)
                            });
                            reject();
                        }

                        if (!this.accept.includes(file.type)) {
                            canUpload = false;
                            this.$notify.error({
                                message: '视频格式错误，目前支持格式：'+ JSON.stringify(this.accept)
                            });
                            reject();
                        }

                        canUpload
                            && this.uploadVideos.push({
                                dataURL: src,
                                progress: 0,
                                id: 'unkown',
                                size: file.size
                            });

                        canUpload
                            && this.uploadFile(file, src)
                            .then(val => {
                                resolve();
                            }).catch((err) => {
                                console.log(err);
                            }) || reject(file.name + ' 上传失败！');
                    }
                })
            },
            fakeProgress(src) {
                let handle =
                    this.upload == 'image'
                    ? this.uploadImages.find(x => x.src == src)
                    : this.uploadVideos.find(x => x.dataURL == src)
                ;
                // 显示进度条
                let fastStep = setInterval(() => {
                    let sep = 1;
                    (handle['progress'] + sep < 5) && (handle['progress'] += sep) || clearInterval(fastStep);
                }, 100)
                let fakeProgress = setInterval(() => {
                    let sep = Math.ceil(Math.random() * 3);
                    (handle['progress'] + sep < 99) && (handle['progress'] += sep) || clearInterval(fakeProgress);
                }, this.upload=='video' ? (this.videoMaxSizeKB/1024*50) : 500)
                this.intervals.push(fakeProgress);
            },
            uploadFile(file, src) {
                let self = this;
                return new Promise((resolve, reject) => {

                    // 虚假进度条
                    this.fakeProgress(src)

                    // FormData
                    let url = this.action,
                        formData = new FormData();
                        formData.append('file', file)
                        formData.append('uploadImagesWidth', file.width)
                        formData.append('uploadImagesHeight', file.height)

                    console.log('formData', formData.get('uploadImagesWidth'), JSON.stringify(file))

                    // 上传
                    let that = this
                    $.ajax({
                        type: "POST",
                        url: url,
                        async: true,
                        contentType: false,
                        processData: false,
                        data: formData,
                        dataType: 'json',
                        success(result) {
                            console.log('result', result)
                            let uploading = null
                            if (self.upload == 'image') {
                                if (result.code >= 0) {
                                    self.uploadNewImageArray.push({
                                        src: src,
                                        cb: () => {
                                            self.uploadImages.find(x => x.src == src)['id'] = id;
                                            let id = self.onSuccess(result.data, self.relatedObj)
                                            self.$emit('onSuccessEmit', result.data)
                                        }
                                    });
                                }
                                uploading = self.uploadImages.find(x => x.src == src);
                            } else if (self.upload == 'video') {
                                if (result.code >= 0) {
                                    console.log('result.data', result.data);
                                    self.uploadNewVideoArray.push({
                                        cb: () => {
                                            self.uploadVideos.find(x => x.dataURL == src)['id'] = id;
                                            let id = self.onSuccess(result.data,self.relatedObj)
                                            self.$emit('onSuccessEmit', result.data)
                                        }
                                    });
                                }
                                uploading = self.uploadVideos.find(x => x.dataURL == src)
                                uploading.src = result.data.cover
                            }
                            uploading && (uploading['progress'] = 100);
                            // self.$refs.input.value = null; // edge下触发两次change
                            resolve(src + ' 上传成功!');
                        },
                        error(result) {
                            let uploading = null
                            if (self.upload == 'image') {
                                uploading = self.uploadImages.find(x => x.src == src);
                            } else if (self.upload == 'video') {
                                uploading = self.uploadVideos.find(x => x.dataURL == src);
                            }
                            uploading && (uploading['progress'] = 99);
                            // self.$refs.input.value = null;
                            reject(src + ' 服务器出现错误!');
                        },
                    });
                });
            },

            /* 历史记录图片处理 */
            getHistory(pageIndex = 1, pageSize = this.upload == 'image' ? this.pagPageSize : this.pagPageSizeVideo) {
                this.$ajax.post('url', {
                    pageIndex,
                    pageSize,
                }).then(res => { 
                    if (this.upload=='image') {
                        this.historyImages = []
                        res.images.map(x => {
                            // console.error("---------------",x)
                            this.historyImages.push({
                                id: x.id,
                                src: x.url + '?imageView2/1/w/80/h/80',
                                time: x.upload_time,
                                active: this.uploadedImages.includes(x.id) ? true : false,
                            })
                        })
                    } else if (this.upload=='video') {
                        this.historyVideos = []
                        res.videos.map(x => {
                            this.historyVideos.push({
                                name: x.name,
                                id: x.id,
                                src: x.cover,
                                dataURL: x.url,
                                time: x.upload_time,
                                active: this.uploadedVideos.includes(x.id) ? true : false,
                            })
                        })
                    }
                    this.paginationData.total = Number(res.total);
                });
            },
            toggleHistory(e) {
                e.target ? '' : (e.target = e)

                // 变量初始化
                let selectMultiple, history, uploadHistoryArray, uploaded;
                if (this.upload=='image') {

                    selectMultiple = this.imageSelectMultiple
                    uploaded = this.uploadedImages
                    history = this.historyImages
                    uploadHistoryArray = this.uploadHistoryImageArray

                } else if (this.upload=='video') {

                    selectMultiple = this.videoSelectMultiple
                    uploaded = this.uploadedVideos
                    history = this.historyVideos
                    uploadHistoryArray = this.uploadHistoryVideoArray
                }

                // 定位历史图片
                let toActive = null,
                    index = history.findIndex(x =>
                        this.upload == 'image'
                            ? x.src.split('?')[0] == ( e.target.src && e.target.src.split('?')[0] )
                            : x.id == ( e.target.id.split('%')[1] )
                    )
                if (index != -1) {
                    if (!history[index].active) {
                        if (uploadHistoryArray.length == this.selectOnce) {

                            // 一张图片的情况单独处理
                            if (selectMultiple) {
                                $notify.error({
                                    message: '一次性最多上传 ' + this.selectOnce + ' 张图片'
                                });
                                return null
                            } else {
                                // 寻找上一张图片
                                let last = uploaded.pop();
                                // 删除任务
                                let j = uploaded.findIndex(x => x.id && x.id == last);
                                if (j != -1) uploaded.splice(j, 1);
                                let i = uploadHistoryArray.findIndex(x => x.id && x.id == last);
                                if (i != -1) uploadHistoryArray.splice(j, 1);
                                // 删除active
                                let k = history.findIndex(x => x.id && x.id == last);
                                if (k != -1) history[k].active = false;
                            }
                        }
                        toActive = '1';
                        history[index].active = true;
                    } else {
                        history[index].active = false;
                        toActive = '0';
                    }

                    let id = history[index].id,
                        src = history[index].src,
                        dataURL = history[index].dataURL;
                    if (toActive == '1') {
                        uploaded.push(id);
                        uploadHistoryArray.push({
                            id: id,
                            cb: () => {
                                this.onSuccess({
                                    id: id,
                                    url: this.upload=='image' ? src.split('?')[0] : dataURL,
                                    cover: src,
                                    uploadImagesWidth: this.uploadImagesWidth,
                                    uploadImagesHeight: this.uploadImagesHeight,
                                },this.relatedObj);
                                this.$emit('onSuccessEmit', {
                                    id: id,
                                    url: this.upload=='image' ? src.split('?')[0] : dataURL,
                                    cover: src,
                                    uploadImagesWidth: this.uploadImagesWidth,
                                    uploadImagesHeight: this.uploadImagesHeight,
                                })
                            }
                        });
                    } else if (toActive == '0') {
                        let i = uploadHistoryArray.findIndex(x => x.id && x.id == id);
                        if (i != -1) uploadHistoryArray.splice(i, 1);
                        let j = uploaded.findIndex(x => x.id && x.id == id);
                        if (j != -1) uploaded.splice(j, 1);
                    }
                }
            },

            /* 翻页处理 */
            onIndexChange(pageIndex) {
                this.getHistory(pageIndex, this.paginationData.curPageSize);
            },
            onSizeChange(pageSize) {
                this.paginationData.lastPageSize = this.paginationData.curPageSize;
                this.paginationData.curPageSize = pageSize;
                this.paginationData.curPage = Math.ceil(this.paginationData.curPage * this.paginationData.lastPageSize / this.paginationData.curPageSize);
                this.getHistory(this.paginationData.curPage, pageSize);
            }
    }
}
</script>

<style lang="less">

.myupload-form {
    position: relative;
    display: inline-block;
}

.myupload-input {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 10px;
    top: 0;
    display: block !important;
    opacity: 0;
    cursor: pointer;
}

#myupload-help-info {
    margin: 25px 10px;
}

.el-dialog--my-upload {
    width: 1050px !important;
    position: flex;
    z-index: 999;
    text-align:left;
    box-shadow: 0px 0px 5px #ccc, 0px 0px 10px #444, 0px 0px 20px #999;
}

</style>

<style lang="less" scoped>

.my-upload-inner {
    display: inline-block;
    over-flow: none;
}

.my-upload-inner .upload_info {
    margin-top: 20px;
    margin-left: 10px;
    text-align: center;
    color: #555;
}

.my-upload-inner .active {
    outline: solid 5px orange !important;
    border: solid 2px #fff !important;
}

.my-upload-inner .active:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    border-left: 20px solid transparent;
    border-bottom: 20px solid orange;
}

.vertical-fix {
    margin-top: 0 !important;
    vertical-align: bottom !important;
}

</style>