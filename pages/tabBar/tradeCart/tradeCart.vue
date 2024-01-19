<template>
	<view>

		<!-- 头部 -->
		<uni-nav-bar color="#333333" fixed="true" @click-left="back">
			<!-- #ifndef MP-WEIXIN -->
			<view class="input-view">
				<text class="view-text">{{ $t('购物车') }}</text>
			</view>
			<!-- #endif -->
			<block slot="right">
				<view class="city">
					<view class="iconfont icon-edit" @click="showDele = true" v-if="!showDele"></view>
					<view class="iconfont icon-wancheng" @click="showDele = false" v-if="showDele"></view>
					<!-- <text @click="showDele = true" v-if="!showDele">编辑</text>
					<text @click="showDele = false" v-if="showDele">完成</text> -->
				</view>
			</block>
		</uni-nav-bar>

		<view :style="{ height: barHeight('statusBarHeight') + 'px' }"></view>
		<view class="list">
			<view v-if="cartLists">
				<view class="uni-list" v-for="(item, key, index) in cartLists" :key="index">
					<checkbox-group @tap="editCart('sele', key, index)">
						<label class="uni-list-cell uni-list-cell-b uni-list-cell-pd">
							<view class="store_wrap">
								<checkbox :value="key" :checked="shopAllCheck(key)" style="display: none;" />
								<text class="iconfont"
									:class="shopAllCheck(key) ? 'icon-success' : 'icon-success-copy1'"></text>
								<text class="store-name">{{ key.split('-')[0] }}</text>
							</view>
						</label>
					</checkbox-group>
					<view class="uni-list-cell" v-for="(pro, i) in cartLists[key]" :key="i">
						<view class="uni-media-list" v-if="pro.productSpu">
							<checkbox-group class="list-flex" @tap="editSele(key, i)">
								<label class="uni-list-cell uni-list-cell-b uni-list-cell-pd">
									<view>
										<checkbox :checked="pro.checked" style="display: none;" />
										<text class="iconfont"
											:class="pro.checked ? 'icon-success' : 'icon-success-copy1'"></text>
									</view>
								</label>
							</checkbox-group>
							<view class="list-flex" @tap="navTo(pro.productSpu.pid)">
								<view class="flex-off" v-if="pro.isOffShelf">{{ $t('下架') }}</view>
								<image class="flex-img" :src="pro.image" @error="imgErr(key, i)" />
							</view>
							<view class="list-flex">
								<view class="product-tit" @tap="navTo(pro.productSpu.pid)">
									{{ pro.productSpu.pid }}
									{{ pro.productSpu.name }}
								</view>
								<view class="product-purchase" v-if="pro.skuValue && !pro.isOffShelf"
									@tap="navTo(pro.productSpu.pid)">
									<!-- 规格： -->
									<text class="">{{ pro.skuValue }}</text>
								</view>
								<view class="product-purchase" v-if="!pro.isOffShelf">
									{{ $t('起购量') }}<text
										class="purchase-num">{{ pro.productSpu.purchasingAmount || 1 }}</text>
								</view>
								<view class="product-price" v-if="!pro.isOffShelf">
									<text class="price">{{ '￥' + formatMoney(pro.price)}}</text>
									<uni-number-box :value="pro.count" :extendData="pro"
										@change="changeProductNum"></uni-number-box>
								</view>

							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="no-msg" v-if="showLoadMore">
				<fine-icon type="cart" size="100" class="cartEmpty"></fine-icon>
				<view class="cartEmpty">{{ $t('购物车是空的') }}</view>
			</view>
		</view>

		<view class="bg-fff footer">
			<view class="footer-flex" @click="selectAll">
				<checkbox-group class="footer-all">
					<view class="uni-list-cell-b">
						<checkbox :checked="comSeleAll" style="display: none;" />
						<text class="iconfont" :class="comSeleAll ? 'icon-success' : 'icon-success-copy1'"
							style="font-size:16px;color:#ccc"></text>
						<text style="font-size:14px">{{ $t('全选') }}</text>
					</view>
				</checkbox-group>
			</view>
			<view class="footer-flex total" v-show="!showDele">
				<text class="total-text">{{ $t('合计') }}: ￥{{ formatMoney(cartCount) }}</text>
			</view>
			<view class="footer-flex account" @click="jiesuan" v-if="!showDele">
				{{ $t('去结算') }}
			</view>
			<view class="footer-flex account" @click="deleShow" v-if="showDele">
				{{ $t('删除') }}
			</view>
		</view>

	</view>
</template>

<script>
	import uniNumberBox from '../../../components/uni-number-box.vue'
	export default {
		data() {
			return {
				url: this.prefix.baseImgUrl,
				prefix: this.prefix,
				showDele: false,
				showImg: true,
				seleAll: false,
				cartLists: {}, //购物车列表
				showLoadMore: false
			}
		},
		components: {
			uniNumberBox,
		},
		onShow() {
			let isLogin = this.$storage.isLogin()
			if (isLogin) {
				this.init()
			} else {
				this.showLoadMore = true
			}
		},
		computed: {
			// 所有商品是否全选
			comSeleAll() {
				let count = 0,
					i = 0;

				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						this.cartLists[k].forEach(n => {
							i++;
							n.checked ? count++ : ''
						})
					}
				}
				if (i == count && count !== 0) {
					return true;
				} else {
					return false;
				}
			},
			// 总价
			cartCount() {
				let price = 0
				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						this.cartLists[k].forEach(n => {
							if (n.checked) {
								price += (n.price * 100 * n.count)
							}
						})
					}
				}
				return price / 100;
			},
			// 店铺商品是否全选
			shopAllCheck() {
				return key => {
					let count = 0,
						i = 0;
					this.cartLists[key].forEach(n => {
						i++;
						n.checked ? count++ : ''
					})
					if (i == count && count !== 0) {
						return true;
					} else {
						return false;
					}
				}
			}
		},
		methods: {
			back() {
				let that = this
				uni.reLaunch({
					url: that.prefix.uIndex
				})
			},
			init() {
				this.$api.tradeCartList({}).then(res => {
					let cartList = res.data
					console.log("购物车数据：")
					console.log(cartList)
					let arr = Object.assign({}, cartList) //浅拷贝Object.assign方法只会拷贝源对象可枚举的的自有属性到目标对象
					if (Object.keys(arr).length === 0) {
						this.showLoadMore = true
						this.cartLists = {} //向外输出
						console.log("这个数据很重要444：" + this.cartLists)
						console.log(this.cartLists)
						return false
					} else {
						this.showLoadMore = false
						//对接口返回数据，做一轮加工。
						for (var k in cartList) {
							if (cartList.hasOwnProperty(k)) {
								cartList[k].forEach((n, i) => {
									arr[k][i].checked = false; //初始化复选框
									//先设置一个默认图
									arr[k][i].image = this.prefix.noProductImg
									// 当商品有图片时，拼接图片全路径赋值给一个新属性image
									if (arr[k][i].productSpu && arr[k][i].productSpu.image) {
										arr[k][i].image = this.prefix.baseImgUrl + arr[k][i].productSpu.image 
										+ this.imgShrink(100, 100);
									}
								})
							}
						}
						this.cartLists = arr; //向外输出
						console.log("这个数据很重要333：" + this.cartLists)
						console.log(this.cartLists)
					}
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})
			},

			editSele(key, index) {
				// 商品选择
				this.cartLists[key][index].checked = !this.cartLists[key][index].checked
				let productCount = 0
				this.cartLists[key].forEach((n, i) => {
					if (n.checked) {
						productCount++
					}
				})

				if (productCount === this.cartLists[key].length) {
					this.cartLists[key].checked = true
				} else {
					this.cartLists[key].checked = false
				}
			},
			editCart(falg, key, index) {
				// 店铺全选
				let data = this.cartLists[key];
				let isShopAllChecked = this.shopAllCheck(key)
				data.forEach((n, i) => {
					data[i].checked = !isShopAllChecked
				})
				// this.cartLists[index].checked = !this.cartLists[index].checked
				this.cartLists[key] = data
			},
			selectAll() {
				this.seleAll = !this.seleAll
				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						this.cartLists[k].forEach((n) => {
							n.checked = this.seleAll
						})
					}
				}
			},
			// 删除商品
			deleSele() {
				let arr = [];
				let noDeleteArr = this.cartLists
				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						this.cartLists[k].forEach((n, i) => {
							if (n.checked) {
								arr.push(n.cartId);
							}
						})
					}
				}
				this.$api.tradeCartDelete({
					cartIds: arr.join() + ',',
					isAll: +this.comSeleAll
				}).then(res => {
					this.openErrMsg(res.message)
					this.init()
				})
			},
			// 删除弹层
			deleShow() {
				let that = this
				let count = 0;
				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						this.cartLists[k].forEach((n, i) => {
							if (n.checked) {
								count++
							}
						})
					}
				}
				if (!count) {
					this.openErrMsg(that.$t('还没有选择商品'));
					return
				}
				uni.showModal({
					title: that.$t('提示'),
					content: that.$t('是否要删除选择的商品'),
					cancelText: that.$t('否'),
					confirmText: that.$t('是'),
					success: function(res) {
						if (res.confirm) {
							that.deleSele()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 商品数量改变
			changeProductNum(data) {
				let arr = this.cartLists
				for (let k in arr) {
					if (arr.hasOwnProperty(k)) {
						arr[k].forEach((n, i) => {
							if (n.cartId === data.param.cartId) {
								arr[k][i].count = data.num
							}
						})
					}
				}
				this.$api.tradeCartUpdateCount({
					cartId: data.param.cartId,
					count: data.num
				}).then(res => {
					this.cartLists = arr
				})
			},
			///////////////////////////////
			//去结算  (核心业务)
			///////////////////////////////
			jiesuan() {
				let that = this;
				let count = 0;
				let arr = [];
				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						this.cartLists[k].forEach((n, i) => {
							if (n.checked) {
								count++;
							}
						})
					}
				}

				if (!count) {
					this.openErrMsg(that.$t('请选择要购买的商品'));
					return;
				}

				for (let k in this.cartLists) {
					if (this.cartLists.hasOwnProperty(k)) {
						for (let i = 0; i < this.cartLists[k].length; i++) {
							let item = this.cartLists[k][i];
							if (item.checked) {
								if (item.isOffShelf) {
									this.openErrMsg(that.$t('不能购买无效的商品'));
									return;
								} else if (item.productSku.stock < item.count) {
									this.openErrMsg(item.productSpu.name + that.$t('库存不足'));
									return;
								} else if (item.productSpu.purchasingAmount > this.cartLists[k].reduce((count, item) => {
										// purchasingAmount; 是 起购量
										// 同店铺同ID的商品总计数量
										if (item.productSpu && item.productSpu.pid === item.productSpu.pid && item.checked) {
											return count += item.count
										} else {
											return count
										}
									}, 0)) {
									this.openErrMsg(that.$t('购买数量必须大于起购量,该商品的起购量是X', {
										num: item.productSpu.purchasingAmount
									}), 5000);
									return;
								} else {
									arr.push(this.cartLists[k][i].cartId);
								}
							}
						}
					}
				}

				uni.navigateTo({
					url: this.prefix.uOrderOk + '?stat=1&type=1&ids=' + arr.join() + '&productSumPrice=' + this
						.cartCount
					//this.cartCount 是商品总价
				})

			},
			imgErr(key, i) {
				let arr = this.cartLists;
				arr[key][i].image = this.prefix.noProductImg;
				this.cartLists = arr
			},
			navTo(pid) {
				let that = this
				uni.navigateTo({
					url: that.prefix.uProductDetail + '?pid=' + pid
				})
			},
		}
	}
</script>

<style scoped>
	.city {
		margin-left: 0px;
	}

	.city .icon-wancheng {
		font-size: 36upx;
	}

	.store-name {
		font-weight: 400;
		font-size: 32upx;
	}

	.store_wrap {
		display: flex;
		align-items: center;
	}

	.list {
		padding-bottom: 170upx;
	}

	.uni-list .uni-list-cell-b:after {
		height: 1upx;
		left: 0;
	}

	.uni-list .uni-list-cell .uni-list-cell-b:after {
		height: 0upx;
	}

	.list-flex {
		position: relative;
	}

	.list-flex .flex-off {
		position: absolute;
		top: 25%;
		left: 25%;
		background-color: #000000;
		color: #FFFFFF;
		width: 50%;
		height: 50%;
		border-radius: 100%;
		opacity: 0.7;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.list-flex:first-child {
		flex: 1;
	}

	.list-flex:nth-child(2) {
		width: 200upx;
	}

	.list-flex:last-child {
		flex: 8;
		padding-left: 20upx;
	}

	.list-flex .uni-list-cell-pd {
		padding: 0;
		height: 100%;
	}

	.flex-img {
		width: 200upx;
		height: 200upx;
	}

	.product-tit {
		height: 76upx;
		font-size: 28upx;
		color: #333;
		line-height: 1.36;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.product-purchase {
		font-size: 20upx;
		color: #949494;
	}

	/* .purchase-num {
		color: red;
	} */
	.product-price .price {
		color: red;
		font-size: 36upx;
	}

	.product-price {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer {
		display: flex;
		display: -webkit-flex;
		position: fixed;
		bottom: 100upx;
		/* #ifdef APP-PLUS | MP-WEIXIN */
		bottom: 0;
		/* #endif */
		left: 0;
		right: 0;
		height: 80upx;
		border-top: 2upx solid #ccc;
		z-index: 100;
	}

	.footer-flex {
		flex: 5;
		line-height: 80upx;
	}

	.footer-flex:first-child {
		flex: 2;
	}

	.footer-all .uni-list-cell-b {
		height: 100%;
		padding-left: 20upx;
		line-height: 80upx;
	}

	.total {
		padding: 0 30upx;
		text-align: right;
	}

	.total .total-text {
		color: red;
		font-size: 32upx;
	}

	.bg-fff {
		background: #fff;
	}

	.mui-left {
		margin-left: 20upx;
	}

	.account {
		text-align: center;
		color: #fff;
		background: #f1224b;
		font-size: 32upx;
		flex: 2;
	}

	/* .raido-view {
		padding-top: 10upx;
	}
	.raido-style {
		display: inline-block;
		width: 36upx;
		height: 40upx;
		border: 1upx solid #999;
		border-radius: 50%;
		position: relative;
		font-size: 40upx;
	} */
	.cartEmpty {
		color: #ccc;
	}
</style>