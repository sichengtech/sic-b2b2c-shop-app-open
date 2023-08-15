<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('物流详情') }}</text>
			</view>
		</uni-nav-bar>
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="order-wrap">
			<view class="order-item">
				<image class="order-img" :src="productImg + imgShrink(100, 100)" mode="" />
			</view>
			<view class="order-item">
				<view class="order-type">{{ companyName }}</view>
				<view class="order-figure" v-if="LogisticCode">{{ $t('运单号') }}: {{ LogisticCode }}</view>
				<view class="order-figure" v-if="!LogisticCode">{{ productName }}</view>
			</view>
		</view>
		
		<view class="order-msg">
			<view class="msg-item">
				<!-- <text class="iconfont icon-map"></text> -->
				<view class="msg-address">
					<!-- [{{ $t('收货地址') }}] 北京市海淀区西北旺冷泉东路10号 -->
				</view>
			</view>

			<!-- 暂无轨迹 -->
			<!-- <view v-if="reason && timeList.length===0">{{ reason }}</view> -->

			<!-- 物流信息 -->
			<view class="uni-timeline msg-item"  v-for="(item, index) in timeList" :key="index">
				<view class="uni-timeline-item" :class="{'uni-timeline-first-item': index == 0, 'uni-timeline-last-item': index+1 == timeList.length}">
					<view class="uni-timeline-item-divider"><text v-if="index == 0" :class="{'iconfont': index == 0, 'icon-duihao': index == 0}"></text></view>
					<view class="uni-timeline-item-content">
						<view>{{ item.AcceptStation }}</view>
						<view class="datetime">{{ item.AcceptTime }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 暂无轨迹 -->
		<view class="no-msg" v-if="!timeList.length">
			<fine-icon type="xiaoxi1" size="100"></fine-icon>
			<view class="">{{ $t('暂无物流消息') }}~</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timeList: [],
				reason: '',
				productImg: '',
				LogisticCode: '',
				companyName: '',
				productName: '',
				orderId: ''
			}
		},
		onLoad(param) {
			this.orderId = param.orderId
			this.productImg = param.productImg
			this.productName = decodeURIComponent(param.productName)
			this.init()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			backIndex() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uIndex
				})
			},
			
			init() {
				this.$api.tradeLogisticsInfo({orderId: this.orderId}).then(res => {
					if(!res.data.Traces || res.data.Traces.length === 0) return false
					this.LogisticCode = res.data.LogisticCode
					this.companyName = res.data.companyName
					this.timeList = res.data.Traces
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			}
		}
	}
</script>

<style lang="scss">
	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-left:16upx;
	}
	.input-view {
		width: 92%;
		display: flex;
		/* background-color: #e7e7e7; */
		height: 60upx;
		/* border-radius: 30upx; */
		padding: 0 4%;
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx;
	}
	.uni-timeline {
		margin: 0;
	}
	.uni-timeline-item .uni-timeline-item-divider {
		left: 8upx;
	}
	.uni-timeline-first-item .uni-timeline-item-divider {
		width: 40upx;
		height: 40upx;
		left: 4upx;
	}
	// .uni-timeline-first-item .uni-timeline-item-divider:before {
		
	// }
	.uni-timeline-first-item .uni-timeline-item-divider:after {
		left: 19upx;
	}
	.uni-timeline-item-divider .iconfont {
		color: #fff;
		position: absolute;
		top: -12upx;
		left: 6upx;
	}
	.uni-timeline-item .uni-timeline-item-divider {
		background-color: #1aad19;
	}
	.order-wrap {
		// margin-top: 88upx;
		display: flex;
		padding: 20upx 30upx;
		.order-item {
			.order-img {
				width: 120upx;
				height: 120upx;
			}
			.order-type {
				margin: 10upx 0;
				font-size: 30upx;
				// color: #04be02;
				color: #343434;
			}
			.order-figure {
				font-size: 30upx;
				color: #ccc;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.order-item:last-child {
			margin-left: 20upx;
		}
	}
	.order-msg {
		padding: 20upx 30upx;
		border-top: 10upx solid #f5f5f5;
		.msg-item:first-child {
			display: flex;
			.iconfont {
				color: #04be02;
				margin-right: 6upx;
			}
		}
	}
</style>
