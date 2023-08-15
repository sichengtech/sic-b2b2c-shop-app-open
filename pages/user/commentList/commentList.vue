<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" leftIcon="back" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('我的评价') }}</text>
			</view>
		</uni-nav-bar>
		
		<!-- <view class="product-item bg-fff dis-flex">
			<view class="flex-item" :class="{active :productShow === 1}" @click="productShow = 1">全部评价</view>
			<view class="flex-item" :class="{active :productShow === 2}" @click="productShow = 2">有图评价</view>
		</view> -->
		<tab :list="tabList" fixedHeight="commList" @tapTab="tapTab"></tab>
		<view :style="{ height: barHeight('barHeight') + 'px' }"></view>
		<view class="comm-list">
			<view class="comment-content" v-for="(item, index) in commentList" :key="index">
				<view class="comment-user">
					<image class="user-img" :src="item.headPicPath + imgShrink(50, 50)" />
					<view class="user-name">{{ item.loginName }}</view>
					<view class="user-time">{{ item.createDate }}</view>
				</view>
				<view class="comment-params">
						{{ item.commentParams || '' }}   
				</view>
				<view class="comment-detail">
						{{ item.content === 'undefined' ? '' : item.content }}   
				</view>
				<view class="comment-img-list" v-if="item.tradeCommentImageList">
					<image  v-for="(project, j) in item.tradeCommentImageList" @tap="previewImage(item.tradeCommentImageList, j)" :key="j" class="comment-item" :src="url + project.path + imgShrink(150, 150)" mode="" />
				</view>
				<view class="comment-reply" v-if="item.tradeCommentAdd">
					<view>{{ $t('追评') }}: {{ item.tradeCommentAdd.content }}</view>
					<view class="comment-img-list" v-if="item.tradeCommentAdd.tradeCommentImageList && item.tradeCommentAdd.tradeCommentImageList ">
						<image  v-for="(project, j) in item.tradeCommentAdd.tradeCommentImageList" @tap="previewImage(item.tradeCommentAdd.tradeCommentImageList, j)" :key="j" class="comment-item" :src="url + project.path + imgShrink(100, 100)" mode="" />
					</view>
				</view>
				<view class="comment-commodity" v-if="item.name" @tap="goToProductDetail(item.pid)">
					<image class="commodity-item commodity-img" :src="item.image" @error="imgErr(index)" mode="" />
					<view class="commodity-item">
						<view class="commodity-name">
							{{ item.name }}
						</view>
						<view class="commodity-price">
							{{ '￥' + item.minPrice || item.maxPrice }}
						</view>
					</view>
				</view>
				<view class="comment-btn">
					<!-- <view class="btn-item">
						<text class="iconfont icon-form">隐藏评价</text>
					</view> -->
					<!-- <view class="btn-item btn-red">
						<text class="iconfont icon-form">追评</text>
					</view> -->
				</view>
			</view>
			<uni-load-more :loadingType="loadingType" v-if="commentList.length > 5"></uni-load-more>
		</view>
		<view class="no-msg" v-if="!commentList.length">
			<fine-icon type="xiaoxi1" size="100"></fine-icon>
			<view class="">{{ $t('暂时还没有评价信息哦') }}</view>
		</view>
		<!-- <view class="" v-if="productShow === 2">
			<view class="comment-content" v-for="(item, index) in commentList" v-if="item.commentImgList" :key="index">
				<view class="comment-user">
					<image class="user-img" :src="item.userImg" mode=""></image>
					<view class="user-name">{{ item.userName }}</view>
					<view class="user-time">{{ item.userTime }}</view>
				</view>
				<view class="comment-params">
						{{ item.commentParams }}   
				</view>
				<view class="comment-detail">
						{{ item.commentDetail }}   
				</view>
				<view class="comment-img-list" v-if="item.commentImgList">
					<image  v-for="(project, j) in item.commentImgList" :key="j" class="comment-item" :src="project" mode=""></image>
				</view>
				<view class="comment-reply" v-if="item.tradeCommentAdd">
						{{ item.tradeCommentAdd.content }}    
				</view>
				<view class="comment-commodity">
					<image class="commodity-item commodity-img" :src="item.commodityImg" mode=""></image>
					<view class="commodity-item">
						<view class="commodity-name">
							{{ item.commodityName }}
						</view>
						<view class="commodity-price">
							{{ item.commodityPrice }}
						</view>
					</view>
				</view>
				<view class="comment-btn">
					<view class="btn-item">
						<text class="iconfont icon-form">隐藏评价</text>
					</view>
					<view class="btn-item btn-red">
						<text class="iconfont icon-form">追评</text>
					</view>
				</view>
			</view>
		</view>
		 -->
		
	</view>
</template>

<script>
	import tab from '../../../components/tab.vue'
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
				active: 1,
				userName: '',
				commentList: [],
				pageNo: 1,
				pageSize: 10,
				uid: '',
				grade: '',
				loadingType: 0,
				noComment: false,
				tabList: [
					{
						tit: '全部评价',
						checked: true
					}, {
						tit: '好评',
						checked: false
					}, {
						tit: '中评',
						checked: false
					}, {
						tit: '差评',
						checked: false
					},
				],
			}
		},
		components: {
			tab,
		},
		mounted() {
			let that = this
			this.uid = this.$storage.getStore(this.$storage.keyVal).user.userId
			this.init()
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.pageNo = ++this.pageNo
			this.loadingType = 1;
			this.init((data)=>{
				this.commentList = this.commentList.concat(data.data)
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

			previewImage(urlList, current) {
				uni.previewImage({
					current: current,
					urls: urlList.map(n => this.url + n.path )
				})
			},
			
			init(callback) {
				let reg = new RegExp(this.prefix.baseImgUrl)
				let param = {
						uid: this.uid,
						pageNo: this.pageNo,
						pageSize: this.pageSize,
						grade: this.grade || '',
						type: 0
					}
				this.$api.tradeCommentPage(param).then(res => {
					if(!res.data || res.data.length == 0) {
						this.loadingType = 2
						this.noComment = true
						// let errMsg = res.message ? res.message : '暂无评价'
						// this.openErrMsg(errMsg)
						return false
					}
					if(res.page.isLastPage) {
						this.loadingType = 2
					} else {
						this.loadingType = 0
					}
					let data = res.data,
						pid = [],
						uid = [];
					data.forEach((n,i) => {
						pid.push(n.pid)
						uid.push(n.uid)
					})

					Promise.all([
						this.$api.productList({pids: pid.join()}),
						this.$api.userList({uids: uid.join()})
					]).then(res => {
						let productList = res[0].data.productList
						let userList = res[1].data;
						data.forEach((n, i) => {
							productList.forEach((m, j) => {
								if(!reg.test(m.image)) {
									m.image = this.prefix.baseImgUrl + m.image
								}
								if(n.pid == m.pid) {
									data[i] = Object.assign(n, m)
								}
							})
							userList.forEach((m, j) => {
								if(n.uid == m.uid) {
									if(n.headPicPath) {
										n.headPicPath = this.prefix.baseImgUrl + n.headPicPath + this.imgShrink(105, 105)
									} else {
										n.headPicPath =  '../../../static/img/user_face_01.png'
									}
									
									data[i] = Object.assign({}, n, m)
								}
							})
						})
						callback ? callback({data}) : this.commentList = data
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			imgErr(index, i) {
				this.commentList[index].image = this.prefix.noProductImg
			},
			tapTab(index) {
				this.commentList = []
				this.noComment = false
				this.loadingType = 0
				this.pageNo = 1
				this.grade = index || ''
				this.init()
			},
			goToProductDetail(pid) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uProductDetail + '?pid=' + pid
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
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx!important;
		font-size: 32upx;
	}
	.dis-flex {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-around;
		justify-content: space-around;
	}
	.flex-item {
		padding: 20upx 0;
		border-bottom: 2upx solid #ccc;
		width: 100%;
		text-align: center;
	}
	.flex-item.active {
		border-bottom: 2upx solid #ec0030;
		color: #ec0030;
	}
	.comm-list {
		/* margin-top: 88upx; */
		/* #ifdef APP-PLUS */
		/* margin-top: 170upx; */
		/* #endif */
	}
	.comment-content {
		padding: 20upx 20upx 2upx;
		border-top: 20upx solid #f5f5f5;
	}
	.comment-content:first-child {
		border-top: none;
	}
	.comment-user {
		display: flex;
	}
	.user-img {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}
	.user-name {
		margin-left: 10upx;
	}
	.user-time {
		flex: auto;
		text-align: right;
		color: #b5b5b5;
	}
	.comment-params {
		color: #999;
	}
	.comment-detail {
		word-break: break-all;
	}
	.comment-img-list {
		display: flex;
		/* justify-content: space-between; */
		justify-content: flex-start;
	}
	.comment-item {
		width: 200upx;
		height: 200upx;
	}
	.comment-reply {
		margin-top: 20upx;
		padding: 10upx;
		background: #f5f5f5;
		color: #6f6f6f;
		line-height: 1.4;
	}
	.comment-reply .comment-item {
		width: 100upx;
		height: 100upx;
	}
	.comment-commodity {
		display: flex;
		background: #f5f5f5;
		margin-top: 20upx;
		padding: 10upx;
	}
	.commodity-img {
		width: 140upx;
		height: 140upx;
		flex-shrink: 0;
	}
	.commodity-item:last-child {
		margin-left: 10upx;
		width: 660upx;
	}
	.commodity-price {
		color: #999;
	}
	.comment-btn {
		display: flex;
		justify-content: flex-end;
		padding: 10upx 0;
	}
	/* .btn-item {
		line-height: 1.4;
	} */
	.btn-item.btn-red .iconfont {
		color: red;
		border-color: red;
	}
	.btn-item:first-child {
		margin-right: 20upx;
	}
	.btn-item .iconfont {
		display: inline-block;
		padding: 2upx 14upx;
		font-size: 24upx;
		border: 1upx solid #ccc;
		border-radius: 20upx;
	}
</style>
