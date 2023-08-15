<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" v-if="showBar" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('商品评价') }}</text>
			</view>
		</uni-nav-bar>
		
		<!-- <view class="product-item bg-fff dis-flex">
			<view class="flex-item"
				v-for="(item, index) in tabName"
				:class="{active : index === tabActive}"
				@click="tabTap(index)"
				:key="index"
			>{{ item }}</view>
		</view> -->
		<tab :list="tabName" fixedHeight="commList" color="#999" @tapTab="tabTap"></tab>
		
		<view class="comment-wrap" :style="{ marginTop: barHeight('statusBarHeight') + 'px' }">
			<view class="comment-content" v-if="commentList" v-for="(item, index) in commentList" :key="index">
				<view class="comment-user">
					<image class="user-img" :src="item.headPicPath" />
					<view class="user-name">{{ item.userName }}</view>
					<view class="user-time">{{ item.createDate }}</view>
				</view>
				<view class="comment-detail">
						{{ item.content }}   
				</view>
				<view class="comment-img-list" v-if="item.tradeCommentImageList">
					<image  v-for="(project, j) in item.tradeCommentImageList"
						v-if="project.path"
						:key="j" class="comment-item" :src="project.path"
						@error="imgErr(index, j)" mode=""
					/>
				</view>
				<view class="comment-reply"  v-if="item.tradeCommentAdd">
						{{ $t('追评') }}
					<view class="">
						{{ item.tradeCommentAdd.content }}
					</view>
				</view>
				<view class="comment-commodity" v-if="item.tradeCommentExplain">
					<!-- <image class="commodity-item commodity-img" :src="item.commodityImg" mode=""></image> -->
					<view class="commodity-item">
						<view class="commodity-name" v-if="item.tradeCommentExplain.content">
							{{ item.tradeCommentExplain.content }}
						</view>
						<view class="commodity-price" v-if="item.commodityPrice ">
							{{ item.commodityPrice }}
						</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="show && commentList.length > 4" :loadingType="loadingType"></uni-load-more>

			<view class="no-msg" v-if="commentList.length == 0 && show">
				<fine-icon type="xiaoxi1" size="100"></fine-icon>
				<view class="">{{ $t('暂时还没有评价信息哦') }}</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import tab from "../../../components/tab.vue"
	export default {
		props: {
			pid: {
				type: String,
				default: ''
			},
			showBar: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				url: this.prefix.baseImgUrl,
				productShow: 1,
				ppid: this.pid,
				pageNo: 1,
				pageSize: 10,
				grade: '',
				type: 0,
				commentList: [],
				tabName: [
					{tit: '全部评价', checked: true},
					{tit: '好评', checked: false},
					{tit: '中评', checked: false},
					{tit: '差评', checked: false}
				],
				tabActive: 0,
				show: false,
				loadingType: 1,
			}
		},
		components: {
			tab,
		},
		onLoad(param) {
			if(param.pid) {
				this.ppid = param.pid
				this.init()
			}
		},
		created() {
			if(this.pid) this.init();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return false
			}
			this.loadingType = 1
			this.init((data, page)=> {
				this.msgList = this.msgList.concat(data)
				if(page.isLastPage) {
					this.loadingType = 2
				} else {
					this.loadingType = 0
				}
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
			
			init(callBack) {
				let that = this
				uni.showLoading({
					title:  that.$t('加载中')
				})
				let param = {
						pid: that.ppid,
						pageNo: that.pageNo,
						pageSize: that.pageSize,
						grade: that.grade,
						type: that.type
					}
				let skuPromise = new Promise((resolve, reject) => {
					this.$api.productCommentPage(param).then(res => {
						if(!res.data || res.data.length === 0) {
							// let errMsg = res.message ? res.message : '没有评价'
							// this.openErrMsg(errMsg)
							this.show = true
							uni.hideLoading()
							return false
						}
						let datum = res.data
						if(res.page.isLastPage) {
							this.loadingType = 2
						}
						let obj = {
							uids: '',
							pids: '',
							skuIds: '',
							commentIds: '',
							page: res.page
						}
						datum.forEach((n, i) => {
							obj.commentIds += n.commentId + ",";
							obj.pids = n.pid
							obj.uids += n.uid + ","
							obj.skuIds += n.skuId + ","
						})
						obj.item = datum
						resolve(obj)
					}).catch(err => {
						uni.hideLoading()
						this.openErrMsg(err.message || '加载错误')
					})
				}).then((par)=> {
					let commentList = par.item
					Promise.all([
							this.$api.userList({uids: par.uids}), // 用户
							// this.$api.productCommentImageList({commentIds: par.commentIds}), // 评价图片
							// this.$api.productCommentPage({pid: par.pids,replyIds: par.commentIds,type:"2"}), // 追评
							// this.$api.productSkuList({skuIds: par.skuIds}) // 
						]).then(res => {
							let datum = res[0].data
							commentList.forEach((n,i)=> {
								datum.forEach((m,j)=> {
									if(n.uid === m.uid) {
										if(n.headPicPath) {
											n.headPicPath = this.prefix.baseImgUrl + n.headPicPath + this.imgShrink(175, 150)
										} else {
											n.headPicPath =  '../../../static/img/user_face_01.png'
										}
										commentList[i].userName = m.loginName
										// commentList[i].headPicPath = n.headPicPath + this.imgShrink(175, 150)
									}
								})
							})
							commentList.forEach((n,i) => {
								if(n.tradeCommentImageList) {
									n.tradeCommentImageList.forEach((m,j) => {
										commentList[i].tradeCommentImageList[j].path = that.url + n.tradeCommentImageList[j].path
									})
								}
							})
							callBack ? callBack(commentList, par.page) :
							that.commentList = commentList
							that.show = that.commentList > 5 ? true : false
							setTimeout(() => {
								uni.hideLoading()
							}, 100)
							that.commentList = commentList
						})
				}).catch(err => {
					uni.hideLoading()
					this.openErrMsg(err.message || '加载错误')
				})
			},
			tabTap(index) {
				if(index == this.tabActive) return false
				this.grade = index > 0 ? index : ''
				this.tabActive = index
				this.commentList = []
				this.show = false
				this.loadingType = 0
				this.pageNo = 1
				this.init()
			},
			imgErr(index, i) {
				this.commentList[index].tradeCommentImageList[i].path = this.prefix.noProductImg
			}
		}
	}
</script>

<style scoped>
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
	.no-msg {
		margin-top: 0;
	}
	.dis-flex {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-around;
		justify-content: space-around;
	}
	/* .product-item {
		margin-top: 88upx;
	} */
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
	.comment-wrap {
		background: #fff;
	}
	.comment-content {
		padding: 20upx;
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
	/* .comment-detail {
		line-height: 1.5;
	} */
	.comment-img-list {
		display: flex;
	}
	.comment-item {
		width: 200upx;
		height: 200upx;
		padding: 0 10upx;
	}
	.comment-item:first-child {
		padding-left: 0;
	}
	.comment-item:last-child {
		padding-right: 0;
	}
	.comment-reply {
		margin-top: 20upx;
		padding: 10upx;
		background: #f5f5f5;
		color: #f1224b;
		line-height: 1.4;
	}
	.comment-reply view {
		color: #ccc;
	}
	.comment-commodity {
		display: flex;
		background: #f5f5f5;
		margin-top: 20upx;
	}
	.commodity-img {
		width: 200upx;
		height: 140upx;
	}
	.commodity-item:last-child {
		margin-left: 10upx;
		color: #6f6f6f;
	}
	.commodity-price {
		color: #999;
	}
</style>
