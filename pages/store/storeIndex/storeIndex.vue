<template>
	<view>
		<view class="view-head">
			<image class="bg-img" :src="prefix.baseUrl + '/wap/views/wap/default/images/store_header_bg.jpg'" mode="" />
			<!-- 头部 -->
			<view class="header">
				<view class="header-item" @tap="back">
					<uni-icons type="back" color="#fff" size="22"></uni-icons>
				</view>
				<view class="header-item input-view">
					<uni-icons type="search" size="20" color="#666666"></uni-icons>
					<input confirm-type="search" class="input" type="text" v-model="k" :placeholder="$t('搜本店')" />
					<text class="view-text" @tap="search">{{ $t('搜索') }}</text>
				</view>
				<view class="header-item" @tap="backIndex">
					<view class="home"></view>
				</view>
			</view>
			<view class="head-shop">
				<view class="shop-item">
					<view class="shop-inner" v-if="storeLogo && prefix.baseImgUrl">
						<image class="shop-img" :src="prefix.baseImgUrl + storeLogo + imgShrink(97, 48)" mode="" />
					</view>
					<view class="shop-msg">
						<view class="shop-name">{{ storeName }}</view>
						<!-- <view class="shop-type">{{ $t('旗舰店') }}</view> -->
						<text class="store_type" v-if="!prefix.englishShop && (storeType == 2 || storeType == 3)">{{ storeType === '2' ? '旗舰店' : '自营' }}</text>
					</view>
				</view>
				<view class="shop-item" @tap="collectStore">
					<view class="shop-collect" :class="collectionStoreId ? 'active' : '' ">
						<!-- <fine-icon :type="collectionStoreId ? 'shoucang1' : 'shoucang'" /> -->
						<text>{{ collectionStoreId ? $t('已收藏') : $t('收藏') }}</text>
					</view>
					<!-- <view class="shop-collect-num">({{ collectionStoreCount + '人' }})</view> -->
				</view>
			</view>
		</view>
		
		<view class="nav">
			<view class="nav-item"
				v-for="(item, index) in tabList"
				:class="{'active': index == tabActive }"
				@tap="tabEvent(index)"
				:key="index"
			>
				<fine-icon type="wxbzhuye" size="10" v-if="index == 0" />
				<text class="nav-num" v-if="index > 0">{{ item.num }}</text>
				<view class="">{{ $t(`${ item.text }`) }}</view>
			</view>
		</view>
		
		<view :style="{height: toHeight}"></view>
		<view class="view" v-if="tabActive === 0">
			<!-- 轮播图 -->
			<view class="height300">
				<swiper-carousel height="300" v-if="carousel.length > 0" :imgList="carousel"></swiper-carousel>
			</view>
		
			<view class="guess-wrap guess-bor" v-if="hotProductList">
				<view class="guess-tit">
					<view class="tit-text">{{ $t('热卖商品') }}</view>
				</view>
				<view class="guess-content">
					<view class="guess-product">
						<view v-for="(item, index) in hotProductList.productList" class="guess-flex" :key="index" @tap="tapTab(item)">
							<image class="guess-img" :src="prefix.baseImgUrl + item.image + imgShrink(243, 225)" mode="" />
							<text class="guess-product-tit">
								{{ item.name }}
							</text>
							<text class="guess-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 : item.minPrice1 }}</text>
							<text class="guess-type" v-if="!prefix.englishShop">{{ item.type == 2 ? $t('批') : $t('零') }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="guess-wrap" v-if="recommendList">
				<view class="guess-tit">
					<view class="tit-text">{{ $t('推荐产品') }}</view>
				</view>
				<view class="guess-content">
					<view class="guess-product">
						<view v-for="(item, index) in recommendList.productList" class="guess-flex" :key="index" @tap="tapTab(item)">
							<image class="guess-img" :src="prefix.baseImgUrl + item.image + imgShrink(243, 225)" mode="" />
							<text class="guess-product-tit">{{ item.name }}</text>
							<text class="guess-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 : item.minPrice1 }}</text>
							<text class="guess-type" v-if="!prefix.englishShop">{{ item.type == 2 ? $t('批') : $t('零') }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="guess-wrap" v-if="newsProductList">
				<view class="guess-tit">
					<view class="tit-text">{{ $t('新品上市') }}</view>
				</view>
				<view class="guess-content">
					<view class="guess-product">
						<view v-for="(item, index) in newsProductList.productList" class="guess-flex" :key="index" @tap="tapTab(item)">
							<image class="guess-img" :src="prefix.baseImgUrl + item.image + imgShrink(243, 225)" mode="" />
							<text class="guess-product-tit">{{ item.name }}</text>
							<text class="guess-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 : item.minPrice1 }}</text>
							<text class="guess-type" v-if="!prefix.englishShop">{{ item.type == 2 ? $t('批') : $t('零') }}</text>
						</view>
					</view>
				</view>
			</view>

			<!--店铺信息-->
			<view class="product-item store-msg bg-fff">
				<view class="store-img">
					<view class="store-img-view"><image v-if="storeLogo" class="view-img" :src="prefix.baseImgUrl + storeLogo" /></view>
				</view>
				<view class="store-name">
					<view class="name">{{ storeName }}</view>
					<view class="top-right">
						<fine-icon :type="i > storeStar ? 'shoucang' : 'shoucang1'" v-for="i in 5" :key="i" />
					</view>
				</view>
				<view class="store-appraise">
					<view class="appraise-item">
						<view class="item-num">
							<text class="item-num_text">{{ $t('描述') }}</text>
							<text class="item-num_num" :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.productScore }}</text>
							<text :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.productScoreUpOrDown === '1' ? '↑' : '↓' }}</text>
						</view>
						<view class="score">{{ collectionStoreCount }}</view>
						<view class="item-attention">{{ $t('关注人数') }}</view>
					</view>
					<view class="appraise-item">
						<view class="item-num">
							<text class="item-num_text">{{ $t('服务') }}</text>
							<text class="item-num_num" :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.serviceAttitudeScore }}</text>
							<text :class="storeData.serviceAttitudeScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.serviceAttitudeScoreUpOrDown === '1' ? '↑' : '↓' }}</text>
						</view>
						<view class="score">{{ productAllCount }}</view>
						<view class="item-attention">{{ $t('全部商品') }}</view>
					</view>
					<view class="appraise-item">
						<view class="item-num">
							<text class="item-num_text">{{ $t('物流') }}</text>
							<text class="item-num_num" :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.logisticsScore }}</text>
							<text :class="storeData.logisticsScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.logisticsScoreUpOrDown === '1' ? '↑' : '↓' }}</text>
						</view>
						<view class="score">{{ storeArticleCount }}</view>
						<view class="item-attention">{{ $t('店铺动态') }}</view>
					</view>
				</view>
				<view class="store-btn-flex">
					<view class="btn" @click="collectStore">
						<fine-icon :type="collectionStoreId ? 'shoucang1' : 'favorite1'" /><text>{{ collectionStoreId ? $t('已收藏') : $t('收藏') }}</text>
					</view>
				</view>
			</view>
			<!-- 商家信息 -->
			<view class="store_msg" v-if="Object.keys(storeData).length">
				<view class="store_item">
					<view class="store_label">{{ $t('店铺名称') }}</view>
					<view class="store_text">{{ storeData.name }}</view>
				</view>
				<view class="store_item">
					<view class="store_label">{{ $t('店铺地址') }}</view>
					<view class="store_text">{{ storeData.cityName + storeData.provinceName + storeData.districtName + storeData.detailedAddress }}</view>
				</view>
				<!-- <view class="store_item">
					<view class="store_label">店铺详细地址</view>
					<view class="store_text">{{ storeData.detailedAddress }}</view>
				</view> -->
				<view class="store_item">
					<view class="store_label">{{ $t('客服电话') }}</view>
					<view class="store_text store_tel" @tap="callTel(storeData.storeTel)">
						<view>{{ storeData.storeTel }}</view>
						<uni-icons class="" type="arrowright" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<view class="store_item">
					<view class="store_label">{{ $t('店铺QQ') }}</view>
					<view class="store_text">{{ storeData.storeQq }}</view>
				</view>
				<view class="store_item">
					<view class="store_label">{{ $t('店铺微信') }}</view>
					<view class="store_text">{{ storeData.storeWechat }}</view>
				</view>
				<view class="store_item">
					<view class="store_label">{{ $t('开店时间') }}</view>
					<view class="store_text">{{ storeData.createDate }}</view>
				</view>
			</view>
		</view>


		<view class="product-wrap view" v-if="tabActive === 1">
			<!-- 商品 -->
			<view class="product-content"
				v-if="productList.length"			
				v-for="(item, index) in productList"
				@tap="tapTab(item)"
				:key="index"				
			>
				<view class="product-left">
					<image class="left-img" :src="item.image" @error="imgErr(index)" />
				</view>
				<view class="product-right">
					<view class="right-tit">
						<rich-text :nodes="item.name"></rich-text>
					</view>
					<view class="right-store">{{ item.storeName }}</view>
					<view class="right-group">
						<text class="right-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 : item.minPrice1 }}</text>
						<text class="right-type" v-if="!prefix.englishShop">{{ item.type == 2 ? $t('批') : $t('零') }}</text>
						<text class="right-sales" v-if="item.allSales">{{ $t('总销量') }}{{ item.allSales && item.allSales}}</text>
					</view>
				</view>
			</view>
			<uni-load-more v-if="productList.length > 6" :loadingType="loadingType"></uni-load-more>
			<!-- <view class="uni-loadmore" v-if="showLoadMore && productList.length != 0">{{loadMsg}}</view> -->
			<view class="no-msg" v-if="productList.length == 0 && showLoadMore">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂无商品') }}</view>
			</view>
		</view>

		<!-- 分类 -->
		<view class="view" v-if="tabActive === 2">
			<block v-if="storeCategoryList.length">
				<view class="category_content"  v-for="(item, i) in storeCategoryList" @tap="gotoSubCategoryProduct(item)" :key="i">
					<view class="category_head">
						<view class="category_title">{{ item.name }}</view>
						<uni-icons class="" type="arrowright" size="18" color="#999"></uni-icons>
					</view>
					<view class="category_child">
						<block v-if="item.subsetStoreCategory && item.subsetStoreCategory.length">
							<view class="category_item" v-for="(child, j) in item.subsetStoreCategory" @tap="gotoSubCategoryProduct(child)" :key="j">{{ child.name }}</view>
						</block>
					</view>
				</view>
			</block>
			<view class="category_content" @tap="gotoSubCategoryProduct">
					<view class="category_head">
						<view class="category_title">{{ $t('其他分类') }}</view>
						<uni-icons class="" type="arrowright" size="18" color="#999"></uni-icons>
					</view>
			</view>
			<!-- <view class="category_child">
				<view class="category_item" @tap="gotoSubCategoryProduct">其他分类</view>
			</view> -->
			<!-- <view class="no-msg" v-if="!storeCategoryList.length">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">该店铺暂无分类~</view>
			</view> -->
		</view>
		
		<!-- 信息 -->
		<view class="shop-msg-wrap view" v-if="tabActive == 3">
			<block v-if="articleList.length">
				<view class="msg-item" v-for="(item, index) in articleList" @tap="geToStoreAD(item)" :key="index">
					<view class="msg-top">{{ item.title }}</view>
					<view class="msg-center">
						{{ item.content }}
					</view>
					<view class="msg-down">
						{{ $t('文字来源：本店_时间') }}{{ item.createDate }}
					</view>
				</view>
			</block>
			<view class="no-msg" v-else>
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('该店铺暂无消息') }}</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import swiperCarousel from '../../../components/swiper.vue'
	export default {
		data() {
			return {
				prefix: this.prefix,
				k: '', //搜索值
				sid: '', // 店铺id
				storeCategoryId: '', // 分类id
				storeName: '', // 店铺名称
				storeLogo: '', // 店铺logo
				carousel: [], // 店铺轮播
				collectionStoreCount: '', // 店铺收藏数
				storeArticleCount: '', // 全部商品数
				productAllCount: '', // 店铺动态数目
				productNewCount: '', // 店铺新品数量
				hotProductList: [], // 热卖商品
				recommendList: [], // 推荐商品
				newsProductList: [], //新品上市
				limit: 4, // 请求商品的个数
				articleList: [], // 店铺动态
				tabList: [
					{
						num: -1,
						text: '首页'
					}, {
						num: 0,
						text: '商品'
					}, {
						num: 0,
						text: '分类'
					}, {
						num: 0,
						text: '信息'
					}
				],
				collectionStoreId: '',
				tabActive: 0,
				pageNo: 1,
				pageSize: 10,
				storeData: {}, // 店铺信息
				productList: [], // 店铺商品列表
				// loadMsg: '加载中...',
				showLoadMore: false,
				loadingType: 1,
				productListPageNo: 1, // 商品分页
				storeCategoryList: [], // 商品分类
				storeType: 0
			}
		},
		components: {
			swiperCarousel
		},
		onLoad(param) {
			this.sid = param.storeId
		},
		onShow() {
			this.init()
		},
		// 上拉
		onReachBottom() {
			if (this.loadingType !== 0) {
				return false
			}
			this.loadingType = 1
			this.showLoadMore = true
			this.productListPageNo = this.productListPageNo + 1
			this.getproductList((data) => {
				this.productList = this.productList.concat(data)
			})
		},
		computed: {
			toHeight() {
				return uni.upx2px(368) + 'px'
			},
			storeStar() {
				let data = this.storeData
				return Math.round((+data.logisticsScore + +data.serviceAttitudeScore + +data.productScore) / 3)
			},
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
			
			tabEvent(index) {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
				// 商品列表为空 加载商品数据
				if(index === 1) {
					this.getproductList()
				} else {
					this.storeCategoryId = ''
					this.k = ''
				}

				// 分类
				if(index === 2) {
					this.getStoreCategory()
				}

				// 文章
				if(index === 3) {
					this.getArticle()
				}
				this.tabActive = index
			},
			// 获取店铺动态
			getArticle() {
				let that = this
				let param = {
					pageNo: that.pageNo,
					pageSize: that.pageSize,
					storeId: that.sid
				}
				this.$api.storeArticlePage(param).then(res => {
					that.articleList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			// 获取店铺分类
			getStoreCategory() {
				this.$api.storeCategoryList({storeId: this.sid}).then(res => {
					this.storeCategoryList = res.data
				})
			},
			init() {
				let that = this
				let param = {storeId: that.sid}
				this.$api.storeOneAll(param).then(res => {
					let data = res.data
					storeMsg.call(this, data.solrStore)
					storeTop.call(this, data.storeNavCount)
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 轮播
				this.$api.storeCarouseList(param).then(res => {
					let datum = res.data
					datum.forEach((n, i) => {
						datum[i].path = n.picturePath + this.imgShrink(560, 195)
					})
					that.carousel = datum
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				//店铺信息
				function storeMsg(datum) {
					this.storeName = datum.name
					this.storeLogo = datum.logo
					this.storeData = datum
					this.storeType = datum.storeType
				}
				// 店铺关注数量
				function storeTop(datum) {
					this.collectionStoreCount = datum.collectionStoreCount
					this.productAllCount = datum.productAllCount
					this.storeArticleCount = datum.storeArticleCount
					

					this.tabList[1].num = datum.productAllCount
					this.tabList[2].num = datum.StoreCategoryCount
					this.tabList[3].num = datum.storeArticleCount
				}
				// 热卖商品
				let hotProParam = {
					sid: that.sid,
					limit: that.limit,
					sort: 'allSales',
					sortModedesc: ''
				}
				this.$api.productList(hotProParam).then(res => {
					that.hotProductList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 推荐商品
				let recommendParam = {
					sid: that.sid,
					isRecommend: 1,
					limit: that.limit
				}
				this.$api.productList(recommendParam).then(res => {
					that.recommendList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				// 新品上市
				let newsParam = {
					sid: that.sid,
					limit: that.limit
				}
				this.$api.productList(newsParam).then(res => {
					that.newsProductList = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				if(that.$storage.isLogin()) {
					this.storeIsColl()
				}
			},
			getproductList(callBack) {
				let that = this,
					param = {
						sid: that.sid,
						k: this.k,
						scid: that.storeCategoryId,
						pageNo: this.productListPageNo,
						pageSize: 10,
					}
				// 商品列表
				this.$api.productPage(param).then(res => {
					let datum = res.data
					if(!datum || datum.productList.length === 0) {
						// that.loadMsg = '没有更多商品了...'
						that.showLoadMore = true
						this.loadingType = 2
						return false
					}
					setTimeout(() => {
						if(res.page.isLastPage) {
							this.loadingType = 2
						} else {
							this.loadingType = 0
						}
					}, 1000)
					datum.productList.forEach((n,i) => {
						if(n.image && n.image.indexOf('http') > -1) {
							datum.productList[i].image = n.image
						} else {
							datum.productList[i].image = that.prefix.baseImgUrl + n.image + this.imgShrink(150, 150)
						}
					})
					callBack ? callBack(datum.productList) : that.productList = datum.productList
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			storeIsColl() {
				// 是否收藏
				this.$api.userCollectionStoreIsCollection({ storeId: this.sid }).then(res => {
					this.collectionStoreId = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			collectStore() {
				let that = this
				if(!this.$storage.isLogin()) {
					uni.showToast({
						title: '暂未登录，请先登录',
						icon: 'none'
					})
					return false
				}
				if(!this.collectionStoreId) {
					this.$api.userCollectionStoreSave({storeId: this.sid}).then(res => {
						if(res.status !== '200') {
							this.errMsg = res.message ? res.message : '加载错误'
							return false
						}
						this.collectionStoreId = res.data.collectionStoreId
						uni.showToast({
							title: '收藏成功',
							duration: 1000,
							icon: 'none'
						})
						this.collectStoreNum()
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				} else {
					this.$api.userCollectionStoreCancel({collectionIds: this.collectionStoreId}).then(res => {
						if(res.status !== '200') {
							this.errMsg = res.message ? res.message : '加载错误'
							return false
						}
						this.collectionStoreId = ''
						uni.showToast({
							title: '取消收藏成功',
							duration: 1000,
							icon: 'none'
						})
						this.collectStoreNum()
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
			},
			gotoSubCategoryProduct(categoryData = {}) {
				this.productList = []
				this.productListPageNo = 1
				this.storeCategoryId = categoryData.storeCategoryId || -1
				this.tabEvent(1)
			},
			collectStoreNum() {
				this.$api.storeNavCount({storeId: this.sid}).then(res => {
					let datum = res.data
					this.collectionStoreCount = datum.collectionStoreCount
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			search() {
				this.productList = []
				this.productListPageNo = 1
				this.storeCategoryId = ''
				this.tabEvent(1)
			},
			geToStoreAD(data) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uStoreArticleDetail + '?data=' + JSON.stringify(data)
				})
			},
			tapTab(item) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uProductDetail + '?pid=' + item.pid
				})
			},
			callTel(tel) {
				uni.makePhoneCall({
					phoneNumber: tel //仅为示例
				});
			},
			imgErr(index, i) {
				this.productList[index].image = this.prefix.noProductImg
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		position: relative;
		top: 0;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
		left: 0;
		right: 0;
		display: flex;
		width: 100%;
		height: 88upx;
		// background-color: #f9f9f9;
		overflow: hidden;
		/* border-bottom: 1upx solid #ccc; */
		z-index: 20;
		// box-shadow: 0 2upx 12upx #ccc;
	}
	.header-item {
		line-height: 88upx;
		font-size: 32upx;
	}
	.header-item .iconfont {
		font-size: 40upx;
		color: #fff;
	}
	.header-item:first-child {
		width: 88upx;
		text-align: center;
	}
	.header-item:last-child {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 2;
		text-align: right;
		// padding-right: 30upx;
	}
	.header-item:nth-child(2) {
		flex: auto;
	}
	.item-abso {
		position: absolute;
		top: 0;
		right: 16upx;
	}
	.view-text {
		width: 120upx;
		font-size: 20upx;
		text-align: center;
	}
	.view-head {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 260upx;
		overflow: hidden;
		z-index: 9;
	}
	.bg-img {
		position: absolute;
		top: 0;
		width: 100%;
		height: 1432upx;
	}
	.input-view {
		width: 60%;
		display: flex;
		background-color: #e7e7e7;
		height: 60upx;
		border-radius: 30upx;
		padding: 0 4%;
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx;
		background: #fff;
		font-weight: normal;
	}
	.input-view .uni-icons{
		line-height:60upx !important;
	}
	.input-view .input {
		height:60upx;
		line-height:60upx;
		width:94%;
		padding: 0 3%;
		font-size: 24upx;
	}
	.head-shop {
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 0;
		width: 100%;
		z-index: 20;
		// .shop-item {
			
		// }
		.shop-item:first-child {
			display: flex;
			margin-left: 20upx;
			.shop-inner {
				height: 64upx;
				.shop-img {
					width: 130upx;
					height: 64upx;
				}
			}
			.shop-msg {
				margin-left: 10upx;
				.shop-name,
				.shop-type {
					line-height: 1;
					color: #fff;
				}
				.shop-name {
					font-size: 24upx;
					line-height: 1.3;
					font-weight: bold;
					width: 390upx;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
				.shop-type {
					padding: 6upx 0;
					width: 80upx;
					font-size: 20upx;
					background: #f1224b;
					text-align: center;
				}
			}
		}
		.shop-item:last-child {
			border-radius: 20upx 0 0 0;
			.shop-collect {
				color: #fff;
				font-size: 24upx;
				line-height: 1;
				background: #f1224b;
				border-radius: 40upx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 12upx 30upx;
				margin-bottom: 10upx;
				margin-right: 10upx;
				.iconfont {
					font-size: 20upx;
				}
				&.active {
					border: 1px solid #fff;
					background: none;
				}
			}
			.shop-collect-num {
				line-height: 1.4;
				font-size: 20upx;
				text-align: center;
				color: #fff;
			}
		}
	}
	.nav {
		position: fixed;
		top: 260upx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		border-bottom: 1upx solid #ddd;
		background-color: #fff;
		z-index: 9;
		.nav-item {
			box-sizing: border-box;
			padding: 0 20upx;
			text-align: center;
			.iconfont {
				line-height: 1;
			}
			.nav-num {
				font-size: 20upx;
			}
			border-bottom: 6upx solid transparent;
		}
		.nav-item.active {
			border-bottom: 6upx solid #f1224b;
			color: #f1224b;
		}
	}

	// .view {
	// 	margin-top: 368upx;
	// }
	
	.guess-bor {
		border-top: 20upx solid #f5f5f5;
	}
	.guess-product-tit {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
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
	}
	.tit-text {
		margin-left: 20upx;
		line-height: 90upx;
		font-size: 34upx;
		font-weight: bold;
	}
	.shop-type {
		padding: 0 4upx;
		background: #f1224b;
		color: #fff;
		font-size: 20upx;
	}
	
	.shop-msg-wrap {
		// border-top: 20upx solid #f5f5f5;
		.msg-item {
			padding: 20upx;
			border-top: 2upx solid #e5e5e5;
			.msg-top {
				font-size: 32upx;
			}
			.msg-center {
				font-size: 24upx;
				text-indent: 2em;
				color: #999;
			}
			.msg-down {
				font-size: 24upx;
				color: #bbb;
			}
		}
		.msg-item:first-child {
			border: none;
		}
	}
	.height300 {
		height: 260upx;
	}


	// 店铺信息
	.product-item {
		position: relative;
		margin-top: 16upx;
		color: #999;
	}
	.item-a {
		display: flex;
		padding: 20upx 0 20upx 20upx;
	}
	.item-flex {
		flex: 1;
	}
	.item-flex + .item-flex {
		flex: 1.2;
		text-align: center;
	}
	
	.sele-span {
		display: inline-block;
		padding-right: 20upx;
		margin-right: 10upx;
		border-right: 2upx solid #999;
		line-height: 40upx;
	}
	.sele-span .iconfont {
		margin-right: 4upx;
	}
	.sele-shop {
		color: #000000;
	}
	
	.border-b {
		border-bottom: 2upx solid #ccc;
	}
	.product-rest {
		padding: 20upx;
		font-size: 24upx;
	}
	.product-rest .rest-span {
		display: inline-block;
		margin-right: 10upx;
		color: #999;
	}
	.product-rest .iconfont {
		margin-right: 0upx;
		color: #2f8714;
		font-size: 24upx;
	}
	.mpb-none {
		border: none;
		padding: 0;
		margin: 0;
	}
	.store-img {
		padding-top: 40upx;
	}
	.store-img .store-img-view {
		text-align: center;
	}
	.store-img .store-img-view .view-img {
		width: 200upx;
		height: 100upx;
	}
	.store-name {
		text-align: center;
	}
	.store-name .name {
		margin: 0;
	}
	.store-appraise,
	.store-btn-flex {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		padding: 0 20upx;
	}
	.store-appraise .item-num,
	.store-appraise .score,
	.store-appraise .item-attention {
		text-align: center;
	}
	.appraise-item {
		width: 100%;
		border-right: 2upx solid #ccc;
	}
	.appraise-item:last-child {
		border: none;
	}
	.item-num {
		margin: 0;
		color: #333;
	}
	.item-num span {
		color: red;
		font-size: 28upx;
	}
	.item-num_text {
		margin-right: 6px;
	}
	.item-num .up {
		color: red;
	}
	.item-num .down {
		color: green;
	}
	.score {
		font-size: 32upx;
		margin-bottom: 10upx;
	}
	.store-btn-flex {
		margin: 40upx 0 0 0;
		padding: 0 20upx 40upx;
		border-bottom: 2upx solid #f3f3f3;
		justify-content: center;
	}
	.btn {
		padding: 10upx 0;
		width: 300upx;
		border: 2upx solid #ccc;
		text-align: center;
		border-radius: 10upx;
	}
	.btn .iconfont {
		margin-right: 6upx;
	}
	.btn:first-child  .iconfont{
		color: red;
	}
	.top-right .icon-shoucang1,
	.icon-color {
		color: #ec0030;
	}

	// 商家信息
	.store_msg {
		border-top: 20upx solid #f3f3f3;
		padding: 20upx;
		color: #343434;
	}
	.store_item {
		display: flex;
		padding: 8upx 0;
		position: relative;
	}
	.store_label {
		flex: 2;
		color: #666;
	}
	.store_text {
		flex: 4;
	}
	.store_tel {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}


	// 商品列表
	.product-wrap {
		/* margin-top: 80upx; */
		/* padding: 0 20upx; */
		background: #fff;
	}
	.product-content {
		display: flex;
		height: 220upx;
		padding: 20upx 0;
		margin: 0 20upx;
		border-bottom: 2upx solid #f3f3f3;
	}
	.product-content:last-child {
		border-bottom: none;
	}
	// .product-left {
	// 	width: 220upx;
	// }
	.product-right {
		flex: auto;
		padding-left: 20upx;
	}
	.left-img {
		width: 220upx;
		height: 220upx;
		border: 2upx solid #f3f3f3;
	}
	.right-tit {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		max-height: 68upx;
		font-size: 26upx;
		line-height: 1.36;
		color: #333;
	}
	.right-store {
		color: #949494;
		font-size: 24upx;
		transform: scale(.9)translate(-30upx, 0upx);
	}
	.right-group {
		display: flex;
		align-items: center;
		margin-top: 64upx;
	}
	.right-sales {
		display: inline-block;
		height: 28upx;
		color: #949494;
		font-size: 24upx;
		transform: scale(.8);
	}
	.right-price {
		color: #ec0030;
		font-size: 36upx;
	}
	.right-type {
		margin-left: 10upx;
		padding: 0 2upx;
		border-radius: 6upx;
		background: #999;
		color: #fff;
		font-size: 24upx;
		line-height: 1.2;
	}

	// 分类\
	.category_content {
		padding-top: 20upx;
		.category_head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 0 20upx;
			.category_title {
				font-size: 28upx;
				margin: 20upx 0;
				border-left: 6upx solid red;
				line-height: 1;
				padding: 4upx 8upx;
				font-weight: bold;
			}
		}
		
	}
	.category_child {
			margin: 0 20upx;
			justify-content: space-between;
			display: flex;
			flex-wrap: wrap;
			.category_item {
				width: 43%;
				background: #f3f3f3;
				margin: 10upx 0;
				padding: 12upx 20upx;
				border-radius: 10upx;
				color: #343434;
				&:nth-child(2n) {
					margin-left: 0;
				}
				&:nth-child(2n + 1) {
					margin-right: 0;
				}
			}
		}
	
</style>
