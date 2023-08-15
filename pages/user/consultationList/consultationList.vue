<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" leftIcon="back" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('我的咨询') }}</text>
			</view>
		</uni-nav-bar>

		<my-tab :list="tabList" fixedHeight="commList" @tapTab="tapTab"></my-tab>
		<view :style="{ height: barHeight('barHeight') + 'px' }"></view>
		<!-- 列表 -->
		<view class="list" v-if="!noData && dictCategor">
			<view class="list-item" v-for="(item, index) in lists" :key="index">
				<view class="list-row ask">
					<view class="consult-type">{{ $t('咨询类型') }}</view>
					<text class="ask-tit">{{ dictCategor[item.category - 1].label || '' }}</text>
				</view>
				<view class="list-row ask">
					<text class="icon-gb-radius icon-ask">{{ $t('问') }}</text>
					<text class="ask-tit">{{ item.content }}</text>
				</view>
				<!-- <view class="list-row answer" v-if="item.answerTit">
					<text class="icon-gb-radius" :class="{ 'icon-answer': !item.answerTit }">答</text>
					<text class="answer-tit">{{ item.answerTit || '暂无回答' }}</text>
				</view> -->
				<view class="list-row answer" v-if="item.replyTradeConsultation">
					<text class="icon-gb-radius icon-answer">{{ $t('答') }}</text>
					<text class="answer-tit">{{ item.replyTradeConsultation.content || $t('暂无回答') }}</text>
				</view>
				<view class="list-row por-flex">
					<view class="por-group" v-if="item.name">
						<image class="por-img" :src="item.image + imgShrink(90, 90)" mode="" />
					</view>
					<view class="por-name" v-if="item.name">{{ item.name }}</view>
					<view v-else>{{ $t('商品已删除') }}</view>
				</view>
				
				<view class="list-row consult-date">
					<text class="date-tit">{{ $t('咨询时间') + ': '  + item.createDate }}</text>
				</view>
			</view>
			<uni-load-more :loadingType="loadingType"></uni-load-more>
		</view>
		<view class="no-msg" v-if="noData">
			<fine-icon type="xiaoxi1" size="100"></fine-icon>
			<view class="">{{ $t('暂时还没有咨询信息哦') }}~</view>
		</view>
	</view>
</template>

<script>
	import myTab from '../../../components/tab.vue'
	export default {
		data() {
			return {
				productShow: 1,
				lists: [],
				filterList: [],
				dictCategor: [], //字典
				noData: false,
				loadingType: 0,
				pageNo: 1,
				pageSize: 10,
				active: 0,
				tabList: [
					{	tit: '全部咨询',
						checked: true
					}, {
						tit: '已回复咨询',
						checked: false
					}, {
						tit: '未回复咨询',
						checked: false
					}
				],
			}
		},
		components: {
			myTab,
		},
		mounted() {
			this.getDict()
			this.init()
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.pageNo = ++this.pageNo
			this.loadingType = 1;
			this.init((data)=>{
				this.lists = this.lists.concat(data.data)
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
			
			tapTab(index) {
				this.active = index
				this.pageNo = 1
				this.loadingType = 0
				this.lists = []
				this.init()
			},
			getDict() {
				let that = this
				this.$api.sysDictLabelList({
					type: 'trade_consultation_categor',
					values: '4,3,2,1'
				}).then(res => {
					that.dictCategor = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			init(callback) {
				let that = this
				let param = {
						type: 0,
						isReply: that.active ? that.active : '' ,
						pageNo: that.pageNo,
						pageSize: that.pageSize
					}
				let skuPromise = new Promise((resolve, reject) => {
					this.$api.tradeConsultationPage(param).then(res => {
						if(res.page.isLastPage) {
							this.loadingType = 2
						} else {
							this.loadingType = 0
						}
						if(!res.data || res.data.length == 0) {
							// this.openErrMsg('暂无咨询')
							that.noData = true
							return false
						} else {
							let datum = res
							let arr = []
							let obj = {}
							datum.data.forEach((n, i) => {
								arr.push(n.pid)
							})
							obj = {
								arr,
								infoData: datum
							}
							return resolve(obj)
						}
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}).then((obj)=> {
					let str = obj.arr.join(),
						page = obj.infoData.page,
						infoData = obj.infoData.data,
						that = this
					this.$api.productList({pids: str}).then(res => {
						let datum = res.data.productList
						let reg = new RegExp(that.prefix.baseImgUrl)
						infoData.forEach((n, i) => {
							datum.forEach((m, j) => {
								if(n.pid == m.pid) {
									if(!reg.test(m.image)) {
										m.image = that.prefix.baseImgUrl + m.image
									}
									infoData[i] = Object.assign({}, n, m)
								}
							})
						})
						infoData.length == 0 ? that.noData = true : that.noData = false,
						callback ? callback({
							data: infoData,
							page
						}) : that.lists = infoData
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}).catch((err) => {
					that.noData = true
					this.openErrMsg(err.message || '加载错误')
				})
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
	}
	.commodity-price {
		color: #999;
	}
	
	
	.list {
		height: 100%;
		background: #f5f5f5;
	}
	.list-item {
		padding: 14upx 16upx;
		margin-bottom: 20upx;
		background: #fff;
	}
	.list-row.ask,
	.list-row.answer {
		display: flex;
    	align-items: baseline;
	}
	.icon-gb-radius {
		display: inline-block;
		padding: 0 4upx;
		margin-right: 6upx;
		width: 30upx;
		height: 36upx;
		line-height: 36upx;
		border-radius: 50%;
		text-align: center;
		color: #fff;
	}
	.icon-ask {
		background: #f91;
	}
	.icon-answer {
		background: #9b1;
	}
	.answer-tit {
		color: #ccc;
	}
	.ask .ask-tit {
		font-size: 28upx;
		font-weight: 700;
		word-break: break-all;
	}
	.date-tit {
		display: block;
		color: #b5b5b5;
		font-size: 24upx;
		text-align: right;
	}
	.consult-type {
		display: inline-block;
		padding: 0 10upx;
		margin-right: 10upx;
		line-height: 1.6;
		background: #ef4f4f;
		color: #fff;
		border-radius: 20upx;
		font-size: 24upx;
	}
	.por-flex {
		display: flex;
		padding: 10upx;
		background: #f5f5f5;
	}
	.por-group {
		width: 120upx;
		height: 120upx;
	}
	.por-name {
		width: 550upx;
		margin-left: 20upx;
		line-height: 1.2;
	}
</style>
