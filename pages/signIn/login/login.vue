<template>
	<view>
		<uni-nav-bar color="#333333" fixed="false" right-icon="home" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('登录') }}</text>
			</view>
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
						{{ $t('用户名') }}
					</view>
					<view class="uni-list-cell-db">
						<input class="uni-input" :placeholder="$t('请输入账号')" v-model="userName" />
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{ $t('密码') }}
					</view>
					<view class="uni-list-cell-db uni-form-item">
						<view class="with-fun">
							<input class="uni-input" :placeholder="$t('请输入密码')" :password="showPassword" v-model="userPassword" />
							<view class="uni-icons uni-icons-eye" :class="[!showPassword ? 'uni-active' : '']" @click="changePassword"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" class="mui-btn mui-btn-danger" @click="userLogin(1)">{{ $t('登录') }}</button>
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
					<view class="btn-get-code" :class="{'codeshow': lock }" @tap="getIphoneCode">{{ getIphoneCodeText }}</view>
				</view>
			</view>
			<view class="btn">
				<button type="warn" class="mui-btn mui-btn-danger" @click="userLogin(2)">{{ $t('登录') }}</button>
			</view>
		</view>
		
		
		<view class="dis-con">
			<navigator url="../register/register">
				<view class="con-flex">{{ $t('免费注册') }}</view>
			</navigator>
			<navigator url="../forgetPwd/forgetPwd">
				<view class="con-flex">{{ $t('忘记密码') }}</view>
			</navigator>
		</view>
		
	</view>
</template>

<script>
import { config } from '../../../config/config'
	export default {
		data() {
			return {
				show: 0,
				showPassword: true,
				getIphoneCodeText: this.$t('获取验证码'),
				lock: false,
				userName: '',
				userPassword: '',
				type: '',
				iphone: '',
				iphoneCode: '',
				intercepted: null,
				showSwitch: config.showSwitch,
				data: ['账号密码登录', '短信验证码登录']
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
		methods: {
			changePassword() {
				this.showPassword = !this.showPassword;
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
			userLogin(type) {
				let that = this
				// #ifdef APP-PLUS
				let cid = plus.push.getClientInfo().clientid
				// #endif
				let param = type === 1 ? {
					type: type,
					loginName: that.userName,
					password: that.userPassword,
					// #ifdef APP-PLUS
					cid
					// #endif
				} : {
					type: type,
					mobile: that.iphone,
					smsCode: that.iphoneCode,
					// #ifdef APP-PLUS
					cid
					// #endif
				}
				// let vuelidate = new this.Vuelidate()
				// if(type === 1) {
				// 	vuelidate.data(this.userName).isRequired('请输入用户名').data(this.userPassword).isRequired('请输入密码')
				// } else {
				// 	vuelidate.data(this.iphone).isRequired('请输入手机号码').isPhone('手机号码有误，请重填').data(this.iphoneCode).isRequired('请输入手机验证码')
				// }

				// if(!vuelidate.pass) {
				// 	this.openErrMsg(vuelidate.errorMessage)
				// 	return
				// }

				this.$api.userLoginApp(param).then(res => {
					uni.showLoading({
						title: that.$t('登录成功')
					})
					let datum = res.data
					that.$storage.setStoreAsync({
						key: that.$storage.keyVal,
						val: datum,
						res(data) {
							setTimeout(() => {
								uni.hideLoading()
								uni.reLaunch({
									url: that.prefix.uUserCenter
								})
							}, 200)
						}
					})
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},
			getIphoneCode() {
				let time
				let that = this
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.iphone).isRequired('手机号码不能为空').isPhone('手机号码有误，请重填')
				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}

				if(!this.lock) {
					this.$api.smsLoginGetCode({mobile: this.iphone}).then(res => {
						this.openErrMsg(res.message)
						setTimeout(()=> {
							uni.hideLoading()
						}, 500)
						let t = 60
						this.lock = true
						clearInterval(time);
						time = setInterval(() => {
							if (t > 0) {
								this.getIphoneCodeText = that.$t('重新获取') + t-- + "s"
							} else {
								this.getIphoneCodeText = that.$t('获取验证码')
								this.lock = false
								clearInterval(time);
							}
						}, 1000);
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
			},
			clickTab(i) {
				this.show = i
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
		width: 142upx;
		line-height: 40upx;
		text-align-last: justify;
		padding: 0 10upx;
	}
	.uni-list-cell:after {
		left: 10upx;
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
</style>
