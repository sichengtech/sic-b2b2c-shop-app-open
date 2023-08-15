<template>
	<view class="lazy-image">
		<image class="real-image" @load="onLoaded" :src="realSrc" />
		<view :class="loaded?'loaded':''">
			<image class="placehold-img" :src="placeholdSrc" mode="aspectFit" />
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			placeholdSrc:{
				type:String,
				default: require('../static/img/loading.gif')
			},
			realSrc:{
				type:String,
				default:""
			}
		},
		data(){
			return {
				loaded:false
			}
		},
		methods:{
			onLoaded(){
				this.loaded = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lazy-image{
		height: 100%;
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		.real-image {
			height: 100%;
			width: 100%;
		}
		view{
			background-color: #fefefe;
			position: absolute;
			z-index: 2;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			transition: opacity 0.4s linear;
			
		}
		.loaded{
			opacity: 0;
		}
		.placehold-img {
			width: 60upx;
			height: 60upx;
			position: relative;
			top: 17%;
		}
	}
</style>
