<template>
	<view>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				订单中心
			</view>
			<view class="header-item">
				<text class="iconfont icon-xiaoxi4"></text>
				<view class="item-abso">
					<navigator :url="this.prefix.uMsgList">
						<uni-badge :text="orderMsg" type="danger"></uni-badge>
					</navigator>
				</view>
			</view>
		</view> -->
		<uni-nav-bar color="#333333" left-icon="back" fixed="true" @click-left="back" @click-right="tapRight">
			<!-- <block slot="left">
				<view class="city">
					<uni-icons type="back" color="#333333" size="22"></uni-icons>
				</view>
			</block> -->
			<view class="input-view">
				<text class="view-text">{{ $t('订单中心') }}</text>
			</view>
			<!-- <block slot="right">
				<view class="header-item">
					<text class="iconfont icon-xiaoxi4"></text>
					<view class="item-abso">
						<uni-badge :text="orderMsg == 0 ? '' : orderMsg" type="danger"></uni-badge>
					</view>
				</view>
			</block> -->
		</uni-nav-bar>
		
		<!-- <view class="order-type">
			<view class="type-item"
				v-for="(item, index) in tabList"
				:class="{'type-active': index == active}"
				@tap="clickTab(index)"
			>{{ item }}</view>
		</view> -->
		<tab :list="tabList" fixedHeight="commList" @tapTab="clickTab"></tab>
		
		<view :style="{ height: barHeight('barHeight') + 'px' }"></view>
		<view class="order-list">
			<view class="list-item" v-for="(item, index) in orderList" :key="index">
				<view class="item-top">
					<view class="top-id">{{ $t('订单号') }}: {{ item.orderId }}</view>
					<view class="top-type">{{ $t(`${ item.orderStatusText }`)}}</view>
				</view>
				<view class="item-product" @tap="tapDetail(item.orderId)" v-for="(child, i) in item.children" :key="i">
					<view class="product-left">
						<image class="product-img" :src="child.thumbnailPath + imgShrink(100, 100)" mode="" />
					</view>
					<view class="product-right">
						<view class="right-top">
							<view class="top-tit">{{ child.name }}</view>
							<view class="top-price">{{ '￥' + formatMoney(child.price) }}</view>
						</view>
						<view class="right-down">
							<view class="down-tit" v-if="child.skuValue">{{ $t('规格') }}: {{ child.skuValue || ''}} </view>
							<view class="down-num">{{ 'x' + child.quantity}}</view>
						</view>
					</view>
				</view>
				<view class="item-time">
					<view class="time-left">
						<view class="left-day">{{ $t('创建日期') }}: </view>
						<view class="left-date">{{ item.createDate }}</view>
					</view>
					<view class="time-right">
						<view>
							<text>{{ $t('共') }}</text>
							<text class="item-quantity">{{ item.quantity }}</text>
							<text>{{ $t('件商品') }} {{ $t('合计') }}: </text>
							<text class="item-price">{{ formatMoney(  item.amountPaid ) }}</text>
						</view>
						<view>
							<text>({{ $t('含运费') }}: {{ $t('¥') }}{{ formatMoney(item.freight) }})</text>
						</view>
					</view>
				</view>
				<view class="item-operation">
					<!-- <view class="operation-item" @tap="operation(index)">更多操作...</view> -->
					<view class="operation-item operation-btn pay" v-if="item.payOrder" @tap="callPay(item)">{{ $t('付款') }}</view>
					<view class="operation-item operation-btn" v-if="item.logistics">
						<view @tap="goToLogistics(item)">{{ $t('查看物流') }}</view>
					</view>
					<view class="operation-item operation-btn" v-if="item.commentOrder">
						<navigator :url="commitForm + '?order=' + item.orderId + '&isAdditionalComment=0' ">{{ $t('我要评价') }}</navigator>
					</view>
					<view class="operation-item operation-btn" v-if="item.isAdditionalComment === '0' && item.orderStatus === '50'">
						<navigator :url="commitForm + '?order=' + item.orderId + '&isAdditionalComment=1' ">{{ $t('追评') }}</navigator>
					</view>
					<view class="operation-item operation-btn" v-if="item.receiveOrder" @tap="receipt(item.orderId)">{{ $t('确认收货') }}</view>
					<view class="operation-item operation-btn cancel" v-if="item.cancelOrder" @tap="showPop(item.orderId)">{{ $t('取消订单') }}</view>
				</view>
				
			</view>
			<view class="no-msg" v-if="showLoadMore">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂无订单') }}</view>
			</view>
			<uni-load-more :loadingType="loadingType" v-if="!showLoadMore"></uni-load-more>
			
		</view>
		<uni-popup :show="showPopupBottom" :type="popType" :msg="msg" v-on:hidePopup="hidePopup">
			<view class="solt-popup">
				<view class="popup-item" v-for="(item, index) in cancelMsgList" :key="index" @tap="cancelOrder(item.label)">{{ item.label }}</view>
			</view>
			<view class="popup-item popup-cancel" @tap="hidePopup">{{ $t('取消') }}</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '../../../components/uni-popup.vue'
	import tab from '../../../components/tab.vue'
	import * as pay from "../../../common/pay.js"
	export default {
		data() {
			return {
				tabList: [
					{
						tit: '全部',
						checked: true
					}, {
						tit: '待付款',
						checked: false
					}, {
						tit: '待发货',
						checked: false
					}, {
						tit: '待收货',
						checked: false
					}, {
						tit: '待评价',
						checked: false
					},
				],
				cancelMsgList: [],
				active: 1,
				orderList: [],
				orderMsg: '',
				popType: 'middle',
				title: 'popup',
				showPopupMiddle: false,
				showPopupTop: false,
				showPopupBottom: false,
				loadingType: 1,
				msg: '',
				pageNo: 1,
				pageSize: 10,
				status: 10,
				cancelOrderId: '',
				showLoadMore: false,
				commitForm: this.prefix.uCommentForm,
				uLogisticsMsg: this.prefix.uLogisticsMsg,
			}
		},
		components: {
			tab,
			uniPopup,
		},
		onLoad(param) {
			let that = this
			uni.showLoading({
				title: that.$t('加载中')
			})
			let index = param.order ? param.order / 10 : 0
			this.status = param.order || ''
			this.tabList.forEach((n, i) => {
				this.tabList[i].checked = i == index
			})
		},
		onShow() {
			this.orderList = []
			this.init()
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.pageNo = this.pageNo + 1
			this.loadingType = 1;
			this.init((data)=> {
				this.orderList = this.orderList.concat(data)
			})
		},
		methods: {
			
			tapRight() {
				let url = this.prefix.uMsgList
				uni.navigateTo({
					url: url
				})
			},
			init(callBack) {
				this.$api.sysDictList({type: 'trade_cancel_order_reason2'}).then(res => {
					this.cancelMsgList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
				// 消息数量
				// this.$api.userMessageUnreadCount().then(res => {
				// 	this.orderMsg = res.data ? res.data + '' : ''
				// }).catch(err => {
				// 	this.openErrMsg(err.message || '加载错误')
				// })
				
				this.$api.tradeOrderPage({
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					status: this.status
				}).then(res => {
					this.showLoadMore = false
					if(!res.data || res.data.length == 0) {
						uni.hideLoading()
						this.showLoadMore = true
						return false
					}
					setTimeout(() => {
						if(res.page.isLastPage) {
							this.loadingType = 2
						} else {
							this.loadingType = 0
						}
					}, 1000)
					let oList = res.data
					let orderIdList = []
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
							// logistics: true,
							// commentOrder: true
						},
						'60': {
							orderStatusText: '已取消'
						}
					}
					oList.forEach((n, i) => {
						// 支付按钮
						oList[i].payOrder = false
						// 查看物流
						oList[i].logistics = false
						// 我要评价
						oList[i].commentOrder = false
						// 确认收货
						oList[i].receiveOrder = false
						// 取消订单
						oList[i].cancelOrder = false
						let statusVal = statusList[n.orderStatus]
						Object.keys(statusVal).forEach(item => {
							// oList[i]['orderStatusText'] = statusVal['orderStatusText']
							oList[i][item] = statusVal[item]
						})
						orderIdList.push(n.orderId)
					})

					this.$api.tradeOrderItemList({orderIds: orderIdList.join()}).then(res => {
						if(res.status !== '200') {
							this.errMsg = res.message ? res.message : '加载错误'
							return false
						}
						let data = res.data
						oList.forEach((item, index) => {
							oList[index].children = []
							let count = 0
							let totalPrice = 0
							data.forEach((n, i) => {
								if(item.orderId === n.orderId) {
									n.createDate = n.createDate.split(' ')[0];
									n.thumbnailPath = this.prefix.baseImgUrl + n.thumbnailPath
									count += n.quantity
									totalPrice += n.quantity * n.price
									oList[index].children.push(n)
								}
	// 							let myDate = new Date(n.createDate);  
	//							ios不支持该写法
	// 							n.createDate = `${myDate.getFullYear()}-${(myDate.getMonth()+1)}-${myDate.getDate()}`;
								
								// oList[i] = Object.assign({}, oList[i], n)
							})
							oList[index].quantity = count
							oList[index].totalPrice = totalPrice
						})
						callBack ? callBack(oList) : this.orderList = oList
						uni.hideLoading()
					}).catch(err => {
						uni.hideLoading()
						this.openErrMsg(err.message || '加载错误')
					})
				}).catch(err => {
					uni.hideLoading()
					this.openErrMsg(err.message || '加载错误')
				})
				
				
			},
			showPop(id) {
				this.hidePopup();
				this.popType = 'bottom';
				this.showPopupBottom = true;
				this.msg = '';
				this.cancelOrderId = id
			},
			hidePopup() {
				this.cancelOrderId = ''
				this.showPopupBottom = false;
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			callPay(data) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uTradePay + '?orderIdList=' + data.orderId + '&totalPrice=' + data.amountPaid
				})
			},
			tapDetail(orderId) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uOrderDetail + '?orderId=' + orderId
				})
			},
			goToLogistics(item) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uLogisticsMsg + '?orderId=' + item.orderId + '&productImg=' + item.children[0]['thumbnailPath'] + '&productName=' + encodeURIComponent(item.children[0]['name'])
				})
			},
			clickTab(index) {
				let that = this
				uni.showLoading({
					title: that.$t('加载中')
				})
				this.active = index
				this.status = index ? index * 10 : ''
				this.orderList = []
				this.loadingType = 0
				this.pageNo = 1
				this.init()
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
							that.$api.tradeOrderConfirmReceipt({orderId: orderId}).then(res => {
								that.openErrMsg(res.message)
								that.orderList = []
								that.init()
							}).catch(err => {
								that.openErrMsg(err.message || '加载错误')
							})
						}
					}
				})
			},
			cancelOrder(label) {
				let param ={
						orderId: this.cancelOrderId,
						reason: label
					}
				this.$api.tradeOrderCancelOrder(param).then(res => {
					this.hidePopup()
					uni.showToast({
						title: res.message,
						duration: 1000,
						icon: 'none'
					})
					this.init()
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			}
		}
	}
</script>

<style>
	.no-msg {
		background: #fff;
	}
	.header {
		position: fixed;
		top: 0;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
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
		margin-right: 20upx;
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
	.header-item .item-abso {
		position: absolute;
		top: 0upx;
		right: 24upx;
		/* #ifdef H5 */
		top: 16upx;
		right: 14upx;
		/* #endif */
		line-height: 0;
	}
	.order-type {
		display: flex;
		justify-content: center;
	}
	.type-item {
		margin: 0 20upx;
		height: 80upx;
		line-height: 80upx;
		box-sizing: border-box;
	}
	.type-active {
		border-bottom: 4upx solid #f1224b;
		color: #f1224b;
	}
	.order-list {
		background: #f3f3f3;
	}
	.list-item {
		border-top: 2upx solid #dfdfdf;
		border-bottom: 2upx solid #dfdfdf;
		/* border-bottom: 2upx solid #ccc; */
		/* box-shadow: 0upx 4upx 20upx #d3d3d3; */
		margin-top: 20upx;
		background: #fff;
	}
	.list-item:first-child {
		border-top: none;
	}
	.item-top,
	.item-time {
		padding: 10upx 20upx;
	}
	.top-type,
	.top-price {
		display: flex;
		justify-content: flex-end;
		color: #f1224b;
		font-size: 24upx;
	}
	.item-product {
		padding: 16upx 20upx;
	}
	.product-left {
		margin-right: 10upx;
		line-height: 1;
	}
	.product-right {
		width: 100%;
	}
	.product-img {
		width: 140upx;
		height: 140upx;
		border: 2upx solid #d5d5d5;
	}
	.item-top,
	.right-top {
		display: flex;
		justify-content: space-between;
	}
	.right-down {
		display: flex;
		justify-content: space-between;
	}
	.right-top {
		height: 110upx;
	}
	.top-tit {
		padding-right: 40upx;
		height: 100upx;
		font-size: 24upx;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.top-tit,
	.top-price {
		line-height: 1.4;
	}
	.top-price {
		flex: 1;
	}
	.down-tit,
	.down-num,
	.time-right {
		font-size: 24upx;
		color: #999;
	}
	.time-right {
		/* display: flex;
		flex-wrap: wrap;
		justify-content: flex-end; */
		margin-left: 30upx;
		/* line-height: 3; */
	}
	.time-right view {
		display: flex;
		justify-content: flex-end;
		font-size: 24upx;
	}
	.time-right text {
		display: flex;
		align-items: center;
	}
	.time-right .item-price,
	.time-right .item-quantity {
		color: #f1224b;
	}
	.item-time {
		justify-content: space-between;
	}
	.item-time,
	.item-product,
	.item-operation {
		display: flex;
		border-top: 2upx solid #f9f9f9;
	}
	.left-day,
	.left-date {
		font-size: 24upx;
	}
	.item-operation {
		justify-content: space-around;
		padding: 20upx;
	}
	.operation-item {
		font-size: 24upx;
		padding: 6upx 20upx;
	}
	.operation-btn {
		border: 2upx solid #d2820e;
		border-radius: 10upx;
		color: #d2820e;
	}
	.operation-btn.cancel {
		color: #999;
		border-color: #999;
	}
	.operation-btn.pay {
		color: #f1224b;
		border-color: #f1224b;
	}
	.popup-item {
		padding: 10upx 0;
		margin: 2upx 0;
		background-color: #fff;
		font-size: 32upx;
	}
	.solt-popup {
		background-color: #f5f5f5;
	}
	.popup-cancel {
		border-top: 10upx solid #d5d5d5;
	}
</style>
