<template>
	<view>
		<uni-nav-bar color="#333333" leftIcon="back" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('设置') }}</text>
			</view>
		</uni-nav-bar>
		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="content-list">
			<view @tap="showPop">
				<view class="uni-list-cell uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate">
						{{ $t('语言') }}
						<view>{{ language }}</view>
					</view>
				</view>
			</view>
			<view @tap="openView(prefix.uUpdatePassword)">
				<view class="uni-list-cell uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						{{ $t('修改密码') }}
					</view>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view @tap="openView(prefix.uUserAboutUs, 1)">
				<view class="uni-list-cell uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right">
						{{ $t('关于') }}
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>

		<uni-popup :show="showPopup" type="bottom" :hidePopup="hidePopup">
			<view class="solt-popup">
				<view class="popup-item" v-for="(item, index) in languageList" :key="index" @tap="checkedLanguage(item)">{{ item.label }}</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '../../../components/uni-popup.vue'
	export default {
		data() {
			return {
				showPopup: false,
				languageList: [
					{
						label: 'English',
						language: 'en_US'
					},{
						label: '中文',
						language: 'zh_CN'
					}
				],
			}
		},
		computed: {
			language() {
				let locale = this.$i18n.locale
				let lang = '中文'
				this.languageList.some(n => {
					lang = n.language === locale ? n.label : '中文'
					return n.language === locale
				})
				return lang
			}
		},
		components: {
			uniPopup,
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			openView(url, type) {
				let that = this
				if(this.$storage.isLogin() || type) {
					url && uni.navigateTo({
						url: url
					})
				} else {
					this.openErrMsg(that.$t('请先登录'))
				}
			},
			hidePopup() {
				this.showPopup = false;
			},
			showPop() {
				this.showPopup = true;
			},
			checkedLanguage(item) {
				this.hidePopup()
				this.$i18n.locale = item.language
				this.$storage.setStore({
					key: 'language',
					val:item.language
				})
			}
		}
	}
</script>

<style>
	.popup-item {
		padding: 20upx 0;
		text-align: center;
	}
</style>
