<template>
	<view class="tab-wrap" :class="fixedHeight" :style="{top: statusBarHeight + 'px', opacity: opacity}">
		<view class="product-item bg-fff dis-flex">
			<view class="flex-item"
				v-for="(item, index) in internaLlist"
				:class="{ 'active':item.checked }"
				@tap="tapProductShow(index)"
				:style="{color: color}"
				:key="index"
			>
				{{ $t(`${ item.tit }`) }}
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				internaLlist : this.list,
				statusBarHeight: 0
			}
		},
		props:{
			list: {
				type: Array,
				default: []
			},
			fixedHeight: {
				type: String,
				default: ''
			},
			opacity: String,
			color: String
		},
		watch: {
			list(data) {
				this.internaLlist = data
			}
		},
		created() {
            //获取手机状态栏高度
            // #ifndef MP-WEIXIN
            this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'] + uni.upx2px(88);
			// #endif
            // #ifdef MP-WEIXIN
            this.statusBarHeight = uni.upx2px(88);
			// #endif
			
        },
		methods: {
			tapProductShow(index) {
				let arr = this.internaLlist
				arr.forEach((item, i) => {
					arr[i].checked = index == i ? true :false
				})
				this.internaLlist = arr
				this.$emit('tapTab', index)
			}
		}
	}
</script>

<style scoped>
	.tab-wrap {
		position: fixed;
		left: 0;
		right: 0;
		top: 88upx;
		z-index: 99;
	}
	/* #ifdef APP-PLUS */
	.tab-wrap.commList {
		top: 124upx;
	}
	/* #endif */
	.dis-flex {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-around;
		justify-content: space-around;
	}
	.flex-item {
		padding: 20upx 0;
		border-bottom: 2upx solid #ccc;
		border-top: 2upx solid #ccc;
		width: 100%;
		text-align: center;
		line-height: 1.38;
	}
	.flex-item.active {
		border-bottom: 2upx solid #ec0030;
		color: #ec0030;
	}
</style>
