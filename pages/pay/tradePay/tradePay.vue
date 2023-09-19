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
		
		<!-- App、H5 (非微信小程序) -->
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
		
		<!-- App、H5 (非微信小程序) -->
		<!-- #ifndef MP-WEIXIN -->
		<view v-if="payWayList.length" class="pay" :style="{top: viewTop}" @tap="orderPay">
			{{ $t('支付') }}
		</view>
		<!-- #endif -->
		
		<!-- 微信小程序 -->
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
	import Base64 from "../../../common/plugin/base64.js"
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
				console.log("####this.totalPrice####")
				console.log(this.totalPrice)
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
			//"返回"按钮的处理函数
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
							console.log('用户点击取消，将继续支付。');
						}
					}
				});
			},
			init() {
				let platformType = ''
				//如果是App
				// #ifdef APP-PLUS
				platformType = 1
				// #endif
				
				//如果是H5
				// #ifdef H5
				platformType = 2
				// #endif
				
				//如果是微信小程序
				// #ifdef MP-WEIXIN
				platformType = 3
				// #endif

				this.$api.payWayList({
					useTerminal: platformType,
					//如果是微信小程序
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
						//如果是App、H5(非微信小程序)
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
			//////////////////////////////////////////
			//“支付”按钮的处理函数。  主入口函数
			//////////////////////////////////////////
			orderPay() {
				let that = this
				let payTypeData = null
				this.payWayList.forEach(item => {
					if(item.checked) {
						payTypeData = item
					}
				})
				// 如果是微信小程序
				// #ifdef MP-WEIXIN
				if(!this.isAuthorizeWX) {
					this.openErrMsg('微信小程序支付需要先授权')
					return
				}
				this.weixin_Payment(payTypeData) //进入weixin_Payment()函数，做微信小程序支付业务。
				// #endif

				// 如果是App、H5 (非微信小程序)
				// #ifndef MP-WEIXIN
				this.apph5_Payment(payTypeData)  //进入apph5_Payment()函数，做App支付、h5支付业务。
				// #endif
			},
			
			//“支付”按钮的处理函数-第二步 (微信小程序支付时会走到这里)
			weixin_Payment(payTypeData){
				let that = this
				//调用pay的wechatMpPay()方法，做“订单支付-微信小程序支付”业务
				pay.wechatMpPay(
					payTypeData,  //这是第1个参数
					this.orderIds,  //这是第2个参数
					//这是第3个参数-支付成功回调函数
					(res) => {
						uni.hideLoading()
						uni.showLoading({
							title: that.$t('支付成功！跳转中'),
							success() {
								setTimeout(_ => {
									uni.hideLoading();
									uni.redirectTo({
										url: that.prefix.uOrderList + '?order=20'
									})
								}, 500)
							}
						});
					}, 
					 //这是第4个参数-错误回调函数
					(error) => { 
						uni.hideLoading()
						//error.message 是接口咱自己商城接口返回，符合：统一数据包装体和状态码 有要求
						//error.message 这个错误信息已在服务端做过了国际化
						//error.errMsg 好像是三方接口返回的
						let msg= that.$t('加载错误')
						if(error){
							msg= error.message || error.errMsg
						}
						uni.showModal({
							title: that.$t('提示'),
							content: msg,
							confirmText: that.$t('关闭'),
							showCancel: false
						})
					}
				)
			},
			
			//“支付”按钮的处理函数-第三步 (App支付、h5支付时会走到这里)
			apph5_Payment(payTypeData) {
				let that = this
				//调用pay的app_h5_Pay()函数，做"订单支付-App支付、h5支付"业务
				pay.app_h5_Pay(
					payTypeData, //这是第1个参数
					this.orderIds, //这是第2个参数
					
					//这是第3个参数-支付成功回调函数
					(data_h5) => {
						// 如果是App
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
						
						// 如果是H5
						// #ifdef H5
						if(payTypeData.phonePayId === 'alipay') {
							const div = document.createElement('div');
							div.innerHTML = Base64.decode(data_h5.data)
							document.body.appendChild(div);
							document.forms[0].submit();
							return
						}
						if(payTypeData.phonePayId === 'wxpay') {
							window.location.replace(data_h5.data.mweb_url+'&redirect_url='+encodeURIComponent(window.location.href+'&tip=yes'))
						}
						// #endif

					}, 
					//这是第4个参数-支付错误回调函数
					(error) => {
						uni.hideLoading()
						console.log("支付失败的回调函数的数据-App支付、h5支付时")
						console.log(error)
						let reg = /(60012)|(-2)|(62001)/g
						if(reg.test(error.errMsg)) {
							uni.showModal({
								title: that.$t('提示'),
								content: that.$t('支付已取消'),
								//cancelText: that.$t('否'),
								confirmText: that.$t('关闭'),
								showCancel: false
							})
						} else {
							//error.message 是接口咱自己商城接口返回，符合：统一数据包装体和状态码 有要求
							//error.message 这个错误信息已在服务端做过了国际化
							//error.errMsg 好像是三方接口返回的
							let msg=error.message || error.errMsg  
							uni.showModal({
								title: that.$t('提示'),
								content: msg,
								confirmText: that.$t('关闭'),
								showCancel: false
							})
						}
					}
				)
			},			
			updetaPayType(payTypeData) {
				this.payWayList = this.payWayList.map(value => {
					value.checked = value.payWayNum === payTypeData ? true : false
					return value;
				})
			},
			
			// 如果是微信小程序
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
