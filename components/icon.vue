<template>
    <text class="iconfont" :class="['icon-'+type]" :style="{color:color,'font-size':fontSize}" @tap="onClick()">
		<slot />
	</text>
</template>

<script>
    export default {
        props: {
            /**
             * 图标类型
             */
            type: String,
            /**
             * 图标颜色
             */
            color: String,
            /**
             * 图标大小
             */
            size: [Number, String],
        },
        computed: {
            fontSize() {
                return `${this.size}px`
            }
        },
        methods: {
            onClick() {
                this.$emit('click')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .icon-shoucang1{
		color: #ec0030;
	}
</style>

