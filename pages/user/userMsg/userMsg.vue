<template>
	<view>
		<uni-nav-bar color="#333333" fixed="true" @click-left="back" @click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('账号信息') }}</text>
			</view>
			<block slot="right">
				<view class="city">
					<view class="home"></view>
				</view>
			</block>
		</uni-nav-bar>

		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="uni-list">
			<view class="uni-list-cell height">
				<view class="uni-list-cell-left">
					{{ $t('头像') }}
				</view>
				<view class="uni-list-cell-db" style="padding: 0 12px;">
					<image class="list-img" :src="imgPath" :data-src="imgPath" mode="" @tap="previewImage" />
					<text class="updatetext" @tap="chooseImage">
						{{ $t('头像上传') }}
					</text>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('用户名') }}
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" :placeholder="$t('请输入用户名')" v-model="name" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('真实姓名') }}
				</view>
				<view class="uni-list-cell-db">
					<input class="uni-input" :placeholder="$t('请输入真实姓名')" maxlength="64" v-model="realName" />
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('性别') }}
				</view>
				<view class="uni-list-cell-db" >
					<block v-if="array.length">
						<picker  @change="bindPickerChange" :canceltext="$t('取消')" :confirmtext="$t('设置')" :value="sexIndex" :range="array" range-key="label">
							<view class="uni-input">{{array[sexIndex].label || Date.now()}}</view>
						</picker>
					</block>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('出生日期') }}
				</view>
				<view class="uni-list-cell-db">
					<picker mode="date" :value="date" :canceltext="$t('取消')" :confirmtext="$t('设置')" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('地址') }}
				</view>
				<view class="uni-list-cell-db">
					<view class="uni-input" @tap="showMulLinkageThreePicker">{{addre}}</view>
				</view>
			</view>
		</view>
		
		<view class="btn">
			<button type="warn" class="mui-btn mui-btn-danger" @tap="save">{{ $t('保存') }}</button>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :defaultId="defaultId"
			@onCancel="onCancel" @onConfirm="onConfirm">
		</mpvue-city-picker>
		
		
	</view>
</template>

<script>
	import mpvueCityPicker from '../../../components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		data() {
			return {
				imgPath: '',
				imgStoragePath: '',
				date: '',
				array: '',
				sexIndex: 0,
				name: '',
				realName: '',
				site: '',
				themeColor: '#007AFF',
				defaultId: [],
				addre: '',
				addreList: null
			};
		},
		components:{
			mpvueCityPicker
		},
		onLoad() {
			
		},
		mounted() {
			this.init()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
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
			init() {
				this.name = this.$storage.getStore(this.$storage.keyVal).user.userName
				let that = this
				Promise.all([
					this.$api.userMember(),
					this.$api.sysDictList({type: 'sex'})
				]).then(res => {
					let datum = res[0].data
					that.addre = datum.provinceName + datum.cityName + datum.districtName
					that.date = datum.birthday
					that.realName = datum.realName && datum.realName.replace("'", "")
					that.sexIndex = datum.sex - 1
					let arr = []
					if(datum.provinceId && datum.cityId && datum.districtId) {
						arr.push(datum.provinceId)
						arr.push(datum.cityId)
						arr.push(datum.districtId)
					}
					that.defaultId = arr
					if(datum.headPicPath) {
						this.imgStoragePath = datum.headPicPath
						that.imgPath = that.prefix.baseImgUrl + datum.headPicPath + this.imgShrink(100, 100)
					} else {
						that.imgPath = '../../../static/img/user_face_01.png'
					}
					that.array = res[1].data
				})
			},
			chooseImage() {
				let that = this;
				uni.chooseImage({
					sizeType: ['original'],
					count: 1,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths[0];
						this.imgPath = tempFilePaths;

						this.$api.sysGetToken().then(res => {
							const token = res.data;
							this.$api.uploaderWebUploadServer({
								filePath: tempFilePaths,
								formData: {
									token: token
								}
							}).then(res => {
								this.openErrMsg(this.$t('上传成功'))
								this.imgStoragePath = JSON.parse(res.data).path
							}).catch(err => {
								this.openErrMsg(err)
							})
						})
					}
				})
			},
			previewImage(e) {
				var current = e.target.dataset.src.split('@')[0] 
				uni.previewImage({
					current: current,
					urls: [this.imgPath]
				})
			},
			// 地址选择器取消
			onCancel(e) {
				console.log(e)
			},
			// 地址选择器确认
			onConfirm(e) {
				this.addreList = e.label
				this.addre = e.label[0].name + e.label[1].name + e.label[2].name
			},
			// 性别选择器
			bindPickerChange(e) {
				this.sexIndex = e.target.value
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 100;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			},
			// 出生日期选择器
			bindDateChange(e) {
				this.date = e.target.value
			},
			// 显示地址选择器
			showMulLinkageThreePicker() {
				this.$refs.mpvueCityPicker.show()
			},
			save() {
				let that = this
				let addressMsg = that.addreList
				let param = addressMsg ? 
				{
					sex: this.array[this.sexIndex].value,
					headPicPath: this.imgStoragePath,
					serverIds: '',
					loginName: this.name,
					realName: this.realName,
					birthday: this.date,
					provinceId: addressMsg[0].id,
					provinceName: addressMsg[0].name,
					cityId: addressMsg[1].id,
					cityName: addressMsg[1].name,
					districtId: addressMsg[2].id,
					districtName: addressMsg[2].name,
				} : {
					sex: this.array[this.sexIndex].value,
					headPicPath: this.imgStoragePath,
					serverIds: '',
					loginName: this.name,
					realName: this.realName,
					birthday: this.date,
				}
				this.$api.userInfoEdit(param).then(res => {
					this.openErrMsg(res.message)
					setTimeout(_ => {
						this.openErrMsg(this.$t('修改信息成功，请重新登录'))
						this.logout()
					}, 500)
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			logout() {
				let that = this
				this.$api.userCentralExitLogin().then(res => {
					that.$storage.cStore()
					uni.redirectTo({
						url: that.prefix.uLogin,
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			}
		}
		
	}
</script>

<style>
	/* .uni-list-cell {
		height: 80upx;
	} */
	.uni-list-cell.height {
		height: 120upx;
	}
	.uni-list-cell-left {
		width: 160upx;
		padding: 12upx 30upx;
	}
	.uni-list-cell-db:first-child {
		padding: 20upx 0;
		height: 100upx;
	}
	.uni-list {
		padding-top: 20upx;
	}
	.list-img {
		width: 100upx;
		height: 100upx;
		border: 2upx solid #999;
	}
	.btn {
		margin: 20upx 10upx 0;
	}
	.btn .mui-btn {
		width: 100%;
	}
	
	.updatetext {
		display: inline-block;
		margin: 20upx;
		padding: 10upx;
		background: #f4f4f4;
		border-radius: 10upx;
		float: right;
		color: #999;
	}
</style>
