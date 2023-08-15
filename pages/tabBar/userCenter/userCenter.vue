<template>
	<view class="user-center">
		<type-top background="#f21249"></type-top>
		<view class="user">
			<view class="user-bg">
				<image v-if="ajaxUrl" :src="ajaxUrl + '/wap/views/wap/default/images/user_head_bg.jpg'" mode="" />
			</view>
			<view class="user-img">
				<view class="user-div"><image class="user-div-img" v-if="userImgUrl" :src="userImgUrl" /></view>
			</view>
			<view class="user-msg" v-if="isLogin">
				<view class="user-name">{{ userName }}</view>
				<view class="user-vip">
					<view class="vip" v-if="userVip"><fine-icon type="success" />{{ $t('账号已认证') }}</view>
					<view class="novip" v-if="!userVip && userVip != ''"><fine-icon type="favorite" />{{ $t('账号未进行认证') }}</view>
				</view>
			</view>
			<view class="user-msg" v-if="!isLogin">
				<view class="user-login">
					<view @tap="login">{{ $t('登录/注册') }}</view>
				</view>
			</view>
			<svg version="1.1" id="line-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1080 50" enable-background="new 0 0 1080 50" xml:space="preserve"><path fill="#FFFFFF" d="M1080,50H0V0c0,0,161,44,540,44s540-44,540-44V50z"></path></svg>
		</view>
		
		<view class="content-icon">
			<view class="flex-content">
				<view v-for="(item, index) in icon" class="a-icon" :key="index" @tap="skip(item.url, index)">
						<view class="a-item-div">
							<text v-if="item.num > 0" class="badge badge-danger">{{ item.num || '' }}</text>
							<fine-icon :type="item.icon" :style="{color: item.color}" />
						</view>
						<view class="a-item-p">{{ $t(`${ item.item }`) }}</view>
				</view>
			</view>
		</view>
		
		<view class="content-list">
			<view class="list-title"><fine-icon type="gerenzhongxin" />{{ $t('会员资料') }}</view>
			<view @tap="openView(prefix.uUserMsg)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('个人信息') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uCommentList)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('我的评价') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uConsultationList)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('我的咨询') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uCollectionStore)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('收藏店铺') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uCollectionProduct)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('收藏商品') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uAddressList + '?boy=1')">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('收货地址') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uInvoiceList)">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('开票信息') }}
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uMsgList + '?id=1')">
				<view class="uni-list-cell uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('我的消息') }}
						<uni-badge class="xiaoxi" :text="orderMsg == 0 ? '' : orderMsg" type="danger"></uni-badge>
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uSettings, 1)">
				<view class="uni-list-cell uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						·{{ $t('设置') }}
					</view>
				</view>
			</view>
		</view>

		<view class="logout" v-if="isLogin">
			<view class="mui-btn" @click="showLogout">{{ $t('退出登录') }}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
				ajaxUrl: this.prefix.baseUrl,
				prefix: this.prefix,
				userImgUrl: '',
				userName: '',
				userVip: '',
				icon: [
					{num: '', icon: 'all', item: '订单中心', color: '#d00', url: this.prefix.uOrderList },
					{num: '', icon: '12', item: '待付款', color: '#d00', url: this.prefix.uOrderList + '?order=10'},
					{num: '', icon: 'shouhuo', item: '待发货', color: '#d00', url: this.prefix.uOrderList + '?order=20'},
					{num: '', icon: 'pingjia', item: '待收货', color: '#d00', url: this.prefix.uOrderList + '?order=30'},
					{num: '', icon: 'yiwancheng', item: '待评价', color: '#d00', url: this.prefix.uOrderList + '?order=40'},
					// {num: '', icon: 'cart', item: '购物车', color: '#d00', url: this.prefix.uTradeCart},
					// {num: '', icon: 'wxbmingxingdianpu', item: '收藏店铺', color: '#c43fa9', url: this.prefix.uCollectionStore},
					// {num: '', icon: 'favorite1', item: '收藏商品', color: '#c43fa9', url: this.prefix.uCollectionProduct},
					// {num: '', icon: 'xiaoxi6', item: '消息', color: '#c43fa9', url: this.prefix.uMsgList + '?id=1'},
					// {num: '', icon: 'sps', item: '评价', color: '#c43fa9', url: this.prefix.uCommentList},
					// {num: '', icon: 'zixun', item: '咨询', color: '#c43fa9', url: this.prefix.uConsultationList}
				],
				isLogin: false,
				orderMsg: 0
			}
		},
		onShow() {
			let that = this
			let isLogin = that.$storage.isLogin()
			if(!isLogin) {
				this.isLogin = false
				this.userImgUrl = '../../../static/img/not-login.jpg'
				this.userName = ''
				this.userVip = ''
				this.icon = [
					{num: '', icon: 'all', item: '订单中心', color: '#d00', url: this.prefix.uOrderList },
					{num: '', icon: '12', item: '待付款', color: '#d00', url: this.prefix.uOrderList + '?order=10'},
					{num: '', icon: 'shouhuo', item: '待发货', color: '#d00', url: this.prefix.uOrderList + '?order=20'},
					{num: '', icon: 'pingjia', item: '待收货', color: '#d00', url: this.prefix.uOrderList + '?order=30'},
					{num: '', icon: 'yiwancheng', item: '待评价', color: '#d00', url: this.prefix.uOrderList + '?order=40'},
				// 	{num: '', icon: 'wxbmingxingdianpu', item: '收藏店铺', color: '#c43fa9', url: this.prefix.uCollectionStore},
				// 	{num: '', icon: 'favorite1', item: '收藏商品', color: '#c43fa9', url: this.prefix.uCollectionProduct},
				// 	{num: '', icon: 'sps', item: '评价', color: '#c43fa9', url: this.prefix.uCommentList},
				// 	{num: '', icon: 'zixun', item: '咨询', color: '#c43fa9', url: this.prefix.uConsultationList}
				]
			} else {
				this.init()
				this.isLogin = true
			}
			let arr = ['首页', '分类', '购物车', '个人中心']

			arr.forEach((n, i) => {
				uni.setTabBarItem({
					index: i,
					text: that.$t(n),
					//iconPath: '/path/to/iconPath',
					//selectedIconPath: '/path/to/selectedIconPath'
				})
			})
		},
		methods: {
			
			init() {
				let that = this
				this.$api.userOne().then(res => {
					that.userName = res.data.loginName
					that.userVip = res.data.isOperation
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
				this.$api.userMember().then(res => {
					if(res.data.headPicPath) {
						that.userImgUrl = that.url + res.data.headPicPath + this.imgShrink(150, 150)
					} else {
						that.userImgUrl = '../../../static/img/user_face_01.png'
					}
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
				this.$api.userCentralCount().then(res => {
					let datum = res.data
					that.icon[1].num = datum.orderStatus10
					that.icon[2].num = datum.orderStatus20
					that.icon[3].num = datum.orderStatus30
					that.icon[4].num = datum.orderStatus40
					// that.icon[4].num = datum.tradeCarts
					// that.icon[4].num = datum.collectionStores
					// that.icon[5].num = datum.collectionProducts
					// that.icon[7].num = datum.messages
					// that.icon[6].num = datum.tradeComments
					// that.icon[7].num = datum.tradeConsultations
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})

				// 消息数量
				this.$api.userMessageUnreadCount().then(res => {
					this.orderMsg = res.data ? res.data + '' : ''
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			showLogout() {
				let that = this
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('确认退出'),
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success(res) {
						if(res.confirm) {
							that.logout()
						}
					}
				})
			},
			skip(url, i) {
				let that = this
				if(this.isLogin) {
					uni.navigateTo({
						url: url
					})
				} else {
					this.openErrMsg(that.$t('请先登录'))
				}
			},
			openView(url, type) {
				let that = this
				if(this.isLogin || type) {
					url && uni.navigateTo({
						url: url
					})
				} else {
					this.openErrMsg(that.$t('请先登录'))
				}
				
			},
			login() {
				let that = this
				uni.navigateTo({
					url: that.prefix.uLogin,
				})
			},
			logout() {
				let that = this
				this.$api.userCentralExitLogin().then(res => {
					that.$storage.cStore()
					uni.navigateTo({
						url: that.prefix.uLogin,
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			}
		}
		
	}
</script>

<style>
	.user-center {
		background: #f9f9f9;
	}
	.user {
		display: flex;
		display: -webkit-flex;
		position: relative;
		height: 300upx;
		color: #fff;
	}
	.user-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 300upx;
	}
	.user-bg image {
		width: 100%;
		height: 100%;
	}
	.user-name {
		color: #fff;
		font-size: 36a-item-divupx
	}
	.user-vip .vip {
		font-size: 20upx;
		font-weight: 100;
		background: rgba(255,255,255,.2);
		display: inline-block;
		padding: 0 20upx;
		border-radius: 30upx;
	}
	.user-img {
		flex: 1;
		margin: 40upx 0 0 40upx;
	}
	.user-msg,
	.user-img {
		z-index: 99;
	}
	.user-msg {
		flex: 2;
		margin: 80upx 0 0 20upx;
	}
	.user svg {
		position: absolute;
		bottom: 0;
	}
	.user-img .user-div {
		width: 208upx;
		height: 208upx;
		border: 6upx solid #fff;
		border-radius: 50%;
		overflow: hidden;
	}
	.user-img .user-div-img {
		width: 208upx;
		height: 208upx;
		border-radius: 50%;
	}
	.iconfont.icon-success {
		color: gold;
		font-size: 24upx;
	}
	.user-vip span {
		position: relative;
		/*margin-right: 0.05rem;*/
		font-size: 24upx;
		background-color: #f7547c;
		border-radius: 20upx;
		height: 28upx;
		line-height: 28upx;
		text-align: center;
		padding: 4upx 10upx;
	}
	.user-vip span i {
		font-size: 24upx;
		margin-right: 10upx;
	}
	.user-login view {
		line-height: 5;
		display: inline;
		padding: 20upx;
		background: pink;
		border-radius: 40upx;
	}

	.content-icon {
		background: #fff;
	}
	.flex-content {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 40upx 30upx 0;
	}
	.a-icon {
		display: block;
		width: 20%;
	}
	.a-item-div {
		position: relative;
		margin: 0 auto;
		width: 100upx;
		height: 100upx;
		border: 2upx solid #f3f3f3;
		border-radius: 50%;
		text-align: center;
		line-height: 100upx;
	}
	.a-item-div .iconfont {
		font-size: 48upx;
		color: #d00;
		line-height: 100upx;
	}
	.iconfont.icon-color {
		color: #c43fa9;
	}
	.a-item-div .badge {
		position: absolute;
		right: -12upx;
		top: -4upx;
		padding: 0 12upx;
	/* 	width: 36upx;
		height: 36upx; */
		border-radius: 34upx;
		background: red;
		color: #fff;
		line-height: 36upx;
	}
	.a-item-p {
		margin: 12upx 0;
		text-align: center;
		color: #999;
		font-size: 24upx;
		font-weight: 300;
		line-height: 1.38;
	}

	.list-title {
		position: relative;
		overflow: hidden;
		padding: 22upx 30upx;
		margin: 0;
		font-weight: 300;
	}
	.list-title .iconfont {
		margin-right: 8upx;
	}
	.content-list:last-child {
		margin-bottom: 88upx;
	}

	.logout {
		padding: 0 20upx;
		margin-top: 24upx;
		margin-bottom: 108upx;
		background: #fff;
	}
	.logout .mui-btn {
		padding: 20upx 0;
		width: 100%;
		text-align: center;
		background: red;
		border-radius: 10upx;
		color: #fff;
	}
	.uni-list-cell-navigate {
		background: #fff;
		font-size: 26upx;
		font-weight: 300;
	}

	.xiaoxi {
		position: absolute;
		left: 145upx;
		/* top: 10upx; */
	}
</style>
