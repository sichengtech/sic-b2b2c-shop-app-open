<template>
	<view class="user-order-ok">
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">确认订单</view>
			<view class="header-item">
				<text class="iconfont icon-xiaoxi4"></text>
				<view class="item-abso">
					<uni-badge :text="msgNum" type="danger"></uni-badge>
				</view>
			</view>
		</view> -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back" @click-right="tapRight">
			<view class="input-view">
				<text class="view-text">{{ $t('确认订单') }}</text>
			</view>
			<block slot="right">
				<view class="header-item">
					<text class="iconfont icon-xiaoxi4"></text>
					<view class="item-abso">
						<uni-badge :text="msgNum == 0 ? '' : msgNum" type="danger"></uni-badge>
					</view>
				</view>
			</block>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="address-wrap" v-if="addressObj.name">
			<view class="iconfont icon-map"></view>
			<view class="addres-item" @tap="chooseAddres">
				<view class="addres-flex"><text>{{ addressObj.name || '' }} </text>  <text> {{ addressObj.mobile || '' }}</text></view>
				<view class="item-addr" v-if="detailAddress">
					{{
						detailAddress
					}}
				</view>
			</view>
		</view>
		<view class="address-wrap" v-if="!addressObj.name">
			<view class="iconfont icon-map"></view>
			<view class="addres-item-name" @tap="chooseAddres">
				{{ $t('您未设置默认地址或为添加收货地址，请点击添加') }}
			</view>
		</view>
		
		<view class="order-wrap" v-for="(item, key, index) in shopProductList" :key="index">
			<view class="order-shop">
				<view class="shop-name">{{ key.split('-')[0] }}</view>
				<navigator :url="storeIndex + '?storeId=' + key.split('-')[1]">
					<view class="shop-skip">
						<text>{{ $t('进入店铺') }}</text>
						<text class="iconfont icon-arrowright"></text>
					</view>
				</navigator>
			 </view>
			 <view class="order-product">
			 	<view class="product-item" v-for="(project, i) in item" :key="i">
			 		<view class="product-l">
			 			<image class="product-img" :src="project.image + imgShrink(100, 100)" mode="" />
			 		</view>
					<view class="product-r">
						<view class="product-r-t">
							<view class="product-name">{{ project.name }}</view>
							<view class="product-size">{{ project.skuValue }}</view>
						</view>
						<view class="product-inner">
							<view class="product-price"> {{ $t('¥') }}
								<text v-if="project.type != 1">
									<!-- {{ project.type == 2 ? formatMoney(project.minPrice2) : formatMoney(project.minPrice1) }} -->
									{{ project.type == 2 ? formatMoney(project.price) : formatMoney(project.minPrice1) }}
								</text>
								<text v-if="project.type == 1">
									{{ formatMoney(project.price) }}
								</text>
							</view>
							<view class="product-num">x 
								<text>{{ project.count }}</text>
							</view>
						</view>
					</view>
			 	</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate">
						{{ $t('运费') }}
						<text class="uni-cell-text">
							<!-- {{   freight ? $t('¥') + freight :  $t('包邮') }} -->
							{{ shopFreightCount(item) > 0 ? $t('¥') + shopFreightCount(item) : shopFreightCount(item) }}
						</text>
					</view>
				</view>
				<!-- <view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						{{ $t('配送时间') }}
						<text class="uni-cell-text">24小时内发货</text>
					</view>
				</view> -->
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate uni-list-cell-last-msg">
						{{ $t('买家留言') }}
						<view class="uni-textarea">
							<textarea class="textarea" v-model="textVal" placeholder="请输入买家留言" auto-height />
						</view>
					</view>
				</view>
				<view class="product-subtotal">{{ $t('共') }}<text>{{ subtotalNum(item) }}</text>{{ $t('件商品') }} {{ $t('小计') }}: <text>{{ $t('¥') }}{{ formatMoney( subtotal(item) ) }}</text></view>
			 </view>
		</view>
		
		<view class="uni-list-cell invoice-msg" hover-class="uni-list-cell-hover">
			<view class="uni-list-cell-navigate uni-navigate-right" @tap="chooseInvoice">
				{{ $t('发票信息') }}
				<text class="uni-cell-text">{{ invoiceMsg.companyName || $t('不需要发票') }}</text>
			</view>
		</view>
		
		<view class="account-wrap">
			<view class="acc-item acc-inner">
				<text class="acc-total">{{ $t('合计') }}: {{ $t('¥') }}{{ formatMoney(productSumPrice + freight || 0) }}</text>
				<text class="acc-freight">（{{ $t('含运费') }}: {{ $t('¥') }}{{ freight || 0 }}）</text>
			</view>
			<view class="acc-item acc-btn" @tap="createOrder">{{ $t('去结算') }}</view>
		</view>
	</view>
</template>

<script>
	import uniPopup from '../../../components/uni-popup.vue'

	export default {
		data() {
			return {
				addressObj: {},
				shopProductList: {},
				invoiceMsg: {},
				total: '0.00',
				freight: '',
				textVal: '',
				msgNum: '',
				stat: '',
				ids: '',
				productSumPrice: 0,
				url: this.prefix.baseImgUrl,
				storeIndex: this.prefix.uStoreIndex,
				count: 0,
				popType: 'bottom',
				msg: '',
				loading: false,
				freightList: [],
				orderIdList: [],
				data: {},
				cartIdList: [],
				pid: [],
				countList: []
			}
		},
		onLoad(param) {
			this.stat = param.stat
			this.ids = param.ids
			if(param.star === '1') {
				this.productSumPrice = param.productSumPrice
			}
			this.data = param
			this.init()
		},
		components: {
			uniPopup,
		},
		watch: {
			['$store.state.orderOkAddressMsg']() {
				this.addressObj = JSON.parse(this.$store.state.orderOkAddressMsg)
				this.countFreight(Array.from(this.countList, _ => this.addressObj.id).join())
			},
			['$store.state.deliver']() {
				this.invoiceMsg = this.$store.state.deliver
			}
		},
		computed: {
			detailAddress() {
				return `${ this.addressObj.provinceName }
				${ this.addressObj.cityName }
				${ this.addressObj.districtName }
				${ this.addressObj.detailedAddress }`
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			tapRight() {
				let url = this.prefix.uMyMessage
				uni.navigateTo({
					url: url
				})
			},
			createOrder() {
				if(!this.addressObj.id) {
					this.openErrMsg(this.$t('请选择地址'))
					return
				}
				for(let i = 0; i < this.freightList.length; i++) {
					if(this.freightList[i].freight == '-1') {
						this.openErrMsg(this.$t('您购买的商品无货了，请购买其他商品'))
						return
					}
				}
				let that = this;
				let keys = [];
				let data = this.shopProductList;
				let storeIdList = [];
				let orderSumPriceList = [],
					freight = [],
					memoList = [];

				// 拼接单个订单的总价、备注、运费
				for( let k in data ) {
					keys.push(k.split('-')[1])
					let count = 0;
					data[k].forEach(item => {
						if(item.type != 1) {
							count += item.count * (item.type == 2 ? item.minPrice2 : item.minPrice1)
						}
						if(item.type == 1) {
							count += item.price * item.count
						}
					})
					// 店铺id 需要跟单个订单的总价、备注、运费 关联
					storeIdList.push(k.split('-')[1])

					// 单个订单总价
					orderSumPriceList.push(count)
				}
				let _data = {
					amountPaid:this.productSumPrice,
					ids: this.stat === '1' ? this.ids + ',' : this.cartIdList.join() + ',',
					keys:keys.join() + ',',
					addressId:this.addressObj.addressId,
					deliverId:this.$store.state.deliver.deliverId || ''
				};
				this.freightList.forEach(item => {
					freight.push(item.freight)
				})
				storeIdList.forEach((item, index) => {
					// 单个订单总价
					_data['amountPaid_' + item] = orderSumPriceList[index]
					// 单个订单 运费
					_data['freight_' + item] = freight[index]
					// 单个订单备注
					_data['memo_' + item] = this.textVal
				})
				this.$api.tradeOrderSave(_data).then(res => {
					// 为0没有支付
					if(res.data.paySwitch === '0') {
						uni.showLoading({
							title: that.$t('下单成功！跳转中'),
							success() {
								setTimeout(_ => {
									uni.hideLoading();
									uni.redirectTo({
										url: that.prefix.uOrderList + '?order=20'
									})
								}, 500)
							}
						});
					} else {
						let orderIdList = []
						res.data.tradeOrderList.forEach(item => {
							orderIdList.push(item.orderId)
						})
						this.orderIdList = orderIdList
						uni.redirectTo({
							url: that.prefix.uTradePay + '?orderIdList=' + orderIdList.join() + '&totalPrice=' + (this.productSumPrice + this.freight)
						})
					}
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
			},			
			init() {
				let storeId = '',
					storeName = '',
					param = this.stat === '1' ? {
						stat: this.stat,
						ids: this.ids,
						productSumPrice: this.productSumPrice,
						type: this.data.type
					} : {
						stat: this.stat,
						pid: this.ids,
						skuMsg: this.data.skuMsg,
						type: this.data.type
					}
				let pid = []
				// 总数
				let count = [];
				let cartIdList = []
				this.$api.userMessageUnreadCount().then(res => {
					this.msgNum = res.data + '' || ''
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
				this.$api.tradeOrderConfimOrder(param).then(res => {
					let productList = res.data.cartMap,
						str = '',
						skuIdsArr = [];
						let totalPrice = 0
					for(let k in productList) {
						if(productList.hasOwnProperty(k)) {
							str = k
						}
						productList[k].forEach((n, i) => {
							cartIdList.push(n.cartId)
							pid.push(n.pid)
							count.push(n.count)
							this.count += n.count
							skuIdsArr.push(n.skuId)
						})
					}
					this.cartIdList = cartIdList
					this.pid = pid
					this.countList = count
					
					let arr = str.split('-')
					storeName = arr[0]
					storeId = arr[1]
					// this.$api.productSkuList({ skuIds: skuIdsArr.join() }).then(res => {
					// 	for(let k in productList) {
					// 		if(productList.hasOwnProperty(k)) {
					// 			productList[k].forEach((n, i) => {
					// 				productList[k][i].image = this.prefix.noProductImg
					// 				// 商品列表 图片
					// 				// res.data.forEach((m, j) => {
					// 				// 	if(n.pid === m.pid) {
					// 				// 		productList[k][i].image = this.prefix.baseImgUrl + m.image;
					// 				// 	}
					// 				// })
					// 			})
					// 		}
					// 	}
					// }).catch(err => {
					// 	this.openErrMsg(err.message || '加载错误')
					// })
					this.$api.productList({pids: pid.join()}).then(res => {
						let data = res.data.productList
						let cartData = productList
						for(let k in cartData) {
							cartData[k].forEach((item, i) => {
								data.forEach((childItem) => {
									if(item.pid === childItem.pid) {
										// 计算总价
										if(childItem.type != 1) {
											totalPrice += item.count * (childItem.type == 2 ? item.price : childItem.minPrice1)
										} else {
											totalPrice += item.count * item.price
										}
										item.image = this.prefix.baseImgUrl + childItem.image
										cartData[k][i] = Object.assign({}, childItem, item)
									}
								})
							})
						}
						this.productSumPrice = totalPrice
						this.shopProductList = cartData
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
					this.$api.userAddressOne().then(res => {
						// 计算运费
						if(res.data === '') {
							return
						}
						this.addressObj = res.data
						this.countFreight(Array.from(count, _ => this.addressObj.id).join())
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			// 总运费
			async countFreight(addressIds) {
				await this.$api.tradeOrderCalculateFreight({
					pids: this.pid.join(),
					counts: this.countList.join(),
					addressIds: addressIds
				}).then(res => {
					this.freightList = res.data
					let freightCount = 0
					res.data.forEach((n,i) => {
						if(n.freight > 0) freightCount += n.freight
						// this.count += count[i]
					})
					this.freight = freightCount
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			// 计算单个店铺里的商品运费
			shopFreightCount(itemList) {
				var obj = {};
				itemList = itemList.reduce((item, next) => {
					obj[next.pid] ? '' : obj[next.pid] = true && item.push(next);
					return item;
				}, []);
				let freightCount = 0
				for(let i = 0; i < itemList.length; i++) {
					for(let j = 0; j < this.freightList.length; j++) {
						if(itemList[i].pid == this.freightList[j].pid) {
							if(this.freightList[j].freight == '-1') return this.$t('无货')
							freightCount += this.freightList[j].freight > 0 ? this.freightList[j].freight : 0
						}
					}
				}
				if(freightCount == 0) {
					return this.$t('包邮')
				} else {
					return freightCount
				}
			},
			// 小计金额
			subtotal(itemList) {
				return itemList.map(item => item.price * item.count ).reduce((count, j) => count + j )
			},
			// 小计数量
			subtotalNum(itemList) {
				return itemList.map(item => item.count ).reduce((count, j) => count + j )
			},
			chooseInvoice() {
				let url = this.prefix.uInvoiceList
				uni.navigateTo({
					url: url + '?userOrderOk=ok'
				})
			},
			chooseAddres() {
				let url = this.prefix.uAddressList
				uni.navigateTo({
					url: url + '?userOrderOk=ok'
				})
			},
		}
	}
</script>

<style lang="scss">
	view {
		color: #4a4a4a;
	}
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
	.header-item .item-abso {
		position: absolute;
		top: 0;
		right: 16upx;
		/* #ifdef H5 */
		top: 16upx;
		right: 8upx;
		/* #endif */
		line-height: 0;
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
		flex: auto;
	}
	.addres-item-name {
		color: #9d9d9d;
	}
	.addres-flex {
		display: flex;
		justify-content: space-between;
	}
	.item-addr {
		/* color: #888; */
		font-size: 24upx;
	}
	.order-wrap {
		border-bottom: 2upx solid #d5d5d5;
	}
	.order-shop {
		padding: 14upx 20upx;
		border-top: 10upx solid #f5f5f5;
		display: flex;
		justify-content: space-between;
		font-size: 12upx;
	}
	.shop-skip .iconfont {
		font-size: 26upx;
	}
	.product-item {
		display: flex;
		padding: 20upx;
		margin: 20upx;
		background: #fbfbfb;
		.product-l {
			height: 160upx;
			.product-img {
				width: 160upx;
				height: 160upx;
				border: 2upx solid #ccc;
			}
		}
		.product-r {
			flex: auto;
			margin-left: 20upx;
			.product-r-t {
				height: 130upx;
				line-height: 1.2;
				.product-name {
					font-size: 24upx;
					color: #666;
					line-height: 1.2;
				}
				.product-size {
					font-size: 20upx;
					color: #999;
				}
			}
			
			.product-inner {
				display: flex;
				justify-content: space-between;
				.product-price {
					color: #f1224b;
					font-size: 36upx;
					line-height: 1;
					// text {
					// 	font-size: 30upx;
					// }
				}
				.product-num {
					color: #f1224b;
					font-size: 36upx;
					line-height: 1;
					// text {
					// 	color: #f1224b;
					// 	font-size: 26upx;
					// }
				}
			}
		}
	}
	
	.uni-cell-text {
		padding-right: 20upx;
		color: #bbb;
		
	}
	.uni-list-cell-last-msg {
		flex-wrap: wrap;
	}
	.textarea {
		margin: 4upx 20upx;
		padding: 0;
	}
	.product-subtotal {
		display: flex;
		justify-content: flex-end;
		padding: 20upx;
		align-items: baseline;
	}
	.product-subtotal text {
		color: #f1224b;
		font-size: 36upx;
	}
	.invoice-msg {
		border-top: 10upx solid #f5f5f5;
		margin-bottom: 100upx;
	}
	
	.account-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100upx;
		background-color: #fff;
		background: linear-gradient(to bottom, #ffffff 0%,#e4e4e4 100%);
		border-top: 2upx solid #ccc;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		z-index: 20;
		.acc-inner {
			display: flex;
			flex-wrap: wrap;
			align-items: baseline;
			justify-content: flex-end;
			padding: 0 20upx;
			.acc-total {
				font-size: 36upx;
				color: #f1224b;
				line-height: 1.4;
			}
			.acc-freight {
				font-size: 22upx;
			}
		}
		.acc-btn {
			padding: 0 40upx;
			height: 100upx;
			line-height: 100upx;
			background: #f1224b;
			color: #fff;
			font-size: 32upx;
			word-break: break-all;
		}
	}
	
	.user-order-ok {
		overflow: hidden;
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
