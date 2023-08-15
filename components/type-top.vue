<template>
	<!-- #ifdef APP-PLUS -->
	<!-- 在app环境隐藏原生导航栏 -->
	<view class="top-view" :class="{'top-fixed' :isFixed}" :style="{'background': background}"></view>
	<!-- <view class="top-titles"></view> -->
	<!-- #endif -->

</template>

<script>
export default {
	name: 'type-top',
	props: {
		isFixed: {
			type: Boolean,
			default: true
		},
		background: {
			type: String,
			default: ''
		}
	}
}
</script>

<style>
	/* 不使用原生导航栏，但要留出状态栏的高度 */
	.top-view {
		width: 100%;
		position: sticky;
		top: 0upx;
		left: 0;
		right: 0;
		height: 20px;
		height: var(--status-bar-height);
		/* height: env(safe-area-inset-top); */
		background: #ccc;
		z-index: 999;
	}
	.top-view.top-fixed {
		position: sticky;
	}
	.top-titles {
		position: absolute;
		width: 100%;
		height: var(--status-bar-height);
	}
</style>

