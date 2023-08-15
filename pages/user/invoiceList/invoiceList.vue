<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('发票信息列表') }}</text>
			</view>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="invoice" v-if="invoiceList.length > 0">
			<view class="address-list">
				<view class="address-item" v-for="(item, index) in invoiceList" :key="index">
					<view class="item-up" @tap="checkedItem(item)">
						<view class="up-name">
							<view class="" v-if="item.deliverType">{{ $t('发票类型') }}: {{ item.deliverType }}</view>
						</view>
						<view class="up-addre">{{ $t('公司名称') }}: {{ item.companyName }}</view>
					</view>
					<view class="item-down">
						<label @tap="radio(index, item.deliverId)">
							<checkbox value="13" :checked="item.hbjbuyer" style="display: none;" />
							<text class="iconfont" :class="item.hbjbuyer == '1' ? 'icon-success' : 'icon-success-copy1'"></text>{{ $t('设为默认') }}
						</label>
						<view class="down-btn">
							<view class="btn-item">
								<text class="iconfont icon-edit" @tap="edit(item.deliverId)">{{ $t('编辑') }}</text>
							</view>
							<view class="btn-item btn-red" @tap="deliverDelete(index, item.deliverId)">
								<text class="iconfont icon-delete">{{ $t('删除') }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="addres">
				<view class="addres-btn" @tap="addInvoice">
					{{ $t('新增发票信息') }}
				</view>
			</view>
		</view>

		<view class="no-msg" v-if="invoiceList.length === 0 && loadFinish">
			<fine-icon type="xiaoxi1" size="100"></fine-icon>
			<view class="addres-btn" @tap="addInvoice">{{ $t('暂无发票，添加一个吧') }}</view>
		</view>
		
	</view>
</template>

<script>
import { mapMutations } from "vuex"
	export default {
		data() {
			return {
				deliverType: [],
				invoiceList: [],
				deliverId: '',
				userOrderOk: null,
				loadFinish: false,
			}
		},
		onLoad(param) {
			this.userOrderOk = param.userOrderOk || null
		},
		onShow() {
			this.init()
		},
		methods: {
			...mapMutations(['updateDeliver']),
			
			/**
			 * 设置默认发票
			 */
			radio(index, deliverId) {
				if(this.invoiceList[index].hbjbuyer === '1') return;
				this.invoiceList.forEach((item, i) => {
					this.invoiceList[i].hbjbuyer = i == index ? '1' : '0'
				})
				let param = {
					deliverId: deliverId,
					hbjbuyer: this.invoiceList[index].hbjbuyer
				}
				this.$api.tradeDeliverDefault(param).then(res => {
					this.openErrMsg(res.message)
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			/**
			 * 删除发票
			 */
			deliverDelete(index, addId) {
				let that = this
				uni.showModal({
					title: that.$t('确认删除'),
					content:that.$t('您确定要删除该发票信息嘛'),
					showCancel: true,
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success: res => {
						if(res.confirm) {
							that.$api.tradeDeliverDelete({deliverId: addId}).then(res => {
								let arr = that.invoiceList
								arr.splice(index, 1)
								that.invoiceList = arr
								that.openErrMsg(res.message)
							}).catch(err => {
								that.openErrMsg(err.message || '加载错误')
							})
						}
					},
					fail: () => {},
					complete: () => {}
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
				let param = {
						type: 'deliver_type',
						values: '1,2,3'
					}
				this.$api.sysDictLabelList(param).then(res => {
					this.deliverType = res.data
					this.$api.tradeDeliverList().then(res => {
						if(res.data && res.data.length) {
							this.invoiceList = res.data.map(item => {
								item.deliverType = this.deliverType.filter(val => val.value === item.deliverType)[0].label
								return item
							})
						} else {
							this.invoiceList = []
						}
						this.loadFinish = true
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
				
			},
			addInvoice() {
				let url = this.prefix.uInvoiceForm
				uni.navigateTo({
					url: url + `?deliverId=`
				})
			},
			edit(deliverId) {
				let url = this.prefix.uInvoiceForm
				uni.navigateTo({
					url: url + `?deliverId=${deliverId}`
				})
			},
			checkedItem(data) {
				if(this.userOrderOk === 'ok') {
					this.updateDeliver(data)
					this.back()
				}
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
	}
	.address-item {
		padding: 20upx;
		border-top: 10upx solid #f5f5f5;
	}
	.address-item:first-child {
		border-top: none;
	}
	.item-up {
		border-bottom: 2upx solid #d5d5d5;
	}
	.up-name,
	.item-down {
		display: flex;
		justify-content: space-between;
	}
	.down-btn {
		display: flex;
		justify-content: flex-end;
	}
	.btn-item {
		padding: 0 20upx;
		line-height: 72upx;
	}
	.iconfont {
		line-height: 72upx;
	}
	.btn-item .iconfont {
		font-size: 28upx;
	}
	.addres {
		/* margin-top: 40upx; */
		padding: 40upx 20upx 0;
		border-top: 10upx solid #f5f5f5;
	}
	.addres-btn {
		background: #f1224b;
		color: #fff;
		text-align: center;
		border-radius: 10upx;
		font-size: 30upx;
		height: 80upx;
		line-height: 80upx;
	}
</style>
