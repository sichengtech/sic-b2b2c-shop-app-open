<template>
	<view>
		<uni-nav-bar color="#333333" leftIcon="back" fixed="true" @click-left="back">
			<view class="input-view">
				<text class="view-text">{{ $t('关于') }}</text>
			</view>
		</uni-nav-bar>


		<view :style="{ height: barHeight('statusBarHeight') + 35 + 'px' }"></view>
		<view></view>
		<view class="content">
			<view class="img">
				<image :src="logo" />
			</view>
			<view class="version">{{ $t('版本号') }}&nbsp;{{ version }}</view>
			<!-- <view class="version">版本号&nbsp;1.2.3</view> -->
		</view>

		<view class="content-list">
			<view>
				<view class="uni-list-cell uni-list-last" hover-class="uni-list-cell-hover" @tap="install">
					<view class="uni-list-cell-navigate">
						{{ $t('检测更新') }}
						<view class="that" v-if="!isUpdate">{{ $t('已是新版本') }}</view>
						<view class="new" v-if="isUpdate">{{ $t('有新版本') }}</view>
					</view>
				</view>
			</view>
		</view>

		<uni-popup :show="showPopup" type="middle">
			<view class="wrap">
				<view class="wrap-title">{{ title }}</view>
				<view class="progress-box">
					<progress :percent="percent" active stroke-width="10" />
				</view>
				<view class="btn" :style="{backgroundColor: downloadStatus ? '#42b983' : '#ccc'}" @tap="apkInstall">{{ $t('安装') }}</view>
			</view>
			
		</uni-popup>

	</view>
</template>

<script>
import uniPopup from '../../../components/uni-popup.vue'
import * as versionUpdate from '@/common/versionUpdate'

	export default {
		data() {
			return {
				logo: require('../../../static/img/logo.png'),
				version: this.$store.state.version,
				isUpdate: false,
				updateData: {},
				showPopup: false,
				percent: 0,
				downloadStatus: 0,
				tempFilePath: '', // apk 临时地址
				title: this.$t('下载中')
			}
		},
		components: {
			uniPopup
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
			init() {
				versionUpdate.deviceUpdate().then(res => {
					let data = res.data
					this.isUpdate = data.isUpdate
					if(data.isUpdate) {
						this.updateData = data.newVersion
					}
				})
			},
			install() {
				let _this = this
				if(_this.isUpdate) {
					let openUrl = _this.prefix.baseImgUrl + _this.updateData.downloadPath
					// 下载apk
					if(_this.updateData.type === '1') {
						uni.showModal({
				        	//提醒用户更新
							title: "提示",
							content: that.$t('是否下载最新版本') + _this.updateData.version,
							cancelText: that.$t('否'),
							confirmText: that.$t('是'),
							success: res => {
								if (res.confirm) {
									_this.createDownload(openUrl);
								}
							}
						});
						return
					}
					// 下载wgt
					if(_this.updateData.type === '2') {
						uni.showModal({
				        	//提醒用户更新
							title: "提示",
							content: that.$t('是否安装最新版本') + _this.updateData.version,
							cancelText: that.$t('否'),
							confirmText: that.$t('是'),
							success: res => {
								if (res.confirm) {
									
									versionUpdate.downWgtApp(openUrl)
								}
							}
						});
						// plus.nativeUI.confirm("是否安装最新版本："+ _this.updateData.version,function(){  
						// 	versionUpdate.downWgtApp(openUrl)
						// });
					}
				}
			},
			// 创建下载任务
			createDownload(url) {
				let _this = this
				const downloadTask = uni.downloadFile({
					url: url,
					success: (res) => {
						if (res.statusCode === 200) {
							// clearInterval(time)
							_this.title = _this.$t('下载成功, 请安装')
							_this.downloadStatus = 1
							_this.tempFilePath = res.tempFilePath
							
						}
					}
				});

				_this.showPopup = true
				downloadTask.onProgressUpdate((res) => {
					let num = parseInt(res.totalBytesWritten / res.totalBytesExpectedToWrite * 1000)
					if(num < 100 && num > _this.percent) {
						_this.percent = num
					}
					
					//console.log('下载进度' , num);
					// console.log('已经下载的数据长度' + res.totalBytesWritten);
					// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			},
			apkInstall() {
				if(this.downloadStatus) plus.runtime.install(this.tempFilePath);
			},
			// download(url) {
			// 	let time
			// 	let dtask = plus.downloader.createDownload(url, {}, function(d, status){
			// 		console.log(d, status)
			// 		// 下载完成
			// 		if(status == 200){ 
			// 			clearInterval(time)
			// 			plus.nativeUI.alert("新版本下载完成请安装",function(){  
			// 				console.log(d)
			// 				// _this.apkInstall(d.filename)
			// 			});
			// 		} else {
			// 			plus.nativeUI.alert("新版本下载失败");
			// 			console.log("Download failed: " + status); 
			// 		}  
			// 	});
			// 	//dtask.addEventListener("statechanged", onStateChanged, false);
			// 	dtask.start(); 
				
				
			// }

		}
	}
</script>

<style scoped lang="scss">
.content {
	display: flex;
	justify-content: center;
	flex-direction: column;
    height: 300upx;
    align-items: center;
}
.img {
	width: 120upx;
	height: 120upx;
	border-radius: 20upx;
	overflow: hidden;
}
.version {
	font-size: 28px;
    color: #999;
    margin-top: 10upx;
}
.content-list::before  {
	position: absolute;
    left: 0;
    right: 0;
	content: '';
	height: 1upx;
	background-color: #f1f1f1;
	transform: scaleY(.5);
}
.uni-list-cell:after {
	background-color: #f1f1f1;
}
.uni-list-cell-navigate {
	color: #444;
}
.uni-list-cell-navigate .that {
	color: #999;
}
.uni-list-cell-navigate .new {
    background: red;
    border-radius: 20upx;
    color: #fff;
	padding: 0 14upx;
	font-size: 24upx;
}
.wrap {
	height: 100%;
    width: 100%;
    display: flex;
	flex-direction: column;
	view {
		width: 100%;
		text-align: center;
		&.wrap-title {
			padding: 20upx 0 80upx 0;
			font-size: 34upx;
		}
		&.btn {
			width: 40%;
			margin: 0 auto;
			margin-top: 100upx;
			border-radius: 30upx;
			color: #fff;
			padding: 10upx 20upx;
		}
	}
}

</style>
