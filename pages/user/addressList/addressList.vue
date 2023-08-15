<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" leftIcon="back" fixed="true" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('管理收货地址') }}</text>
			</view>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="address-view">
			<view class="address-list" v-if="addresList.length > 0">
				<view class="address-item"
					v-for="(item, index ) in addresList"
					:key="index"
				>
					<view class="item-up" @tap="checkedItem(item)">
						<view class="up-name">
							<view class="">{{ item.name }}</view>
							<view class="">{{ item.mobile }}</view>
						</view>
						<view class="up-addre">{{ item.provinceName + item.cityName + item.districtName + item.detailedAddress  }}</view>
					</view>
					<view class="item-down">
						<label @tap="radio(index, item.addressId)">
							<checkbox value="13" :checked="item.isDefault" style="display: none;" />
							<text class="iconfont" :class="item.isDefault == '1' ? 'icon-success' : 'icon-success-copy1'"></text>{{ $t('设为默认') }}
						</label>
						<view class="down-btn">
							<view class="btn-item" @tap="edit(item.addressId)">
								<text class="iconfont icon-edit"></text>{{ $t('编辑') }}
							</view>
							<view class="btn-item btn-red" @tap="deleteAddres(index, item.addressId)">
								<text class="iconfont icon-delete"></text>{{ $t('删除') }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="addres" v-if="addresList.length < 20">
				<view class="addres-btn" @tap="addAddress">
					{{ $t('新增一个收货地址') }}
				</view>
			</view>
		</view>

		<view class="no-msg addres address-view" :style="{ marginTop: barHeight('statusBarHeight') + 'px'}" v-if="addresList.length === 0 && loadFinish">
			<fine-icon type="xiaoxi1" size="100"></fine-icon>
			<view class="addres-btn addres-btn-no" @tap="addAddress">{{ $t('暂无收货地址，添加一个吧') }}</view>
		</view>
		

	</view>
</template>

<script>
	import { mapMutations } from "vuex"
	export default {
		data() {
			return {
				addresList: [],
				addressId: '',
				loadFinish: false,
				userOrderOk: null
			}
		},
		onLoad(param) {
			this.userOrderOk = param.userOrderOk || null
		},
		onShow() {
			this.init()
		},
		methods: {
			...mapMutations(['updateOrderOkAddressMsg']),
			
			/**
			 * 设置默认地址
			 */
			radio(index, addressId) {
				if(this.addresList[index].isDefault === '1') return;
				this.addresList.forEach((item, i) => {
					this.addresList[i].isDefault = i == index ? '1' : '0'
				})
				this.$api.userAddressDefault({
					addressId: addressId,
					isDefault: this.addresList[index].isDefault
				}).then(res => {
					uni.showToast({
						title: res.message,
						duration: 1000,
						icon: 'none'
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			/**
			 * 删除地址
			 */
			deleteAddres(index, addId) {
				let that = this
				uni.showModal({
					title: that.$t('确认删除'),
					content: that.$t('您确定要删除该地址嘛'),
					showCancel: true,
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success: res => {
						if(res.confirm) {
							that.$api.userAddressDelete({addressId: addId}).then(res => {
								let arr = that.addresList
								arr.splice(index, 1)
								that.addresList = arr
								uni.showToast({
									title: res.message,
									duration: 1000,
									icon: 'none'
								})
							}).catch(err => {
								this.openErrMsg(err.message || '加载错误')
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
				this.$api.userAddressList().then(res => {
					this.addresList = res.data
					this.loadFinish = true
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			addAddress() {
				let that = this
				uni.navigateTo({
					url: that.prefix.uAddressForm + '?addressId='
				});
			},
			edit(addId) {
				let url = this.prefix.uAddressForm
				uni.navigateTo({
					url: url + '?addressId=' + addId
				})
			},
			checkedItem(data) {
				if(this.userOrderOk === 'ok') {
					this.updateOrderOkAddressMsg(JSON.stringify(data))
					this.back()
				}
			}
		}
	}
</script>

<style>
	.address-view view {
		font-size: 24upx;
		font-weight: 300;
		font-family: sans-serif;
	}
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
	.address-item {
		padding: 6upx 20upx 0;
		border-top: 10upx solid #f5f5f5;
	}
	.address-item:first-child {
		border-top: none;
	}

	.item-up {
		border-bottom: 2upx solid #f3f3f3;
	}
	.item-up > .up-name,
	.item-down {
		font-size: 30upx;
		display: flex;
		justify-content: space-between;
	}
	.item-up .up-name view {
		font-size: 32upx;
	} 
	.down-btn {
		display: flex;
		justify-content: flex-end;
	}
	.btn-item {
		padding: 0 20upx;
		line-height: 72upx;
	}
	.btn-item .iconfont {
		margin-right: 4upx;
	}
	.iconfont {
		line-height: 72upx;
		font-size: 24upx;
	}
	.addres {
		margin-bottom: 40upx;
		padding: 40upx 20upx;
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
	.addres-btn-no {
		margin-top: 20upx;
	}
	
</style>
