<template>
	<!-- chineseIndex -->
	<view class="bg-fff">
		<!-- <view class="top-view" :class="{'top-fixed' :isFixed}" :style="{'background': background}"></view> -->
		<!-- #ifdef APP-PLUS -->
		<view class="top-view"></view>
		<!-- #endif -->
		<!--  -->
		<!-- 顶部 -->
		<view class="fixed-top flex-content">
			<!-- 搜索 -->
			<!-- #ifndef H5 -->
			<view class="seach-top" @tap="scanCode">
				<uni-icons class="" type="scan" size="22" color="#333"></uni-icons>
			</view>
			<!-- #endif -->
			<view class="input-view" @tap="serach">
				<uni-icons class="input_icon" type="search" size="22" color="#666666"></uni-icons>
				<input confirm-type="search" class="input" type="text" disabled :placeholder="$t('输入搜索关键词')" />
				<span class="input-btn">{{ $t('搜索') }}</span>
			</view>
			<view class="xiaoxi-icon" @tap="tapUserMsg">
				<!-- #ifdef APP-PLUS -->
				<fine-icon type="xiaoxi2" size="20" />
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<fine-icon type="xiaoxi2" size="22" />
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<fine-icon type="xiaoxi2" class="icon_size" />
				<!-- #endif -->
				<view class="item-abso">
					<uni-badge :text="badgeNum" type="danger"></uni-badge>
				</view>
			</view>
		</view>
		
		<!-- 轮播图 -->
		<view class="carousel-height">
			<swiper-carousel v-if="carousel.length > 0" :imgList="carousel" @swipetTab="swipetTab"></swiper-carousel>
		</view>
		
		<!-- 活动快捷方式 -->
		<view class="huodong flex-content">
			<view class="huodong-item" v-for="(item, index) in huodongIcon" :key="index">
				<view @tap="toView(item)">
					<image :src="ajaxUrl + item.path" />
				</view>
			</view>
		</view>

		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>

		<!-- 活动专题 -->
		<view class="subject" v-if="subjectList.name">
			<view class="subject-tit">
				<view class="tit-zhuangti">
					<text>{{ subjectList.name }}</text>
					<view class="bg-wrap">
						<image class="subject-bg-img" src="../../../static/img/h2_span_bg.png" mode="" />
						<text class="tit-bg">抢低价</text>
					</view>
				</view>
			</view>
			<view class="subject-content">
				<block v-if="subjectList.siteRecommendItemList">
					<view class="subject-flex" v-for="(item, index) in subjectList.siteRecommendItemList" :key="index">
						<view @tap="toView(item)">
							<view class="subject-image">
								<lazy-img :realSrc="(url + item.path)"></lazy-img>
							</view>
							<!-- <image class="subject-image" :src="url + item.path" mode="" /> -->
						</view>
					</view>
				</block>
			</view>
		</view>
		
		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>
		
		<!-- 品牌购 -->
		<view class="brand-wrap" v-if="brandList.name">
			<view class="brand-tit">
				<image class="tit-img" src="../../../static/img/title_01.png" mode="" />
				<view class="tit-text">{{ brandList.name }}</view>
			</view>
			<view class="brand-content">
				<block v-if="brandList.siteRecommendItemList">
					<view class="brand-flex" v-for="(item, index) in brandList.siteRecommendItemList" :key="index">
						<view @tap="toView(item)">
							<image class="brand-img" :src="url + item.path + imgShrink(100, 43)" mode="" />
						</view>
					</view>
				</block>
			</view>
		</view>
		
		<!-- 活动轮播 -->
		<view class="uni-tab-bar activity">
			<scroll-view id="tab-bar" class="uni-swiper-tab activity-tab" scroll-x :scroll-left="scrollLeft">
				<block v-if="activityList[0].path">
					<view class="activity-view" v-for="(item,index) in activityList" :key="index">
						<image class="activity-img" :src="url + item.path + imgShrink(435, 132)" mode="" />
					</view>
				</block>
			</scroll-view>
		</view>
		
		<!-- 工程机械专区 -->
		<view class="project-wrap" v-if="projectList.name">
			<view class="project-tit">
				<image class="tit-img" src="../../../static/img/title_01.png" mode="" />
				<view class="tit-text">{{ projectList.name }}</view>
			</view>
			<view class="project-content">
				<view class="project-top">
					<block v-if="projectList.siteRecommendItemList">
						<view v-for="(item, index) in projectList.siteRecommendItemList" :class="index < 1 ? 'top-flex2' : 'top-flex1'" :key="index">
							<view @tap="toView(item)">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
							</view>
						</view>
					</block>
				</view>
				<view class="project-product">
					<block v-if="projectProductList[0].path">
						<view v-for="(item, index) in projectProductList" class="top-flex" :key="index">
							<view @tap="toView(item)">
								<image class="product-img" :src="url + item.path + imgShrink(100, 100)" mode="" />
								<text class="product-tit">{{ item.addInfo1 }}</text>
								<text class="product-price">{{ '￥' + item.addInfo2 }}</text>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>

		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>
		
		<!-- 猜你喜欢 -->
		<view class="guess-wrap">
			<view class="guess-tit">
				<image class="tit-img" src="../../../static/img/title_02.png" mode="" />
				<view class="tit-text">猜你喜欢</view>
			</view>
			<view class="guess-content">
				<view class="guess-product">
					<block>
						<view v-for="(item, index) in productList" class="guess-flex" :key="index">
							<navigator :url="prefix.uProductDetail + '?pid=' + item.pid">
								<image class="guess-img" :src="item.image" @error="imgErr(index)" />
								<text class="guess-product-tit">{{ item.name }}</text>
								<text class="guess-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 === item.maxPrice2 ? item.minPrice2 : item.minPrice2 + ' ~ ' + $t('¥') + item.maxPrice2 : item.minPrice1 }}</text>
								<text class="guess-type" v-if="!prefix.englishShop">{{ item.addInfo4 == 2 ? $t('批') : $t('零') }}</text>
							</navigator>
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="bot-dixian" v-if="showLoadMore">
			<view class="bot-flex"></view>
			<view class="bot-cen">我是有底线的</view>
			<view class="bot-flex"></view>
		</view>
		
	</view>
</template>

<script>
	import swiperCarousel from "../../../components/swiper.vue"
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
				ajaxUrl: this.prefix.baseUrl,
				prefix: this.prefix,
				scrollLeft: 0,
				tabIndex: 0,
				count: 1,
				// tabBars: [{
				// 		name: '首页',
				// 		id: '',
						
				// }, {
				// 		name: '工程机械',
				// 		id: '1'
				// }, {
				// 		name: '3c数码',
				// 		id: '108'
				// }, {
				// 		name: '安防监控',
				// 		id: '179'
				// }, {
				// 		name: '汽车汽配',
				// 		id: '240'
				// }, {
				// 		name: '家电产品',
				// 		id: '329'
				// }],
				huodongIcon: [
					{
						path: '/wap/views/wap/default/images/type_ico_01.png',
						operationContent: 1,
						operationType: '6'
					}, {
						path: '/wap/views/wap/default/images/type_ico_02.png',
						operationContent: 329,
						operationType: '6'
					}, {
						path: '/wap/views/wap/default/images/type_ico_03.png',
						operationContent: 108,
						operationType: '6'
					}, {
						path: '/wap/views/wap/default/images/type_ico_04.png',
						operationContent: 240,
						operationType: '6'
					}, {
						path: '/wap/views/wap/default/images/type_ico_05.png',
						operationContent: 179,
						operationType: '6'
					}
					
				],
				carousel: [],
				brandList: {},
				subjectList: {},
				projectList: [{path: ''},{path: ''},{path: ''}],
				projectProductList: [{path: ''},{path: ''},{path: ''},{path: ''}],
				guessList: [{path: ''},{path: ''},{path: ''},{path: ''}],
				activityList: [{path: ''},{path: ''},{path: ''},{path: ''}],
				badgeNum: null,
				productList: [],
				pageNo: 1,
				pageSize: 20,
				showLoadMore: false
			}
		},
		components: {
			swiperCarousel,
		},
		mounted() {
			this.init()
			this.$storage.isLogin() && this.userMsg()
		},
		// 下拉
		onPullDownRefresh() {
			this.carousel = []
			this.init()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000);
		},
		computed: {  
			i18n () {  
				return this.$t('messages')
			}  
		},
		// 上拉
		onReachBottom() {
			if (this.showLoadMore) {
				return false
			}
			this.pageNo = this.pageNo + 1
			this.getProdunctList((data) => {
				this.productList = this.productList.concat(data)
			})
		},
		methods: {
			change() {
				this.$i18n.locale = this.$i18n.locale === 'en-US' ? 'zh-CN' : 'en-US'
			},
			serach() {
				let that = this
				uni.navigateTo({
					url: that.prefix.uSearch
				})
			},
			
			tapUserMsg() {
				if(!this.$storage.isLogin()) {
					uni.showToast({
						title: '暂未登录，请先登录',
						icon: 'none'
					})
					return false
				}
				uni.navigateTo({
					url: this.prefix.uMsgList
				})
			},
			userMsg() {
				let isLogin = this.$storage.isLogin()
				if(isLogin) {
					this.$api.userMessageUnreadCount().then(res => {
						this.badgeNum = res.data ? res.data + '' : ''
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
				this.badgeNum = ''
			},
			init() {
				let that = this
				// 轮播
				this.$api.siteCarouselPictureList({type: 11}).then(res => {
					that.carousel = res.data.map(item => {
						item.path = item.path + this.imgShrink(562, 285, 0)
						item.mode = 'scaleToFill'
						return item
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 活动专区
				this.$api.siteRecommendOne({number: 'weixin_index_hdzt'}).then(res => {
					that.subjectList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 品牌购
				this.$api.siteRecommendOne({number: 'weixin_index_brand_list'}).then(res => {
					that.brandList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 工程机械
				this.$api.siteRecommendOne({number: 'weixin_index_gcjx_hd'}).then(res => {
					that.projectList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 工程机械-商品
				this.$api.siteRecommendOne({number: 'weixin_index_gcjx_product'}).then(res => {
					that.projectProductList = res.data.siteRecommendItemList
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 猜你喜欢
				// this.$api.siteRecommendOne({number: 'weixin_index_product_list'}).then(res => {
				// 	that.guessList = res.data.siteRecommendItemList
				// }).catch(err => {
				// 	this.openErrMsg(err.message || '加载错误')
				// })
				this.getProdunctList()
				// 活动轮播
				this.$api.siteCarouselPictureList({type: 12}).then(res => {
					that.activityList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			getProdunctList(callBack) {
				let that = this,
					param = {
						pageNo: that.pageNo,
						pageSize: that.pageSize,
					}
				// 商品列表
				this.$api.productPage(param).then(res => {
					let datum = res.data
					if(!datum || datum.productList.length === 0) {
						that.showLoadMore = true
						return false
					}
					setTimeout(() => {
						if(res.page.isLastPage) {
							that.showLoadMore = true
						}
					}, 1000)
					datum.productList.forEach((n,i) => {
						if(n.image && n.image.indexOf('http') > -1) {
							datum.productList[i].image = n.image + this.imgShrink(160, 160)
						} else {
							datum.productList[i].image = that.prefix.baseImgUrl + n.image + this.imgShrink(160, 160)
						}
					})
					callBack ? callBack(datum.productList) : that.productList = datum.productList
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			toView(item) {
				// 操作类型(1无操作、2链接地址、3关键字、4商品编号、5店铺编号、6商品分类)
				let that = this
				if(item.operationType === '3') {
					uni.navigateTo({
						url: that.prefix.uProductList + '?k=' + item.operationContent
					})
					return
				}
				if(item.operationType === '4') {
					uni.navigateTo({
						url: that.prefix.uProductDetail + '?pid=' + item.operationContent
					})
					return
				}
				if(item.operationType === '5') {
					uni.navigateTo({
						url: that.prefix.uStoreIndex + '?storeId=' + item.operationContent
					})
					return
				}
				if(item.operationType === '6') {
					uni.navigateTo({
						url: that.prefix.uProductList + '?cid=' + item.operationContent

					})
					return
				}
			},
			swipetTab(item) {
				if(item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			imgErr(index) {
				this.productList[index].image = this.prefix.noProductImg
			},
			scanCode() {
				var that = this
				uni.scanCode({
					success(res) {
						uni.navigateTo({
							url: that.prefix.uCodeWebView + '?url=' + res.result
						})
					},
					fail(res) {
						if(!/cancel/g.test(res.errMsg)) {
							uni.showToast({
								title: res.errMsg,
								duration: 1000,
								icon: 'none'
							})
						}
					}
				})
				
				
			}
		}
	}
</script>

<style>
.top-view {
		width: 100%;
		position: sticky;
		top: 0upx;
		left: 0;
		right: 0;
		height: 20px;
		height: var(--status-bar-height);
		/* height: env(safe-area-inset-top); */
		background: #ccc;
		z-index: 999;
	}
	.bg-fff {
		background: #fff;
	}
	.seach-top {
		padding: 6upx 20upx 0 0;
		/* #ifdef APP-PLUS */
			padding-top: 10upx;
		/* #endif */
	}
	.flex-content {
		display: flex;
		justify-content: space-between;
	}
	.fixed-top {
		position: sticky;
		/* #ifndef APP-PLUS */
		top: 0;
		/* #endif */
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* top: env(safe-area-inset-top); */
		/* #endif */
		left: 0;
		right: 0;
		background: #fff;
		z-index: 99;
		height: 60upx;
		padding: 14upx 20upx;
		/* padding-top: 20px; */
		border-bottom: 1upx solid #e0e0e0;
	}
	.fixed-top::after {
		width: 100%;
		position: sticky;
		top: 0upx;
		left: 0;
		right: 0;
		height: 20px;
		height: var(--status-bar-height);
		/* height: env(safe-area-inset-top); */
		background: #ccc;
		z-index: 999;
	}
	.fixed-height {
		height: 81upx;
	}
	.img_width {
		width: 199.4upx;
		height: 62.3upx;
	}
	.xiaoxi-icon {
		position: relative;
		display: flex;
		align-items: center;
	}
	.icon_size.iconfont {
		font-size: 40upx;
		/* #ifdef APP-PLUS || MP-WEIXIN */
		font-size: 50upx;
		/* #endif */
	}
	.item-abso {
		position: absolute;
		top: -12upx;
		right: -10upx;
	}
	.tab-nav-wrap {
		background-color: #fff;
		height: 80upx;
	}
	
	.img-banner {
		width: 100%;
		height: 200upx;
	}
	.input-view {
		margin: 0 20upx 0 0;
		display: flex;
		align-items: center;
		flex-direction: row;
		background-color: #e7e7e7;
		border-radius: 30upx;
		padding: 0 20upx;
		flex: 1;
		border: 1upx solid #ccc;
		background: #fff;
		position: relative;
		font-size: 24upx;
		font-weight: normal;
	}
	/* #ifndef H5 */
	.input_icon {
		height: 46upx;
	}
	/* #endif */
	.input {
		flex: 1;
		padding: 0 10upx;
		height: 48upx;
		line-height: 48upx;
		font-size: 28upx;
	}
	.input-btn {
		position: absolute;
		/* #ifdef H5 */
		top: -3upx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		top: -1.5upx;
		/* #endif */
		right: -5upx;
		width: 100upx;
		height: 62.5upx;
		line-height: 62.5upx;
		text-align: center;
		background: #f1224b;
		border-radius: 30upx;
		color: #fff;
		font-size: 28upx;
	}
	.huodong {
		padding: 30upx 20upx;
	}
	.huodong-item {
		display: block;
		width: 120upx;
		height: 120upx;
		border: 1upx solid #ccc;
		border-radius: 50%;
	}
	.huodong-item image {
		width: 120upx;
		height: 120upx;
	}
	
	.subject {
		padding: 0 20upx;
	}
	.subject-tit,
	.brand-tit,
	.project-tit {
		height: 90upx;
		font-weight: 800;
		border-bottom: 2upx solid #e5e5e5;
	}
	.subject-tit .tit-zhuangti {
		display: flex;
		line-height: 90upx;
		font-size: 34upx;
	}
	.bg-wrap {
		position: relative;
		padding: 25upx;
	}
	.subject-bg-img {
		width: 144upx;
		height: 50upx;
	}
	.subject-tit .tit-bg {
		position: absolute;
		top: 24upx;
		/* #ifdef APP-PLUS */
		top: 28upx;
		/* #endif */
		left: 64upx;
		color: #fff;
	}
	.subject-content {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 20upx 0;
	}
	.subject-flex {
		width: 49%;
		height: 160upx;
	}
	.subject-flex > view {
		height: 100%;
	}
	.subject-flex:nth-child(n+3) {
		margin-top: 14upx;
	}
	.subject-image {
		width: 100%;
		height: 160upx;
	}
	.brand-tit,
	.project-tit,
	.guess-tit {
		position: relative;
	}
	.tit-img {
		width: 100%;
		height: 90upx;
	}
	.tit-text {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		line-height: 90upx;
		font-size: 34upx;
		text-align: center;
	}
	.brand-content {
		display: flex;
		flex-wrap: wrap;
		padding: 20upx;
	}
	.brand-flex {
		box-sizing: border-box;
		width: 20%;
		height: 70upx;
	}
	/* .brand-flex > view, */
	.brand-img {
		width: 94%;
		height: 58upx;
		border: 2upx solid #e0e0e0;
	}
	
	.activity {
		padding: 20upx 0;
		background: #efeff4;
	}
	.activity-tab {
		height: 176upx;
	}
	.activity-view {
		display: inline-block;
		padding: 0 10upx;
	}
	.activity-view:first-child {
		padding-left: 20upx;
	}
	.activity-view:last-child {
		padding-right: 20upx;
	}
	.activity-img {
		width: 580upx;
		height: 176upx;
		border-radius: 20upx;
	}
	.project-content {
		height: 590upx;
	}
	.project-content .project-top,
	.project-content .project-product {
		display: flex;
	}
	.project-content .project-top {
		height: 270upx;
	}
	.top-flex2 {
		flex: 2;
	}
	.top-flex1 {
		flex: 1;
	}
	.navigator-hover {
		background: none;
	}
	.top-img {
		width: 100%;
		height: 270upx;
	}
	.product-img {
		width: 146upx;
		height: 146upx;
	}
	.product-tit,
	.guess-product-tit {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.product-price,
	.guess-price {
		color: red;
	}
	.guess-product {
		display: flex;
		flex-wrap: wrap;
		padding: 1%;
		background: #efeff4;
	}
	.guess-flex {
		box-sizing: border-box;
		padding: 20upx;
		width: 49.5%;
		height: 492upx;
		background: #fff;
	}
	.guess-flex:nth-child(2n + 1) {
		margin-right: .5%;
	}
	.guess-flex:nth-child(2n) {
		margin-left: .5%;
	}
	.guess-flex:nth-child(n-2) {
		margin-bottom: 1%;
	}
	.guess-img {
		width: 100%;
		height: 300upx;
	}
	.guess-product-tit {
		margin: 10upx 0;
		line-height: 1.4;
	}
	.guess-type {
		margin-left: 10upx;
		padding: 0 2upx;
		border-radius: 6upx;
		background: #999;
		color: #fff;
		font-size: 24upx;
		line-height: 1.2;
	}
	
	.bg-efeff4 {
		background: #efeff4;
		height: 20upx;
	}
	
	.bot-dixian {
		display: flex;
		justify-content: center;
		/* #ifdef H5 */
			margin-bottom: 110upx;
		/* #endif */
		/* #ifdef APP-PLUS || MP-WEIXIN */
			margin-bottom: 20upx;
		/* #endif */
	}
	.bot-flex {
		margin: 0 40upx;
		width: 160upx;
		height: 40upx;
		border-bottom: 2upx solid #b5b5b5;
	}
	.bot-cen {
		padding-top: 16upx;
	}
	.carousel-height {
		/* margin-top: 100upx; */
		height: 380upx;
	}
</style>
