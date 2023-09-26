<template>
	<view class="content">
		<swiper class="swiper" 
		:indicator-dots="indicatorDots" 
		:indicator-color="baise" 
		:indicator-active-color="lanse"
		:autoplay="autoplay" 
		:duration="duration"
		@change="swiperChange">
			<block v-if="adData">
				<swiper-item v-for="(item, index) in adData" :key="index">
					<view class="swiper-item">
						<view class="swiper-item-img" :style="{ backgroundColor: item.backgroundColor, backgroundImage: `url(${prefix.baseImgUrl}${item.backgroundImage})` }"></view>
						<view class="swiper-text">
							<view
								v-if="item.wordOne"
								:class="{'animated-none': index === 1 ? animatedNone[0].yes : false || index === 2 ? animatedNone[1].yes : false }"
								:style="{color: item.wordOneColor}"
								class="swiper-text-h animated bounceInDown"
							>
								{{ item.wordOne }}
							</view>
							<view
								v-if="item.wordTwo"
								:class="{'animated-none': index === 1 ? animatedNone[0].yes : false || index === 2 ? animatedNone[1].yes : false }"
								class="swiper-text-cn animated bounceInLeft"
								:style="{color: item.wordTwoColor}"
							>
								{{ item.wordTwo }}
							</view>
							<view
								v-if="item.wordThree"
								:class="{'animated-none': index === 1 ? animatedNone[0].yes : false || index === 2 ? animatedNone[1].yes : false }"
								class="swiper-text-us animated bounceInRight"
								:style="{color: item.wordThreeColor}"
							>
								{{ item.wordThree }}
							</view>
						</view>
						<view v-if="adData.length - 1 === index" class="experience-now" :style="{backgroundColor: item.buttonColour}" @tap="launchFlag()">{{ item.buttonWord }}</view>
					</view>
				</swiper-item>
			</block>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: false,
				duration: 500,
				baise:'rgba(255, 255, 255, .3)',
				lanse: '#fff',
				animatedNone: [
					{yes: true},
					{yes: true}
				],
				adData: [],
				prefix: this.prefix
			}
		},
		onLoad() {
			//请求接口,获取开屏广告信息
			this.$api.appAdList().then(res => {
				this.adData = res.data
			})
		},
		methods: {
			launchFlag(){
				/**
				 * 向本地存储中设置launchFlag的值为true，即启动标识；
				 */
				let that = this
				this.$storage.setStore({
					key: 'launchFlag',
					val: true
				})
				//进入首页
				uni.switchTab({
					url: that.prefix.uIndex
				});
				
			},
			swiperChange(event) {
				let arr = this.animatedNone
				for(let i = 0; i < arr.length; i++) {
					if(arr[i].yes) {
						arr[event.detail.current - 1].yes = false
						this.animatedNone = arr
					}
				}
				
			}
		}
	}
</script>
<style>
	page,
	.content{
		width: 100%;
		height: 100%;
		background-size: 100% auto ;
		padding: 0;
	}
	.swiper{
		width: 100%;
		height: 100%;
	}
	.swiper-item {
		display: block;
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
	}
	.swiper-item-img {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		background-size: contain;
		background-color: #fff;
		background-repeat: no-repeat;
		background-position: center center;
	}
	.swiper-item-img image{
		width: 100%;
		height: 100%;
	}
	.swiper-item-text {
		padding-top: 40upx;
		width: 430upx;
		height: 130upx;
		margin: 0 auto;
	}
	.swiper-item-text image{
		width: 100%;
		height: 100%;
	}
	.swiper-text{
		width: 100%;
	}
	.swiper-text view{
		position: absolute;
		width: 100%;
		text-align: center;
		color: #FFF;
	}
	.swiper-text-cn{
		bottom: 260upx;
		font-size: 40upx;
	}
	.swiper-text-us{
		bottom: 180upx;
		font-size: 28upx;
	}
	.swiper-text-h {
		top: 240upx;
		font-size: 60upx;
	}
	.jump-over{
		position: absolute;
		height: 60upx;
		line-height: 60upx;
		padding: 0 40upx;
		border-radius: 30upx;
		font-size: 32upx;
		right: 45upx;
		top: 125upx;
		color: #37393b;
		background: #918984;
		z-index: 999;
	}
	.experience-now{
		position: absolute;
		width: 200upx;
		height: 60upx;
		line-height: 60upx;
		padding:5upx 40upx;
		border-radius: 35upx;
		font-size: 32upx;
		left: 50%;
		margin-left: -140upx;
		bottom: 100upx;
		color: #fff;
		/* background: #0c3; */
		z-index: 9999;
	}
	.animated {
		animation-duration: 1s;
		animation-play-state: paused;
		animation-fill-mode: both;
	}
	.animated-none.animated {
		animation: none;
	}
	.bounceInDown {
		animation-name: bounceInDown;
		animation-play-state: running;
		animation-delay: 1s;
	}
	.bounceInLeft {
		animation-name: bounceInLeft;
		animation-play-state: running;
	}
	.bounceInRight {
		animation-name: bounceInRight;
		animation-play-state: running;
		animation-delay: 0.5s;
	}
	@keyframes bounceInDown {
		0%, 60%, 75%, 90%, 100% {
			animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
		}
		0% {
			opacity: 0;
			transform: translate3d(0, -3000px, 0);
		}
		60% {
			opacity: 1;
			transform: translate3d(0, 25px, 0);
		}
		75% {
			transform: translate3d(0, -5px, 0);
		}
		90% {
			transform: translate3d(0, 3px, 0);
		}
		100% {
			transform: none;
		}
	}
	@keyframes bounceInLeft {
		0%, 60%, 75%, 90%, 100% {
			animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
		}
		0% {
			opacity: 0;
			transform: translate3d(-3000px, 0, 0);
		}
		60% {
			opacity: 1;
			transform: translate3d(25px, 0, 0);
		}
		75% {
			transform: translate3d(-10px, 0, 0);
		}
		90% {
			transform: translate3d(5px, 0, 0);
		}
		100% {
			transform: none;
		}
	}
	@keyframes bounceInRight {
		0%, 60%, 75%, 90%, 100% {
			animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
		}
		0% {
			opacity: 0;
			transform: translate3d(3000px, 0, 0);
		}
		60% {
			opacity: 1;
			transform: translate3d(-25px, 0, 0);
		}
		75% {
			transform: translate3d(10px, 0, 0);
		}
		90% {
			transform: translate3d(-5px, 0, 0);
		}
		100% {
			transform: none;
		}
	}
</style>
