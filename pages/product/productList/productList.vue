<template>
	<view class="list-body" :style="{ overflow: isOverflow, height: rightDrawerVisible && '100%' }">
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view" @tap="serach">
				<uni-icons type="search" size="22" color="#666666"></uni-icons>
				<input confirm-type="search" :value="k" class="input" type="text" :placeholder="$t('输入搜索关键词')" />
			</view>
		</uni-nav-bar>
		
		<!-- 筛选条件 -->
		<view class="screen" :style="{top: barHeight('statusBarHeight') + 'px'}">
			<view class="screen-flex" v-for="(item, index) in sortWay" :key="index">
				<view class="">
					<view class="s_item" :class="{active: item.checked}"  @tap="actionSheetTap(index)">
						<text>{{ $t(`${ item.name }`) }}</text>
						<!-- <uni-icons :type="item.arrowup" color="red" size="12"></uni-icons> -->
						<view class="s_img">
							<image :style="{transform: 'rotate('+item.deg + 'deg)'}" src="../../../static/img/arrowup.png"></image>
						</view>
					</view>
					<view class="screen-list-a screen-list" :class="{'height-auto': item.showScreenList}">
						<view class="list-item" v-for="(pro, j) in item.pullDown" :key="j" @tap="sortTap(index, j)">
							{{ $t(`${ pro.name }`) }}<fine-icon :type=" pro.checked ? 'wancheng' : ''" />
						</view>
					</view>
				</view>
			</view>
			<view class="screen-flex" @tap="showRightDrawer">
				<text class="right-bor">|</text>
				<text>{{ $t('筛选') }}</text>
				<fine-icon type="filter" />
				
			</view>
		</view>
		<view :style="{ height: barHeight('statusBarHeight') + 35 + 'px' }"></view>
		<!-- 列表 -->
		<view class="product-wrap">
			<!-- <scroll-view class="nav-left" scroll-y :scroll-top="scrollTop" :style="'height:' + height +'px'" scroll-with-animation> -->
			<view class="product-content"
				v-if="productList.length"			
				v-for="(item, index) in productList"
				@tap="navTo(item.pid)"
				:key="index"				
			>
				<view class="product-left">
					<image class="left-img" :src="item.image" @error="imgErr(index)" />
				</view>
				<view class="product-right">
					<view class="right-tit">
						<rich-text :nodes="item.name"></rich-text>
					</view>
					<view class="right-store">
						<text class="store-name">{{ item.storeName }}</text>
						<text class="store_type" v-if="!prefix.englishShop && (item.storeType == 2 || item.storeType == 3)">{{ item.storeType === '2' ? '旗舰店' : '自营' }}</text>
					</view>
					
					<view class="right-group">
						<text class="right-price">{{ $t('¥') }}{{ item.type == 2 ? item.minPrice2 === item.maxPrice2 ? item.minPrice2 : item.minPrice2 + ' ~ ' + $t('¥') + item.maxPrice2 : item.minPrice1 }}</text>
						<text class="right-type" v-if="!prefix.englishShop">{{ item.type == 2 ? $t('批') : $t('零') }}</text>
						<text class="right-sales">{{ $t('总销量') }}{{ item.allSales ? item.allSales : 0 }}</text>
					</view>
				</view>
			</view>
			<uni-load-more v-if="productList.length > 6" :loadingType="loadingType"></uni-load-more>
			<view class="no-msg" v-if="productList.length == 0 && showLoadMore">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂无商品') }}</view>
			</view>
			<!-- </scroll-view> -->
		</view>
		
		<!-- 侧边菜单 -->
		<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeRightDrawer">
			<view class="drawer-wrap">
				<view class="drawer-top" @tap="closeRightDrawer">
					<fine-icon type="arrowright" />{{ $t('筛选') }}
				</view>
				<view class="">
					<view class="uni-form-item uni-column">
						<view class="title">{{ $t('价格区间') }}</view>
						<view class="drawer-flex">
							<input class="uni-input" type="number" :placeholder="$t('请输入数字')" v-model="minPrice" />
							<input class="uni-input" type="number" :placeholder="$t('请输入数字')" v-model="maxPrice"/>
						</view>
					</view>
					<view class="uni-form-item uni-column" v-if="brandList.length">
						<view class="title">{{ $t('品牌') }}</view>
						<view class="drawer-flex">
							<view class="button-default"
								v-for="(item, index) in brandList"
								:key="index"
								@tap="brandTap(index)"
								:class="item.checked ? 'active' : ''"
							>
								{{ item.name }}
							</view>
						</view>
					</view>
					<view class="uni-form-item uni-column"
						v-if="categoryList.length"
					>
						<view class="title">{{ $t('分类') }}</view>
						<view class="drawer-flex">
							<view class="button-default"
								:class="item.checked ? 'active' : ''"
								v-for="(item, index) in categoryList"
								@tap="categoryTap(index)"
								:key="index"
							>
								{{ item.name }}
							</view>
						</view>
					</view>
					<view class="uni-form-item uni-column" v-if="paramValueMap.length">
						<block v-for="(item, key) in paramValueMap" :key="key">
							<view class="title" v-if="item">{{ key }}</view>
							<view class="drawer-flex" v-if="item">
								<view class="button-default"
									:class="flex.checked ? 'active' : ''"
									v-for="(flex, j) in item" @tap="paramTap(key, item, j)"
									:key="j"
								>
									{{ flex.name }}
								</view>
							</view>
						</block>
					</view>
					
				</view>
			</view>
			<block slot="bottom">
				<view class="drawer-bot">
					<view class="" @tap="reset">{{ $t('重置') }}</view>
					<view class="" @tap="query">{{ $t('完成') }}</view>
				</view>
			</block>
		</uni-drawer>
		
		<!-- 遮罩 -->
		<view class="shade" v-show="showShade" @tap="hide"></view>
	</view>
</template>

<script>
	import uniDrawer from '../../../components/uni-drawer.vue'

	export default {
		data() {
			return {
				showLoadMore: false,
				pageNo: 1,
				pageSize: 10,
				sort: '',
				sortMode: '',
				sid: '', // 店铺id
				productList: [], // 商品列表
				brandList: [], // 筛选品牌
				categoryList: [], // 筛选分类列表
				paramValueMap: [], // 筛选参数
				rightDrawerVisible: false, // 侧边菜单
				showShade: false, // 遮罩
				cid: '', // 筛选分类id
				bid: [], // 筛选品牌id
				attr: {}, // 筛选参数
				minPrice: '' ,// 筛选价格区间
				maxPrice: '',// 筛选价格区间
				pPrice: '', // ajax参数
				pAttr: '', // ajax参数
				k: '',
				loadingType: 1,
				sortWay: [
					{
						name: '综合',
						showScreenList: false,
						arrowup: 'arrowup',
						deg: 0,
						checked: true,
						pullDown: [
							{
								name: '默认',
								checked: false,
								sort: '',
								sortMode: ''
							}, {
								name: '新品优先',
								checked: false,
								sort: '',
								sortMode: ''
							}, {
								name: '好评数从高到底',
								checked: false,
								sort: 'commentCount',
								sortMode: 'DESC'
							}
						]
					}, {
						name: '销量',
						showScreenList: false,
						arrowup: 'arrowup',
						deg: 0,
						checked: false,
						pullDown: [
							{
								name: '销量从低到高',
								checked: false,
								sort: 'allSales',
								sortMode: 'ASC'
							}, {
								name: '销量从高到低',
								checked: false,
								sort: 'allSales',
								sortMode: 'DESC'
							}
						]
					}, {
						name: '价格',
						showScreenList: false,
						arrowup: 'arrowup',
						deg: 0,
						checked: false,
						pullDown: [
							{
								name: '价格从低到高',
								checked: false,
								sort: 'minPrice',
								sortMode: 'ASC'
							}, {
								name: '价格从高到低',
								checked: false,
								sort: 'minPrice',
								sortMode: 'DESC'
							}
						]
					}
				],
				height: 0,
				scrollTop: 0,
			}
		},
		onLoad(data) {
			// #ifdef APP-PLUS
			this.height = uni.getSystemInfoSync().windowHeight - 100
			// #endif
			
			// #ifdef MP-WEIXIN
			this.height = uni.getSystemInfoSync().windowHeight - 40
			// #endif
			
			// #ifdef H5
			this.height = uni.getSystemInfoSync().windowHeight - 80
			// #endif
			
			this.cid = data.cid || ''
			this.k = data.k || ''
			this.sid = data.sid || ''
		},
		components: {
			uniDrawer,
		},
		computed: {
			isOverflow() {
				return this.rightDrawerVisible === true ? 'hidden' : 'inherit'
			}
		},
		mounted() {
			let that = this
			uni.showLoading({title: that.$t('加载中')})
			this.init()
			this.sortTap(0,0)

		},
		// 下拉
		onPullDownRefresh() {
			uni.showLoading({title: that.$t('加载中')})
			this.productList = []
			this.init()
			uni.stopPullDownRefresh()
		},
		// 上拉
		onReachBottom() {
			if (this.loadingType !== 0) {
				return false
			}
			this.loadingType = 1
			this.showLoadMore = true
			this.pageNo = this.pageNo + 1
			this.init((data) => {
				this.productList = this.productList.concat(data)
				// uni.pageScrollTo({
				// 	scrollTop: 0,
				// 	duration: 300
				// });
			})
			
		},
		methods: {
			back() {
				let that = this
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
			navTo(pid) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uProductDetail + '?pid=' + pid
				})
			},
			hide() {
				this.showShade = false
				this.sortWay.forEach((n, i) => {
					// this.sortWay[i].arrowup = 'arrowup'
					this.sortWay[i].deg = 0
					this.sortWay[i].showScreenList = false
				})
			},
			closeRightDrawer() {
				this.rightDrawerVisible = false;
			},
			showRightDrawer() {
				this.rightDrawerVisible = true;
			},
			actionSheetTap(type) {
				this.showShade = true
				this.sortWay.forEach((n, i) => {
					if(type == i) {
						// this.sortWay[i].arrowup = n.arrowup == 'arrowup' ? 'arrowdown' : 'arrowup'
						this.sortWay[i].deg = this.sortWay[i].deg === 180 ? 0 : 180
						this.sortWay[i].showScreenList = this.sortWay[i].showScreenList ? false : true
						this.showShade = this.sortWay[i].showScreenList ? true : false
					} else {
						this.sortWay[i].deg = 0
						this.sortWay[i].showScreenList = false
					}
				})
			},
			init(callBack) {
				let that = this,
					param = {
						cid: that.cid,
						k: '',
						sid: that.sid || '',
						scid: '',
						sDate: '',
						eDate: '',
						sort: that.sort,
						sortMode: that.sortMode,
						price: that.pPrice,
						attr: that.pAttr,
						bid: that.bid && that.bid.join(),
						k: that.k,
						pageNo: that.pageNo,
						pageSize: that.pageSize,
					}
				// 商品列表
				this.$api.productPage(param).then(res => {
					// that.showMiddlePopup()
					let datum = res.data
					if(!datum || datum.productList.length === 0) {
						setTimeout(() => {
							uni.hideLoading()
						}, 500)
						that.showLoadMore = true
						return false
					}
					if(that.pageNo == 1) {
						that.initParams(datum)
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
							datum.productList[i].image = n.image + this.imgShrink(150, 150)
						} else {
							datum.productList[i].image = that.prefix.baseImgUrl + n.image + this.imgShrink(150, 150)
						}
					})
					callBack ? callBack(datum.productList) : that.productList = datum.productList

					setTimeout(() => {
						uni.hideLoading()
					}, 500)
				}).catch(err => {
					uni.hideLoading()
					this.openErrMsg(err.message || '加载错误')
				})
			},
			initParams(data) {
				let brandList = []
				let categoryList = []
				let paramValueMap = {}
				data.brandList && data.brandList.forEach((n,i) => {
					n.checked = false
					brandList.push(n)
				})
				data.categoryList && data.categoryList.forEach((n,i) => {
					n.checked = false
					categoryList.push(n)
				})
				for(let key in data.paramValueMap) {
					let arr = []
					data.paramValueMap[key].forEach((n) => {
						let obj = {}
						obj.name = n
						obj.checked = false
						arr.push(obj)
					})
					paramValueMap[key] = arr
				}
				this.brandList = brandList
				this.categoryList = categoryList
				this.paramValueMap = paramValueMap

			},
			paramTap(key, item, index) {
				let dataMap = this.paramValueMap

				dataMap[key][index].checked = !dataMap[key][index].checked

				let obj = {}
				for(let k in dataMap) {
					if(dataMap.hasOwnProperty(k)) {
						obj[k] = []
						dataMap[k].forEach(item => {
							if(item.checked) {
								obj[k].push(item.name)
							}
						})
					}
				}
				this.attr = obj
				this.paramValueMap = dataMap
			},
			categoryTap(index) {
				this.categoryList.forEach((n, i) => {
					n.checked = false
				})
				this.categoryList[index].checked = true
				this.cid = this.categoryList[index].categoryId
			},
			brandTap(index) {
				let bid = []
				this.brandList.forEach((n, i) => {
					if(index === i) {
						n.checked = !n.checked
					}
					if(n.checked) {
						bid.push(n.brandId)
					}
				})
				this.bid = bid
			},
			query() {
				let that = this
				let attr = this.attr
				let pAttr = ''
				this.pPrice = this.minPrice + '-' + this.maxPrice
				for(let k in attr) {
					if(attr.hasOwnProperty(k)) {
						if(attr[k].length) {
							pAttr += k + '_' + attr[k].join(':') + ','
						}
					}
				}
				this.pAttr = pAttr.substr(0, pAttr.length-1)
				this.productList = []
				uni.showLoading({title: that.$t('加载中')})
				this.init()
				this.closeRightDrawer()
			},
			reset() {
				let that = this
				this.brandList.forEach((n, i) => {
					n.checked = false
				})
				this.categoryList.forEach((n, i) => {
					n.checked = false
				})
				for(let key in this.paramValueMap) {
					this.paramValueMap[key].forEach((n,i) => {
						this.paramValueMap[key][i].checked = false
					})
				}
				this.bid = ''
				// this.cid = ''
				this.minPrice = ''
				this.maxPrice = ''
				this.pPrice = ''
				this.attr = []
				this.pAttr = ''
				uni.showLoading({title: that.$t('加载中')})
				this.init()
				this.closeRightDrawer()
			},
			sortTap(index, i) {
				let that = this
				this.sortWay.forEach((n,j) => {
					// this.sortWay[j].arrowup = 'arrowup'
					this.sortWay[j].deg = 0
					this.sortWay[j].checked = index === j
					n.pullDown.forEach((m, k) => {
						this.sortWay[j].pullDown[k].checked = false
					})
				})
				this.sortWay[index].pullDown[i].checked = true
				this.sort = this.sortWay[index].pullDown[i].sort
				this.sortMode = this.sortWay[index].pullDown[i].sortMode
				this.productList = []
				this.pageNo = 1
				uni.showLoading({title: that.$t('加载中')})
				this.init()
				this.hide()
			},
			serach() {
				let that = this
				let pages = getCurrentPages();
				if(pages.length > 1 && ('/' + pages[pages.length - 2].route) === this.prefix.uSearch) {
					this.back()
				} else {
					uni.redirectTo({
						url: that.prefix.uSearch + '?k=' + that.k
					})
				}
			},
			imgErr(index) {
				this.productList[index].image = this.prefix.noProductImg
			}
		}
	}
</script>

<style>
	/* .list-body {
		height: 100%;
		overflow: hidden;
	} */
	/* .title {
		font-size: 30upx;
		line-height: 40upx;
		color: #333333;
		padding: 60upx;
	} */


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
	.product-left {
		width: 220upx;
	}
	.product-right {
		flex: auto;
		padding-left: 20upx;
		overflow: hidden;
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
		display: flex;
	}
	.store-name {
		overflow: hidden;
		text-overflow: ellipsis;
	    white-space: nowrap;
		height: 40upx;
		max-width: 340upx;
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
	
	.icon-filter{
		color: red;
		font-size: 24upx;
		/* #ifdef MP-WEIXIN */
		font-size: 28rpx;
		/* #endif */
		transform: scale(.8);
		display: inline-block;
	}
	.icon-wancheng {
		color: red;
	}
	.screen {
		position: fixed;
		left: 0;
		right: 0;
		display: flex;
		/* padding: 20upx 0; */
		background: #fdfdfd;
		z-index: 20;
		border-top: 1upx solid #f5f5f5;
		border-bottom: 1upx solid #f5f5f5;
	}
	.screen-flex {
		padding: 12upx 30upx;
		margin: auto;
	}
	.screen-flex .active {
		color: #ec0030;
	}
	.screen-flex text {
		font-size: 24upx;
	}
	.screen-flex:last-child {
		flex: auto;
		text-align: right;
	}
	.screen-flex .s_item {
		display: flex;
	}
	.s_img {
		width: 20upx;
		height: 28upx;
	}
	.right-bor {
		margin-right: 20upx;
		color: #d8d8d8;
	}
	
	
	.screen-list {
		box-sizing: border-box;
		position: absolute;
		left: 0;
		padding: 14upx 20upx 0;
		width: 100%;
		background: #fff;
		overflow: hidden;
		/* animation: height 1s linear; */
		transition: all 2s;
		border-bottom: 2upx solid #e0e0e0;
		height: 0;
		display: none;
	}
	.height-auto {
		height: auto;
		display: block;
	}
	.list-item {
		border-top: 2upx solid #e0e0e0;
		color: #999;
		height: 80upx;
		line-height: 80upx;
	}
	.icon-wancheng {
		float: right;
	}
	
	.shade {
		background: #000;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 10;
		left: 0;
		top: 0;
		opacity: 0.50;
		transition: all 3s liner 2s;
	}

	/* @keyframes showheight {
		from {
			height: 0px;
		}
		to {
			height: auto;
		}
	} */
	.drawer-top {
		padding: 20upx;
		background: #f5f5f5;
	}
	.uni-form-item .title {
		font-size: 26upx;
	}
	.drawer-top .iconfont {
		font-weight: bold;
		font-size: 26upx;
	}
	.drawer-flex {
		display: flex;
		flex-wrap: wrap;
		padding: 0 10upx 16upx;
	}
	.uni-input {
		margin: 0 10upx;
		padding: 0 1upx;
		border: 1upx solid #d8d8d8;
		border-radius: 6upx;
		font-size: 20upx;
	}
	.uni-form-item {
		position: relative;
	}
	.uni-form-item:after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 16px;
		height: 0.5px;
		content: '';
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.button-default {
		font-size: 26upx;
		display: inline-block;
		padding: 5upx 18upx;
		margin: 10upx;
		background: #eeeeee;
		text-align: center;
		color: #333;
		border-radius: 8upx;
	}
	.button-default.active {
		border: 1upx solid red;
		color: red;
		background: #fff;
	}
	.drawer-wrap {
		padding-bottom: 100upx;
		/* #ifdef APP-PLUS */
		padding-bottom: 140upx;
		/* #endif */
	}
	.drawer-bot {
		position: fixed;
		right: 0;
		bottom: 0;
		background: #fff;
		width: 75%;
		display: flex;
		justify-content: space-between;
		border-top: 1upx solid #ccc;
		transform: translatex(100%);
		transition: all 0.3s ease-out;
	}
	.uni-drawer.uni-drawer-visible .drawer-bot{
		transform: translatex(0);
	}
	.drawer-bot view {
		margin: 20upx;
		padding: 10upx 80upx;
		text-align: center;
		background: #fff;
		color: #ec4b4e;
		display: block;
		border-radius: 6upx;
		border: 1upx solid #ec4b4e;
	}
	.drawer-bot view:last-child {
		background: #ec4b4e;
		color: #fff;
	}
</style>
