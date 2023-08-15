<template>
	<view class="uni-numbox">
		<view class="uni-numbox-minus" :class="{'uni-numbox-disabled': disableSubtract}" @click="_calcValue('subtract')">-</view>
		<input class="uni-numbox-value" type="number" :disabled="disabled" :value="inputValue" @blur="_onBlur">
		<view class="uni-numbox-plus" :class="{'uni-numbox-disabled': disableAdd}" @click="_calcValue('add')">+</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			value: {
				type: Number,
				default: 1
			},
			min: {
				type: Number,
				default: 1
			},
			max: {
				type: Number,
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			},
			extendData: {}
		},
		data() {
			return {
				inputValue: this.value
			}
		},
		computed: {
			disableSubtract() {
				return this.inputValue <= this.min
			},
			disableAdd() {
				return this.inputValue >= this.max
			}
		},
		watch: {
			value(val) {
				this.inputValue = val;
			},
			inputValue(val) {
				let obj ={
					param: this.extendData,
					num: val
				}
				this.$emit('change', obj);
			}
		},
		methods: {
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let step = this.step * scale;

				if (type === 'subtract') {
					value -= step
				} else if (type === 'add') {
					value += step
				}
				if (value < this.min || value > this.max) {
					return
				}
				this.inputValue = value / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value;
				if (!value) {
					this.inputValue = 0;
					return
				}
				value = +value;
				if (value > this.max) {
					value = this.max;
				} else if (value < this.min) {
					value = this.min
				}
				this.inputValue = value
			}
		}
	}
</script>
<style>
	.uni-numbox {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		height: 50upx;
	}

	.uni-numbox-minus,
	.uni-numbox-plus {
		margin: 0;
		background-color: #f9f9f9;
		width: 50upx;
		height: 50upx;
		line-height: 50upx;
		text-align: center;
		color: #555555;
		font-size: 30upx;
	}

	.uni-numbox-minus {
		font-weight: bold;
		border: 2upx solid #cccccc;
		border-right: none;
		border-top-left-radius: 6upx;
		border-bottom-left-radius: 6upx;
	}

	.uni-numbox-plus {
		border: 2upx solid #cccccc;
		border-left: none;
		border-top-right-radius: 6upx;
		border-bottom-right-radius: 6upx;
	}

	.uni-numbox-value {
		border: 2upx solid #cccccc;
		background-color: #ffffff;
		width: 66upx;
		height: 50upx;
		font-size: 24upx;
		text-align: center;
		min-height: 50upx;
		color: #666!important;
	}

	.uni-numbox-disabled {
		color: #c0c0c0;
	}
</style>
