<template>
    <view>
        <view class="product-item bg-fff dis-flex 1231" :style="{ top: barHeight('statusBarHeight') + 'px'}">
			<view class="flex-item" :class="{active : !productShow}" @click="tapProductShow">{{ $t('商品详情') }}</view>
			<view class="flex-item" :class="{active :productShow}" @click="tapProductShow">{{ $t('商品参数') }}</view>
		</view>
		<view v-show="!productShow" class="bg-fff">
			<view class="store-params" v-if="!productDetail">
				<text class="params-span">{{ $t('暂无商品详情') }}</text>
			</view>
			<view  class="richtext" v-if="productDetail" >
				<rich-text :nodes="productDetail"></rich-text>
			</view>
		</view>
		<view v-show="productShow" class="bg-fff">
			<view class="params-wrap" v-if="productParamListShow == 0">
				<view class="p-params" v-for="(item, j) in productParamList" :key="j">
					<view class="params-item">
						<view class="params-name">{{ item.name }}</view>
						<text class="params-val">{{ item.value }}</text>
					</view>
				</view>
			</view>
			<view class="store-params" v-if="productParamListShow == 1">
				<text class="params-span">{{ $t('加载中') }}</text>
			</view>
			<view class="store-params" v-if="productParamListShow == 2">
				<text class="params-span">{{ $t('很遗憾，暂无参数') }}</text>
			</view>
		</view>
    </view>
</template>

<script>
export default {
    props: {
        pid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            ppid: this.pid,
            productShow: false, // 商品详情切换
            productParamList: [], // 商品参数信息
            productParamListShow: 1,
            productDetail: '', // 商品详情
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            // 商品详情信息
            this.$api.productDetail({pid: this.ppid}).then(res => {
				//对商品详情的html片段，做一些必要的字符串替换
				let urlPrefix = `src="${ this.prefix.baseImgUrl }/`  //图片URL的前缀
				let data = res.data.introduction
				// console.log("图片URL的前缀",urlPrefix)
				// console.log("商品详情-替换前",data)
				data = data.replace(/src="\/upload\/filestorage\//g, urlPrefix)
                data = data.replace(/<p><img/g, '<p style="line-height: 0;"><img')
				// console.log("商品详情-替换后",data)
                this.productDetail = '<div>' + data + '</div>'
            }).catch(err => {
                this.openErrMsg(err.message || '加载错误')
            })
        },
        // 商品详情 商品参数切换
        tapProductShow() {
			this.productShow = !this.productShow;
			if(this.productParamListShow === 2) {
				return
			}
            this.productParamListShow = 1;
            this.productParamList.length == 0 ? this.loadProductParam() : this.productParamListShow = 0;
        },
        // 加载商品参数
        loadProductParam() {
            let that = this
            this.$api.productParamList({pid: this.ppid}).then(res => {
				that.productParamList = res.data || []
                that.productParamListShow = that.productParamList.length ? 0 : 2
            }).catch(err => {
                this.openErrMsg(err.message || '加载错误')
            })
        },
    }
};
</script>

<style scoped>
    .product-item {
		position: relative;
		/* margin-top: 16upx; */
		color: #999;
    }
    .dis-flex {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-around;
        justify-content: space-around;
        position: sticky;
	}
    .flex-item {
		padding: 20upx 0;
		border-bottom: 2upx solid #ccc;
		width: 100%;
		text-align: center;
	}
	.flex-item.active {
		border-bottom: 2upx solid #ec0030;
	}
    .store-params {
		padding: 500upx 20upx;
	}
	.store-params .params-span {
		display: block;
		height: 80upx;
		line-height: 80upx;
		border-top: 2upx solid #ccc;
		border-bottom: 2upx solid #ccc;
		text-align: center;
    }
    .params-wrap {
		padding: 30upx;
    }
    .params-item {
		display: flex;
		border-bottom: 1upx solid #ccc;
	}
	.p-params:first-child .params-item {
		border-top: 1upx solid #ccc;
	}
	.params-name {
		flex: 1;
		border-right: 1upx solid #ccc;
	}
	.params-val {
		flex: 2;
	}
	.params-name,
	.params-val {
		padding: 10upx;
		text-align: center;
	}
	.height750 {
		height: 750upx;
	}
	/* 无法控制 rich-text 内的样式 */
	.richtext {
		width: 100%;
		height: auto;
		overflow: hidden;
	}
	.richtext p img {
		line-height: 0;
	}
</style>