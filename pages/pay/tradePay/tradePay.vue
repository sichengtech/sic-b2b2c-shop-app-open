<template>
	<view>
		
		<uni-nav-bar color="#333333" leftIcon="back" fixed="false" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('支付') }}</text>
			</view>
		</uni-nav-bar>

		<view class="pay_price">
			<text class="price_num">
				{{ $t('¥') }} <text>{{ totalPrice }}</text>{{ totalPriceValue }}
			</text>
		</view>
	


		
		<!-- #ifndef MP-WEIXIN -->
		<view class="title">{{ $t('支付方式') }}</view>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in payWayList" :key="key">
				<view class="uni-media-list" @tap="updetaPayType(value.payWayNum)">
					<view class="uni-media-list-logo">
						<image :src="value.payLogo"></image>
					</view>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{value.name}}</view>
						<!-- <view class="uni-media-list-text-bottom uni-ellipsis">{{value.content}}</view> -->
					</view>
					<view class="">
						<checkbox-group class="list-flex">
							<label class="uni-list-cell uni-list-cell-b uni-list-cell-pd">
								<view>
									<checkbox :checked="value.checked" style="display: none;" />
									<text class="iconfont" :class="value.checked ? 'icon-success' : 'icon-success-copy1'"></text>
								</view>
							</label>
						</checkbox-group>
					</view>
				</view>
			</view>
			<view class="no_pay" v-if="payWayList.length === 0">
				{{ $t('暂无支付方式') }}
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view v-if="payWayList.length" class="pay" :style="{top: viewTop}" @tap="orderPay">
			{{ $t('支付') }}
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<!-- 微信小程序需要授权， 才能拿到UnionID交给服务端去换openId -->
		<view v-if="!isAuthorizeWX" class="authorize" :style="{top: viewTop}">
			<button open-type="getUserInfo" @getuserinfo="onGotUserInfo">{{ $t('支付前，请先授权') }}</button>
		</view>
		<view v-if="payWayList.length && isAuthorizeWX" class="pay" :style="{top: viewTop}" @tap="orderPay">
			{{ $t('支付') }}
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import * as pay from "../../../common/pay.js"
	import Base from "../../../common/plugin/base64.js"
	export default {
		data() {
			return {
				myPayList: {
					weixin_app: {
						phonePayId: 'wxpay',
						payLogo: "../../../static/img/iconweixin.png"
					},
					ali_app: {
						phonePayId: 'alipay',
						payLogo: "../../../static/img/iconzhifubao.png"
					},
					weixin_h5: {
						phonePayId: 'wxpay',
						payLogo: "../../../static/img/iconweixin.png"
					},
					ali_h5: {
						phonePayId: 'alipay',
						payLogo: "../../../static/img/iconzhifubao.png"
					},
				},
				orderIds: '',
				payWayList: [],
				totalPrice: 0,
				viewTop: 0,
				// 微信小程序是否授权
				isAuthorizeWX: false,
				// 防止用户多次点击支付按钮
				timer: null
			}
			
		},
		computed: {
			totalPriceValue() {
				return this.totalPrice.split('.')[1] ? '' : '.00'
			}
		},
		onLoad(param) {
			this.orderIds = param.orderIdList
			this.totalPrice = param.totalPrice
			this.viewTop = (uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight - 80) / uni.getSystemInfoSync().windowHeight * 100 + '%'
			this.init()
			// #ifdef MP-WEIXIN
			this.getAuthorizeStatus()
			// #endif
		},
		methods: {
			back() {
				let that = this
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('确定离开收银台？'),
					cancelColor: '#666',
					cancelText: that.$t('继续支付'),
					confirmText: that.$t('确定离开'),
					success: function (res) {
						if (res.confirm) {
							uni.redirectTo({
								url: that.prefix.uOrderList + '?order=10'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			init() {
				let platformType = ''
				// #ifdef APP-PLUS
				platformType = 1
				// #endif
				// #ifdef H5
				platformType = 2
				// #endif
				// #ifdef MP-WEIXIN
				platformType = 3
				// #endif

				this.$api.payWayList({
					useTerminal: platformType,
					// #ifdef MP-WEIXIN
					payWayNum: 'weixin_mp'
					// #endif
				}).then(res => {
					if(!res.data.length) {
						uni.showModal({
							title: that.$t('提示'),
							content: that.$t('暂无交易方式，请联系管理员'),
							confirmText: that.$t('是'),
							showCancel: false,
							success: function (res) {
								uni.redirectTo({
									url: that.prefix.uOrderList + '?order='
								})
							}
						});
						return;
					}
					
					let data = res.data
					// weixin_app, ali_app
					
					let myPayList = this.myPayList
					data = res.data.map((value, index) => {
						// #ifndef MP-WEIXIN
						value.phonePayId = myPayList[value.payWayNum].phonePayId
						value.payLogo = myPayList[value.payWayNum].payLogo
						value.checked = false
						// #endif
						return value;
					})
					data[0].checked = true
					this.payWayList = data
					
				})
			},
			requestPayment(payTypeData) {
				let that = this
				pay.orderPay(payTypeData, this.orderIds, (data_h5) => {
					// #ifdef APP-PLUS
					uni.hideLoading()
					uni.showLoading({
						title: that.$t('支付成功！跳转中'),
						success() {
							setTimeout(_ => {
								uni.redirectTo({
									url: that.prefix.uOrderList + '?order=20'
								})
								uni.hideLoading();
							}, 500)
						}
					});
					
					// #endif
					// #ifdef H5
					if(payTypeData.phonePayId === 'alipay') {
						const div = document.createElement('div');
						div.innerHTML = Base.decode(data_h5.data)
						document.body.appendChild(div);
						document.forms[0].submit();
						return
					}

					if(payTypeData.phonePayId === 'wxpay') {
						window.location.replace(data_h5.data.mweb_url+'&redirect_url='+encodeURIComponent(window.location.href+'&tip=yes'))
					}
					// #endif

				}, (error) => {
					uni.hideLoading()
					let reg = /(60012)|(-2)|(62001)/g
					if(reg.test(error.errMsg)) {
						uni.showModal({
							title: that.$t('提示'),
							content: that.$t('支付已取消'),
							cancelText: that.$t('否'),
							confirmText: that.$t('是'),
							showCancel: false
						})
					} else {
						uni.showModal({
							title: that.$t('提示'),
							content: error.errMsg,
							confirmText: that.$t('是'),
							showCancel: false
						})
					}
				})
			},
			orderPay() {
				// 防止用户多次点击
				uni.showLoading({
					title: '提交订单中',
				})
				clearTimeout(this.timer)
				this.timer = setTimeout(_ => {
					this.payDataDeploy()
				}, 200)
			},
			payDataDeploy() {
				let that = this
				let payTypeData = null
				this.payWayList.forEach(item => {
					if(item.checked) {
						payTypeData = item
					}
				})
				// #ifdef MP-WEIXIN
				if(!this.isAuthorizeWX) {
					this.openErrMsg('微信小程序支付需要先授权')
					return
				}
				pay.wechatXiaoChengXuPay(payTypeData, this.orderIds, res => {
					setTimeout(_ => {
						uni.redirectTo({
							url: that.prefix.uOrderList + '?order=20'
						})
						uni.hideLoading();
					}, 500)
				}, err => {
					setTimeout(_ => {
						uni.redirectTo({
							url: that.prefix.uOrderList + '?order=0'
						})
						uni.hideLoading();
					}, 500)
				})
				// #endif

				// #ifndef MP-WEIXIN
				this.requestPayment(payTypeData)
				// #endif
			},
			updetaPayType(payTypeData) {
				this.payWayList = this.payWayList.map(value => {
					value.checked = value.payWayNum === payTypeData ? true : false
					return value;
				})
			},
			// #ifdef MP-WEIXIN
			// 获取微信授权状态
			getAuthorizeStatus() {
				let that = this
				wx.getSetting({
					success(res) {
						that.isAuthorizeWX = res.authSetting['scope.userInfo'] || false
					}
				})
			},

			onGotUserInfo(e) {
				if(e.detail.errMsg == 'getUserInfo:ok') {
					this.isAuthorizeWX = true
				}
			},

			// #endif
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

	.pay_price {
		padding: 60upx;
		text-align: center;
		.price_num {
			color: #ff0000;
			font-size: 26upx;
			text {
				margin-left: 4upx;
				// margin-right: -8upx;
				font-size: 50upx;
			}
		}
	}


	.title {
		padding: 20upx;
		background: antiquewhite;
		color: #ff0000;
	}
	.uni-media-list {
		align-items: center;
	}
	.uni-media-list-body {
		height: auto;
	}
	.uni-media-list-text-top {
		line-height: 1.8;
		font-size: 28upx;
	}
	.uni-media-list-logo {
		width: 60upx;
		height: 60upx;
	}


	.uni-list-cell-pd {
		padding: 0;
	}
	.pay {
		padding: 16upx 0;
		margin: 0 5%;
		position: absolute;
		left: 0;
		right: 0;
		border-radius: 50upx;
		text-align: center;
		background: #ff0000;
		color: #fff;
		font-size: 30upx;
	}
	.no_pay {
		padding: 60upx;
		text-align: center;
	}

	.authorize {
		position: absolute;
		left: 0;
		right: 0;
		padding: 0 5%;
		button {
			border-radius: 50upx;
			font-size: 34upx;
			color: #ff4444;
			&::after {
				border: none;
			}
		}
	}
</style>
