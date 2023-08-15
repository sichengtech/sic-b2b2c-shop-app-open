<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('商品咨询') }}</text>
			</view>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="product-wrap">
			<view class="wrap-item-first">
				<image class="wrap-img" :src="productImg + imgShrink(75, 75)" mode="" />
			</view>
			<view class="wrap-tit">{{ productName }}</view>
		</view>
		
		<view class="consult">
			<view class="consult-type">
				<text class="type-tit">{{ $t('咨询类型') }}:</text>
				<view class="type-option">
					<button class="mini-btn" 
						v-for="(item, index) in btnCheckedList" 
						:type="item.checked ? 'warn' : 'default'" 
						size="mini" @tap="select(index)" :key="index"
					>{{ item.label }}</button>
				</view>
			</view>
			<view class="consult-content">
				<view class="content-tit">
					<text>{{ $t('咨询内容') }}:</text>
				</view>
				<view class="content-text">
					<textarea class="textarea" value="" :placeholder="$t('请填写你需要的咨询')" v-model="textMsg" />
				</view>
			</view>
		</view>
		
		<view class="submit-content">
			<button type="warn" @tap="save">{{ $t('保存') }}</button>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
				productImg: '',
				productName: '',
				btnCheckedList: [],
				textMsg: '',
				seleValue: '',
				pid: '',
			}
		},
		onLoad(param) {
			this.pid = param.pid || ''
			this.init()
		},
		methods:{
			select(index) {
				this.btnCheckedList.forEach((n, i) => {
					if(index == i) {
						this.seleValue = this.btnCheckedList[i].value
						this.btnCheckedList[i].checked = true
					} else {
						this.btnCheckedList[i].checked = false
					}
				})
			},
			
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
				let that = this
				this.$api.sysDictList({type:'trade_consultation_categor'}).then(res => {
					let datum = []
					res.data.forEach((n) => {
						n.checked = false
						datum.push(n)
					})
					that.btnCheckedList = datum
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				this.$api.productOne({ pid: that.pid }).then(res => {
					let datum = res.data
					that.productImg = that.url + datum.image
					that.productName = datum.name
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			save() {
				let that = this
				let param = {
					pid: that.pid,
					content: that.textMsg,
					category: that.seleValue
				}
				this.$api.tradeConsultationSave(param).then(res => {
					uni.showLoading({
						title: that.$t('提交成功')
					})
					uni.navigateBack({
						delta: 1
					})
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
		flex-wrap:nowrap;
		margin:14upx 0;
		line-height:60upx!important;
		font-size: 32upx;
	}
	.product-wrap {
		display: flex;
		padding: 20upx 20upx 6upx;
		background: #f5f5f5;
	}
	.wrap-item-first {
		margin-right: 20upx;
	}
	.wrap-img {
		width: 100upx;
		height: 100upx;
		border: 2upx solid #ccc;
	}
	.consult {
		padding: 20upx;
	}
	.type-option .mini-btn {
		margin: 10upx;
		padding: 6upx 10upx;
	}
	.mini-btn[type=warn],
	[type=warn] {
		background: #f1224b;
	}
	.textarea {
		border: 2upx solid #f1f1f1;
		width: 100%;
		padding: 6upx;
		font-size: 28upx;
	}
	.submit-content {
		padding: 20upx;
	}
</style>
