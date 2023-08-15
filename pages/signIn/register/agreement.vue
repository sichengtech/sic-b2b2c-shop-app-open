<template>
    <view>
        <view class="title" style="text-align: center;">{{ $t('用户协议') }}</view>
        <view class="richtext_wrap">
            <rich-text :nodes="agreement"></rich-text>
        </view>
        <view class="xieyi-btn" @tap="hideXieYi">{{ $t('关闭') }}</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            agreement: ''
        }
    },
    created() {
        this.init()
    },
    methods: {
        hideXieYi() {
            uni.navigateBack({
                delta: 1
            })
        },
        init() {
            this.$api.siteRegisterInfo().then(res => {
                this.agreement = res.data.agreement
            })
        },
    }
};
</script>

<style scoped>
	.xieyi-btn {
		width: 80%;
		margin: 20upx 10%;
		background: red;
		color: #fff;
		text-align: center;
		border-radius: 10upx;
		height: 60upx;
		line-height: 60upx;
	}
    /* .btn_wrap {
        position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
        z-index: 9999;
        background: #fff
    } */
	.title {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #fff;
		z-index: 9999;
		font-size: 30upx;
		font-weight: 400;
		padding: 40upx;
	}
	.richtext_wrap {
        padding: 0 10upx;
        margin: 40upx 0;
		height: 100%;
		overflow: auto;
	}
</style>