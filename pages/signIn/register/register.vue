<template>
	<view>
		
		<uni-nav-bar color="#333333" fixed="false" @click-left="back"
			@click-right="goToLogin">
			<view class="input-view">
				<text class="view-text">{{ $t('注册') }}</text>
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
						{{ $t('账号') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :placeholder="$t('请输入注册账号')" v-model="account" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('密码') }}
					</view>
					<view class="uni-list-cell-db uni-form-item">
						<view class="with-fun">
							<input class="uni-input" :placeholder="$t('请输入密码')" :password="showPassword" v-model="accountPassword" />
							<view class="uni-icons uni-icons-eye" :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
						</view>
					</view>
				</view>
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
					<view class="btn-get-code" :class="{'codeshow': accountLock }" @tap="getemailCode">{{ getemailCodeText }}</view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" class="mui-btn mui-btn-danger" @click="register(1)">{{ $t('注册') }}</button>
			</view>
		</view>
		
		<view class="" v-if="showSwitch[1] && options[show] === data[1]">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('手机号') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" type="number" :placeholder="$t('请输入手机号')" v-model="iphone" />
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
			</view>
			<view class="btn">
				<button type="warn" class="mui-btn mui-btn-danger" @click="register(2)">{{ $t('注册') }}</button>
			</view>
		</view>
		
		
		<view class="dis-con register">
			<view class="radio">
				<checkbox value="r1" checked="radioChecked" style="display: none;" ></checkbox>
				<text class="iconfont" :class="radioChecked ? 'icon-success' : 'icon-success-copy1'" @tap="radioChecked = !radioChecked"></text>
				<text class="radio-text" @tap="xieyiShow">{{ $t('用户协议') }}</text>
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
				radioChecked: true,
				account: '',
				accountPassword: '',
				email: '',
				emailCode: '',
				accountLock: '',
				getemailCodeText: this.$t('获取验证码'),
				iphone: '',
				iphoneCode: '',
				iphoneLock: false,
				getIphoneCodeText: this.$t('获取验证码'),
				siteRegister: {},
				showSwitch: config.showSwitch,
				data: ['账号注册', '手机号注册']
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
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			goToLogin() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uLogin,
				})
			},
			xieyiShow() {
				uni.navigateTo({
					url: '/pages/signIn/register/agreement'
				})
			},
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			init() {
				this.$api.siteRegisterInfo().then(res => {
					// res.data.agreement = `<div style=" height: 200px; overflow: hidden; ">${ res.data.agreement }</div>`
					this.siteRegister = res.data

				})
			},
			clickTab(i) {
				this.show = i
			},
			register(type) {
				let that = this
				let param = type === 1 ? {
						type: type,
						loginName: that.account,
						password: that.accountPassword,
						email: that.email,
						emailCode: that.emailCode
					} : {
						type: type,
						mobile: that.iphone,
						mobileCode: that.iphoneCode
					}

				if(!this.radioChecked) {
					this.openErrMsg(this.$t('请勾选用户协议'))
					return
				}
				let vuelidate = new this.Vuelidate()
				let rule = this.siteRegister
				if(type === 1) {
					vuelidate.data(this.account).isRequired('请输入用户名').minLength(rule.usernameMin, ['用户名不能小于X位', rule.usernameMin]).maxLength(rule.usernameMax, ['用户名不能超过X位', rule.usernameMax]).requireRegexp(/^[A-Za-z0-9]+$/, '用户名请输入字母或数字')
							 .data(this.accountPassword).isRequired('请输入密码').minLength(rule.pwdMin, ['密码不能小于X位', rule.pwdMin]).maxLength(rule.pwdMax, ['密码不能超过X位', rule.pwdMax])
							 .data(this.email).isRequired('请输入邮箱号').isEmail('邮箱号码有误')
							 .data(this.emailCode).isRequired('请输入邮件验证码')
				} else {
					vuelidate.data(this.iphone).isRequired('请填写手机号').isPhone('手机号码有误，请重填').data(this.iphoneCode).isRequired('请输入短信验证码')
				}

				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				this.$api.userRegisterSave(param).then(res => {

					this.openErrMsg(res.message)

					this.$storage.setStoreAsync({
						key: that.$storage.keyVal,
						val: res.data,
						res(data) {
							setTimeout(() => {
								uni.reLaunch({
									url: that.prefix.uUserCenter,
								})
							}, 200)
						}
					})

				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			getemailCode() {
				let time;
				let that = this

				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.email).isRequired('邮箱不能为空').isEmail('邮箱号码有误')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}

				if(!this.accountLock) {
					let param ={
							email: that.email,
							loginName: that.account
						}
					this.$api.eamilRegisterGetCode(param).then(res => {
						this.openErrMsg(res.message)
						setTimeout(()=> {
							uni.hideLoading()
						}, 500)
						let t = 60
						this.accountLock = true
						clearInterval(time);
						time = setInterval(() => {
							if (t > 0) {
								this.getemailCodeText = that.$t('重新获取') + t-- + "s"
							} else {
								this.getemailCodeText = that.$t('获取验证码')
								this.accountLock = false
								clearInterval(time);
							}
						}, 1000);
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
					
				}
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
					this.$api.smsRegisterGetCode({mobile: that.iphone}).then(res => {
						this.openErrMsg(res.message)
						setTimeout(()=> {
							uni.hideLoading()
						}, 500)
						let t = 60
						this.iphoneLock = true
						clearInterval(time);
						time = setInterval(() => {
							if (t > 0) {
								this.getIphoneCodeText = this.$t('重新获取') + t-- + "s"
							} else {
								this.getIphoneCodeText = this.$t('获取验证码')
								this.iphoneLock = false
								clearInterval(time);
							}
						}, 1000);
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
					
				}
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
	.radio {
		color: #999;
	}
	.radio-text {
		margin-left: 10upx;
		color: red;
	}
	.array-div {
		position: fixed;
		top: -0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1999;
		background: #fff;
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
