<template>
	<view>
		<!--  -->
		<!-- <uni-nav-bar color="#333333" fixed="true" @click-left="back">
			<block slot="left">
				<view class="city">
					<uni-icons type="back" color="#333333" size="22"></uni-icons>
				</view>
			</block>
			<view class="input-view">
				<text class="view-text">扫码</text>
			</view>
		</uni-nav-bar> -->
		<view v-if="isHttp">
			<web-view :src="url"></web-view>
		</view>
		<view v-if="!isHttp">
			{{ url }}
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				url: '',
				isHttp: false
			};
		},
		onLoad(param) {
			let reg = /^http/
			if(reg.test(param.url)) {
				this.isHttp = true
			}
			this.url = param.url
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
		}
	}
</script>

<style>

</style>
