<template>
	<view>
		
		<!-- 头部 -->
		<!-- <view class="header">
			<view class="header-item" @tap="back">
				<uni-icons type="back" color="#333333" size="22"></uni-icons>
			</view>
			<view class="header-item">
				商品咨询
			</view>
			<view class="header-item" @tap="gotoForm">
				<view class="iconfont">
					<fine-icon type="xiaoxi5" size="20"></fine-icon>发起咨询
				</view>
			</view>
		</view> -->
		<uni-nav-bar color="#333333" v-if="showBar" rightWidth="max-right" fixed="true" @click-left="back"
			@click-right="gotoForm">
			<view class="input-view">
				<text class="view-text">{{ $t('商品咨询') }}</text>
			</view>
			<block slot="right">
				<view class="header-item">
					<view class="iconfont">
						<fine-icon type="xiaoxi5" size="12"></fine-icon>  {{ $t('发起咨询') }}
					</view>
				</view>
			</block>
		</uni-nav-bar>
		<view class="btn">
			<view class="text" @tap="gotoForm">{{ $t('发起咨询') }}</view>
		</view>
		<!-- 列表 -->
		<view class="list" v-if="lists && dictCategor">
			<view class="list-item" v-for="(item, index) in lists" :key="index">
				<view class="list-row ask">
					<view class="consult-type">{{ $t('咨询类型') }}</view>
					<text class="ask-tit">{{ dictCategor[item.category - 1].label ? dictCategor[item.category - 1].label : '' }}</text>
				</view>
				<view class="list-row ask">
					<text class="icon-gb-radius icon-ask">{{ $t('问') }}</text>
					<text class="ask-tit">{{ item.content }}</text>
				</view>
				<view class="list-row answer">
					<text class="icon-gb-radius icon-answer">{{ $t('答') }}</text>
					<text class="answer-tit">{{ item.replyTradeConsultation && item.replyTradeConsultation.content || $t('暂无回答') }}</text>
				</view>
				<view class="list-row consult-date">
					<text class="date-tit">{{ $t('咨询时间') }}：{{ item.createDate }}</text>
				</view>
			</view>
			<uni-load-more :loadingType="loadingType" v-if="!lists"></uni-load-more>
		</view>
		
		<view class="no-msg" v-if="noData">
			<fine-icon type="xiaoxi1" size="100"></fine-icon>
			<view class="">{{ $t('暂时还没有咨询信息哦') }}</view>
		</view>
		
		
	</view>
</template>

<script>
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
				dictCategor: [], //字典
				noData: false,
				loadingType: 0,
				lists: [],
				ppid: this.pid,
				pageNo: 1,
				pageSize: 10,
			}
		},
		onLoad(param) {
			if(param.pid) {
				this.ppid = param.pid
				this.getDict()
				this.init()
			}
		},
		onShow() {
			if(this.pid) this.getDict(),this.init();
		},
		created() {
			if(this.pid) this.getDict(),this.init();
		},
		onReachBottom() {
			if (this.loadingType !== 0) {
				return;
			}
			this.loadingType = 1
			this.pageNo = this.pageNo + 1
			this.init((data)=>{
				this.lists = this.lists.concat(data.data)
				data.page.isLastPage ? this.loadingType = 2 : this.loadingType = 0
				
			})
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			gotoForm() {
				let that = this
				uni.navigateTo({
					url: that.prefix.uConsultationForm + '?pid=' + that.pid
				})
			},
			
			getDict() {
				let that = this
				this.$api.sysDictList({type:'trade_consultation_categor'}).then(res => {
					that.dictCategor = res.data
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			init(callback) {
				let that = this
				let param = {
					pid: that.ppid,
					pageNo: that.pageNo,
					pageSize: that.pageSize
				}
				this.$api.productConsultationPage(param).then(res => {
					let datum = res.data

					that.noData = !datum || datum.length === 0
					// let consultationIdList = []
					// datum.forEach(item => {
					// 	consultationIdList.push(item.consultationId)
					// })
					// this.$api.productConsultationList({
					// 	consultationIds: consultationIdList.join(),
					// 	type: 1
					// }).then(res => {
					// 	let data = []
					// 	datum.forEach(item => {
					// 		res.data.forEach((childItem, index) => {
					// 			console.log(item, childItem)
					// 			if(item.consultationId === childItem.replyId) {
					// 				item.answer = childItem.content
					// 				data.push(Object.assign({}, item, childItem))
					// 				console.log(data)
					// 			}
					// 		})
					// 	})
					// })




					callback ? callback(res) : that.lists = datum
				}).catch(err => {
					this.loadingType = 2
					this.errMsg = err.errMsg
				})
			}
		}
	}
</script>

<style scoped>
	.no-msg {
		margin-top: 0;
		background: #fff;
	}
	.btn {
		display: flex;
		justify-content: flex-end;
		background: #fff;
	}
	.text {
		padding: 4upx;
		background: #f3f3f3;
		width: 20%;
		border-radius: 40upx;
		text-align: center;
		color: #ff0000;
		margin: 10upx;
	}
	.header {
		position: fixed;
		top: var(--status-bar-height);
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
	}
	.header-item:first-child {
		width: 100%;
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
	.header-item:last-child .iconfont {
		color: red;
		line-height: 88upx;
		font-size: 24upx;
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
	.icon-gb-radius {
		flex-shrink: 0;
		display: inline-block;
		padding: 0 4upx;
		margin-right: 10upx;
		width: 80upx;
		height: 36upx;
		line-height: 36upx;
		border-radius: 50%;
		text-align: center;
		color: #fff;
		font-size: 26upx;
	}
	.icon-ask {
		color: #f91;
	}
	.icon-answer {
		color: #9b1;
	}
	.answer-tit {
		color: #bababa;
	}
	.ask .ask-tit {
		line-height: 36upx;
		font-size: 28upx;
		font-weight: 700;
		word-break: break-all;
	}
	.answer {
		display: flex;
		line-height: 36upx;
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
	.list-row.ask {
		display: flex;
		margin-bottom: 20upx;
	}
</style>
