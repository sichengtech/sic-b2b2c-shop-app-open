<template>
	<view>
		<view class="error-wrap">
			<view class="error-top">
				<image class="error-img" src="http://demo.sicheng.net/wap/views/wap/default/images/default_goods.png" mode="" />
			</view>
			<view class="error-center">{{ $t('找不到商品') }}</view>
			<view class="error-down">
				<text class="down-text" @tap="returnIndex">{{ $t('返回首页') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onBackPress(options) { 
			if(options.from) {
				this.returnIndex()
			}
		},
		methods: {
			returnIndex() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uIndex
				})
			}
		}
	}
</script>

<style lang="scss">
	.error-wrap {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		// height: 100%;
		padding: 120upx 0 0 0;
		background: #f0f0f0;
		.error-top {
			.error-img {
				width: 500upx;
				height: 500upx;
				border-radius: 50%;
			}
		}
		.error-center {
			font-size: 50upx;
			color: #666;
		}
		.error-down {
			color: #666;
			.down-text {
				color: #00abff;
				margin-left: 10upx;
				text-decoration: underline;
			}
		}
		.error-top,
		.error-center,
		.error-down {
			display: flex;
			justify-content: center;
		}
	}
</style>
