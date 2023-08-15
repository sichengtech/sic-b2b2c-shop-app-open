<template>
	<view>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				订单详情
			</view>
			<view class="header-item">
				<text class="iconfont icon-xiaoxi4"></text>
				<view class="item-abso">
					<uni-badge text="12" type="danger"></uni-badge>
				</view>
			</view>
		</view> -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('订单详情') }}</text>
			</view>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="type-wrap">
			<view class="type-item">
				<!-- <text class="iconfont icon-zhifubaofukuan"> -->
				<text class="iconfont">
					<text class="item-tit">{{ $t('交易状态') }}</text>
				</text>
			</view>
			<view class="type-item">{{ $t(`${ orderStatusText(userOrder.orderStatus) }`) }}</view>
		</view>
		
		<view class="address-wrap">
			<view class="iconfont icon-map"></view>
			<view class="addres-item">
				<view class=""><text>{{ userOrder.consignee }} </text>  <text> {{ userOrder.phone }}</text></view>
				<view class="item-addr">{{ userOrder.provinceName+" "+userOrder.cityName+" "+userOrder.districtName+" "+userOrder.detailedAddress }}</view>
			</view>
		</view>
		
		<view class="product-list order-inner">
			<view class="item-shop">
				<text class="iconfont icon-wxbmingxingdianpu"></text>
				<text @tap="openStore(userOrder.storeId)">{{ userOrder.bname }}</text>
				<text class="iconfont icon-arrowright"></text>
			</view>
			<view class="item-product" v-for="(item, index) in productOrder" :key="index" @tap="openProduct(item.pid)">
				<view class="product-left">
					<image class="product-img" :src="url + item.thumbnailPath + imgShrink(100, 100)" mode="" />
				</view>
				<view class="product-right">
					<view class="right-top">
						<view class="top-tit">{{ item.name }}</view>
						<view class="top-price">{{ '￥' + formatMoney(item.price) }}</view>
					</view>
					<view class="right-down">
						<view class="down-tit" v-if="item.skuValue">{{ $t('规格') }}: {{ item.skuValue }}</view>
						<view class="down-num">x{{ item.productNum || item.quantity }}</view>
					</view>
				</view>
			</view>
			<view class="item-price">
				<view class="price-tit">{{ $t('订单金额') }}: </view>
				<view class="price" v-show="userOrder.amountPaid">{{ $t('¥') + formatMoney(userOrder.amountPaid + userOrder.freight ) }}<text class="price-freight">({{ $t('含运费') }}: {{ $t('¥') }}{{ formatMoney(userOrder.freight) }})</text></view>
			</view>
		</view>
		
		<view class="invoice-wrap">
			<view class="payment-mode invoice-item">
				<view class="invoice-left">{{ $t('付款方式') }}</view>
				<view class="">{{ userOrder.paymentMethodName }}</view>
			</view>
		</view>
		
		<view class="order-msg">
			<view class="" v-if="userOrder.orderId">
				{{ $t('订单号') }}: {{ userOrder.orderId }}
			</view>
			<view class="" v-if="userOrder.createDate">
				{{ $t('创建时间') }}: {{ userOrder.createDate }}
			</view>
			<view class="" v-if="userOrder.payOrderTime">
				{{ $t('付款时间') }}: {{ userOrder.payOrderTime }}
			</view>
			<view class="" v-if="userOrder.deliverProductDate">
				{{ $t('发货时间') }}: {{ userOrder.deliverProductDate }}
			</view>
			<view class="" v-if="userOrder.productReceiptDate">
				{{ $t('完成时间') }}: {{ userOrder.productReceiptDate }}
			</view>
		</view>
		
		<!-- <view class="leave-msg">
			<view class="msg-item">
				<view class="item-lea">买家留言</view>
				<view class="item-content">{{ buyerLeaveWord }}</view>
			</view>
			<view class="msg-item">
				<view class="item-lea">卖家留言</view>
				<view class="item-content">{{ sellerLeaveWord }}</view>
			</view>
		</view> -->
		
		<!-- <view class="invoice-wrap">
			<view class="invoice-msg">
				<view class="invoice-item">
					<view class="invoice-left">发票类型</view>
					<view class="">{{ invoiceType }}</view>
				</view>
				<view class="invoice-item">
					<view class="invoice-left">公司名称</view>
					<view class="">{{ companyName }}</view>
				</view>
				<view class="invoice-item">
					<view class="invoice-left">纳税人识别号</view>
					<view class="">{{ taxpayerNum }}</view>
				</view>
				<view class="invoice-item">
					<view class="invoice-left">开户行</view>
					<view class="">{{ openingBank }}</view>
				</view>
				<view class="invoice-item">
					<view class="invoice-left">账号</view>
					<view class="">{{ account }}</view>
				</view>
				<view class="invoice-item">
					<view class="invoice-left">地址</view>
					<view class="">{{ address }}</view>
				</view>
				<view class="invoice-item">
					<view class="invoice-left">电话</view>
					<view class="">{{ openingTel }}</view>
				</view>
			</view>
			
		</view> -->
		
		<view class="btn-wrap" v-if="userOrder.receiveOrder || userOrder.commentOrder || userOrder.payOrder">
			<!-- <view class="btn-item active" v-if="userOrder.cancelOrder">取消订单</view> -->
			<view class="btn-item" v-if="userOrder.receiveOrder" @tap="receipt(orderId)">{{ $t('确认收货') }}</view>
			<view class="btn-item" v-if="userOrder.commentOrder">
				<navigator :url="commitForm + '?order=' + orderId ">
					{{ $t('我要评价') }}
				</navigator>
			</view>
			<view class="btn-item pay" v-if="userOrder.payOrder" @tap="callPay">{{ $t('支付') }}</view>
			<!-- <view class="btn-item" v-if="userOrder.logistics">查看物流</view> -->
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				userOrder: {},
				productOrder: {},
				url: this.prefix.baseImgUrl,
				commitForm: this.prefix.uCommentForm,
			}
		},
		onLoad(param) {
			this.orderId = param.orderId
			this.init()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			init() {
				this.$api.tradeOrderOne({orderId: this.orderId}).then(res => {
					let data = res.data
					let statusList = {
						'10': {
							orderStatusText: '待付款',
							payOrder: true,
							cancelOrder: true
						},
						'20': {
							orderStatusText: '待发货',
						},
						'30': {
							orderStatusText: '待收货',
							logistics: true,
							receiveOrder: true
						},
						'40': {
							orderStatusText: '待评价',
							logistics: true,
							commentOrder: true
						},
						'50': {
							orderStatusText: '交易完成',
						},
						'60': {
							orderStatusText: '已取消'
						}
					}
					// 支付按钮
					data.payOrder = false
					// 查看物流
					data.logistics = false
					// 我要评价
					data.commentOrder = false
					// 确认收货
					data.receiveOrder = false
					// 取消订单
					data.cancelOrder = false
					let statusVal = statusList[data.orderStatus]
					Object.keys(statusVal).forEach(item => {
						data[item] = statusVal[item]
					})
					this.userOrder = data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})

				this.$api.tradeOrderItemList({orderIds: this.orderId}).then(res => {
					this.productOrder = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			orderStatusText(statusCode) {
				let statusList = {
						'10': {
							orderStatusText: '待付款',
							payOrder: true,
							cancelOrder: true
						},
						'20': {
							orderStatusText: '待发货',
						},
						'30': {
							orderStatusText: '待收货',
							logistics: true,
							receiveOrder: true
						},
						'40': {
							orderStatusText: '待评价',
							logistics: true,
							commentOrder: true
						},
						'50': {
							orderStatusText: '交易完成',
						},
						'60': {
							orderStatusText: '已取消'
						}
					}

					return statusList[statusCode].orderStatusText
			},
			receipt(orderId) {
				let that = this
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('确定收货'),
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success(res) {
						if (res.confirm) {
							this.$api.tradeOrderConfirmReceipt({orderId: orderId}).then(res => {
								if(res.status !== '200') {
									let errMsg = res.message ? res.message : '加载错误'
									that.openErrMsg(errMsg)
									return false
								}
								that.openErrMsg(res.message)
							}).catch(err => {
								that.openErrMsg(err.message || '加载错误')
							})
						}
					}
				})
				
			},
			callPay(data) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uTradePay + '?orderIdList=' + this.orderId + '&totalPrice=' + (that.userOrder.amountPaid + that.userOrder.freight)
				})
			},
			openStore(sid) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uStoreIndex + '?storeId=' + sid
				})
			},
			openProduct(pid) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uProductDetail + '?pid=' + pid
				})
			}
		}
	}
</script>

<style lang="scss">
	.header {
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		width: 100%;
		height: 88upx;
		background-color: #f9f9f9;
		overflow: hidden;
		/* border-bottom: 1upx solid #ccc; */
		z-index: 20;
		box-shadow: 0 2upx 12upx #ccc;
	}
	.header-item {
		position: relative;
		line-height: 88upx;
		font-size: 32upx;
	}
	.header-item .iconfont {
		font-size: 40upx;
	}
	.header-item:first-child {
		width: 88upx;
		text-align: center;
	}
	.header-item:last-child {
		flex: 2;
		text-align: right;
		padding-right: 30upx;
	}
	.header-item:nth-child(2) {
		flex: auto;
	}
	.item-abso {
		position: absolute;
		top: 0;
		right: 16upx;
	}
	.type-wrap {
		// margin-top: 88upx;
		padding: 20upx;
		display: flex;
		justify-content: space-between;
	}
	.item-tit {
		margin-left: 10upx;
		font-size: 28upx;
	}
	.type-item:last-child {
		color: #f1224b;
	}
	.item-shop {
		padding-bottom: 10upx;
		border-bottom: 2upx solid #d9d9d9;
	}
	.item-shop .iconfont {
		font-size: 26upx;
	}
	.address-wrap,
	.item-product {
		display: flex;
	}
	.item-product {
		padding: 24upx 0 10upx;
		border-bottom: 2upx solid #d9d9d9;
	}
	.address-wrap,
	.order-inner {
		padding: 20upx;
		border-top: 10upx solid #f5f5f5;
	}
	.addres-item {
		margin-left: 10upx;
	}
	.item-addr {
		color: #888;
	}
	
	.product-left {
		margin-right: 10upx;
	}
	.product-right {
		width: 100%;
	}
	.product-img {
		width: 140upx;
		height: 140upx;
		border: 2upx solid #d5d5d5;
	}
	.right-top,
	.right-down {
		display: flex;
		justify-content: space-between;
	}
	.right-top {
		height: 110upx;
	}
	.top-tit {
		padding-right: 40upx;
		font-size: 24upx;
	}
	.top-tit,
	.top-price {
		line-height: 1.4;
	}
	.top-price {
		color: #f1224b;
		font-size: 24upx;
	}
	.down-tit,
	.down-num {
		font-size: 24upx;
		color: #999;
	}
	.item-price {
		display: flex;
		justify-content: space-between;
		padding: 20upx 0 0;
		.price {
			color: red;
			.price-freight {
				color: #ccc;
				font-size: 20upx;
			}
		}
	}
	.leave-msg {
		padding: 0 20upx;
		border-top: 10upx solid #f5f5f5;
		.msg-item {
			padding: 10upx 0;
			.item-lea {
				color: #999;
			}
		}
		.msg-item:last-child{
			border-top: 2upx solid #f5f5f5;
		}
	}
	
	.invoice-wrap {
		padding: 20upx;
		border-top: 10upx solid #f5f5f5;
		.invoice-item {
			display: flex;
			justify-content: space-between;
			.invoice-left {
				color: #999;
			}
		}
// 		.payment-mode {
// 			margin: 20upx 0 0;
// 			padding: 20upx 0 0;
// 			border-top: 2upx solid #f5f5f5;
// 		}
	}
	.invoice-wrap:first-child {
		padding: 0;
	}
	.order-msg {
		padding: 20upx;
		margin-bottom: 100upx;
		border-top: 10upx solid #f5f5f5;
		.uni-timeline {
			margin: 0;
		}
	}
	
	.btn-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: flex-end;
		padding: 20upx;
		background: #fff;
		border-top: 2upx solid #d6d6d6;
		.btn-item {
			padding: 6upx 20upx;
			margin: 0 10upx;
			border: 2upx solid #d9d9d9;
			border-radius: 10upx;
			&.pay {
				color: #f1224b;
				border-color: #f1224b;
			}
		}
	}
	
</style>
