<template>
	<view>
		
		<uni-nav-bar color="#333333" fixed="false" @click-left="back"
			@click-right="goToLogin">
			<view class="input-view">
				<text class="view-text">{{ $t('找回密码') }}</text>
			</view>
			<view slot="right" class="slot_right">{{ $t('登录') }}</view>
		</uni-nav-bar>
		<view class="tab-segement">
			<view class="segement-flex"
				:class="{'segement-ative': show === i}"
				@tap="clickTab(i)"
				v-for="(item, i) in options"
				:key="i"
			>{{ $t(`${ item }`) }}</view>
		</view>
		
		<view class="" v-if="showSwitch[0] && options[show] === data[0]">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('邮箱号') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :placeholder="$t('请输入邮箱号')" v-model="email" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('邮件验证码') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :placeholder="$t('请输入邮件验证码')"  v-model="emailCode" />
					</view>
					<view class="btn-get-code" :class="{'codeshow': emailLock }" @tap="getEmailCode">{{ getEmailCodeText }}</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('设置密码') }}
					</view>
					<view class="uni-list-cell-db uni-form-item">
						<view class="with-fun">
							<input class="uni-input" :placeholder="$t('输入新密码')" :password="showPassword21" v-model="password21" />
							<view class="uni-icons uni-icons-eye" :class="[!showPassword21 ? 'uni-active' : '']" @click="changePassword21"></view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('确认密码') }}
					</view>
					<view class="uni-list-cell-db uni-form-item">
						<view class="with-fun">
							<input class="uni-input" :placeholder="$t('输入确认密码')" :password="showPassword22" v-model="password22" />
							<view class="uni-icons uni-icons-eye" :class="[!showPassword22 ? 'uni-active' : '']" @click="changePassword22"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" class="mui-btn mui-btn-danger" @click="emailSave">{{ $t('确认') }}</button>
			</view>
		</view>

		<view class="" v-if="showSwitch[1] && options[show] === data[1]">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('手机号') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :placeholder="$t('请输入手机号')" v-model="iphone" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('短信验证码') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :placeholder="$t('请输入短信验证码')"  v-model="iphoneCode" />
					</view>
					<view class="btn-get-code" :class="{'codeshow': iphoneLock }" @tap="getIphoneCode">{{ getIphoneCodeText }}</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('设置密码') }}
					</view>
					<view class="uni-list-cell-db uni-form-item">
						<view class="with-fun">
							<input class="uni-input" :placeholder="$t('输入新密码')" :password="showPassword11" v-model="password11" />
							<view class="uni-icons uni-icons-eye" :class="[!showPassword11 ? 'uni-active' : '']" @click="changePassword11"></view>
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('确认密码') }}
					</view>
					<view class="uni-list-cell-db uni-form-item">
						<view class="with-fun">
							<input class="uni-input" :placeholder="$t('输入确认密码')" :password="showPassword12" v-model="password12" />
							<view class="uni-icons uni-icons-eye" :class="[!showPassword12 ? 'uni-active' : '']" @click="changePassword12"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" class="mui-btn mui-btn-danger" @click="iphoneSave">{{ $t('确认') }}</button>
			</view>
		</view>
		
	</view>
</template>

<script>
import { config } from '../../../config/config'
	export default {
		data() {
			return {
				showPassword: true,
				show: 0,
				iphoneLock: false,
				emailLock: false,
				iphone: '',
				iphoneCode: '',
				getIphoneCodeText: this.$t('获取验证码'),
				password11: '',
				password12: '',
				showPassword11: true,
				showPassword12: true,
				email: '',
				emailCode: '',
				getEmailCodeText: this.$t('获取验证码'),
				password21: '',
				password22: '',
				showPassword21: true,
				showPassword22: true,
				showSwitch: config.showSwitch,
				data: ['邮箱号找回', '手机号找回'],
				siteRegister: {},
			}
		},
		computed: {
			options() {
				let options = []
				let data = this.data
				config.showSwitch.forEach((n, i) => {
					if(n) options.push(data[i])
				})
				return options
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			// 显示密码
			changePassword11() {
				this.showPassword11 = !this.showPassword11;
			},
			changePassword12() {
				this.showPassword12 = !this.showPassword12;
			},
			changePassword21() {
				this.showPassword21 = !this.showPassword21;
			},
			changePassword22() {
				this.showPassword22 = !this.showPassword22;
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			clickTab(i) {
				this.show = i
			},
			goToLogin() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uLogin
				})
			},
			init() {
				this.$api.siteRegisterInfo().then(res => {
					this.siteRegister = res.data
				})
			},
			getIphoneCode() {
				let time;
				let that = this
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.iphone).isRequired('手机号码不能为空').isPhone('手机号码有误，请重填')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				if(!this.iphoneLock) {
					this.$api.smsForgetPwdGetCode({ mobile: this.iphone }).then(res => {
						this.openErrMsg(res.message)
						setTimeout(()=> {
							uni.hideLoading()
						}, 500)
						let t = 60
						this.iphoneLock = true
						clearInterval(time);
						time = setInterval(() => {
							if (t > 0) {
								this.getIphoneCodeText = that.$t('重新获取') + t-- + "s"
							} else {
								this.getIphoneCodeText = that.$t('获取验证码')
								this.iphoneLock = false
								clearInterval(time);
							}
						}, 1000);
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
					
				}
			},
			getEmailCode() {
				let time;
				let that = this
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.email).isRequired('邮箱不能为空').isEmail('邮箱号码有误')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				if(!this.emailLock) {
					this.$api.eamilForgetPwdGetCode({ email: this.email }).then(res => {
						this.openErrMsg(res.message)
						setTimeout(()=> {
							uni.hideLoading()
						}, 500)
						let t = 60
						this.emailLock = true
						clearInterval(time);
						time = setInterval(() => {
							if (t > 0) {
								this.getEmailCodeText = that.$t('重新获取') + t-- + "s"
							} else {
								this.getEmailCodeText = that.$t('获取验证码')
								this.emailLock = false
								clearInterval(time);
							}
						}, 1000);
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
			},
			iphoneSave() {
				let that = this;
				let data = {
					mobile: this.iphone,
					mcode: this.iphoneCode,
					mpassword: this.password11,
					mnextPassword: this.password12,
					type: 2
				}
				let rule = this.siteRegister
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.iphone).isRequired('请输入手机号码').isPhone('手机号码有误，请重填')
						 .data(this.iphoneCode).isRequired('请输入短信验证码')
						 .data(this.password11).isRequired('请输入密码').minLength(rule.pwdMin, ['密码不能小于X位', rule.pwdMin]).maxLength(rule.pwdMax, ['密码不能超过X位', rule.pwdMax]).rePassword(this.password12, '两次密码不一致')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				this.$api.userForgetPwdEdit(data).then(res => {
					uni.showToast({
						title: res.message,
						duration: 2000,
						icon: 'none'
					})
					setTimeout(_ => {
						uni.redirectTo({
							url: that.prefix.uLogin
						})
					}, 200)
				}).catch(err => {
					this.openErrMsg(err.message.replace(/<br\/>/g, ', '))
				})
			},
			emailSave() {
				let that = this;
				let data = {
					email: this.email,
					ecode: this.emailCode,
					epassword: this.password21,
					enextPassword: this.password22,
					type: 1
				}
				let rule = this.siteRegister
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.email).isRequired('请输入邮箱').isEmail('邮箱号码有误')
						 .data(this.emailCode).isRequired('请输入邮件验证码')
						 .data(this.password21).isRequired('请输入密码').minLength(rule.pwdMin, ['密码不能小于X位', rule.pwdMin]).maxLength(rule.pwdMax, ['密码不能超过X位', rule.pwdMax]).rePassword(this.password22, '两次密码不一致')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				this.$api.userForgetPwdEdit(data).then(res => {
					uni.showToast({
						title: res.message,
						duration: 2000,
						icon: 'none'
					})
					setTimeout(_ => {
						uni.redirectTo({
							url: that.prefix.uLogin
						})
					}, 200)
				}).catch(err => {
					this.openErrMsg(err.message.replace(/<br\/>/g, ', '))
				})
			}
		}
	}
</script>

<style>
	.tab-segement {
		display: flex;
		height: 80upx;
		background: #fff;
	}
	.segement-flex {
		box-sizing: border-box;
		flex: 1;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		color: #333;
		border-bottom: 4upx solid #ccc;
	}
	.segement-flex.segement-ative {
		color: red;
		border-bottom: 4upx solid red;
	}
	
	.uni-list {
		padding: 40upx;
		width: auto;
	}
	.uni-list:after {
		height: 0;
	}
	.uni-list .uni-list-cell:last-child:after {
		height: 1upx;
	}
	.uni-list-cell-left {
		width: 144upx;
		text-align-last: justify;
		line-height: 40upx;
	}
	.uni-form-item .with-fun {
		width: 100%;
	}
	.uni-form-item {
		padding: 0;
	}
	.btn {
		margin: 20upx 40upx 0;
	}
	.btn .mui-btn {
		width: 100%;
		font-size: 28upx;
	}
	.dis-con {
		margin: 40upx 40upx 0;
		display: flex;
		justify-content: space-between;
	}
	.btn-get-code {
		border: 1upx solid #f1f1f1;
		height: 70upx;
		line-height: 70upx;
		font-size: 24upx;
		padding: 0 10upx;
		color: red;
		border-radius: 10upx;
	}
	.btn-get-code.codeshow {
		color: #999;
	}
	.slot_right {
		background: red;
		color: #fff;
		position: absolute;
		right: 30upx;
		padding: 4upx 20upx;
		border-radius: 10upx;
	}

</style>
