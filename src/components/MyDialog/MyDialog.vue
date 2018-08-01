<!--
    Mask为height:100%，为了解决IE10的样式问题，于是将content的height:auto去掉了，
    但是在footer下会有一丝透明，于是加了margin:-1；
 -->

<template>
    <div class="mydialog">
        <!-- <transition name='vuemodal'> -->
        <transition name="el-fade-in-linear">
            <!-- v-if="render" -->
            <div  v-if="render" v-show="visible" class="mask" :style="modalMaskStyle" @click="$emit('onClose')">
                <div class="body" :style="modalBodyStyle">
                    <div class="content" :style="modalContentStyle" @click="$event.stopPropagation();">

                        <!-- 头部 -->
                        <section class="header-content" :style="styles.headerContent" v-if="!noHead && !asContainer">
                            <slot name="head">
                                <header class="left header">
                                    <span class="tag">
                                            <i class="fa fa-align-justify"></i> {{tag}}{{state?'·':''}}{{state}}
                                    </span>
                                    <span class="right">
                                        <!-- <i class="fa fa-chevron-down"></i> -->
                                        <i v-if="canCloseButton" class="fa fa-times" @click="$emit('onClose')"></i>
                                    </span>
                                </header>
                            </slot>
                        </section>

                        <!-- 躯干 -->
                        <section class="main-content" :style="modalContentBodyStyle">
                            <slot name="body"></slot>
                            <slot></slot>
                        </section>

                        <!-- 尾部 -->
                        <section class="footer-content" v-if="!noFoot && !asContainer">
                            <footer class="footer">
                                <span class="right">
                                    <slot name="foot">
                                        <el-button class="button" @click="cansle"> {{cansleMsg}} </el-button>
                                        <el-button type="primary" class="nextButton button" @click="next"> {{nextMsg}} </el-button>
                                    </slot>
                                </span>
                            </footer>
                        </section>

                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>

export default {
    props: {

        // DOM基础
        id      : { type: [String, Number],     default: _=>+String(Math.random()*new Date().getTime()).split('.')[0] },
        zIndex  : { type: [String, Number],     default: 160   },
        top     : { type: [String, Number],     default: '15%' },
        bottom  : { type: [String, Number],     default: '5%'  },
        padding : { type: String,               default: '20px'    },
        width       : { type: [String, Number],     default: null    },
        minWidth    : { type: [String, Number],     default: null    },
        height  : { type: [String, Number],     default: null    },
        asContainer  : { type: Boolean,  default: false },              // 是否将MyDialog仅作为容器使用
        noFoot  : { type: Boolean,  default: false },
        noHead  : { type: Boolean,  default: false },
        headerColor : { type: String, default: '#f5f5f5'},
        boxShadow: { type: String, default: 'none'},
        borderRadius: { type: String, default: '0'},

        // 配置属性
        render  : { type: Boolean,  default: true       },
        visible : { type: Boolean,  default: false      },
        size    : { type: String,   default: 'medium'    },
        canCloseButton : { type: Boolean,  default: true      },

        // 信息
        tag         : { type: String,   default: '对话框'    },
        nextMsg     : { type: String,   default: '确 认'    },
        cansleMsg   : { type: String,   default: '关 闭'    },

        //状态
        state   : { type: String,   default: ''    },

        // 通信
        beforeNext : { type: Function, default: ()=>{} },
        beforeCansle : { type: Function, default: ()=>{} },

    },
    data() {
        return {
            // style
            modalMaskStyle : {
                position: 'fixed',
                zIndex  : this.zIndex,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, .5)',
                // transition: '.3s',
            },
            modalBodyStyle : {
                position: 'absolute',
                display: 'flex',
                paddingBottom: this.bottom,
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                overflowY: 'scroll',
                // transition: '.3s',
            },
            modalContentStyle : {
                display: 'block',
                position: 'relative',
                top: this.top,
                margin: '0 auto',
                width: this.width || this.realSize(),
                minWidth: this.minWidth,
                height: '0',
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: '0 2px 8px 1px rgba(0, 0, 0, .33)',
                // transition: '.3s',
            },
            modalContentBodyStyle : {
                padding: this.padding,
                minHeight: this.height || 'auto',
                backgroundColor: '#fff',
                boxShadow: this.boxShadow,
                borderRadius: this.borderRadius,
                transition: '.3s',
            },

            styles : {
                headerContent : {
                    backgroundColor: this.headerColor,
                }
            }
        }
    },
    created () {

        if (this.asContainer) {
            this.modalContentBodyStyle.backgroundColor = 'transparent'
        }

    },
    methods: {

        // footer
        cansle () {
            this.beforeCansle()
            this.$emit('onCansle')
            // this.$emit('onClose')
        },
        next () {
            this.beforeNext()
            this.$emit('onNext')
            // this.$emit('onClose')
        },

        // computed
        realSize () {
            return {
                small: '25%', medium: '50%', large: '90%',
            }[this.size]
        }
    }
}
</script>

<style lang="less">

.mydialog {
    .header-content {
        padding: 20px 15px 10px 15px;
        .header {
            height: 25px;
            line-height: normal;
            text-align: left;
            background-color: #f5f5f5;
            position:static;
            box-shadow:none;
            .tag {
                padding: 5px 10px;
                border-radius: 2px;
                color: #787878;
                background-color: #e5e5e5;
                cursor: pointer;
            }
            .right {
                float: right;
                .fa {
                    margin-top: -7px;
                    margin-left: 8px;
                    font-size: 23px;
                    color: #ccc;
                    cursor: pointer;
                }
            }
        }
    }

    .footer-content {
        margin-top: -1px;
        padding: 10px 15px;
        height: auto;
        border-radius: 4px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        background-color: #f5f5f5;
        overflow: hidden;
        .button {
            min-width: 80px;
        }
        .nextButton {
            background: -webkit-linear-gradient(top left, #FB8C00, lighten(orange, 5%)) !important;
        }
    }

    // ========================================================================= 模态框动画
    // =========================================================================
    .vuemodal-enter {
        opacity: 0;
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
        transition: .3s;
    }
    .vuemodal-enter-active {
        opacity: 1;
        transition: .3s;
    }
    .vuemodal-leave-active {
        opacity: 0;
        -webkit-transform: scale(1.02);
        transform: scale(1.02);
        transition: .3s;
    }

    // ========================================================================= 功能性css
    // =========================================================================
    .right {
        float: right;
    }
    .clear {
        clear: both;
    }
    /*滚动条宽度*/
    ::-webkit-scrollbar {
        width: 0px;
    }
    /* 轨道样式 */
    ::-webkit-scrollbar-track {
        width: 0px;
    }
}
</style>
