<template>
	<view>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				店铺收藏
			</view>
			<view class="header-item">
				<text class="iconfont icon-category" v-if="!edit" @tap="edit = !edit">管理</text>
				<text class="iconfont icon-duihao" v-else @tap="edit = !edit">完成</text>
			</view>
		</view> -->
		<uni-nav-bar rightWidth="right" color="#333333" leftIcon="back" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('店铺收藏') }} </text>
			</view>
			<block slot="right">
				<view class="header-item">
					<text class="iconfont icon-category" v-if="!edit" @tap="edit = !edit">{{ $t('管理') }}</text>
					<text class="iconfont icon-duihao" v-else @tap="edit = !edit">{{ $t('完成') }}</text>
				</view>
			</block>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="msg-content">
			<view class="uni-list-cell uni-list-cell-b uni-list-cell-pd" v-for="(item, index) in msgList" :key="index">
				<checkbox-group class="cell-left" v-if="edit"  @tap="editCheck(index)">
					<label>
						<checkbox value="13" :checked="item.checked" style="display: none;" />
						<text class="iconfont" :class="item.checked ? 'icon-success' : 'icon-success-copy1'"></text>
					</label>
				</checkbox-group>
				<view class="cell-right" @tap="navigator(item.storeId)">
					<view class="right-imglist">
						<image class="right-img" :src="item.logo + imgShrink(135, 75, 0)" mode="" />
					</view>
					<view class="right-shop">
						<view class="right-tit">
							{{ item.name }}
						</view>
						<view class="right-mark">{{ item.mark }}</view>
					</view>
				</view>
			</view>
			<!-- <uni-load-more :loadingType="loadingType" v-if="msgList.length > 5"></uni-load-more> -->
			<view class="no-msg" v-if="noData">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂时还没有收藏店铺哦') }}~</view>
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
				// loadingType: 0,
				msgList: [],
				pageNo: 1,
				pageSize: 10,
				bool: false,
				noData: false
			}
		},
		// onReachBottom() {
		// 	if (this.loadingType !== 0) {
		// 		return;
		// 	}
		// 	this.loadingType = 1;
		// 	this.pageNo = this.pageNo + 1
		// 	this.init((data)=> {
		// 		this.msgList = this.msgList.concat(data)
		// 	})
		// },
		onShow() {
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
				this.$api.userCollectionStoreList({
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}).then(res => {
					if(!res.data || res.data.length == 0) {
						this.noData = true
						return false
					}
					let arr = []
					let collIds = res.data
					res.data.forEach((n, i) => {
						arr.push(n.storeId)
					})
					let str = arr.join()
					str ?
					(this.$api.storeList({storeIds: str}).then(res => {
						let data = res.data
						data.forEach((n, i) => {
							collIds.forEach((m, j) => {
								if(n.storeId === m.storeId) {
									data[i].logo = this.prefix.baseImgUrl + n.logo
									data[i].checked = false
									data[i] = Object.assign({}, n, m)
								}
							})
							
						})
						this.msgList = data
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})) : this.msgList = []
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
				let str = that.isAllCheckAndId()
				if(!str) {
					this.openErrMsg(that.$t('还没有选择店铺'));
					return
				}
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('确定删除选中的店铺'),
					showCancel: true,
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success: res => {
						if(res.confirm) {
							that.$api.userCollectionStoreCancel({collectionIds: str}).then(res => {
								that.openErrMsg(res.message)
								that.init()
							}).catch(err => {
								that.openErrMsg(err.message || '加载错误')
							})
						}
						
					},
					fail: () => {},
					complete: () => {}
				});
			},
			navigator(sid) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uStoreIndex + '?storeId=' + sid
				});
			},
			isAllCheckAndId() {
				let arr = []
				this.msgList.forEach((n, i) => {
					n.checked ? arr.push(n.collectionStoreId) : ''
				})
				return arr.join()
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
		flex: 2;
		text-align: right;
		padding-right: 20upx;
	}
	.header-item:nth-child(2) {
		flex: auto;
	}
	.msg-content {
		/* margin-top: 88upx; */
		margin-bottom: 100upx;
	}
	.cell-left {
		flex: 1;
	}
	.cell-right {
		flex: 6;
		display: flex;
	}
	.right-shop {
		margin-left: 10upx;
	}
	.right-img {
		width: 180upx;
		height: 100upx;
		border: 2upx solid #ccc;
	}
	.right-tit {
		font-size: 24upx;
	}
	.right-mark {
		color: #ccc;
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
		/* line-height: 88upx; */
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
