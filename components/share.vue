<template>
	<view class="nativeShare">
		<view class="label">分享到</view>
		<view class="list">
			<view class="list-item" v-for="(button, index) in Buttons" :key="index">
				<image :src="button.src" class="i" @tap="share(button)" />
				{{button.text}}
			</view>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import nativeShare from 'nativeshare'
	import * as mShare from 'm-share'
	// #endif
	export default {
		data() {
			return {
				Buttons: [{
						text: '微信好友',
						app_share: 'WXSceneSession',
						nativeshare: 'wechatFriend',
						m_share: 'wx',
						src: require('../static/img/share/weixin.png')
					},
					{
						text: '朋友圈',
						app_share: 'WXSenceTimeline',
						nativeshare: 'wechatTimeline',
						m_share: 'wxline',
						src: require('../static/img/share/wxfriend.png')
					},
					// {text: '新浪微博', nativeshare:'weibo', m_share: 'sina', src: require('../static/img/share/weibo.png')},
					// {text: 'QQ好友', nativeshare:'qqFriend', m_share: 'qq', src: require('../static/img/share/qq.png')},
					// {text: 'QQ空间', nativeshare:'qZone', m_share: 'qzone', src: require('../static/img/share/qqzone.png')},
					// {text: '更多', nativeshare:'', m_share: '', src: require('../static/img/share/more.png')},
				],
				shareData: this.config
			}
		},
		props: {
			config: Object,
			shareMenu: Array,
		},
		// computed: {
		//   shareButtons() {
		//       if (!this.shareMenu) {
		//           return this.Buttons
		//       }
		//       return this.shareMenu.map(i => this.Buttons[i]).filter(i => i !== undefined)
		//   }
		// },
		methods: {
			share(command) {
				// #ifdef APP-PLUS
				uni.share({
					provider: "weixin",
					scene: command.app_share,
					type: 0,
					href: `${ this.prefix.baseUrl }${ this.prefix.h5Path }#/pages/product/productDetail/productDetail?pid=${ this.shareData.pid }`,
					title: this.shareData.productName,
					summary: "我在这里发现一个不错的宝贝，赶快来看看吧。",
					imageUrl: this.prefix.baseImgUrl + this.shareData.img.path,
					success(res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail(err) {
						console.log("fail:" + JSON.stringify(err));
					}
				});
				// #endif

				// #ifdef H5
				let shareData = { //nativeShare的参数模型
					title: this.shareData.productName,
					// desc: this.shareData.desc,
					// 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
					link: window.location.href,
					icon: this.shareData.url,
					// 不要过于依赖以下两个回调，很多浏览器是不支持的
					// success: this.shareData.success,
					// fail: this.shareData.cancel,
				}
				let mShareData = { //m-share的参数模型
					title: this.shareData.productName, // 标题，默认读取document.title
					//desc: this.shareData.desc, // 描述, 默认读取head标签：<meta name="description" content="desc" />
					link: window.location.href, // 网址，默认使用window.location.href
					imgUrl: this.prefix.baseImgUrl + this.shareData.img.path, // 图片, 默认取网页中第一个img标签
					// fnDoShare: this.shareData.success,
					infoMap: { // 针对不同平台设定不同分享内容
						wx: {
							link: window.location.href, // 覆盖分享到微信的链接
							title: this.shareData.productName, // 覆盖分享到微信的标题
							desc: '分享到微信的描述', // 覆盖分享到微信的标题
							imgUrl: this.prefix.baseImgUrl + this.shareData.img.path // 覆盖分享到微信的图片链接
						}
					},
				}
				let nativeShare = new NativeShare()
				nativeShare.setShareData(shareData)
				try {
					nativeShare.call(command.nativeshare)
				} catch (e) {
					//iphone的qq浏览器调用此api
					//除iphone的qq浏览器外其他浏览器调用的api
					//在iphone的qq浏览器中比较奇葩，第一次调用nativeShare.call()会报错，第二次之后不报，这里是让每次调用nativeShare.call()之后都报错，然后统一去调m-share.to()方法
					mShare.to(command.m_share, mShareData)
				}
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nativeShare {
		font-size: 13px;
	}

	.label {
		font-size: 28upx;
		text-align: center;
		padding: 30upx 0;
	}

	.list {
		text-align: center;
	}

	.list-item {
		width: 30%;
		display: inline-block;
		text-align: center;
		margin: 10px 0;
	}

	$height: 70upx;

	.i {
		width: $height;
		height: $height;
		display: block;
		margin: 0 auto;
		margin-bottom: 10upx;
		background-size: cover;
	}
</style>
