<template>
    <div ref="myimage" class="my-image" :id="'myImage%'+String(id)" v-show="!stateDestroy" @click="clickEvent" :style="myImageStyle" @mouseleave="blurDimmer">
        <!-- 图片层 -->
        <transition name="el-fade-in" v-if="src.indexOf('__MSIE9__')==-1">
            <img :id="'myImageImage%'+String(id)" :src="trueSRC" :style="imageStyle" @mouseenter="focusImage" @mouseleave="blurDimmer">
        </transition>
        <!-- 标志层 -->
        <label v-show="canLabel && ( stateUploadSuccess || stateUploadFailed )" :style="labelStyle">
            <i v-if="stateUploadSuccess"
                class="el-icon-upload-success el-icon-check"
                style="transform:rotate(-45deg);">
            </i>
            <i v-if="stateUploadFailed"
                class="el-icon-plus">
            </i>
        </label>
        <!-- 进度条层 -->
        <transition name="el-fade-in">
            <el-progress type="circle" :width="progressWidth || width*0.64" v-show="progressVisible" :percentage="progress>=1 ? progress : 1" :style="progressStyle"></el-progress>
        </transition>
        <!-- 遮罩层 -->
        <transition name="el-fade-in-linear">
            <div v-show="dimmerVisible" :style="dimmerStyle" @mouseenter="focusImage" @mouseleave="blurDimmer">
                <slot name="dimmer-content">  </slot>
                <slot> {{ iconText }} </slot>
            </div>
        </transition>
        <span v-show="dimmerVisible" :id="'myImageDimmer%'+String(id)" style="left:40px;top:40px;" :style="iconStyle" @mouseleave="blurDimmer">
                <i
                    v-for="icon in icons"
                    :class="icon.style"
                    @click="execIconFunction(icon.cb)"
                    @mouseleave="blurDimmer"
                    :style="{cursor:'pointer'}">
                </i>
        </span>
        <!-- 浮标层 -->
        <label v-show="floatLabelVisible" :id="'myImageFloatLabel%'+String(id)" :style="floatLabelStyle" @mouseenter="focusImage(), focusFloatLabel()" @mouseleave="blurDimmer" @click="$emit('onClose', this)">
            <i class="fa fa-times el-icon-circle-close-outline" style="transform:rotate(-45deg);"></i>
        </label>
        <!-- 展示层 -->
        <my-dialog v-if="viewVisible"
            :minWidth="viewWidth+'px'"
            top="10%" class="el-dialog--myImageView" tag="浏览源文件"
            :visible.sync="viewVisible"
            @click="closeView"
            @onClose="closeView"
            :style="{ textAlign: 'center'}">
                <img v-if="version=='image'"
                    :src="
                        (viewWidth)
                            ? src.split('?')[0]+`?imageView2/2/w/${viewWidth}`
                            : src.split('?')[0]
                    "
                    :style="viewImageStyle"
                >
                <video v-if="version=='video'"
                    controls="controls"
                    autoplay
                    :poster="
                        (viewWidth)
                            ? src.split('?')[0]+`?imageView2/2/w/${viewWidth}`
                            : src.split('?')[0]
                    "
                    :src="dataURL"
                    :style="viewVideoStyle">
                        {{'您的浏览器版本过低，不支持视屏预览，请升级浏览器后重试！'}}
                </video>
                <span slot="foot">
                    <el-button @click="viewVisible=false" >关闭</el-button>
                </span>
        </my-dialog>
    </div>
</template>

<script>

import MyDialog from 'components/MyDialog/MyDialog.vue';

export default {
    components: {
        MyDialog
    },
    props: {

        // 基本属性
        id: { type: [String,Number], default: ()=>Math.random()*(new Date()).getTime()+'_'+(new Date()).getTime() },
        src: { type: String, requird: true },
        dataURL: { type: String, default: '' }, // 视屏版本地址
        cleanSRC: { type: Boolean, default: false },
        width: { type: Number, default: 100 },
        height: { type: Number, default: 100 },
        position: { type: String, default: 'relative' },
        display: { type: String, default: 'inline-block' },
        canBorder: { type: Boolean, default: true },
        borderRadius: { type: [String, Boolean], default: '0px' },
        viewWidth: { type: Number, default: 860 }, // dialog 中图片的宽度
        viewHeight: { type: Number, default: null },
        canClose: { type: Boolean, default: false },
        floatClose: { type: Boolean, default: false },
        closeEvent: { type: Function, default: () => { /*console.log('关闭图片')*/ } },
        clickEvent: { type: Function, default: () => {} },

        // 位移属性
        iconFunctionOffsetX: { type: Number, default: 0 },
        iconFunctionOffsetY: { type: Number, default: 0 },

        // 标志层属性
        canLabel: { type: Boolean, default: false },
        labelBackgroundColor: { type: Array, default: ()=>['#13ce66','#FC3A17'] },

        // 进度条属性
        canProgress: { type: Boolean, default: false },
        progressWidth: { type: Number, default: null },
        progressShadow: { type: Number, default: null },
        progressBackgroundColor: { type: String, default: 'rgba(0,0,0,0.5)' },

        // 遮罩层属性
        canDimmer: { type: Boolean, default: false },
        dimmerHeight: { type: String, default: '40%' },
        dimmerColor: { type: String, default: 'rgba(0,0,0,0.5)' },
        dimmerPadding: { type: String, default: '20px' },
        iconFunction: { type: Array, default: () => [] },
        iconSize: { type: Number, default: 20 },

        // 展示层属性
        viewTitle: { type: Boolean, default: false },

        /* 状态 */
        // lock2D: { type: Boolean, default: false },
        version: { type: String, default: 'image' },
        destroy: { type: Boolean, default: false },
        progress: { type: Number, default: 0 },
        uploadSuccess: { type: Boolean, default: false },
    },
    data() {
        return {

            // 锁定
            widthLock: this.widthLock || this.width,
            heightLock : this.heightLock || this.height,

            icons : this.iconFunction,
            iconText : '',

            /* 状态 */
            stateDestroy: this.destroy,
            stateProgress: this.progress,
            stateUploadSuccess: this.uploadSuccess,
            stateUploadFailed: null,

            /* 显隐 */
            labelVisible: false,
            floatLabelVisible: false,
            progressVisible: false,
            dimmerVisible: false,
            viewVisible: false,

            /* 样式 */
            myImageStyle: {
                position: this.position,
                marginRigth: '10px',
                width: this.width + 'px',
                height: this.height + 'px',
                border: this.canBorder ? '1px solid rgb(204, 204, 204)' : '0',
                display: this.display,
                overflow: 'hidden',
                verticalAlign: 'bottom'
            },
            imageStyle: {
                width: this.width + 'px',
                height: this.height + 'px',
                borderRadius: this.borderRadius ? this.borderRadius : 'none',
            },
            floatLabelStyle: {
                position: 'absolute',
                right: '-25px',
                top: '-25px',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                transform: 'rotate(45deg)',
                boxShadow: '0 1px 1px #ccc',
                color: 'white',
                fontSize: '12px',
                lineHeight: '70px',
                transition: '.3s',
                cursor: 'pointer',
            },
            labelStyle: {
                position: 'absolute',
                right: '-20px',
                top: '-9px',
                width: '50px',
                height: '30px',
                textAlign: 'center',
                backgroundColor: null,
                transform: 'rotate(45deg)',
                boxShadow: '0 1px 1px #ccc',
                color: 'white',
                fontSize: '12px',
                lineHeight: '43px',
            },
            progressStyle: {
                position: 'absolute',
                left: '' + (this.width - ( this.progressWidth || this.width * 0.64 ) ) / 2 + 'px',
                top: '' + (this.height - ( this.progressWidth || this.height * 0.64 ) ) / 2 + 'px',
                backgroundColor: this.progressBackgroundColor,
                boxShadow: this.progressBackgroundColor + ' 0 0 ' + ( this.progressShadow || this.height * 0.64 ) / 4 + 'px ' + ( this.progressShadow || this.height * 0.64 ) / 2.5 + 'px',
                borderRadius: this.borderRadius ? this.borderRadius : 'none',
            },
            dimmerStyle: {
                position: 'absolute',
                left: '0',
                top: '0',
                width: this.width + 'px',
                height: this.height + 'px',
                backgroundColor: this.dimmerColor,
                borderRadius: this.borderRadius ? this.borderRadius : 'none',
            },
            dimmerStyleWithContent: {
                position: 'absolute',
                left: '0',
                bottom: '0',
                padding: this.dimmerPadding,
                width: this.width + 'px',
                height: this.dimmerHeight,
                backgroundColor: this.dimmerColor,
                borderRadius: this.borderRadius ? this.borderRadius : 'none',
            },
            dimmerStyleWithoutContent: {
                position: 'absolute',
                left: '0',
                top: '0',
                width: this.width + 'px',
                height: this.height + 'px',
                backgroundColor: this.dimmerColor,
                borderRadius: this.borderRadius ? this.borderRadius : 'none',
            },
            dimmerStyle: {},
            iconStyle: {
                position: 'absolute',
                left: (this.width - (this.iconSize * 2 * this.iconFunction.length) + this.iconSize + this.iconFunctionOffsetX) / 2  + 'px',
                top: (this.height - this.iconSize) / 2 + this.iconFunctionOffsetY + 'px',
                width: this.width+'px',
                letterSpacing: '' + this.iconSize + 'px',
                fontSize: '' + this.iconSize + 'px',
                textAlign: 'left',
                color: 'white',
            },
            viewVideoStyle: {
                margin: '30px 0',
                boxShadow: '0 0 5px #ddd',
                width: '100%'
            },
            viewImageStyle: {
                width: this.viewWidth ? this.viewWidth + 'px' : '100%'
            },
        }
    },
    updated () {

    },
    mounted() {

        // console.log(this.canClose);

        // IE9
        if (this.src.indexOf('__MSIE9__')!=-1) {
            let imageHandle = this.$refs.myimage
            try{
                imageHandle.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)"
                imageHandle.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = this.src.split('__MSIE9__')[0]
            } catch (e) {
                this.$emit('onClose')
            }
        }

        // 标识
        (this.canLabel) &&
        (this.stateUploadSuccess == true) &&
        (this.labelVisible = true);

        // 进度条
        (this.canProgress) &&
        (this.width >= 126) &&
        (this.height >= 126) &&
        (this.progressVisible = true);

        // dimmer
        this.dimmerStyle = this.dimmerStyleWithoutContent;

        // 默认icon
        let proxy = this;
        let addIcon = {
            view(proxy, index) {
                proxy.icons[index] = {
                    style : 'el el-icon-zoom-in',
                    cb    : (self) => {
                        self.viewVisible = true;
                    }
                }
            },
            close(proxy, index) {
                !proxy.floatClose
                    &&  (proxy.icons[index] =  {
                                style: 'el-icon-circle-close-outline',
                                cb: (self) => {
                                    self.$emit('onClose', self);
                            }
                        })
                    ||  ( (proxy.floatLabelVisible = true)
                            &&  proxy.icons.splice(index, 1)
                        );
            },
            testUpload(proxy, index) {
                proxy.icons[index] = {
                    style : 'el-icon-upload',
                    cb    : (self) => {
                        self.dimmerVisible = false;
                        self.progressVisible = true;
                        setTimeout(function() { self.progress = 100; }, 300);
                    }
                }
            }
        }
        this.icons.map((f,index)=>{
            // this.canDimmer = true; 避免修改父组件传入的变量
            if (typeof(f)=='string') {
                if (addIcon[f]) {
                    addIcon[f](proxy, index)
                } else {
                    this.iconText=f;
                    this.dimmerStyle=this.dimmerStyleWithContent;
                }
            }
        });
    },
    watch: {
        icons(curVal, oldVal) {
            !this.iconText
                && (    this.iconStyle.left = (   this.width
                            -
                            (this.iconSize * 2 * this.iconFunction.length)
                            +
                            this.iconSize
                            +
                            this.iconFunctionOffsetX
                    )   + 'px' );
        },
        progress(curVal, oldVal) {
            this.progressVisible = true;
            this.stateProgress = curVal;
            if (curVal == 100) {
                setTimeout(() => {
                    this.progressVisible = false;
                    (this.canLabel) && (this.labelVisible = true) && (this.stateUploadSuccess = true);
                    this.labelStyle.backgroundColor = this.labelBackgroundColor[0]
                }, 1000);
            }
            // 上传失败状态
            if (curVal == 99) {
                setTimeout(() => {
                    this.progressVisible = false;
                    (this.canLabel) && (this.labelVisible = true) && (this.stateUploadFailed = true);
                    this.labelStyle.backgroundColor = this.labelBackgroundColor[1]
                }, 0);
            }
        },
    },
    computed: {
        trueSRC() {
            // console.log("src",this.src);
            return this.src.split('blob').length>1
                            ? this.src
                            : this.src.split('?').length==1 && this.cleanSRC
                                ?   this.src
                                :   this.src.split('?')[0]+`?imageView2/1/w/${this.width}/h/${this.height}`
        }
    },
    methods: {
        execIconFunction(func) {
            func(this);
            this.dimmerVisible=false;
        },
        focusImage() {
            (this.canDimmer) && (!this.progressVisible) && (this.dimmerVisible = true);
        },
        focusFloatLabel () {
            this.floatLabelStyle.backgroundColor = 'rgba(200, 0, 0, 0.9)';
            this.floatLabelStyle.boxShadow = '0 0 12px 2px rgba(200, 0, 0, 0.9)';
        },
        blurFloatLabel () {
            this.floatLabelStyle.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            this.floatLabelStyle.boxShadow = '0 0 1px 0 #ccc';
        },
        blurDimmer(e) {
            this.blurFloatLabel();
            e.toElement && e.fromElement
                && e.fromElement.offsetParent
                && this.id!=e.toElement.parentElement.id.split('%')[1]
                && (this.dimmerVisible = false);
        },
        closeView() {
            setTimeout(()=>{ this.viewVisible = false; }, 10);
        },

    }
}
</script>

<style lang="less">
.el-dialog--myImageView {
    min-width: 900px;
    width: 50%;
    max-width: 1400px;
}
.el-progress-circle__path {
    stroke: orange;
}
.el-progress__text {
    color: white;
}

.my-image {
    position : relative;
    display : inline-block;
}
</style>
