<template>
	<view class="uni-navbar" :class="{'uni-navbar-fixed':isFixed,'uni-navbar-shadow':hasShadow}" :style="{'background-color':backgroundColor, paddingTop: statusBarHeight + 'px'}">
		<!-- <uni-status-bar v-if="insertStatusBar"></uni-status-bar> -->
		<view class="uni-navbar-header" :style="{color:color}">
			<!-- #ifndef MP-WEIXIN -->
			<view class="uni-navbar-header-btns" @tap="onClickLeft">
				<view v-if="leftIcon.length">
                    <view v-if="leftIcon === 'back'" class="back"></view>
					<uni-icons v-else :type="leftIcon" :color="color" size="24"></uni-icons>
				</view>
				<view v-if="leftText.length" class="uni-navbar-btn-text" :class="{'uni-navbar-btn-icon-left':!leftIcon.length}">{{leftText}}</view>
				<slot name="left"></slot>
			</view>
			<!-- #endif -->
			<view class="uni-navbar-container">
				<view v-if="title.length" class="uni-navbar-container-title">{{title}}</view>
				<!-- 标题插槽 -->
				<slot></slot>
			</view>
			<view class="uni-navbar-header-btns uni-navbar-header-auto" :class="rightWidth" @tap="onClickRight">
                <view v-if="rightIcon.length" class="right-icon">
                    <view v-if="rightIcon === 'home'" class="home"></view>
                    <uni-icons v-else :type="rightIcon" :color="color" size="24"></uni-icons>
                </view>
                <!-- 优先显示图标 -->
                <view v-if="rightText.length&&!rightIcon.length" class="uni-navbar-btn-text">{{rightText}}</view>
                <slot name="right"></slot>
            </view>
		</view>
	</view>
</template>

<script>
    import uniStatusBar from './uni-status-bar.vue'
    import uniIcon from './uni-icons.vue'

    export default {
        components: {
            uniStatusBar,
            uniIcon
        },
        props: {
            /**
             * 标题文字
             */
            title: {
                type: String,
                default: ''
            },
            /**
             * 左侧按钮文本
             */
            leftText: {
                type: String,
                default: ''
            },
            /**
             * 右侧按钮文本
             */
            rightText: {
                type: String,
                default: ''
            },
            /**
             * 左侧按钮图标
             */
            leftIcon: {
                type: String,
                default: 'back'
            },
            /**
             * 右侧按钮图标
             */
            rightIcon: {
                type: String,
                default: ''
            },
            /**
             * 是否固定在顶部
             */
            fixed: {
                type: [Boolean, String],
                default: false
            },
            /**
             * 按钮图标和文字颜色
             */
            color: {
                type: String,
                default: '#000000'
            },
            /**
             * 背景颜色
             */
            backgroundColor: {
                type: String,
                default: '#ccc'
            },
            /**
             * 是否包含状态栏，默认固定在顶部时包含
             */
            statusBar: {
                type: [Boolean, String],
                default: ''
            },
            /**
             * 是否使用阴影，默认根据背景色判断
             */
            shadow: {
                type: String,
                default: ''
            },
            /**
             * 右侧宽度÷
             */
            rightWidth: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                //状态栏高度
                statusBarHeight: 0,
            }
        },
        computed: {
            isFixed() {
                return String(this.fixed) === 'true'
            },
            insertStatusBar() {
                switch (String(this.statusBar)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return this.isFixed
                }
            },
            hasShadow() {
                var backgroundColor = this.backgroundColor
                switch (String(this.shadow)) {
                    case 'true':
                        return true
                    case 'false':
                        return false
                    default:
                        return backgroundColor !== 'transparent' && backgroundColor.indexOf('rgba') < 0
                }
            }
        },
        created() {
            //获取手机状态栏高度
            // #ifdef APP-PLUS
            this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
            // #endif
        },
        methods: {
            /**
             * 左侧按钮点击事件
             */
            onClickLeft() {
                // this.$emit('clickLeft')
                this.$emit('click-left')
            },
            /**
             * 右侧按钮点击事件
             */
            onClickRight() {
                // this.$emit('clickRight')
                this.$emit('click-right')
            }
        }
    }
</script>

<style>
    .uni-navbar {
        display: block;
        position: relative;
        width: 100%;
        background-color: #ccc;
        overflow: hidden;
		z-index: 20;
    }
    
	.uni-navbar view{
		line-height:44px;
	}

    .uni-navbar-shadow {
        box-shadow: 0 1px 6px #ccc;
    }

    .uni-navbar.uni-navbar-fixed {
        top: 0;
		/* #ifdef APP-PLUS */
		/* top: var(--status-bar-height); */
		/* top: env(safe-area-inset-top); */
		/* #endif */
        position: fixed;
        z-index: 998;
    }

    .uni-navbar-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        height:88upx;
        line-height:88upx;
        font-size: 32upx;
        background: #fff;
    }
	
	.uni-navbar-header .uni-navbar-header-btns{
		display:inline-flex;
		flex-wrap:nowrap;
		flex-shrink:0;
		width: 120upx;
		padding:0 12upx;
        display: flex;
        align-items: center;
        justify-content: center;
	}
	
	.uni-navbar-header .uni-navbar-header-btns:first-child{
		padding-left:0;
		padding-right:0;
		width: 60upx;
	}
	.uni-navbar-header .uni-navbar-header-btns:last-child{
        align-items: center;
        width: 60upx;
        padding-left: 0;
	}
	.uni-navbar-header .uni-navbar-header-btns.right:last-child{
		width: 120upx;
	}
	.uni-navbar-header .uni-navbar-header-btns.max-right:last-child{
		width: 200upx;
	}
	.uni-navbar-container{
		width:100%;
		margin:0 10upx;
	}
	.uni-navbar-container-title{
		text-align:center;
		/* padding-right: 60upx; */
        font-size: 32upx;
		font-weight: 700;
	}
	.right-icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
