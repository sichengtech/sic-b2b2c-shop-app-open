<template>
	<!-- englishIndex -->
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
				<uni-icons type="search" size="22" color="#666666"></uni-icons>
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
		
		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>

		<!-- 活动快捷方式 -->
		<view class="huodong flex-content">
			<view class="huodong-item" v-for="(item, index) in categoryList" :key="index">
				<view @tap="toCategoryView(item)">
					<image :src="item.bak1" />
					<view class="huodong-text">{{ item.name }}</view>
				</view>
			</view>
		</view>
		
		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>
		
		<!-- 推荐位-1 -->
		<view class="project-wrap" v-if="projectProductList1.name">
			<view class="project-tit">
				<view class="tit-text">{{ projectProductList1.name }}</view>
			</view>
			<view class="project-content">
				<view class="project-top">
					<block>
						<view v-for="(item, index) in projectProductList1.siteRecommendItemList" :class="index < 1 ? 'top-flex2' : 'top-flex1'"  v-if="index < 3" :key="index">
							<view @tap="toView(item)" v-if="index === 0">
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-group">
									<view class="project-left">
										<view class="project-logo">
											<!-- <image :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" /> -->
										</view>
										<view class="project-unit">{{ item.addInfo2 }}</view>
									</view>
									<view class="project-right">
										<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
									</view>
								</view>
							</view>
							<view v-else @tap="toView(item)" class="project-two">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-unit">{{ item.addInfo2 }}</view>
							</view>
						</view>
					</block>
				</view>
				<view class="project-product">
					<block>
						<view v-for="(item, index) in projectProductList1.siteRecommendItemList" class="top-flex" v-if="index > 2" :key="index">
							<view @tap="toView(item)" class="project-two">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-unit">{{ item.addInfo2 }}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>

		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>
		
		<!-- 推荐位-2 -->
		<view class="project-wrap" v-if="projectProductList2.name">
			<view class="project-tit">
				<view class="tit-text">{{ projectProductList2.name }}</view>
			</view>
			<view class="project-content">
				<view class="project-top">
					<block>
						<view v-for="(item, index) in projectProductList2.siteRecommendItemList" :class="index < 1 ? 'top-flex2' : 'top-flex1'"  v-if="index < 3" :key="index">
							<view @tap="toView(item)" v-if="index === 0">
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-group">
									<view class="project-left">
										<view class="project-logo">
											<!-- <image :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" /> -->
										</view>
										<view class="project-unit">{{ item.addInfo2 }}</view>
									</view>
									<view class="project-right">
										<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
									</view>
								</view>
							</view>
							<view v-else @tap="toView(item)" class="project-two">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-unit">{{ item.addInfo2 }}</view>
							</view>
						</view>
					</block>
				</view>
				<view class="project-product">
					<block>
						<view v-for="(item, index) in projectProductList2.siteRecommendItemList" class="top-flex" v-if="index > 2" :key="index">
							<view @tap="toView(item)" class="project-two">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-unit">{{ item.addInfo2 }}</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>

		<!-- 灰色间隙 -->
		<view class="bg-efeff4"></view>
		
		<!-- 推荐位-3 -->
		<view class="project-wrap" v-if="projectProductList3.name">
			<view class="project-tit">
				<view class="tit-text">{{ projectProductList3.name }}</view>
			</view>
			<view class="project-content">
				<view class="project-top">
					<block>
						<view v-for="(item, index) in projectProductList3.siteRecommendItemList" :class="index < 1 ? 'top-flex2' : 'top-flex1'"  v-if="index < 3" :key="index">
							<view @tap="toView(item)" v-if="index === 0">
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-group">
									<view class="project-left">
										<view class="project-logo">
											<!-- <image :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" /> -->
										</view>
										<view class="project-unit">{{ item.addInfo2 }}</view>
									</view>
									<view class="project-right">
										<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
									</view>
								</view>
							</view>
							<view v-else @tap="toView(item)" class="project-two">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-unit">{{ item.addInfo2 }}</view>
							</view>
						</view>
					</block>
				</view>
				<view class="project-product">
					<block>
						<view v-for="(item, index) in projectProductList3.siteRecommendItemList" class="top-flex" v-if="index > 2" :key="index">
							<view @tap="toView(item)" class="project-two">
								<image class="top-img" :src="url + item.path  + (index === 0 ? imgShrink(282, 202) : imgShrink(141, 202))" mode="" />
								<view class="project-title">
									{{ item.addInfo1 }}
								</view>
								<view class="project-unit">{{ item.addInfo2 }}</view>
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
				<!-- <image class="tit-img" src="../../../static/img/title_02.png" mode="" /> -->
				<view class="tit-text">recommendations for you</view>
			</view>
			<view class="guess-content">
				<view class="guess-product">
					<block v-if="productList.length">
						<view v-for="(item, index) in productList" class="guess-flex" :key="index">
							<navigator :url="prefix.uProductDetail + '?pid=' + item.pid" class="guess-group">
								<image class="guess-img" :src="item.image" @error="imgErr(index)" />
								<text class="guess-product-tit">
									{{ item.name }}
								</text>
								<view class="guess-pmo">
									<text class="guess-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 === item.maxPrice2 ? item.minPrice2 : item.minPrice2 + ' ~ ' + $t('¥') + item.maxPrice2 : item.minPrice1 }}</text>
									<text class="guess-unit">/ {{ item.unit }}</text>
								</view>
								<view class="min-order">1 Piece (Min. Order)</view>
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
				categoryList: [],
				carousel: [],
				projectProductList1: [],
				projectProductList2: [],
				projectProductList3: [],
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
							if(datum.productList[i].type!='2' && datum.productList[i].storeAlbumPictureList2){
								datum.productList[i].image = that.prefix.baseImgUrl + datum.productList[i].storeAlbumPictureList2[0].path + this.imgShrink(160, 160)
							} else {
								datum.productList[i].image = that.prefix.baseImgUrl + n.image + this.imgShrink(160, 160)
							}

						}
					})
					callBack ? callBack(datum.productList) : that.productList = datum.productList
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			init() {
				let that = this
				let arr = ['首页', '分类', '购物车', '个人中心']
				arr.forEach((n, i) => {
					uni.setTabBarItem({
						index: i,
						text: that.$t(n),
						//iconPath: '/path/to/iconPath',
						//selectedIconPath: '/path/to/selectedIconPath'
					})
				})
				// 轮播
				this.$api.siteCarouselPictureList({type: 11}).then(res => {
					that.carousel = res.data.map(item => {
						item.path = item.path + this.imgShrink(562, 345)
						return item
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})

				// 分类
				this.$api.productCategoryList().then(res => {
					this.categoryList = res.data.map(item => {
						if(item.bak1) {
							item.bak1 = this.url + item.bak1 + this.imgShrink(100, 100)
						}
						return item
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})

				// 推荐位-1
				this.$api.siteRecommendOne({number: 'index_chemical_products'}).then(res => {
					that.projectProductList1 = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 推荐位-2
				this.$api.siteRecommendOne({number: 'index_consumer_electronics'}).then(res => {
					that.projectProductList2 = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 推荐位-3
				this.$api.siteRecommendOne({number: 'index_mechanical_equipment'}).then(res => {
					that.projectProductList3 = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})

				this.getProdunctList()
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
			toCategoryView(item) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uProductList + '?cid=' + item.categoryId
				})
			},
			imgErr(index) {
				this.productList[index].image = this.prefix.noProductImg
			},
			swipetTab(item) {
				if(item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
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

<style scoped>
* {
	font-family: Arial;
	font: inherit;
	line-height: 1.38;
}
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
		flex-wrap: wrap;
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
		padding: 10upx 20upx 30upx;
		min-height: 432upx;
	}
	.huodong-item {
		display: block;
		width: 120upx;
		padding: 20upx 10upx 0;
	}
	.huodong-item image {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		overflow: hidden;
		border: 1upx solid #ccc;
	}
	.huodong-item .huodong-text {
		text-align: center;
		font-size: 20upx;
		max-height: 66upx;
		overflow: hidden;
		/* text-overflow: ellipsis; */
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.project-tit {
		height: 90upx;
		font-weight: 800;
		border-bottom: 2upx solid #e5e5e5;
	}
	.bg-wrap {
		position: relative;
		padding: 25upx;
	}

	.project-tit,
	.guess-tit {
		position: relative;
		height: 90upx;
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
		text-transform: uppercase;
	}

	.project-content {
		height: 520upx;
	}
	.project-content .project-top,
	.project-content .project-product {
		display: flex;
		height: 260upx;
	}
	.top-flex2 {
		flex: 2;
		padding: 0 20upx;
		border-right: 2upx solid #f1f1f1f1;
		border-bottom: 2upx solid #f1f1f1f1;
		overflow: hidden;
	}
	.top-flex1 {
		padding: 10upx 10upx 0;
		flex: 1;
		border-right: 2upx solid #f1f1f1f1;
		border-bottom: 2upx solid #f1f1f1f1;
		overflow: hidden;
	}
	.top-flex1:last-child {
		border-right: none;
	}
	.project-title {
		line-height: 40upx;
		font-size: 18upx;
		color: #757575;
		height: 110upx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}
	.project-group {
		display: flex;
		justify-content: space-between;
		margin-top: 10upx;
	}
	.project-left {
		overflow: hidden;
	}
	.project-logo {
		margin-top: 10upx;
		width: 90upx;
		height: 44upx;
	}
	.project-left .project-unit {
		margin-top: 40upx;
		font-size: 30upx;
	}
	.project-unit {
		color: #db0036;
		font-size: 20upx;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	    white-space: nowrap;
	}
	.project-right {
		width: 120upx;
		height: 120upx;
		overflow: hidden;
		flex-shrink: 0;
	}
	.project-two {
		text-align: center;
	}
	.project-two .top-img {
		width: 136upx;
		height: 136upx;
	}
	.project-two .project-title {
		-webkit-line-clamp: 2;
		height: 56upx;
		line-height: 28upx;
		margin: 0 0 10upx 0;
	}

	.top-flex {
		padding: 10upx 10upx 0;
		overflow: hidden;
		flex: 1;
	}
	.project-product .top-flex {
		border-right: 2upx solid #f1f1f1f1;
		border-bottom: 2upx solid #f1f1f1f1;
	}
	.project-product .top-flex:last-child {
		border-right: none;
	}
	
	.guess-product-tit {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		text-align: left;
		margin: 10upx 0;
		line-height: 1.4;
		color: #666;
		font-size: 24upx;
		min-height: 96upx;
	}
	.guess-pmo {
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
	    white-space: nowrap;
		font-size: 24upx;
	}
	.guess-price {
		color: #db0036;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
	    white-space: nowrap;
		font-weight: bold;
	}
	.guess-unit {
		margin-left: 4upx;
		color: #666;
	}
	.min-order {
		font-size: 20upx;
		line-height: 36upx;
		height: 36upx;
		overflow: hidden;
		text-align: left;
		color: #666;
	}
	.guess-product {
		display: flex;
		flex-wrap: wrap;
		padding: 10upx;
		background: #efeff4;
	}
	.guess-flex {
		box-sizing: border-box;
		padding: 20upx;
		min-width: 48%;
		height: 550upx;
		background: #fff;
		flex: 1;
		flex-wrap: wrap;
		margin-bottom: 10upx;
	}
	.guess-flex:nth-child(2n) {
		margin-left: 10upx;
	}
	.guess-group {
		text-align: center;
	}
	.guess-img {
		width: 320upx;
		height: 320upx;
	}
	
	.bg-efeff4 {
		background: #f0f0f0;
		height: 10upx;
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
		height: 310upx;
	}
</style>
