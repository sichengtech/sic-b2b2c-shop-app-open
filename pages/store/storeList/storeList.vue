<template>
	<view>
		<uni-nav-bar color="#333333" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<view class="input-type">
					<view class="text">{{ $t('店铺') }}</view>
					<view class="icon"></view>
				</view>
				<!-- <uni-icons type="search" size="20" color="#666666"></uni-icons> -->
				<input
					class="input" type="text"
					confirm-type="search"
					@tap="serach"
					:placeholder="$t('输入搜索关键词')"
					v-model="k"
				/>
				<text class="view-text">{{ $t('搜索') }}</text>
			</view>
		</uni-nav-bar>

		<view class="tab-list" :style="{ top: barHeight('statusBarHeight') + 'px'}">
			<view class="tab-item"
				v-for="(value, index) in tabList"
				:class="{ active: value.checked }"
				@tap="cutSort(index)"
				:key="index"
			>
				{{ $t(`${ value.text }`) }}
			</view>
		</view>

		<view class="store-list" :style="{ marginTop: barHeight('statusBarHeight') + 2 + 'px'}">
			<view class="store-item" v-for="(item , index) in storeList" :key="index" @click="gotoStore(item)">
				<view class="item-img">
					<image :src="item.logo"></image>
				</view>
				<view class="item-content">
					<view class="i_c_title">{{ item.name }}</view>
					<view class="i_c_sales">
						<text class="num" v-if="item.allSales">{{ item.allSales }}{{ $t('销量') }} | </text>
						<text class="num">{{ $t('共X件商品', { num: item.productCount }) }} | </text>
						<text class="num">{{ $t('共X人收藏', { num: item.countCollection }) }}</text>
					</view>
					<view class="i_c_address">{{ $t('所在地区') }}: {{ item.detailedAddress }}</view>
					<view class="i_c_product">{{ $t('主营产品') }}: {{ item.industry }}</view>
				</view>
			</view>
			<uni-load-more v-if="storeList.length > 6" :loadingType="loadingType"></uni-load-more>
			<view class="no-msg" v-if="storeList.length == 0">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂无店铺') }}</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [
					{
						type: '',
						text: '默认排序',
						checked: true
					},
					{
						type: 'allSales',
						text: '销量优先',
						checked: false
					},
					{
						type: 'collectionCount',
						text: '店铺收藏量',
						checked: false
					}
				],
				storeList: [],
				loadingType: 1,
				pageNo: 1,
				pageSize: 10,
				k: '',
			}
		},
		onLoad(param) {
			this.k = param.k
			this.init()
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
				this.storeList = this.storeList.concat(data)
			})
			
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
			serach() {
				let that = this
				let pages = getCurrentPages();
				if(('/' + pages[pages.length - 2].route) === this.prefix.uSearch) {
					this.back()
				} else {
					uni.redirectTo({
						url: that.prefix.uSearch + '?k=' + that.k + '&searchType=2'
					})
				}
			},
			init(callBack) {
				let sortType = ''
				this.tabList.forEach((val, i) => {
					if(val.checked) {
						sortType = val.type
					}
				})
				this.$api.storePage({
					sort: sortType,
					k: this.k
				}).then(res => {
					if(!res.data) return
					let data = res.data.map(item => {
						item.logo = this.prefix.baseImgUrl + item.logo + this.imgShrink(270, 180, 0)
						return item
					})
					setTimeout(() => {
						if(res.page.isLastPage) {
							this.loadingType = 2
						} else {
							this.loadingType = 0
						}
					}, 500)
					
					callBack ? callBack(data) : this.storeList = data
				})
			},
			cutSort(index) {
				this.tabList = this.tabList.map((item, i) => {
					item.checked = index === i
					return item
				})
				this.init()
			},
			// 进入店铺
			gotoStore(item) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uStoreIndex + '?storeId='+ item.storeId,
				});
			},
		}
	}
</script>

<style lang="scss">
	uni-view {
		font-size: 24upx;
	}
	.header {
		position: relative;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		width: 100%;
		height: 88upx;
		/* background-color: #f9f9f9; */
		overflow: hidden;
		/* border-bottom: 1upx solid #ccc; */
		z-index: 20;
		/* box-shadow: 0 2upx 12upx #ccc; */
	}
	.header-item {
		position: relative;
		// line-height: 88upx;
		font-size: 32upx;
	}
	.header-item .iconfont {
		font-size: 40upx;
		color: #fff;
	}
	.item-abso {
		position: absolute;
		top: 0;
		right: 16upx;
	}
	.view-text {
		position: absolute;
		top: 0;
		right: 0; 
		width: 100upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		background: #f1224b;
		border-radius: 30upx;
		color: #fff;
		font-size: 24upx;
		z-index: 10;
	}
	.view-head {
		position: relative;
		background: #f9f9f9;
		overflow: hidden;
	}
	.input-view {
		position: relative;
		// width: 80%;
		display: flex;
		background-color: #f8f8f8;
		height: 60upx;
		border-radius: 30upx;
		padding: 0;
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx;
		border: 1px solid #c5c5c5;
		// overflow: hidden;
	}

	.input-view .input-type {
		flex: 1;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		height: 100%;
		line-height: 60upx;
		font-size: 24upx;
		font-weight: 400;
		
	}
	.input-type .text {
		font-size: 24upx;
		color: #848484;
	}
	.input-type .icon {
		width: 10upx;
		height: 6upx;
		margin-left: 8upx;
		overflow: hidden;
		position: relative;
	}
	.input-type .icon::after {
		content: "";
		position: absolute;
		top: -6upx;
		left: 0upx;
		width: 10upx;
		height: 10upx;
		background: #666;
		transform: rotate(45deg);
	}
	.input-view .input {
		height:60upx;
		line-height:60upx;
		width:78%;
		padding: 0 3% 0 0;
		color: #343434;
		font-size: 24upx;
		font-weight: normal;
	}
	.uni-input-placeholder { 
		color: #ccc; 
	}

	.tab-list {
		position: sticky;
		display: flex;
		justify-content: space-around;
		border-top: 2upx solid #ccc;
		border-bottom: 2upx solid #f4f4f4;
		background: #fff;
		box-shadow: 0px 6upx 14upx #ddd;
		z-index: 99;
	}
	.tab-item {
		padding: 20upx 0;
		color: #848484;
		
	}
	.tab-item.active {
		color: #f1224b;
	}

	// .store-list {
	// 	background: #f4f4f4;
	// }
	.store-item {
		display: flex;
		padding: 20upx;
		background: #fff;
		margin-bottom: 20upx;
		box-shadow: 0px 6upx 14upx #ddd;
	}
	.store-item:last-child {
		margin-bottom: 0;
	}
	.item-img {
		width: 180upx;
		height: 120upx;
		flex-shrink: 0;
	}
	.item-content {
		margin-left: 20upx;
		overflow: hidden;
	}
	.item-content view {
		line-height: 1.4;
		color: #666;
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow: hidden;
	}
	.item-content view.i_c_title {
		font-size: 30upx;
		color: #444;
		font-weight: bold;
		line-height: 1.2;
	}
	.i_c_sales {
		color: #999;
	}
	.i_c_sales .num {
		margin-right: 5upx;
		margin-left: 5upx;
		
		&:first-child {
			margin-left: 0;
		}
	}

</style>
