<template>
	<view>
	<!-- 	<page-head :title="title"></page-head> -->
		<view class="uni-page-body">
			<view class="page-section swiper" :class="'height' + height">
				<view class="page-section-spacing">
					<swiper class="swiper" :class="'height' + height" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="(item, index) in imgList" :key="index" @tap="emitParent(item)">
							<view v-if="item.id">
								<image class="swiper-item" :class="'height' + height" :src="url + item.path" :mode="item.mode" />
							</view>
							<view v-else>
								<image class="swiper-item" :class="'height' + height" :src="item.path" :mode="item.mode" />
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	
	</view>
</template>
<script>
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
			}
		},
		props:{
			imgList: {
				type: Array,
				default: []
			},
			height: {
				type: String,
				default: '460upx;'
			},
			title: {
				type: String,
				default: 'swiper'
			},
			indicatorDots: {
				type: Boolean,
				default: true
			},
			autoplay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 5000
			},
			duration: {
				type: Number,
				default: 300
			},
			circular: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			emitParent(item) {
				this.$emit('swipetTab', item)
			}
// 			changeIndicatorDots(e) {
// 				this.indicatorDots = !this.indicatorDots
// 			},
// 			changeAutoplay(e) {
// 				this.autoplay = !this.autoplay
// 			},
// 			intervalChange(e) {
// 				this.interval = e.target.value
// 			},
// 			durationChange(e) {
// 				this.duration = e.target.value
// 			}
		}
	}
</script>

<style>
	.swiper {
		height: 380upx;
		/* height: 310upx; */
	}
	.swiper-item {
		display: block;
		width: 100%;
		height: 380upx;
		line-height: 380upx;
		/* height: 310upx;
		line-height: 310upx; */
		text-align: center;
	}

	.swiper-list {
		margin-top: 40upx;
		margin-bottom: 0;
	}
	
	.uni-common-mt{
		margin-top:60upx;
		position:relative;
	}
	
	.info {
		position: absolute;
		right:20upx;
	}
	.height750 {
		height: 750upx;
		/* line-height: 750upx; */
	}
	.height300 {
		height: 260upx;
		/* line-height: 750upx; */
	}
</style>
