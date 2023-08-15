<template>
	<view v-cloak>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				我的消息
			</view>
			<view class="header-item">
				<text class="iconfont icon-category" v-if="!edit" @tap="edit = !edit">管理</text>
				<text class="iconfont icon-duihao" v-else @tap="edit = !edit">完成</text>
			</view>
		</view> -->
		<uni-nav-bar rightWidth="right" color="#333333" leftIcon="back" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('我的消息') }}</text>
			</view>
			<block slot="right">
				<view class="header-item">
					<text class="iconfont icon-category" v-if="!edit" @tap="edit = !edit">{{ $t('管理') }}</text>
					<text class="iconfont icon-duihao" v-else @tap="edit = !edit">{{ $t('完成') }}</text>
				</view>
			</block>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="wrap-msg">
			<view class="msg-item" v-for="(item, index) in msgIconList" :key="index" @tap="clickTab(index)">
				<view class="item-top">
					<image class="item-img" :src="urlPrefix + item.img" mode="" />
				</view>
				<view class="item-text" :class="{'active': index == active}">
					{{ $t(`${item.text}`) }}
				</view>
			</view>
		</view>
		
		<view :style="{ height: barHeight('statusBarHeight') + 54 + 'px' }"></view>

		<view class="msg-content">
			<view class="uni-list-cell uni-list-cell-b uni-list-cell-pd" v-for="(item, index) in msgList" :key="index">
				<checkbox-group class="cell-left" v-if="edit"  @tap="editCheck(index)">
					<label>
						<checkbox value="13" :checked="item.checked" style="display: none;" />
						<text class="iconfont" :class="item.checked ? 'icon-success' : 'icon-success-copy1'"></text>
					</label>
				</checkbox-group>
				<view class="cell-right">
					<view class="right-tit">
						<uni-badge class="tit-badge" :text="item.num" type="danger"></uni-badge>
						<text>{{ item.content }}</text>
					</view>
					<view class="right-date">{{ item.createDate }}</view>
				</view>
			</view>
			<view class="no-msg" v-if="noMsg && msgList.length === 0">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂无消息') }}</view>
			</view>
			<uni-load-more v-if="msgList.length !== 0" :loadingType="loadingType"></uni-load-more>
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
				{{ $t('删除') }}
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				urlPrefix: this.prefix.baseUrl,
				active: 0,
				edit: false,
				loadingType: 0,
				noMsg: false,
				msgIconList: [
					{
						img: '/wap/views/wap/default/img/sys_message_all.jpg',
						text: '全部消息'
					}, {
						img: '/wap/views/wap/default/img/sys_message_04.jpg',
						text: '交易消息'
					}, {
						img: '/wap/views/wap/default/img/sys_message_02.jpg',
						text: '退货消息'
					}, {
						img: '/wap/views/wap/default/img/sys_message_03.jpg',
						text: '商品消息'
					}, {
						img: '/wap/views/wap/default/img/sys_message_01.jpg',
						text: '运营消息'
					}
				],
				msgList: [],
				pageNo: 1,
				pageSize: 10,
				deleMsgId: [],
				skipType: false, // 是否 tabBar页进入
				allCheckedBooL: true,
			}
		},
		onLoad(param) {
			let arr = Object.keys(param)
			if(arr.length !== 0) {
				this.skipType = true
			}
		},
		watch: {
			addressId() {
				this.addressId ? this.edit(this.addressId) : this.init()
			}
		},
		mounted() {
			let that = this
			uni.showLoading({title: that.$t('加载中')})
			this.init()
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
		computed: {
			allChecked() {
				let count = 0
				this.msgList.forEach((n, i) => {
					n.checked ? count ++ : ''
				})
				if(count === this.msgList.length && this.msgList.length > 0) {
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
				let that = this
				if(that.skipType.length) {
					uni.switchTab({
						url: that.prefix.uUserCenter
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			},
			
			allCheck() {
				this.msgList.forEach((n, i) => {
					this.msgList[i].checked = this.allCheckedBooL
				})
				this.allCheckedBooL = !this.allCheckedBooL
			},
			deleMsg() {
				let that = this
				let count = 0
				this.msgList.forEach((n, i) => {
					if(n.checked) {
						count++
						this.deleMsgId.push(n.id)
					}
				})
				if(!count) {
					that.openErrMsg('没有选择需要删除的消息')
					return
				}
				
				uni.showModal({
					title: '提示',
					content: '您确定删除选中的消息嘛',
					success(res) {
						if (res.confirm) {
							
							that.dele()
						}
					}
				})
			},
			dele() {
				let that = this
				let msgId = that.deleMsgId.join()
				this.$api.userMessageDelete({messageIds: msgId}).then(res => {
					uni.showLoading({
						title: '删除成功'
					})
					that.init()
					setTimeout(()=> {
						uni.hideLoading()
					}, 200)
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			clickTab(index) {
				this.active = index
				this.msgList = []
				this.pageNo = 1
				this.init()
			},
			init(callBack) {
				let that = this
				let type = that.active == 0 ? '' : that.active
				let param ={
						pageNo: that.pageNo,
						pageSize: that.pageSize,
						type: type
					}
				this.$api.userMessagePage(param).then(res => {
					uni.hideLoading()
					if(!res.data || res.data.length == '0') {
						that.noMsg = true
						return false
					}
					if(res.page.isLastPage) {
						that.loadingType = 2
					} else {
						that.loadingType = 0
					}
					let datum = res.data
					
					
					datum.forEach((n,i) => {
						datum[i].checked = false
					})
					callBack ? callBack(datum) : that.msgList = datum
					uni.hideLoading()
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			}
		}
	}
</script>

<style>
	.city {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin-left:16upx;
	}
	.input-view {
		width: 92%;
		display: flex;
		/* background-color: #e7e7e7; */
		height: 60upx;
		/* border-radius: 30upx; */
		padding: 0 4%;
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx;
		align-items: center;
	}
	.header {
		position: fixed;
		top: 0;
		/* #ifdef APP-PLUS */
		top: var(--status-bar-height);
		/* #endif */
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
	.wrap-msg {
		position: fixed;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		/* margin-top: 88upx; */
		padding: 20upx 40upx;
		background: #fff;
		z-index: 9;
		border-bottom: 1upx solid #bbb;
	}
	.item-top {
		text-align: center;
	}
	.item-img {
		width: 80upx;
		height: 80upx;
	}
	.item-text {
		text-align: center;
	}
	.active {
		color: #f1224b;
	}
	.cell-left {
		flex: 1;
	}
	.cell-right {
		flex: 6;
	}
	.tit-badge {
		margin-right: 4upx;
	}
	.right-tit {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.right-date {
		color: #bbb;
		text-align: right;
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
	.all-check > * {
		padding-right: 0;
	}
	.all-text {
		flex: 7;
		text-align: left;
	}
	.all-text,
	.all-btn {
		line-height: 88upx;
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
