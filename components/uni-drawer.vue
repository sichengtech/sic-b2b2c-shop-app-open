<template>
	<view class="uni-drawer" @catchtouchmove.stop.prevent="moveHandle" :class="{'uni-drawer-visible':visible,'uni-drawer-right':rightMode}">
		<view v-if="showMask" class="uni-drawer-mask" @tap="close"></view>
		<view class="uni-drawer-content">
			<slot></slot>
		</view>
		<slot name="bottom"></slot>
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * 显示状态
			 */
			visible: {
				type: Boolean,
				default: false
			},
			/**
			 * 显示模式（左、右），只在初始化生效
			 */
			mode: String,
			/**
			 * 蒙层显示状态
			 */
			mask: {
				type: [Boolean, String],
				default: true
			}
		},
		data() {
			return {
				rightMode: false,
				// catchtouchmove: false
			}
		},
		computed: {
			showMask() {
				return String(this.mask) === 'true'
			}
		},
		created() {
			this.rightMode = this.mode === 'right'
			//#ifdef MP-WEIXIN
			// this.catchtouchmove = true
			//#endif
		},
		methods: {
			close() {
				this.$emit('close')
			},
			moveHandle(){
				return;
			}
		}
	}
</script>

<style scoped>
	.uni-drawer {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		visibility: hidden;
		z-index: 998;
		height:100%;
		/* #ifdef APP-PLUS */
		margin-top: var(--status-bar-height);
		/* #endif */
	}

	.uni-drawer>.uni-drawer-mask {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.uni-drawer>.uni-drawer-content {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 75%;
		height: calc(100vh - var(--status-bar-height)) ;
		background: #FFFFFF;
		transition: all 0.3s ease-out;
		transform: translatex(-100%);
		overflow-y: auto;
	}

	.uni-drawer.uni-drawer-right>.uni-drawer-content {
		left: auto;
		right: 0;
		transform: translatex(100%);
	}

	.uni-drawer.uni-drawer-visible {
		visibility: visible;
	}

	.uni-drawer.uni-drawer-visible>.uni-drawer-mask {
		display: block;
	}

	.uni-drawer.uni-drawer-visible>.uni-drawer-content {
		transform: translatex(0);
	}
</style>
