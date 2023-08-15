<template>
	<view>
		<uni-nav-bar color="#333333" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<view class="input-type" @tap="showPop">
					<view class="text"  v-for="item in popList" v-if="item.type == searchType" :key="item.text">
						{{ $t(`${ item.text }`) }}
					</view>
					<view class="icon"></view>
				</view>
				<!-- <uni-icons type="search" size="20" color="#666666"></uni-icons> -->
				<input
					class="input" type="text"
					confirm-type="search"
					focus="true"
					v-model="searchVal"
					:placeholder="$t('输入搜索关键词')"
				/>
				<text class="view-text" @tap="tapSearch">{{ $t('搜索') }}</text>
			</view>
		</uni-nav-bar>

		<view class="shade" @tap="hideMenu" @touchmove="hideMenu" v-show="showPopVal">
			<view class="wrap" :style="{top: barHeight('statusBarHeight') - 10 + 'px'}">
				<view class="type" v-for="item in popList" :key="item.type" @tap="onSearchType(item.type)">
					{{ $t(`${ item.text }`) }}
				</view>
			</view>
		</view>

		<view class="hot-search" :style="{ marginTop: barHeight('statusBarHeight') + 'px'}">
			<view class="hot-tit">{{ $t(`${ text }`) }}</view>
			<view class="hot-wrap">
				<view class="hot-item" v-for="(item, index) in hotSearchList" :key="item.word">
					<view @tap="serchWord(item.word)">{{ item.word }}</view>
				</view>
			</view>
		</view>

		<view class="history-list">
			<view class="h_title h_item">{{ $t('历史搜索') }}</view>
			<block v-if="historySearch.length > 0">
				<block v-for="item in historySearch" :key="item">
					<view class="h_item" v-if="item"  @tap="serchWord(item)" >{{ item }}</view>
				</block>
			</block>
			<view class="h_clear">
				<fine-icon type="delete" color="#343434"></fine-icon>
				<view class="h_c_delete" @tap="removelHistory">{{ $t('清空历史记录') }}</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	const searchKey = 'history'
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
				listUrl: this.prefix.uProductList,
				searchVal: '',
				sid: '',
				text: '你是不是要找',
				hotSearchList: [],
				showPopVal: false,
				popList: [
					 {
						type: 1,
						text: '商品'
					}, {
						type: 2,
						text: '店铺'
					}
				],
				searchType: 0,
				historySearch: []
			}
		},
		onLoad(data) {
			this.sid = data.sid
			this.searchVal = data.k || ''
			this.searchType = data.searchType || 1
			this.init()
		},
		onShow() {
			this.getHistorySearch()
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
			init() {
				this.$api.siteHotSearchWordList().then(res => {
					this.hotSearchList = res.data
				})
			},
			// 显示店铺 商品弹层
			showPop() {
				this.showPopVal = !this.showPopVal
			},
			hideMenu() {
				this.showPopVal = false
			},
			// 获取搜索历史记录
			getHistorySearch() {
				let data = this.$storage.getStore(searchKey)
				this.historySearch = data.length > 0 ? data.split(',') : []
			},
			// 切换搜索商品 店铺
			onSearchType(type) {
				this.searchType = type
				this.showPopVal = false
			},
			// 历史记录 热搜词点击搜索
			serchWord(wrod) {
				this.searchVal = wrod;
				this.tapSearch()
			},
			// 删除历史搜索记录
			removelHistory() {
				this.$storage.reStore(searchKey)
				this.getHistorySearch()
			},
			// 搜索
			tapSearch() {
				let _this = this
				let historySearch = _this.historySearch
				if(_this.searchType === 1) {
					let newHistorySearch = historySearch.slice()
					newHistorySearch.unshift(_this.searchVal.trim())
					// 搜索有值
					if(_this.searchVal) {
						// 过滤空格添加
						// 历史记录超过20条删除以前的记录
						let data = [...new Set(historySearch)].slice(0, 20).join()
						let newData = [...new Set(newHistorySearch)].slice(0, 20).join()
						if(data !== newData) {
							_this.$storage.setStore({
								key: searchKey,
								val: newData
							})
						}
						
					}
					uni.navigateTo({
						url: _this.prefix.uProductList + '?sid='+ (_this.sid || '') + '&k=' + _this.searchVal
					})
				} else {
					uni.navigateTo({
						url: _this.prefix.uStoreList + '?k=' + _this.searchVal
					})
				}
				
			}
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
		// position: absolute;
		// top: 0;
		// right: 0; 
		width: 100upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		background: #f1224b;
		border-radius: 30upx;
		color: #fff;
		font-size: 24upx;
		// z-index: 20;
		padding: 0 10upx;
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
		flex: auto;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		height: 100%;
		line-height: 60upx;
		font-size: 24upx;
		font-weight: 400;
		padding: 0 10upx;
		min-width: 90upx;
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
	.wrap {
		position: fixed;
		left: 36upx;
		width: 170upx;
		height: auto;
		background: #333;
		z-index: 999;
		border-radius: 6upx;
	}
	.wrap::after {
		content: "";
		position: absolute;
		top: -10upx;
		left: 80upx;
		width: 24upx;
		height: 24upx;
		background: #333;
		transform: rotate(45deg);
	}
	.type {
		color: #fff;
		font-size: 26upx;
		padding: 4upx 20upx;
	}
	.input-view .input {
		height:60upx;
		line-height:60upx;
		width:66%;
		padding: 0 3% 0 0;
		color: #343434;
		font-size: 24upx;
		font-weight: normal;
	}
	.uni-input-placeholder { 
		color: #ccc; 
	}
	.hot-search {
		padding: 40upx 20upx 20upx;
	}
	.hot-tit {
		color: #999;
		font-size: 24upx;
	}
	.hot-wrap {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20upx;
	}
	.hot-item {
		padding: 4upx 16upx;
		margin: 10upx;
		background: #f4f4f4;
		border-radius: 10upx;
		color: #343434;
		font-size: 24upx!important;
	}
	.history-list {
		border-top: 20upx solid #f1f1f1;
	}
	.h_title.h_item {
		padding: 8upx 14upx;
		color: #343434;
	}
	.h_item {
		border-bottom: 2upx solid #f6f6f6;
		padding: 18upx;
		font-size: 26upx;
		color: #747474;
	}

	.h_clear {
		width: 60%;
		margin: 50upx auto 0;
		border: 2upx solid #f6f6f6;
		display: flex;
		justify-content: center;
		align-items: center;
		.iconfont {
			padding: 0 10upx;
			color: #343434;
		}
		.h_c_delete {
			color: #949494;
			font-size: 24upx;
		}
	}
	.shade {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
	}
</style>
