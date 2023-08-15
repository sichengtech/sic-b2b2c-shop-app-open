<template>
	<view>
		
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('发票信息设置') }}</text>
			</view>
		</uni-nav-bar>
		
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('发票类型') }}:
				</view>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :canceltext="$t('取消')" :confirmtext="$t('设置')" :value="index" :range="invoiceArray" range-key="label">
						<input class="uni-input" disabled :placeholder="$t('请选择发票类型')" v-model="invoiceType" />
					</picker>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('公司名称') }}:
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" :placeholder="$t('请输入公司名称')" v-model="firmName" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('纳税人识别号') }}:
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" type="text" :placeholder="$t('请输入纳税人识别号')" v-model="discernNum" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('开户行') }}:
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" :placeholder="$t('请输入开户行')" v-model="openingBank" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('账号') }}:
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" type="number" :placeholder="$t('请输入账号')" v-model="accountNum" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('地址') }}:
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" :placeholder="$t('请输入地址')" v-model="address" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('手机号') }}:
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" type="number" :placeholder="$t('请输入手机号')" v-model="tel" />
				</view>
			</view>
		</view>
		
		<view class="set-default">
			<view class="uni-list-cell">
				<view class="uni-list-cell-db uni-list-cell-left" @tap="setDefault">
					<checkbox-group class="footer-all">
						<view class="uni-list-cell-b">
							<checkbox :checked="checked" style="display: none;" />
							<fine-icon :type="checked ? 'success' : 'success-copy1'" />
							<text>{{ $t('设为默认') }}</text>
						</view>
					</checkbox-group>
				</view>
			</view>
		</view>
		
		<view class="btn-wrap">
			<view class="invoice-save" @tap="save">{{ $t('保存') }}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				invoiceArray: [],
				index: 0,
				checked: false,
				invoiceType: '',
				firmName: '',
				discernNum: '',
				openingBank: '',
				accountNum: '',
				address: '',
				tel: '',
				deliverId: null
			}
		},
		onLoad(param) {
			this.deliverId = param.deliverId || null
		},
		mounted() {
			this.init()
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
			
			setDefault() {
				this.checked = !this.checked
			},
			bindPickerChange(e) {
				this.index = e.detail.value
				this.invoiceType = this.invoiceArray[this.index].label
			},
			init() {
				this.$api.sysDictList({type: 'deliver_type'}).then(res => {
					this.invoiceArray = res.data
					if(this.deliverId) {
						this.edit()
					}
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			edit() {
				this.$api.tradeDeliverOne({deliverId: this.deliverId}).then(res => {
					let data = res.data
					this.deliverId = data.deliverId
					this.firmName = data.companyName
					this.discernNum = data.axpayerIdentityNumber
					this.openingBank = data.openingBank
					this.accountNum = data.accountNumber
					this.address = data.address
					this.tel = data.phone
					this.checked = data.hbjbuyer == 0 ? false : true
					this.index = +data.deliverType
					this.invoiceType = this.invoiceArray.filter(val => val.value === data.deliverType)[0].label
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			save() {
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.tel).isRequired('手机号码不能为空').isPhone('手机号码有误，请重填')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				let saveMethod = this.deliverId ? this.$api.tradeDeliverEdit : this.$api.tradeDeliverSave
				let data = {
					deliverId: this.deliverId,
					companyName: this.firmName,
					axpayerIdentityNumber: this.discernNum,
					openingBank: this.openingBank,
					accountNumber: this.accountNum,
					address: this.address,
					phone: this.tel,
					deliverType: this.invoiceArray[this.index].value
				}
				if(this.checked) {
					data.hbjbuyer = +this.checked
				}

				saveMethod(data).then(res => {
					uni.showLoading({
						title: res.message
					})
					setTimeout(() => {
						this.back()
					}, 500)
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
				
			}
		}
	}
</script>

<style lang="scss">
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
	.uni-list-cell-left {
		padding: 12upx 30upx;
		width: 192upx;
	}
	.set-default {
		border-top: 14upx solid #f5f5f5;
	}
	.uni-list-cell:after {
		right: 32upx;
	}
	.btn-wrap {
		padding: 20upx;
		.invoice-save {
			background: #f1224b;
			color: #fff;
			text-align: center;
			border-radius: 10upx;
			font-size: 30upx;
			height: 80upx;
			line-height: 80upx;
		}
	}
</style>
