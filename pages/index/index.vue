<template>
	<view class="content">
		<!-- 我是第一首页，无可视内容。我的作用是判断是否进入引导页,或是进入第二首页. -->
	</view>
</template>

<script>
	export default {
		data() {
			return { }
		},
		onLoad(){
			// if(process.env.NODE_ENV === 'development'){
			// 	console.log('开发环境')
			// 	// let that = this
			// 	// uni.switchTab({
			// 	// 	url: that.prefix.uIndex
			// 	// })
			// }else{
			// 	console.log('生产环境')
			// 	// this.loadExecution()
			// }

			// 如果是App
			// #ifdef APP-PLUS
			// this.remove()
			this.loadExecution()  //判断是否进入引导页
			// #endif
			
			// 如果不是App
			// #ifndef APP-PLUS
			let that = this
			console.log(that)
			uni.switchTab({
				url: that.prefix.uIndex  //直接进入首页
			})
			// #endif			
		},
		methods: {
			loadExecution(){
				/**
				 * 获取本地存储中launchFlag的值
				 * 若存在，说明不是首次启动，直接进入首页；
				 * 若不存在，说明是首次启动，进入引导页；
				 */
				let that = this
				let launchFlag = this.$storage.getStore('launchFlag')
				// 判断launchFlag的值是否为true，如果是true进入首页 
				if(launchFlag){
					// 若launchFlag存在，说明不是首次启动，直接进入首页；
					uni.switchTab({
						url: that.prefix.uIndex
					})
				}else{
					// 若launchFlag不存在，说明是首次启动，进入引导页；
					// launchFlag的值不为true，进入App引导页
					uni.redirectTo({
						url: that.prefix.uGudie
					})
				}					
			},
			remove() {
				this.$storage.reStore('launchFlag')
				this.loadExecution()
			}
		}
	}
</script>
<style>
	
</style>
