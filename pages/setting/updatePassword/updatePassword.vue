<template>
	<view>
		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back"
			@click-right="backIndex">
			<view class="input-view">
				<text class="view-text">{{ $t('修改密码') }}</text>
			</view>
		</uni-nav-bar>
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('原密码') }}
				</view>
				<view class="uni-list-cell-db uni-form-item">
					<view class="wrap">
						<input class="uni-input" type="text" :placeholder="$t('请输入原密码')" :password="showOldPassword" v-model="oldPassword" />
						<view class="uni-icons uni-icons-eye" :class="[!showOldPassword ? 'uni-active' : '']" @click="showOldPassword = !showOldPassword"></view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('新密码') }}
				</view>
				<view class="uni-list-cell-db uni-form-item">
					<view class="wrap">
						<input class="uni-input" type="text" :placeholder="$t('请输入新密码')" :password="showNewPassword" v-model="newPassword" />
						<view class="uni-icons uni-icons-eye" :class="[!showNewPassword ? 'uni-active' : '']" @click="showNewPassword = !showNewPassword"></view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					{{ $t('确认密码') }}
				</view>
				<view class="uni-list-cell-db uni-form-item">
					<view class="wrap">
						<input class="uni-input" type="text" :placeholder="$t('输入确认密码')" :password="showConfirmPassword" v-model="confirmPassword" />
						<view class="uni-icons uni-icons-eye" :class="[!showConfirmPassword ? 'uni-active' : '']" @click="showConfirmPassword = !showConfirmPassword"></view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="btn">
			<button type="warn" class="mui-btn" @click="save">{{ $t('保存') }}</button>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword: '',
				newPassword: '',
				confirmPassword: '',
				showOldPassword: true,
				showNewPassword: true,
				showConfirmPassword: true,
			}
		},
		onLoad(param) {

		},
		methods: {
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
			save() {
				let that = this
				let vuelidate = new this.Vuelidate()
				vuelidate.data(this.oldPassword).isRequired('密码不能为空')
						.data(this.newPassword).isRequired('密码不能为空').minLength(6, ['密码不能小于X位', 6]).rePassword(this.confirmPassword, '两次密码不一致')

				if(!vuelidate.pass) {
					this.openErrMsg(vuelidate.errorMessage)
					return
				}
				this.$api.userUpdatePwdEdit({
					oldPassword: this.oldPassword,
					password: this.newPassword,
					repassword: this.confirmPassword,
				}).then(res => {
					this.openErrMsg(res.message + this.$t('跳转'))
					setTimeout(() => {
						that.$storage.cStore()
						uni.navigateTo({
							url: that.prefix.uLogin,
						})
					}, 1000);
				}).catch(err => {
					this.openErrMsg(err.message.replace(/<br\/>/g, ', '))
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
	.uni-form-item .wrap {
		width: 100%;
		display: flex;
		padding-right: 50upx;
	}
	.uni-form-item .wrap .uni-icons {
		line-height: 80upx;
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
		margin: 40upx auto;
		/* padding: 0 30upx; */
		width: 88%;
		box-sizing: border-box;
	}
	.btn .mui-btn {
		background: #f1224b;
		line-height: 2;
	}
</style>
