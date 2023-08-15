<template>
	<view>
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ title }}</text>
			</view>
		</uni-nav-bar>
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('收货人') }}
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" :placeholder="$t('请输入姓名')" v-model="name" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('手机号') }}
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" type="number" :placeholder="$t('请输入手机号')" v-model="tel" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('地址') }}
				</view>
				<view class="uni-list-cell-db">
					<view class="uni-input" @click="showMulLinkageThreePicker">{{addre}}</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<textarea class="textarea" :placeholder="$t('请输入详细地址')" v-model="addresDetail"/>
			</view>
			<view class="uni-list-cell" style="padding: 6px 0;">
				<label @tap="checked = !checked" class="cell-radio">
					<checkbox value="13" :checked="checked" style="display: none;" />
					<text class="iconfont" :class="checked ? 'icon-success' : 'icon-success-copy1'"></text>{{ $t('设为默认') }}
				</label>
			</view>
		</view>
		
		<view class="btn">
			<button type="warn" class="mui-btn mui-btn-danger" @click="save">{{ $t('保存') }}</button>
		</view>
		<mpvue-city-picker v-if="showMpvue" :themeColor="themeColor" ref="mpvueCityPicker" :defaultId="defaultId"
			@onCancel="onCancel" @onConfirm="onConfirm">
		</mpvue-city-picker>
		
		
	</view>
</template>

<script>
	import mpvueCityPicker from '../../../components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		data() {
			return {
				themeColor: '#007AFF',
				defaultId: [],
				addressId: '',
				name: '',
				tel: '',
				addre: '',
				addresDetail: '',
				provinceId: '',
				provinceName: '',
				cityId: '',
				cityName: '',
				districtId: '',
				districtName: '',
				checked: false,
				showMpvue: false,
				title: ''
			}
		},
		components:{
			mpvueCityPicker,
		},
		onLoad(param) {
			let that = this
			uni.showLoading({
				title: that.$t('加载中')
			})
			this.addressId = param.addressId || ''
			if(this.addressId) {
				this.title = that.$t('编辑收货地址')
				this.edit()
			} else{
				this.title = that.$t('添加收货地址')
				setTimeout(() => {
					// 延迟加载地址选择器
					this.showMpvue = true
					setTimeout(() => {
						uni.hideLoading()
					}, 300)
				}, 200)
				return false
			}
		},
		// mounted() {
			
		// },
		methods: {
			// 地址选择器取消
			onCancel(e) {
				console.log(e)
			},
			// 地址选择器确认
			onConfirm(e) {
				this.addre = e.label[0].name + e.label[1].name + e.label[2].name
				this.provinceId = e.label[0].id
				this.provinceName = e.label[0].name
				this.cityId = e.label[1].id
				this.cityName = e.label[1].name
				this.districtId = e.label[2].id
				this.districtName = e.label[2].name
			},
			// 显示地址选择器
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			
			backIndex() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uIndex
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			// init() {
			// 	this.addressId = ''
			// 	this.name = ''
			// 	this.tel = ''
			// 	this.provinceId = ''
			// 	this.provinceName = ''
			// 	this.cityId = ''
			// 	this.cityName = ''
			// 	this.districtId = ''
			// 	this.districtName = ''
			// 	this.addresDetail = ''
			// 	this.checked = null
			// 	this.addre = null
			// 	this.defaultId = []
			// },
			edit() {
				this.$api.userAddressOne({addressId: this.addressId}).then(res => {
					let data = res.data
					// this.addressId = data.addressId
					this.name = data.name
					this.tel = data.mobile
					this.provinceId = data.provinceId
					this.provinceName = data.provinceName
					this.cityId = data.cityId
					this.cityName = data.cityName
					this.districtId = data.districtId
					this.districtName = data.districtName
					this.addresDetail = data.detailedAddress
					this.checked = data.isDefault == '1' ? true : false
					this.addre = data.provinceName + data.cityName + data.districtName
					if(data.provinceId && data.cityId && data.districtId) {
						let arr = []
						arr.push(data.provinceId)
						arr.push(data.cityId)
						arr.push(data.districtId)
						this.defaultId = arr
					}
					this.showMpvue = true
					setTimeout(() => {
						uni.hideLoading()
					}, 300)
				}).catch(err => {
					uni.hideLoading()
					this.openErrMsg(err.message || '加载错误')
				})
				
			},
			save() {
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.name).isRequired('请填写姓名')
						 .data(this.tel).isRequired('请填写手机号').isPhone('手机号码有误，请重填')
						 .data(this.provinceId).isRequired('请选择地址')
						 .data(this.addresDetail).isRequired('请填写详细地址')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}

				let addressSave = this.addressId ? this.$api.userAddressEdit : this.$api.userAddressSave
				let param = {
					addressId: this.addressId,
					name: this.name,
					mobile: this.tel,
					provinceId: this.provinceId,
					provinceName: this.provinceName,
					cityId: this.cityId,
					cityName: this.cityName,
					districtId: this.districtId,
					districtName: this.districtName,
					detailedAddress: this.addresDetail,
					isDefault: this.checked ? 1 : 0
				}
				addressSave(param).then(res => {
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

<style scoped>
	.uni-list view,
	.uni-list .uni-input {
		line-height: 1.8;
		font-weight: 300;
		font-family: unset;
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
		/* line-height:60upx; */
		align-items: center;
	}
	.uni-list-cell .uni-list-cell-left {
		width: 120upx;
		text-align-last: justify;
		color: #999;
		line-height: 1
	}
	.uni-list-cell-db:first-child {
		padding: 20upx 0;
		height: 100upx;
	}
	.uni-list-cell:after {
		right: 32upx;
	}
	.uni-input {
		color: #343434;
	}
	.textarea {
		padding: 20upx 30upx;
		height: 100upx;
		color: #343434;
		font-size: 30upx;
	}
	.cell-radio {
		padding: 0 30upx;
	}
	.uni-list {
		padding-top: 10upx;
	}
	.btn {
		margin: 20upx auto;
		padding: 0 30upx;
		width: 88%;
		box-sizing: border-box;
	}
	.btn .mui-btn {
		background: #f1224b;
	}
	
	/* .form {
		position: absolute;
		top: 0;
		bottom: 0;
		transform: translateX(100%);
		width: 100%;
		background: #fff;
		z-index: 100;
		transition: all 0.2s ease-out;
	}
	.form.visibel-form {
		transform: translateX(0)
	} */
	.icon-success-copy1, .icon-success {
		font-size: 24upx;
	}
</style>
