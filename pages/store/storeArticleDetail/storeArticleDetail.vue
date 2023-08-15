<template>
	<view>
		<!-- 头部 -->
		<uni-nav-bar color="#333333" leftIcon="back" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ saData.title }}</text>
			</view>
		</uni-nav-bar>
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="msg-down">
			{{ $t('文字来源：本店_时间') }}{{ saData.createDate }}
		</view>
		<view class="rich">
			<rich-text :nodes="detail"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				saData: '',
				detail: ''
			}
		},
		onLoad(param) {
			this.saData = JSON.parse(param.data)
			this.init()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			init() {
				this.$api.storeArticleOne({saId: this.saData.saId}).then(res => {
					//let data = res.data.content.replace(/src="\/upload\/filestorage\//g, `src="${ this.prefix.baseImgUrl }/`).replace(/<img /g, '<img width="100%" ')
					this.detail = res.data.content
				})
			}
		}
	}
</script>

<style>
	.msg-down {
		padding: 30upx 20upx 0 20upx;
		font-size: 24upx;
		color: #bbb;
	}
	.rich{
		padding: 0 20upx;
	}
</style>
