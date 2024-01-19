<template>
	<view style="overflow: hidden;">
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view" @tap="serach">
				<uni-icons type="search" size="22" color="#666666"></uni-icons>
				<input confirm-type="search" @confirm="confirm" class="input" type="text" :placeholder="$t('输入搜索关键词')" />
			</view>
		</uni-nav-bar>
		<!-- <nav-bar :back="false">
			<view slot="left">
				<view class="input-view">
					<uni-icons type="search" size="22" color="#666666"></uni-icons>
					<input confirm-type="search" @confirm="confirm" class="input" type="text" placeholder="输入搜索关键词" />
				</view>
			</view>
			<uni-icons slot="right" type="home" size="22" color="#666666"></uni-icons>
		</nav-bar> -->
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="container">
			<view class="page-body">
				<scroll-view class="nav-left" scroll-y :style="'height:' + height +'px'">
					<view class="nav-left-item" @click="categoryClickMain(item,index)" :key="index" :class="index==categoryActive?'active':''"
					    v-for="(item,index) in categoryList">
						<view>{{item.name}}</view>
					</view>
				</scroll-view>
				<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
					<!-- 热销品牌 -->
					<view class="" v-if="hotProductList.length">
						<view class="nav-top">{{ $t('热销品牌') }}</view>
						<view class="nav-hot">
							<view class="hot-item"
								:class="{'hot-item-l': index!=0 && index != 4, 'hot-item-b': index < 4}"							
								v-for="(item, index) in hotProductList"
								:key="index"
							>
								<view @tap="toView(item)">
									<view class="hot-img">
										<!-- <lazy-img :realSrc="(url + item.path)"></lazy-img> -->
										<image :src="url + item.path" />
									</view>
								</view>
							</view>
						</view>
					</view>
					<block v-if="subCategoryList.length">
						<view v-for="(item, index) in subCategoryList[categoryActive]" :key="index">
							<view class="nav-top">{{ item.name }}</view>
							<view class="nav-content">
								<block v-if="categoryActive === 0">
									<view :id="index===0?'first':''" class="nav-right-item" v-for="(project, i) in item.childrenList" :key="i">
										<view @tap="toView(project)">
											<image v-if="project.path" :src="url + project.path + imgShrink(75, 75)" />
											<view v-else class="no_img"></view>
											<view class="category-name">{{project.addInfo1}}</view>
										</view>
									</view>
								</block>
								<block v-if="categoryActive > 0">
									<view :id="i === 0 ? 'first' : ''" class="nav-right-item" v-for="(project, i) in item.childrenList" :key="i">
										<view @tap="toView(project)">
											<!-- 分类图片 -->
											<image v-if="project.bak1" :src="url + project.bak1 + imgShrink(75, 75)" />
											<!-- 无分类图片时显示的默认图片 -->
											<view v-else class="no_img" ></view>
											<!-- 分类的名称 -->
											<view class="category-name">{{ project.name }}</view>
										</view>
									</view>
								</block>
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations } from "vuex"
import store from '../../../store/index'
	export default {
		data() {
			return {
				ajaxParams: ['rx', 'gcjx', 'jdcp', '3csm', 'afjk', 'qcqp'],
				url: this.prefix.baseImgUrl,
				prefix: this.prefix,
				hotProductList: [{path: ''},{path: ''},{path: ''},{path: ''},{path: ''},{path: ''},{path: ''},{path: ''}],
				categoryList: [
					{
						categoryId: 0,
						firstLetter: "RX",
						id: 0,
						level: 1,
						name: this.$t('热销'),
						parentId: 0,
						parentIds: "0,",
						siteRecommends: ["weixin_categoryIndex_rx_brand", "weixin_categoryIndex_rx_category1", "weixin_categoryIndex_rx_category2"],
						sort: 50
					}
				],
				subCategoryList: store.state.childCategoryList,
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollHeight: 0,
			}
		},
		mounted() {
			this.init()
		},
		watch: {
			['$store.state.childCategoryList']() {
				this.subCategoryList = store.state.childCategoryList
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			this.height = uni.getSystemInfoSync().windowHeight - 66
			// #endif

			// #ifdef MP-WEIXIN
			this.height = uni.getSystemInfoSync().windowHeight - 40
			// #endif
			
			// #ifdef H5
			this.height = uni.getSystemInfoSync().windowHeight - 40
			// #endif
		},
		methods: {
			...mapMutations(['updateChildCategoryList']),
			back() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uIndex
				})
			},
			serach() {
				let that = this
				uni.navigateTo({
					url: that.prefix.uSearch
				})
			},
			backIndex() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uIndex
				})
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(categroy, index) {
				this.categoryActive = index;
				this.scrollTop = -this.scrollHeight * index;
				// this.productRxCategoryDetail()
				this.getProductCategory()
			},
			init() {
				this.$api.productCategoryList().then(res => {
					this.categoryList = this.categoryList.concat(res.data)
					this.productRxCategoryDetail()
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
				if(item.categoryId) {
					uni.navigateTo({
						url: that.prefix.uProductList + '?cid=' + item.categoryId
					})
				}
			},
			//热销品牌、热销分类、其他分类
			productRxCategoryDetail() {
				let _this = this
				// 热销品牌
				this.$api.siteRecommendOne({ number: _this.categoryList[_this.categoryActive].siteRecommends[0] }).then(res => {
					if(res.data) {
						_this.hotProductList = res.data.siteRecommendItemList
					} else {
						_this.hotProductList = []
					}
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				if(_this.categoryActive === 0) {
					// 热销分类
					this.$api.siteRecommendOne({number: `weixin_categoryIndex_rx_category1`}).then(res => {
						if(res.data) {
							_this.subCategoryList[_this.categoryActive][0].childrenList = res.data.siteRecommendItemList
						}
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
					// 其他分类
					this.$api.siteRecommendOne({number: `weixin_categoryIndex_rx_category2`}).then(res => {
						if(res.data) {
							_this.subCategoryList[_this.categoryActive][1].childrenList = res.data.siteRecommendItemList
						}
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
					return
				}
				_this.getProductCategory()
			},
			async getProductCategory() {
				if(this.subCategoryList[this.categoryActive]) return
				let response = await this.$api.productCategoryList({ parentId: this.categoryList[this.categoryActive].categoryId })
				let data = response.data
				let arr = []
				data.forEach((item, index) => {
					arr.push(this.$api.productCategoryList({ parentId: item.categoryId }))
				})
				Promise.all(arr).then(childList => {
					data.forEach((item, index) => {
						item.childrenList = childList[index].data
					})
					let subList = this.subCategoryList
					if(subList.length < this.categoryActive) {
						let list = subList
						for(let i = list.length; i < this.categoryActive; i++) {
							list.push(0)
						}
					}
					subList[this.categoryActive] = data
					this.updateChildCategoryList(JSON.stringify(subList))
				})
			},
		}
	}
</script>

<style lang="scss">
	.title {
		font-size: 30upx;
		line-height: 40upx;
		color: #333333;
		padding: 60upx;
	}
	
	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 56upx;
		margin-left:16upx;
	}
	.input-view {
		width: 92%;
		display: flex;
		background-color: #e7e7e7;
		height: 60upx;
		border-radius: 30upx;
		padding: 0 4%;
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx;
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
		font-weight: normal;
	}
	.page-body {
		display: flex;
	}
	
	.nav {
		display: flex;
		width: 100%;
	}
	.nav-left {
		width: 20%;
		border-right: solid 2upx #E0E0E0;
	}
	.nav-left-item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 54upx;
		border-bottom: solid 2upx #E0E0E0;
		text-align: center;
		padding: 20upx 0;
	}
	.nav-left-item view {
		font-size: 24upx;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.nav-right {
		padding: 0 20upx;
		// margin-bottom: 94upx;
		width: 80%;
		background: #f5f5f5;
	}
	.nav-right-item {
		width: 29%;
		height: 220upx;
		text-align: center;
		padding: 11upx;
		font-size: 28upx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.nav-content {
		display: flex;
		flex-wrap: wrap;
		background: #fff;
	}
	.nav-right-item image {
		width: 110upx;
		height: 110upx;
		border-radius: 10%;
		border: #f7f7fa solid 1px;
	}
	.nav-right-item .no_img {
		width: 110upx;
		height: 110upx;
		border-radius: 10%;
		border: #f7f7fa solid 1px;
		background-image: url(../../../static/img/default_goods.png); 
		background-size: contain;
		margin: 0 auto;
	}
	.active {
		color: #f1224b;
	}
	.nav-top {
		padding: 20upx 0;
		background: #f5f5f5;
	}
	.nav-hot {
		display: flex;
		flex-wrap: wrap;
		// padding: 0 10upx;
		.hot-item {
			height: 90upx;
			.hot-img {
				width: 138upx;
				height: 90upx;
			}
		}
		.hot-item-l {
			border-left: 2upx solid #ccc;
		}
		.hot-item-b {
			border-bottom: 2upx solid #ccc;
		}
	}
	.category-name {
		margin-top: 6upx;
		line-height: 32upx;
		color: #343434;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		word-break: break-word;
	}
</style>
