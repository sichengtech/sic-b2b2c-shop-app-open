<template>
	<view class="content">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad(){
			if(process.env.NODE_ENV === 'development'){
				console.log('开发环境')
// 				let that = this
// 				uni.switchTab({
// 					url: that.prefix.uIndex
// 				})
			}else{
				console.log('生产环境')
				// this.loadExecution()
			}
			// this.loadExecution()
			// return
			// #ifdef APP-PLUS
			// this.remove()
			this.loadExecution()
			// #endif
			
			// #ifndef APP-PLUS
			let that = this
			console.log(that)
			uni.switchTab({
				url: that.prefix.uIndex
			})
			// #endif
// 			switch(uni.getSystemInfoSync().platform){
// 				case 'android':
// 				   console.log('运行Android上')
// 				   this.loadExecution()
// 				   break;
// 				case 'ios':
// 				   console.log('运行iOS上')
// 				   this.loadExecution()
// 				   break;
// 				default:
// 				   console.log('运行在开发者工具上')
// 				   uni.switchTab({
// 				   	url: that.prefix.startIndex
// 				   })
// 				   break;
// 			}
			
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
				launchFlag ?
					uni.switchTab({
						url: that.prefix.uIndex
					})
				:
					// launchFlag的值不为true，进入引导页
					uni.redirectTo({
						url: that.prefix.uGudie
					})
				
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
