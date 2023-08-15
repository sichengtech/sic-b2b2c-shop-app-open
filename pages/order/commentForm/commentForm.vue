<template>
	<view>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				商品评价
			</view>
			<view class="header-item">
				<text class="item-tit" @tap="save">提交</text>
			</view>
		</view> -->
		<uni-nav-bar rightWidth="right" color="#333333" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('商品评价') }}</text>
			</view>
			<block slot="right">
				<view class="header-item">
					<text class="item-tit" @tap="save">{{ $t('提交') }}</text>
				</view>
			</block>
		</uni-nav-bar>
		
		<view class="comment-list" :style="{ marginTop: barHeight('statusBarHeight') + 'px'}">
			<view class="comment-item" v-for="(pro, i) in productCommentList" :key="i">
				<view class="item-top">
					<image class="top-img" :src="url + pro.thumbnailPath + imgShrink(105, 105)" mode="" />
					<view class="top-right">
						<view class="right-tit">{{ pro.name }}</view>
						<view class="right-grade grade">
							<text class="grade-tit">{{ $t('宝贝评分') }}</text>
							<view class="grade-star">
								<view v-for="(item, index) in pro.starList" :key="index">
									<text class="iconfont icon-shoucang1"
									@click="starChange(i, index)"
									:class="{ 'active': item.checked }"
									:id="index" :key="index"
									></text>
								</view>
							</view>
							<text>{{ pro.grade + $t('分') }}</text>
						</view>
						<view class="right-grade">
							<text class="grade-tit">{{ $t('评价等级') }}</text>
							<radio-group class="grade-radio">
								<label class="grade-label" v-for="(item, index) in pro.praise" :key="item.value">
										<radio style="transform:scale(0.6)translateX(8px)" class="radio" :value="item.value" :checked="item.checked" @tap="radioChange(i,index)" />{{ $t(`${ item.name }`) }}
								</label>
							</radio-group>
						</view>
					</view>
				</view>
				<view class="item-text">
					<textarea class="text" value="" v-model="pro.content" :placeholder="$t('宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧')" />
				</view>
				<view class="item-upload">
					<view class="upload-img-list"
						v-if="pro.uploadImgList && i < 5"
						v-for="(item, index) in pro.uploadImgList"
						:key="index"
					>
						<image class="upload-img" :src="item" @tap="previewImage(i, item)" />
					</view>
					<view class="upload" @tap="upload(i)" v-if="pro.uploadImgList.length < 5"></view>
				</view>
			</view>
			
		</view>
		
		<view class="shop-comment">
			<view class="">{{ $t('店铺评分') }}</view>
			<view class="right-grade grade" v-for="(item, i) in shopCommentList" :key="i">
				<view class="grade-tit">{{ $t(`${ item.tit }`) }}</view>
				<view class="grade-star">
					<view v-for="(n, index) in item.starList" :key="index">
						<text class="iconfont icon-shoucang1"
							:class="{ 'active': n.checked }"
							:id="index" :key="index"
							@tap="shopStarChange(i,index)"
						></text>
					</view>
				</view>
				<text class="shop-grade-tit">{{ item.grade + $t('分') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				productCommentList: [],
				shopCommentList: [
					{
						tit: '卖家的服务态度',
						starList: [
							{checked: true},
							{checked: true},
							{checked: true},
							{checked: true},
							{checked: true}
						],
						grade: 5
					},
					{
						tit: '卖家的发货速度',
						starList: [
							{checked: true},
							{checked: true},
							{checked: true},
							{checked: true},
							{checked: true}
						],
						grade: 5
					}
				],
				url: this.prefix.baseImgUrl,
				orderId: '',
				timer: null
			}
		},
// 		computed: {
// 		},
		onLoad(param) {
			this.orderId = param.order
			this.isAdditionalComment = param.isAdditionalComment
			this.init()
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			
			init() {
				this.$api.tradeOrderItemList({orderIds: this.orderId}).then(res => {
					let data = res.data
					data.forEach((n, i) => {
						data[i].praise = [
							{
								value: '1',
								name: '好评',
								checked: true
							},
							{
								value: '2',
								name: '中评',
							},
							{
								value: '3',
								name: '差评',
							}
						]
						data[i].starList = [
							{checked: true},
							{checked: true},
							{checked: true},
							{checked: true},
							{checked: true}
						]
						data[i].grade = 5
						data[i].uploadImgList = []
						// 需要上传的图片路径
						data[i].imgPathList = []
					})
					this.productCommentList = data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			radioChange(j, index) {
				var items = this.productCommentList[j].praise;
				for (var i = 0, len = items.length; i < len; ++i) {
					items[i].checked = index == i
				}
				this.productCommentList[j].praise = items
			},
			starChange(i, index) {
				let count = 0;
				let starList = this.productCommentList[i].starList;
					starList.forEach((n,i) => {
						if(i <= index) {
							count++
							starList[i].checked = true
						} else {
							starList[i].checked = false
						}
					})
					this.productCommentList[i].starList = starList
					this.productCommentList[i].grade = count
				
			},
			shopStarChange(i, index) {
				let count = 0;
				let starList = this.shopCommentList[i].starList;
					starList.forEach((n,i) => {
						if(i <= index) {
							count++
							starList[i].checked = true
						} else {
							starList[i].checked = false
						}
					})
					this.shopCommentList[i].starList = starList
					this.shopCommentList[i].grade = count
			},
			upload(i) {
				let that = this
				let list = this.productCommentList
				uni.chooseImage({
					sizeType: ['original'],
					count: 5,
					success: (chooseImageRes) => {
						chooseImageRes.tempFilePaths = chooseImageRes.tempFilePaths.slice(0, 5)
						chooseImageRes.tempFilePaths.forEach(path => {
							if(list[i].uploadImgList.length < 5) {
								list[i].uploadImgList.push(path);
								that.$api.sysGetToken().then(res => {
									const token = res.data;
									that.$api.uploaderWebUploadServer({
										filePath: path,
										formData: {
											token: token
										}
									}).then(res => {
										list[i].imgPathList.push(JSON.parse(res.data).path)
										that.productCommentList = list;
									})
								})
							}
						})
					}
				})
			},
			previewImage(index, current) {
				uni.previewImage({
					current: current,
					urls: this.productCommentList[index].uploadImgList
				})
			},
			save() {
				let that = this
				uni.showLoading({
					mask: true,
					title:  that.$t('评价提交中')
				})
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					let that = this;
					let str = ''
					let data = this.productCommentList;
					let param = {}
					if(data.length === 1) {
						let grade;
						let pid = data[0].pid
						let skuId = data[0].skuId
						let serverIds = ''
						let imgPath = data[0].imgPathList.map(n => {
							return n;
						}).join()
						data[0].praise.forEach((n, i) => {
							if(n.checked) {
								grade = n.value
							}
						})
						let productScore = data[0].grade
						let content = data[0].content || ''
						let orderId = data[0].orderId
						let replyId = data[0].replyId
						param = {
							pid: this.isStringParam(pid),
							skuId: this.isStringParam(skuId),
							serverIds: this.isStringParam(serverIds),
							imgPath: this.isStringParam(imgPath),
							productScore: this.isStringParam(productScore),
							grade: this.isStringParam(grade),
							content: this.isStringParam(content),
							orderId: this.isStringParam(orderId),
							replyId: this.isStringParam(replyId),
							isAddComment: this.isAdditionalComment,
							serviceAttitudeScore: this.shopCommentList[0].grade,
							deliverySpeedScore: this.shopCommentList[1].grade,
							serviceAttitudeScore: this.shopCommentList[0].grade,
							deliverySpeedScore: this.shopCommentList[1].grade
						}
					} else {
						param = {
							pid: [],
							skuId: [],
							serverIds: [],
							imgPath: [],
							productScore: [],
							grade: [],
							content: [],
							orderId: [],
							replyId: [],
							serviceAttitudeScore: this.shopCommentList[0].grade,
							deliverySpeedScore: this.shopCommentList[1].grade
						}
						data.forEach((n, i) => {
							param.pid = [...param.pid, n.pid]
							param.skuId = [...param.skuId, n.skuId]
							param.serverIds = [...param.serverIds, n.serverIds || '']
							param.imgPath = [...param.imgPath, n.imgPathList.map(n => {
									return n;
								}).join()]
							param.productScore = [...param.productScore, n.productScore || '']
							param.grade = [...param.grade, n.grade]
							param.content = [...param.content, n.content || '']
							param.replyId = [...param.replyId, n.replyId || '']
						})
						param.orderId = data[0].orderId
						param.isAddComment = this.isAdditionalComment
					}
				
					this.$api.tradCommentSave(param).then(res => {
						uni.hideLoading()
						this.openErrMsg(res.message)
						setTimeout(_ => {
							uni.redirectTo({
								url: that.prefix.uCommentList
							})
						}, 200)
					}).catch(err => {
						uni.hideLoading()
						this.openErrMsg(err.message || '加载错误')
					})
				}, 200)
				
			},
			isStringParam(data) {
				if(typeof data === 'undefined' || data.length === 0) {
					return ''
				}
				return Array.isArray(data) ? data.join() : data
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
	.item-tit {
		color: red;
	}
	.comment-list {
		margin-top: 88upx;
		padding: 10upx 0upx 20upx;
	}
	.comment-item {
		border-top: 20upx solid #f5f5f5;
		padding: 10upx 20upx;
	}
	.comment-item:first-child {
		border: none;
	}
	.item-top {
		display: flex;
	}
	.top-img {
		width: 140upx;
		height: 140upx;
		flex-shrink: 0;
	}
	.top-right {
		padding-left: 10upx;
		width: 80%;
	}
	.right-tit,
	.right-grade {
		line-height: 1;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.right-grade {
		display: flex;
		align-items: center;
	}
	.right-grade.grade {
		margin-top: 20upx;
	}
	.grade-star {
		flex: auto;
		display: flex;
	}
	.grade-star .iconfont {
		font-size: 32upx;
		margin-right: 10upx;
		color: #ccc;
	}
	.grade-star .iconfont.active {
		color: #f1224b;
	}
	.grade-tit {
		margin-right: 10upx;
		color: #a0a0a0;
		line-height: 1.6;
	}
	.grade-radio {
		display: flex;
	}
	.grade-label {
		display: flex;
		align-items: center;
	}
	.text {
		padding: 10upx;
		width: auto;
		height: 120upx;
		border: 2upx solid #f7f7f7;
		border-radius: 6upx;
		box-shadow: 0 0 14upx #ececec inset;
		font-size: 28upx;
	}
	.item-upload {
		display: flex;
	}
	.item-text,
	.item-upload {
		margin-top: 20upx;
	}
	.upload {
		position: relative;
		margin-left: 10upx;
		box-sizing: border-box;
		border: 2upx solid #ccc;
	}
	.upload:before,
	.upload:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background-color: #d9d9d9;
	}
	.upload:before {
		width: 4upx;
		height: 80upx;
	}
	.upload:after {
		width: 80upx;
		height: 4upx;
	}
	.upload-img,
	.upload {
		width: 100upx;
		height: 100upx;
	}
	.upload-img {
		border: 2upx solid #ccc;
		margin-right: 10upx;
	}
	
	.shop-comment {
		padding: 20upx;
		border-top: 20upx solid #f5f5f5;
	}
	.shop-comment .grade-tit {
		color: #333;
		width: 300upx;
	}
	.shop-grade-tit {
		color: #a5a5a5;
	}
</style>
