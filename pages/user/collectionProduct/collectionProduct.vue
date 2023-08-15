<template>
	<view>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				商品收藏
			</view>
			<view class="header-item">
				<text class="iconfont icon-category" v-if="!edit" @tap="edit = !edit">管理</text>
				<text class="iconfont icon-duihao" v-else @tap="edit = !edit">完成</text>
			</view>
		</view> -->
		<uni-nav-bar rightWidth="right" color="#333333" leftIcon="back" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('商品收藏') }}</text>
			</view>
			<block slot="right">
				<view class="header-item">
					<view class="iconfont icon-category" v-if="!edit" @tap="edit = !edit">{{ $t('管理') }}</view>
					<view class="iconfont icon-duihao" v-else @tap="edit = !edit">{{ $t('完成') }}</view>
				</view>
			</block>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="wrap-msg" v-if="invalidNum">
			<view class="msg-sole">
				<view class="">
					{{ $t('亲，你当前有已下架的宝贝X个', { invalidNum: invalidNum || 0 } ) }}
				</view>
				<view class="" v-if="invalidNum" @tap="cancalSoldOut">
					{{ $t('立即清理') }}>>
				</view>
			</view>
		</view>
		
		<view class="msg-content">
			<view class="uni-list-cell uni-list-cell-b uni-list-cell-pd" v-for="(item, index) in msgList" :key="index">
				<checkbox-group class="cell-left" v-if="edit"  @tap="editCheck(index)">
					<label>
						<checkbox value="13" :checked="item.checked" style="display: none;" />
						<text class="iconfont" :class="item.checked ? 'icon-success' : 'icon-success-copy1'"></text>
					</label>
				</checkbox-group>
				<view class="comment-commodity cell-right" @tap="geToPorductDetail(item)">
					<view class="commodity-item">
						<image class="commodity-img" :src="item.image + imgShrink(105, 105)" mode="" />
						<view class="sold-out" v-if="item.soldOut">
							{{ $t('下架') }}
						</view>
					</view>
					<view class="commodity-item" :class="{'commodity-out': item.soldOut === 1}">
						<view class="commodity-name">
							{{ item.pictureName }}
						</view>
						<view class="commodity-price">
							{{ '￥' + item.picturePrice }}
						</view>
					</view>
				</view>
			</view>
			<!-- <uni-load-more :loadingType="loadingType" v-if="!noData" v-show="msgList.length > 9"></uni-load-more> -->
			<view class="no-msg" v-if="noData">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂时还没有收藏商品哦') }}</view>
			</view>
		</view>
		
		<view class="all-wrap" v-if="edit">
			<checkbox-group class="all-check" @tap="allCheck">
				<label>
					<checkbox value="13" :checked="allChecked" style="display: none;" />
					<text class="iconfont" :class="allChecked ? 'icon-success' : 'icon-success-copy1'"></text>
				</label>
			</checkbox-group>
			<view class="all-text">
				{{ $t('全选') }}
			</view>
			<view class="all-btn" @tap="deleMsg">
				{{ $t('取消收藏') }}
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				edit: false,
				loadingType: 0,
				msgList: [],
				invalidNum: '',
				pageNo: 1,
				pageSize: 10,
				bool: true,
				noData: false
			}
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1;
			this.pageNo = this.pageNo + 1
			this.init((data)=> {
				this.msgList = this.msgList.concat(data)
			})
		},
		mounted() {
			let that = this
			uni.showLoading({title: that.$t('加载中')})
			this.init()
		},
		computed: {
			allChecked() {
				let count = 0
				this.msgList.map((n,i) => {
					n.checked ? count++ : ''
				})
				if(this.msgList.length == count) {
					return true
				} else {
					return false
				}
			}
		},
		methods: {
			editCheck(index) {
				this.msgList[index].checked = !this.msgList[index].checked
			},
			
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			init(callBack) {
				let reg = new RegExp(this.prefix.baseImgUrl)
				this.$api.userCollectionProductList({
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}).then(res => {
					uni.hideLoading()
					if(!res.data || res.data.length == 0) {
						this.noData = true
						return false
					}
					if(res.page.isLastPage) {
						this.loadingType = 2
					} else {
						this.loadingType = 0
					}
					let data = res.data
					data.forEach((n,i) => {
						if(!reg.test(n.image)) {
							data[i].image = this.prefix.baseImgUrl + n.image
						}
						data[i].checked = false
					})
					callBack ? callBack(data) : this.msgList = data
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
					this.openErrMsg(err.message || '加载错误')
				})

				this.$api.userCollectionProductInvalidCount().then(res => {
					this.invalidNum = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			allCheck() {
				let arr = this.msgList
				arr.forEach((n, i) => {
					arr[i].checked = this.bool
				})
				this.bool = !this.bool
				this.msgList = arr
			},
			deleMsg() {
				let that = this
				let collectionIds = that.isAllCheckAndId()
				if(!collectionIds) {
					this.openErrMsg(that.$t('还没有选择商品'));
					return
				}
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('确定删除选中的收藏商品'),
					showCancel: true,
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success: res => {
						if(res.confirm) {
							that.cancalCollect(collectionIds)
						}
					},
					fail: () => {console.log('失败了触发')},
					complete: () => {}
				})
			},
			// 删除 下架商品
			cancalSoldOut() {
				this.cancalCollect('', true)
			},
			cancalCollect(collectionIds, isAll = false) {
				this.$api.userCollectionProductCancel({
					collectionIds: collectionIds,
					// 删除 下架商品
					isAll: isAll
				}).then(res => {
					this.openErrMsg(res.message)
					this.msgList = []
					this.init()
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			isAllCheckAndId() {
				let arr = [];
				this.msgList.forEach((n, i) => {
					if(this.allChecked) {
						arr.push(n.collectionId)
					} else {
						if(n.checked) {
							arr.push(n.collectionId)
						}
					}
				})
				return arr.join();
			},
			geToPorductDetail(item) {
				let that = this
				if(item.soldOut == 1) {
					return false;
				}
				uni.navigateTo({
					url: that.prefix.uProductDetail + '?pid=' + item.pid
				})
			}
		}
	}
</script>

<style>
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
		line-height: 88upx;
		font-size: 32upx;
	}
	.header-item .iconfont {
		font-size: 28upx;
	}
	.header-item .iconfont::before {
		margin-right: 6upx;
	}
	.header-item:first-child {
		width: 88upx;
		text-align: center;
	}
	.header-item:last-child {
		/* width: 200upx; */
		flex: 2;
		text-align: right;
		padding-right: 20upx;
	}
	.header-item:nth-child(2) {
		flex: auto;
	}
	.msg-content {
		margin-bottom: 100upx;
	}
	.wrap-msg {
		padding: 20upx 30upx;
		background: #f5f5f5;
	}
	.msg-sole {
		display: flex;
		justify-content: space-between;
		background: #fff;
		padding: 20upx;
		border-radius: 50upx;
	}
	.cell-left {
		flex: 1;
	}
	.cell-right {
		flex: 6;
	}
	.comment-commodity {
		display: flex;
		margin-top: 20upx;
	}
	.commodity-img {
		width: 140upx;
		height: 140upx;
		border: 2upx solid #ccc;
	}
	.commodity-item {
		position: relative;
	}
	.sold-out {
		position: absolute;
		top: 30upx;
		left: 30upx;
		background-color: #000000;
		color: #FFFFFF;
		width: 80upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		border-radius: 100%;
		opacity: 0.5;
		z-index: 1;
		font-size: 24upx;
	}
	
	.commodity-item:last-child {
		margin-left: 10upx;
	}
	.commodity-out .commodity-name,
	.commodity-out .commodity-price {
		color: #ccc;
	}
	.commodity-price {
		color: red;
	}
	.all-wrap {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		height: 100upx;
		line-height: 100upx;
		background: #f7f7fa;
		border-top: 2upx solid #ccc;
		z-index: 20;
	}
	.all-check {
		padding-left: 30upx;
		flex: 1;
	}
	.all-check label {
		display: flex;
		align-items: center;
	}
	.all-check > * {
		padding-right: 0;
	}
	.all-text {
		flex: 7;
	}
	.all-text,
	.all-btn {
		/* line-height: 100upx; */
		font-size: 32upx;
	}
	.all-btn {
		flex: 3;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f1224b;
		color: #fff;
		text-align: center;
		line-height: 32upx;
	}
</style>
