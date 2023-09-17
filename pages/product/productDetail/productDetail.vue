<template>
	<view class="detail-body">
		<nav-bar transparentFixedFontColor="#FFF">
			<!-- 滑动前 -->
			<!-- <view class="transparent_fixed_preview" slot="right">
				<view class="menu_icon">
					<image src="/static/img/share.png"></image>
				</view>
				<view class="menu_icon">
					<image src="/static/img/menu.png"></image>
				</view>
			</view> -->
			<!-- 滑动后 -->
			<view class="transparent_fixed_preview" slot="right">
				<view class="detail_anchor">
					<view class="detail_item"
						v-for="(anchor, i) in anchorList"
						:class="{ active: anchor.id === anchorChecked }"
						@tap="skipAnchor(anchor.id)"
						:key="i"
					>
						{{ $t(`${ anchor.name }`) }}
					</view>
				</view>
				<!-- <view class="detail_anchor" v-show="!anchorChecked">图文详情</view> -->
				<!-- #ifndef MP-WEIXIN -->
				<view class="menu_icon preview" v-if="isShowShare" @tap="shareProduct">
					<image src="/static/img/share.png"></image>
				</view>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="menu_icon preview" v-if="isShowShare" open-type="share">
					<image src="/static/img/share.png"></image>
				</button>
				<!-- #endif -->
				<view class="menu_icon preview" @tap="showMenu">
					<image src="/static/img/menu.png"></image>
				</view>
			</view>
		</nav-bar>
		<!-- 分享 -->
		<view class="shade bg" v-if="showShare" @tap="hideMenu">
			<share v-if="productName && pid && carousel.length" class="share" :config="{productName, pid, img: carousel[0]}"></share>
		</view>
		<view class="shade" @tap="hideMenu" @touchmove="hideMenu" v-show="showPopVal">
			<view class="wrap" :style="{top: barHeight('statusBarHeight') - 10 + 'px'}">
				<view class="item" v-for="item in popList" :key="item.type" @tap="onSearchType(item.type)">
					<view class="img">
						<view class="img_img" v-if="item.img" :style="{ backgroundImage: 'url('+item.img +')' }"></view>
						<fine-icon v-if="item.icon" :type="item.icon" class="icon_size" />
					</view>
					<view class="text">{{ $t(`${item.text}`) }}</view>
				</view>
			</view>
		</view>
		
		<!-- 商品 -->
		<view v-show="anchorChecked === 1 || anchorChecked === 2">
			<!-- 商品轮播图 -->
			<view class="height750">
				<swiper-carousel v-if="carousel.length > 0" :imgList="carousel" :autoplay="false" :height="'750'"></swiper-carousel>
			</view>
			
			<!--商品名称 价格 库存-->
			<view class="product-detail bg-fff">
				<view class="product-name">
					<text class="store_type" v-if="!prefix.englishShop && (storeType == 2 || storeType == 3)">{{ storeType === '2' ? '旗舰店' : '自营' }}</text>
					{{ productName }}
				</view>
				<view class="product-subname" v-if="productSubName">{{ productSubName }}</view>
				<view class="product-wrap" v-if="productType != 1">
					<view class="product-price" v-for="item in productPriceList" :key="item.id">
						<view>
							<text class="price-unit">{{ $t('¥') }}</text>
							<text class="price">{{item.price  }}</text>
							<!-- productPrice -->
						</view>
						<view class="price-num">{{ item.section }}</view>
					</view>
				</view>
				<view class="product-price" v-else>
					<text class="price-unit">{{ $t('¥') }}</text>
					<text class="price">{{ productPrice }}</text>
				</view>
				
				<!-- <view>{{ productNum + unit}}</view> -->
			</view>
			<view class="product-item set_height bg-fff">
				<view class="item-a">
					<view class="item-flex">
						<view>{{ $t('供应总量') }}：<text>{{ skuData + unit}}</text></view>
					</view>
					<view class="item-flex">
						<text>{{ $t('评价') }}:{{ commentCount || 0 }}&nbsp;&nbsp;&nbsp;</text>&nbsp;&nbsp;&nbsp;
						<text>{{ $t('月销') }}:{{ monthSales || 0 }}&nbsp;&nbsp;&nbsp;</text>&nbsp;&nbsp;&nbsp;
						<text>{{ $t('收藏') }}:{{ collectionCount || 0 }}</text>
						<!-- <uni-icons class="icon" type="arrowright" size="22" color="#999"></uni-icons> -->
					</view>
				</view>
			</view>
			<view class="product-item set_height bg-fff" v-if="productType == 1">
				<view class="item-a" @tap="showBottomPopup">
					<view class="sele">
						<view class="sele-span"><fine-icon type="banben" />{{ $t('已选') }}</view>
						<text>{{ displayCheckedVal }}</text>
						<uni-icons class="abso-icon" type="arrowright" size="22" color="#999"></uni-icons>
					</view>
				</view>
			</view>
			<view class="product-item set_height bg-fff border-b">
				<view class="item-a" @tap="gotoStore">
					<view class="sele">
						<view class="sele-span"><fine-icon type="wxbmingxingdianpu" />{{ $t('店铺') }}</view>
						<text class="sele-shop">{{ storeName }}</text>
						<uni-icons class="abso-icon" type="arrowright" size="22" color="#999"></uni-icons>
					</view>
				</view>
			</view>
			<view class="bg-fff product-rest" v-if="!prefix.englishShop">
				<view class="rest-span"><fine-icon type="success" />{{ $t('官方认证店') }}</view>
				<view class="rest-span"><fine-icon type="success" />{{ $t('担保交易') }}</view>
				<view class="rest-span"><fine-icon type="success" />{{ $t('7天退换货') }}</view>
			</view>

			<!--店铺信息-->
			<view class="product-item store-msg bg-fff">
				<view class="store-img">
					<view class="store-img-view"><image v-if="storeLogo + imgShrink(150, 75)" class="view-img" :src="prefix.baseImgUrl + storeLogo" /></view>
				</view>
				<view class="store-name">
					<view class="name">{{ storeName }}</view>
					<view class="top-right">
						<fine-icon :type="i > storeStar ? 'shoucang' : 'shoucang1'" v-for="i in 5" :key="i" />
					</view>
				</view>
				<view class="store-appraise">
					<view class="appraise-item">
						<view class="item-num">
							<text class="item-num_text">{{ $t('描述') }}</text>
							<text class="item-num_num" :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.productScore }}</text>
							<text :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.productScoreUpOrDown === '1' ? '↑' : '↓' }}</text>
							<!-- 描述<text>4.8↑</text> -->
						</view>
						<view class="score">{{ collectionStoreCount }}</view>
						<view class="item-attention">{{ $t('关注人数') }}</view>
					</view>
					<view class="appraise-item">
						<!-- <view class="item-num">服务<text>4.8↓</text></view> -->
						<view class="item-num">
							<text class="item-num_text">{{ $t('服务') }}</text>
							<text class="item-num_num" :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.serviceAttitudeScore }}</text>
							<text :class="storeData.serviceAttitudeScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.serviceAttitudeScoreUpOrDown === '1' ? '↑' : '↓' }}</text>
						</view>
						<view class="score">{{ productAllCount }}</view>
						<view class="item-attention">{{ $t('全部商品') }}</view>
					</view>
					
					<view class="appraise-item">
						<!-- <view class="item-num">物流<text>4.8↑</text></view> -->
						<view class="item-num">
							<text class="item-num_text">{{ $t('物流') }}</text>
							<text class="item-num_num" :class="storeData.productScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.logisticsScore }}</text>
							<text :class="storeData.logisticsScoreUpOrDown === '1' ? 'up': 'down'">{{ storeData.logisticsScoreUpOrDown === '1' ? '↑' : '↓' }}</text>
						</view>
						<view class="score">{{ storeArticleCount }}</view>
						<view class="item-attention">{{ $t('店铺动态') }}</view>
					</view>
				</view>
				<view class="store-btn-flex">
					<view class="btn" @click="collectStore">
						<fine-icon :type=" collectionStoreId ? 'shoucang1' : 'favorite1'" /><text>{{ $t('收藏店铺') }}</text>
					</view>
					<view class="btn" @click="gotoStore">
						<fine-icon type="wxbmingxingdianpu" /><text>{{ $t('进店逛逛') }}</text>
					</view>
				</view>
			</view>
			
			
			<view class="pull">
				<!-- <uni-icons type="arrowup" color="#999" size="18"></uni-icons> -->
				<view class="pull_btn">{{ $t('详情') }}</view>
			</view>
		</view>
		<!--index 商品详情-->
		<view v-show="anchorChecked === 1 || anchorChecked === 2" v-if="pid"  class="detail" style="margin-bottom: 44px;">
			<detail :pid="pid"></detail>
		</view>

		<!--tab 商品详情-->
		<!-- <view v-show="anchorChecked === 2" v-if="pid" style="margin-bottom: 44px;">
			<detail :pid="pid"></detail>
		</view> -->

		<!--评价-->
		<view v-show="anchorChecked === 3" v-if="pid" style="margin-bottom: 44px;">
			<comment-list :pid="pid" :showBar="false"></comment-list>
		</view>


		<!--咨询-->
		<view v-show="anchorChecked === 4" v-if="pid" style="margin-bottom: 44px;">
			<consultation-list :pid="pid" :showBar="false" v-if="loadShow"></consultation-list>
		</view>
		
		<!-- 底部按钮 -->
		<view class="bg-fff footer">
			<view class="flex-1" @tap="gotoStore">
				<fine-icon type="wxbmingxingdianpu" :class="{ 'icon-color' : show1 }" />
				<view>{{ $t('店铺') }}</view>	
			</view>
			<view class="flex-1" @tap="collectProduct">
				<fine-icon :type="collectId ? 'shoucang1' : 'favorite1'" />
				<view>{{ $t('收藏') }}</view>
			</view>
			<view class="flex-1" @tap="skipCart">
				<fine-icon type="cart" />
				<view>{{ $t('购物车') }}</view>	
			</view>
			<view class="flex-2 flex-cart" @tap="addProduct">{{ $t('加入购物车') }}</view>
			<view class="flex-2 flex-buy" @tap="instantBuy">{{ $t('立即购买') }}</view>
		</view>

		<!-- 购买弹层 -->
		<uni-popup :show="showPopupBottom" :type="popType" :msg="msg" v-on:hidePopup="hidePopup">
			<!-- 可选择菜单 -->
			<view class="cover-content">
				<view class="sku-wrap">
					<view class="header">
						<view class="img-wrap">
							<image v-if="summaryImg" :src="prefix.baseImgUrl + summaryImg + imgShrink(150, 150)" class="j-summary-img" />
						</view>
						<view class="main">
							<view class="price">{{ $t('¥') + (sectionPrice || productPrice) }}</view>
							<view class="stock" v-if="productType != 1"><text>{{ $t('起购量') }}: {{ purchasingAmount }}{{ unit }}</text></view>
						</view>
						<view class="sku-close"><fine-icon type="73" /></view>
					</view>
					<!-- 批发 -->
					<view class="body" v-if="productType == 2 || productType == 3">
						<view class="t-flex body_item">
							<view v-if="skuList.length && skuList[0].spec1V">{{ $t('规格') }}</view>
							<view>{{ $t('单价') }}</view>
							<view>{{ $t('库存量') }}</view>
							<view class="cai-gou">{{ $t('采购数') }}</view>
						</view>
						<block v-for="(item, index) in skuList" :key="index">
							<view class="t-flex">
								<view v-if="item.spec1V">
									<view v-if="item.spec1V">{{ item.spec1V }}</view>
									<view v-if="item.spec2V">{{ item.spec2V }}</view>
									<view v-if="item.spec3V">{{ item.spec3V }}</view>
								</view>
								<view>{{ $t('¥') + (sectionPrice || productPrice)  }}</view>
								<view>{{ item.stock + unit }}</view>
								<view class="tt-flex">
									<uni-number-box :extendData="index" @change="valueChange"  :min="0" :max="item.stock" :value="item.checkedNum"></uni-number-box>
								</view>
							</view>
						</block>
					</view>
					<!-- 零售 -->
					<view class="body retail" v-if="productType == 1 && retailList">
						<block v-for="(item, key, index) in retailList" :key="index">
							<view class="b-title" v-if="key">{{ key }}</view>
							<view class="b-wrap">
								<view class="b-flex">
									<view class="b-item"
										v-for="(child, i) in item"
										:class="{ checked: child.checked }"
										:key="i"
										@tap="retailChange(key, i)"
									>{{ child.value }}
									</view>
								</view>
							</view>
						</block>

						<view class="b-wrap retail_buy_num">
							<view class="b-title">{{ $t('购买数量') }}</view>
							<view class="tt-flex">
								<uni-number-box @change="valueChange"  :min="1" :max="skuData" :value="presentValue"></uni-number-box>
							</view>
						</view>
					</view>
					<view class="trade">
						<view class="ok " type="buy" @click="buy">{{ $t('确定') }}</view>
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import uniPopup from '../../../components/uni-popup.vue'
	import swiperCarousel from "../../../components/swiper.vue"
	import uniNumberBox from '../../../components/uni-number-box.vue'
	import navBar from '../../../components/zhouWei-navBar'
	import detail from './detail'
	import commentList from './commentList'
	import consultationList from './consultationList'
	import share from '../../../components/share'
	import { config } from '../../../config/config'

	export default {
		data() {
			return {
				prefix: this.prefix,
				pid: '',
				storeData: {}, // 店铺信息
				productName: '', // 店铺名称
				productSubName: '', // 店铺sub
				monthSales: '', // 月销
				collectionCount: '', // 收藏
				unit: '', // 商品单位
				carousel: [], // 轮播图
				summaryImg: '', // 弹层图片
				storeName: '', // 店铺名称
				storeLogo: '', // 店铺logo
				
				collectionStoreCount: '', // 店铺收藏数
				storeArticleCount: '', // 全部商品数
				productAllCount: '', // 店铺动态数目
				productPrice: '', // 商品单价
				productNum: 0, // 商品数量
				commentCount: 0, // 评价数量
				
				presentValue: 1, // 当前选择的商品数
				
				showPopupBottom: false,
				msg: '',
				popType: 'bottom',
				// skuId: '',
				showAddCart: false ,// ture时是加入购物车
				collectId: '',
				collectionStoreId: false,
				skuData: 0,
				skuList: [],
				productType: '',
				retailStock: 0,  // 零售库存
				purchasingAmount: 0, // 起购量
				productPriceList: '',  // 阶梯价
				sectionPrice: 0, // 当前采购数量到批发价
				retailList: null, // 零售
				showPopVal: false,
				popList: [
					 {
						type: 1,
						text: '首页',
						img: require('../../../static/zhouWei-navBar/home-1.png')
					}, {
						type: 2,
						text: '购物车',
						img: require('../../../static/img/cart.png')
					}, {
						type: 3,
						text: '个人中心',
						img: require('../../../static/img/account.png')
					}, {
						type: 4,
						text: '消息',
						icon: 'xiaoxi2'
					}
				],
				anchorChecked: 1,
				anchorList: [
					{
						id: 1,
						name: '商品',
						checked: true,
					},{
						id: 2,
						name: '详情',
						checked: false,
					},{
						id: 3,
						name: '评价',
						checked: false,
					},{
						id: 4,
						name: '咨询',
						checked: false,
					}
				],
				show1: false,
				storeId: '', // 店铺id
				productDetailIsShow: false,
				downPullLocation: [],
				topPullLocation: [],
				timer: null,
				loadShow: true,
				showShare: false,
				detailTop: 1100,
				isShowShare: config.shareIsShow, //“分享”是否显示, 为true显示,为false不显示
				storeType: 0
			}
		},
		components: {
			uniPopup,
			uniNumberBox,
			swiperCarousel,
			navBar,
			detail,
			commentList,
			consultationList,
			share
		},
		computed: {
			storeStar() {
				let data = this.storeData
				return Math.round((+data.logisticsScore + +data.serviceAttitudeScore + +data.productScore) / 3)
			},
			displayCheckedVal() {
				let arr = []
				for(let key in this.retailList) {
					arr.push(this.retailList[key].find(val => val.checked).value)
				}
				let str = arr.join()
				return str ? str + ' ; ' + this.presentValue : + this.presentValue
			}
		},
		onLoad(param) {
			this.pid = param.pid || ''
			this.init()
		},
		onShow() {
			if(this.anchorChecked === 4) {
				this.loadShow = false
				this.$nextTick(() => (this.loadShow = true))
			}
		},
		mounted() {
			let that = this
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this)
				query.select('.detail').boundingClientRect(data => {
					if(data) {
						that.detailTop = data.top - that.barHeight('statusBarHeight')
					}
				}).exec();
			})
		},
		// 微信小程序分享
		onShareAppMessage (res) {
			if (res.from === 'button') {
			// 来自页面内转发按钮
			}
			console.log('分享的图片路径', this.prefix.baseImgUrl + this.carousel[0].path)
			return {
				title: this.productName,
				path: `/pages/product/productDetail/productDetail?pid=${this.pid}`,
				imageUrl: this.prefix.baseImgUrl + this.carousel[0].path
			}
		},
		//实时获取到滚动的值 
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop
			clearTimeout(this.timer)
			this.timer = setTimeout(() => {
				if(e.scrollTop >= this.detailTop && this.anchorChecked === 1) {
					this.anchorChecked = 2
				} 
				if(e.scrollTop <= (this.detailTop - 1) && this.anchorChecked === 2) {
					this.anchorChecked = 1
				}
			}, 20);
			
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			skipAnchor(i, type) {
				this.anchorList.forEach(item => {
					item.id === i ? this.anchorChecked = item.id : ''
				})
				if(this.anchorChecked === 1) {
					uni.pageScrollTo({  
						scrollTop: 0,  
						duration: 300  
					}); 
				}
				if(this.anchorChecked === 2) {
					let that = this
					setTimeout(() => {
						uni.pageScrollTo({  
							scrollTop: that.detailTop,  
							duration: 300  
						}); 
					}, 50);
				}
			},
			// 店铺收藏
			collectStore() {
				let that = this
				if(!this.$storage.isLogin()) {
					uni.showToast({
						title: that.$t('暂未登录，请先登录'),
						icon: 'none'
					})
					return false
				}
				if(!this.collectionStoreId) {
					this.$api.userCollectionStoreSave({storeId: this.storeId}).then(res => {
						if(res.status !== '200') {
							this.errMsg = res.message ? res.message : '加载错误'
							return false
						}
						this.collectionStoreId = res.data.collectionStoreId
						uni.showToast({
							title: that.$t('店铺收藏成功'),
							duration: 1000,
							icon: 'none'
						})
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				} else {
					this.$api.userCollectionStoreCancel({collectionIds: this.collectionStoreId}).then(res => {
						if(res.status !== '200') {
							this.errMsg = res.message ? res.message : '加载错误'
							return false
						}
						this.collectionStoreId = ''
						uni.showToast({
							title: that.$t('取消店铺收藏成功'),
							duration: 1000,
							icon: 'none'
						})
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
			},
			// 商品收藏
			collectProduct () {
				let that = this
				if(!this.$storage.isLogin()) {
					uni.showToast({
						title: that.$t('暂未登录，请先登录'),
						icon: 'none'
					})
					return false
				}
				if(this.collectId) {
					let isLogin = this.$storage.isLogin()
					if(isLogin) {
						this.$api.userCollectionProductCancel({collectionIds: this.collectId}).then(res => {
							this.collectId = ''
							uni.showToast({
								title: res.message,
								icon: 'none'
							})
						}).catch(err => {
							this.openErrMsg(err.message || '加载错误')
						})
					}
				} else {
					this.$api.userCollectionProductSave({pid: this.pid}).then(res => {
						this.collectId = res.data.collectionId
						uni.showToast({
							title: res.message,
							icon: 'none'
						})
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
			},
			// 进入店铺
			gotoStore() {
				let that = this
				uni.navigateTo({
					url: that.prefix.uStoreIndex + '?storeId='+ that.storeId,
				});
			},
			onSearchType(type) {
				let that = this
				if(type === 1) {
					uni.switchTab({
						url: that.prefix.uIndex
					})
					return
				}
				if(type === 2) {
					this.skipCart()
					return
				}
				if(type === 3) {
					uni.switchTab({
						url: that.prefix.uUserCenter
					})
					return
				}
				if(type === 4) {
					this.skipMessage()
					return
				}
			},
			skipMessage(event) {
				let that = this
				if(!that.$storage.isLogin()) {
					uni.showToast({
						title: that.$t('暂未登录，请先登录'),
						icon: 'none'
					})
					return false
				}
				uni.navigateTo({
					url: that.prefix.uMsgList
				})
			},
			shareProduct() {
				this.showShare = !this.showShare
			},
			showMenu() {
				this.showPopVal = true
			},
			hideMenu() {
				this.showPopVal = false
				this.showShare = false
			},
			// 隐藏弹层
			hidePopup() {
				this.showPopupBottom = false;
			},
			// 加入购物车
			addProduct() {
				this.showAddCart = true
				this.showBottomPopup()
			},
			// 进入购物车
			skipCart() {
				let that = this
				if(!this.$storage.isLogin()) {
					uni.showToast({
						title: that.$t('暂未登录，请先登录'),
						icon: 'none'
					})
					return false
				}
				uni.switchTab({
					url: that.prefix.uTradeCart
				})
			},
			// 显示弹层
			showBottomPopup() {
				this.hidePopup();
				this.popType = 'bottom';
				this.showPopupBottom = true;
			},
			instantBuy() {
				this.showAddCart = false
				this.showBottomPopup()
			},
			// 点击弹层的确认按钮
			buy() {
				let that = this
				if(!this.$storage.isLogin()) {
					uni.showToast({
						title: that.$t('暂未登录，请先登录'),
						icon: 'none'
					})
					return false
				}
				let skuMsg = ''
				let skuList = this.skuList
				for(let i = 0; i < skuList.length; i++) {
					// 批发商品
					if(this.productType != 1) {
						// 批发购买的总数量
						let totalCheckedNum = skuList.reduce((count, item) => count += item.checkedNum, 0)
						// 立即购买需要验证数量
						if(!that.showAddCart) {
							if(totalCheckedNum >= this.purchasingAmount) {
								if(skuList[i].checkedNum) skuMsg += skuList[i].skuId + '-' + skuList[i].checkedNum + ','
							} else {
								this.openErrMsg(this.$t('购买数量必须大于起购量,该商品的起购量是X', { num: this.purchasingAmount }))
								return
							}
						} else {
							// 加入购物车
							if(skuList[i].checkedNum) skuMsg += skuList[i].skuId + '-' + skuList[i].checkedNum + ','
						}
					}
					// 零售商品
					if(this.productType == 1 ) {
						// 选中规格
						// let obj = this.retailList
						// let attr = []
						// for(let key in obj) {
						// 	if(obj.hasOwnProperty(key)) {
						// 		obj[key].forEach(item => {
						// 			if(item.checked) attr.push(item.value)
						// 		})
						// 	}
						// }
						// 有问题的代码
						// if(skuList[i].specValue === attr.join('')) {
						// 	skuMsg += skuList[i].skuId + '-' + this.presentValue + ','
						// } else {
						// 	skuMsg += skuList[i].skuId + '-' + this.presentValue + ','
						// }
						// 重写逻辑
						if(skuList[i].checked) skuMsg += skuList[i].skuId + '-' + this.presentValue + ','
					}
				}
				if(that.showAddCart) {
					this.$api.tradeCartSave({
						pid: that.pid,
						skuMsg: skuMsg,
						type: 2
					}).then(res => {
						uni.showToast({
							title: that.$t('加入购物车成功'),
							icon: 'none'
						})
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				} else {

					this.$api.tradeOrderConfimOrderValidate({
						stat: 2,
						pid: that.pid,
						skuMsg: skuMsg,
						type: 2,
					}).then(res => {
						if(res.data) {
							uni.navigateTo({
								url: that.prefix.uOrderOk +
									'?stat=2&ids='+ that.pid +'&skuMsg='+ skuMsg +'&type=' + that.productType
							})
						} else {
							this.openErrMsg(res.message)
						}
						
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
				this.hidePopup();
			},
			//零售 根据选中的规格，显示不同的图片、价格和库存信息
			updateProductMsgBySpec() {
				let obj = this.retailList
				let attr = []
				for(let key in obj) {
					if(obj.hasOwnProperty(key)) {
						obj[key].forEach(item => {
							if(item.checked) attr.push(item.value)
						})
					}
				}
				this.skuList.forEach(item => {
					if(item.specValue === attr.join('')) {
						this.retailStock = item.stock
						this.productPrice = item.price
					}
				})
			},
			// 初始化 商品加载数据
			init() {
				let param = {pid: this.pid}
				let that = this

				this.$api.productAll(param).then(res => {
					let data = res.data
					// https://test.sicheng.net/upload/filestorage/shop_init/store_logo.png@135x75
					cartSku.call(this, data.productSkuList)
					proMsg.call(this, data.productOne)
					parCarousel.call(this, data.productImageList)
					data.productSectionPriceList && proPrice.call(this, data.productSectionPriceList)
					storeMsg.call(this, data.storeOne)
					storeTop.call(this, data.storeNavCount)
				}).catch(err => {
					this.openErrMsg(err.message || '加载错误')
				})

				// 查询库存
				function cartSku(data) {
					let skuData = 0
					let spec1Name = ''
					let spec2Name = ''
					let spec3Name = ''
					let spec1List = []
					let spec2List = []
					let spec3List = []
					if(data.length === 0) {
						return
					}					
					for(let i = 0; i < data.length; i++) {
						// data[i].specValue = data[i].spec1V+data[i].spec2V+data[i].spec3V
						if(data[i].spec1V) {
							spec1List.push(data[i].spec1V)
							spec1Name = data[i].spec1.split('_')[1]
							data[i].specValue = data[i].spec1V
						}
						if(data[i].spec2V) {
							spec2List.push(data[i].spec2V)
							spec2Name = data[i].spec2.split('_')[1]
							data[i].specValue += data[i].spec2V
						}
						if(data[i].spec3V) {
							spec3List.push(data[i].spec3V)
							spec3Name = data[i].spec3.split('_')[1]
							data[i].specValue += data[i].spec3V
						}
					}
					if(spec1List.length > 0) {
						spec1List = this.deWeight(spec1List)
					}
					if(spec2List.length > 0) {
						spec2List = this.deWeight(spec2List)
					}
					if(spec3List.length > 0) {
						spec3List = this.deWeight(spec3List)
					}

					this.skuList = data.map((item, index) => {
						item.checked = index === 0
						item.checkedNum = 0
						skuData += item.salableStock
						return item
					})
					let obj = {}

					if(spec1List.length) obj[spec1Name] = spec1List
					if(spec2List.length) obj[spec2Name] = spec2List
					if(spec3List.length) obj[spec3Name] = spec3List
					this.retailList = obj
					// 更新商品价格
					this.updateProductMsgBySpec()
					// 供应总量
					this.skuData = skuData
				}
				// 商品信息
				function proMsg(datum) {
					this.productName = datum.name
					this.productSubName = datum.nameSub
					this.commentCount = datum.commentCount
					this.monthSales = datum.monthSales
					this.collectionCount = datum.collectionCount
					this.unit = datum.unit || ''
					this.summaryImg = datum.image
					this.storeId = datum.storeId
					this.productPrice = datum.type == 2 ? datum.minPrice2 : datum.minPrice1
					this.productType = datum.type
					this.purchasingAmount = datum.purchasingAmount
					if(datum.type != 1) {
						this.getSectionPrice()
					}
					// this.getStore(datum.storeId)
					// 获取店铺信息，箭头向上向下
					this.$api.storeOneAll({ storeId: this.storeId }).then(res => {
						this.storeData = res.data.solrStore
					})
				}
				// 轮播
				function parCarousel(datum) {
					datum.forEach((n,i) => {
						datum[i].path = datum[i].path + this.imgShrink(500, 500, 0)
					})
					this.carousel = datum
				}
				// 商品价格  // 阶梯价
				function proPrice(data) {
					let datum = data.map((item, index) => {
						if(data.length - 1  === index) {
							item.section = '≥' + item.section
						} else {
							item.section = data[index].section + '~' + (data[index+1].section - 1)
						}
						return item
					})
					this.productPriceList = datum
					this.productNum = data.length ? +data[0].section : 0
				}
				// 店铺信息
				function storeMsg(datum) {
					this.storeName = datum.name
					this.storeLogo = datum.logo
					this.storeType = datum.storeType
				}
				// 店铺头部信息
				function storeTop(datum) {
					this.collectionStoreCount = datum.collectionStoreCount
					this.productAllCount = datum.productAllCount
					this.storeArticleCount = datum.storeArticleCount
				}
			
				this.getIsCollection()
			},
			// 是否收藏店铺
			getIsCollection() {
				let that = this
				if(this.$storage.isLogin()) {
					this.$api.userCollectionProductIsCollection({pid: this.pid}).then(res => {
						this.collectId = res.data
					}).catch(err => {
						this.openErrMsg(err.message || '加载错误')
					})
				}
			},
			// 购买数量改变
			valueChange(param) {
				if(this.productType != 1) {
					this.skuList[param.param].checkedNum = param.num
					let skuList = this.skuList
					let presentValue = 0
					this.getSectionPrice()
					for(let i = 0; i < skuList.length; i++) {
						if(skuList[i].checkedNum) {
							presentValue += skuList[i].checkedNum
						}

						if(this.productType == 1 && skuList[i].checked) {
							presentValue += this.presentValue
						}
					}
					this.presentValue = presentValue
				} else {
					this.presentValue = param.num
				}
			},
			// 零售商品切换规格
			retailChange(key, index) {
				let data = this.retailList
				let skuList = this.skuList.slice()
				data[key].forEach((item, i) => {
					item.checked = index === i
					if(index === i) {
						skuList.forEach(val => {
							val.checked = val.specValue === item.value
						})
					}
					
				})
				this.retailList = data
				this.skuList = skuList
				this.updateProductMsgBySpec()
			},
			// 获取批发价
			getSectionPrice() {
				let count = 0
				this.skuList.forEach(item => {
					if(item.checkedNum) {
						count += item.checkedNum
					}
				})
				this.$api.productGetSectionPrice({
					pid: this.pid,
					count: count || 1
				}).then(res => {
					this.sectionPrice = res.data
				})
			},
			// 去重 返回符合业务的数组
			deWeight(data) {
				return [...new Set(data)].map((value, index) => {
					return {
						value,
						checked: index === 0
					}
				})
			}
		}
	}
</script>

<style scoped>
	.height750 {
		height: 750upx;
	}
	.transparent_fixed_preview {
		display: flex;
		width: 100%;
		align-items: center;
	}
	.detail_anchor {
		flex: auto;
		display: flex;
		justify-content: space-evenly;
	}
	.detail_item {
		color: #858585;
	}
	.detail_item.active {
		color: #ec0030;
		border-bottom: 2upx solid #ec0030;
	}
	.menu_icon {
		width: 40upx;
		height: 40upx;
		background: rgba(255, 255, 255, .9);
		border-radius: 50%;
		padding: 6px;
	}
	/* .menu_icon.preview {
		pad
	} */
	.menu_icon:last-child {
		margin: 0 0 0 10upx;
	}

	.wrap {
		position: fixed;
		right: 14upx;
		width: 228upx;
		height: auto;
		background: #333;
		z-index: 999;
		border-radius: 6upx;
	}
	.wrap::after {
		content: "";
		position: absolute;
		top: -10upx;
		right: 20upx;
		width: 24upx;
		height: 24upx;
		background: #333;
		transform: rotate(45deg);
	}
	.shade {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
	}
	.shade.bg {
		background: rgba(0, 0, 0, .3)
	}
	.share {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
	}
	.item {
		display: flex;
		align-items: center;
		color: #fff;
		font-size: 26upx;
		padding: 10upx 20upx;
		position: relative;
	}
	.item::after {
		content: "";
		height: 2upx;
		background: #ccc;
		position: absolute;
		left: 0;
		right: 0;
		top: 64upx;
		transform: scale(.8);
	}
	.item:last-child::after {
		content: none;
	}
	.img {
		width: 34upx;
		height: 34upx;
		overflow: hidden;
		position: relative;
	}
	.text {
		margin-left: 20upx;
	}
	.img .img_img{
		position: relative;
		left: -40upx;
		width: 100%;
		height: 100%;
		border-right: 40upx solid transparent;
		filter: drop-shadow(40upx 0 #fff);
		background-size: cover;
		background-repeat: no-repeat;
	}
	.icon_size {
		position: absolute;
		/* #ifndef APP-PLUS */
		top: -12upx;
		/* #endif */
		/* #ifdef APP-PLUS */
		top: -14upx;
		/* #endif */
		left: 2upx;
		font-size: 30upx;
	}


	.detail-body {
		background: #efeff4;
	}
	.title {
		font-size: 30upx;
		line-height: 40upx;
		color: #333333;
		padding: 60upx;
	}
	.pull {
		display: flex;
		justify-content: center;
		background: #efeff4;
		margin-top: 20upx;
		padding: 0 0 22upx;
		color: #343434;
		height: 50upx;
	}
	.pull_btn {
		position: relative;
	}
	.pull .pull_btn::before {
		content: "";
		position: absolute;
		left: -40upx;
		width: 20upx;
		height: 2upx;
		background: #343434;
		top: 50%;
	}
	.pull .pull_btn::after {
		content: "";
		position: absolute;
		right: -40upx;
		width: 20upx;
		height: 2upx;
		background: #343434;;
		top: 50%;
	}
	
	.product-appraise {
		padding: 20upx 20upx;
	}
	/* .appraise-title {
		padding: 20upx;
	} */
	.appraise {
		padding: 0 0 20upx 0;
	}
	/* .appraise-title, */
	.detail-top {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
	}
	.appraise-detail {
		padding: 16upx 20upx 0;
		border-bottom: 1upx solid #c5c5c5;
	}
	.appraise-detail-last {
		border-bottom: 0;
	}
	.top-left {
		display: flex;
		display: -webkit-flex;
	}
	.top-left-span {
		line-height: 34px;
		margin-left: 5px;
		color: #999;
		font-size: 20upx;
	}
	.top-left .top-left-img {
		width: 60upx;
		height: 60upx;
		border: 2upx solid #ccc;
		border-radius: 50%;
	}
	.detaile-content {
		color: #333;
	}
	.top-right .iconfont {
		font-size: 28upx;
		color: #ec0030;
	}
	.btn-block {
		margin: 10upx 20upx 0;
		padding: 6upx 0;
		display: block;
		text-align: center;
		background: #f7f7f7;
		border-radius: 10upx;
		border: 2upx solid #ccc;
		color: #666;
	}

	.footer {
		display: flex;
		/* align-items: center; */
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 88upx;
        border-top: 2upx solid #dedede;
        z-index: 9;
	}
	.flex-1 {
		padding: 8upx 0 0;
		flex: 1;
		text-align: center;
		/* border-right: 2upx solid #ccc; */
	}
	.flex-1 .iconfont {
		line-height: 1;
		font-size: 36upx;
	}
	.flex-1 view {
		line-height: 1;
		font-size: 18upx;
		color: #a3a3a3;
	}
	.icon-shoucang1,
	.icon-color {
		color: #ec0030;
	}
	.flex-2 {
		flex: 2;
		text-align: center;
		font-size: 28upx;
		line-height: 88upx;
		color: #fff;
		background: #fecc32;
	}
	.flex-2:last-child {
		background: #f1224b;
	}
	


	.abso-icon,
	.item-a .uni-icons {
		position: absolute;
		/* #ifdef H5 */
		top: 22upx;
		/* #endif */
		/* #ifndef H5 */
		top: 13upx;
		/* #endif */
		right: 0;
	}
    .product-detail {
		padding: 16upx;
		max-height: 200upx;
	}
	.product-name{
		font-size: 38upx;
		font-weight: 300;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	.product-subname {
		color: #f1224b;
		font-size: 20upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.product-wrap {
		display: flex;
	}
	.product-price {
		flex: 1;
		margin: 20upx 0 0;
		color: red;
	}
	.product-price > view {
		line-height: 1.2;
	}
	.product-price .price {
		font-size: 36upx;
	}
	.product-price .price-num {
		font-size: 24upx;
		color: #666;
	}
	
	.product-item {
		position: relative;
		margin-top: 16upx;
		color: #999;
	}
	.set_height {
		height: 90upx;
	}
	.store-msg {
		height: 584upx;
	}
	.item-a {
		display: flex;
		padding: 20upx 0 20upx 20upx;
	}
	.item-flex {
		flex: 1;
	}
	.item-flex > view {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 260upx;
	}
	.item-flex + .item-flex {
		flex: 1.8;
		text-align: right;
		padding-right: 14upx;
	}
	.item-flex + .item-flex text {
		margin-left: 14upx;
	}
	.item-flex .icon {
		text-align: right;
	}
	
	.sele-span {
		display: inline-block;
		padding-right: 20upx;
		margin-right: 10upx;
		border-right: 2upx solid #999;
		line-height: 40upx;
	}
	.sele-span .iconfont {
		margin-right: 4upx;
	}
	.sele-shop {
		color: #000000;
	}
	
	.border-b {
		border-bottom: 2upx solid #ccc;
	}
	.product-rest {
		padding: 20upx;
		font-size: 24upx;
	}
	.product-rest .rest-span {
		display: inline-block;
		margin-right: 10upx;
		color: #999;
	}
	.product-rest .iconfont {
		margin-right: 6upx;
		color: #2f8714;
		font-size: 24upx;
	}
	.mpb-none {
		border: none;
		padding: 0;
		margin: 0;
	}
	
	
	
	.store-params {
		padding: 40upx 20upx;
	}
	.store-params .params-span {
		display: block;
		height: 80upx;
		line-height: 80upx;
		border-top: 2upx solid #ccc;
		border-bottom: 2upx solid #ccc;
		text-align: center;
	}
	
	.store-img {
		padding-top: 40upx;
	}
	.store-img .store-img-view {
		text-align: center;
	}
	.store-img .store-img-view .view-img {
		width: 200upx;
		height: 100upx;
	}
	.store-name {
		text-align: center;
	}
	.store-name .name {
		margin: 0;
	}
	.store-appraise,
	.store-btn-flex {
		display: flex;
		display: -webkit-flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		padding: 0 20upx;
	}
	.store-appraise .item-num,
	.store-appraise .score,
	.store-appraise .item-attention {
		text-align: center;
	}
	.appraise-item {
		width: 100%;
		border-right: 2upx solid #ccc;
	}
	.appraise-item:last-child {
		border: none;
	}
	.item-num {
		margin: 0;
		color: #333;
	}
	.item-num span {
		color: red;
		font-size: 28upx;
	}
	.item-num_text {
		margin-right: 6px;
	}
	.item-num .up {
		color: red;
	}
	.item-num .down {
		color: green;
	}
	.score {
		font-size: 32upx;
		margin-bottom: 10upx;
	}
	.store-btn-flex {
		margin: 40upx 0 0 0;
		padding: 0 20upx 40upx;
		border-bottom: 2upx solid #f3f3f3;
	}
	.btn {
		padding: 10upx 0;
		width: 300upx;
		border: 2upx solid #ccc;
		text-align: center;
		border-radius: 10upx;
		justify-content: center;
		align-items: center;
	}
	.btn .iconfont {
		margin-right: 6upx;
	}
	.btn:first-child  .iconfont{
		color: red;
	}
	
	
	.sku-wrap { position: absolute; top: 0; bottom: 0; left: 0; right: 0 }
	.sku-wrap .header { padding: 10upx 0 10upx 186upx; position: relative; height: 200upx;; }
	.sku-wrap .header .img-wrap { width: 150upx; height: 150upx; position: absolute; top: -28upx; left: 10upx; border-radius: 4upx; overflow: hidden; border: 1upx solid rgba(0,0,0,.1); padding: 1upx; background-color: #fff }
	.sku-wrap .header .img-wrap .j-summary-img { width: 100%; height: 100% }
	.sku-wrap .header .main { color: #051b28; font-size: 13upx; line-height: 18upx; padding-right: 20upx; text-align: left; }
	.sku-wrap .header .main .price { font-family: arial; font-size: 34upx; color: #f1224b }
	.sku-wrap .body { padding: 0 15upx 10upx; /*margin: 0 auto;*/ overflow: auto; -webkit-overflow-scrolling: touch; width: auto; height: 44vh; }
	.sku-wrap .body:before { content: ""; display: block; border-bottom: 1upx solid rgba(0,0,0,.1) }
	.sku-wrap .trade { display: block; display: -webkit-box; display: flex; height: 90upx; text-align: center; line-height: 90upx; color: #FFF; width: 100%; position: absolute; bottom: 0 }
	.sku-wrap .trade .ok { width: 100%; line-height: 90upx; font-size: 30upx;color: #fff; background-color: #f1224b }
	.sku-wrap .trade .ok.disabled { background-color: #cfcfcf; color: rgba(255,255,255,.4) }

	.sku-wrap .body.retail {
		width: auto;
		text-align: left;
	}
	.retail_buy_num {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 0;
	}
	.b-title {
		font-size: 24upx;
		color: #666;
	}
	.b-item {
		position: relative;
		display: inline-block;
		border: 2upx solid #f5f5f5;
		background-color: #f5f5f5;
		padding: 12upx 20upx;
		border-radius: 14upx;
		font-size: 20upx;
		margin: 20upx
	}
	.b-item.checked {
		border-color: #f1224b;
		background-color: #f1224b;
		color: #fff;
	}

	.cover-content {
		background: #fff;
		height: 70vh;
	}
	
	.t-flex,
	.tt-flex {
		display: flex;
		display: -webkit-flex;
		/* text-align: center; */
	}
	.t-flex.body_item > view {
		padding: 10upx 0;
	}
	.t-flex.body_item {
		padding: 10upx 0;
		border-top: 2upx solid #d1d1d1;
		font-weight: 700;
	}
	.t-flex {
		justify-content: space-between;
		align-items: center;
		border-bottom: 2upx solid #d1d1d1;
		border-left: 2upx solid #d1d1d1;
		border-right: 2upx solid #d1d1d1;
		width: 100%;
		padding: 20upx 0;
	}
	.t-flex div {
		flex: 1;
		text-align: center;
	}
	.t-flex > view {
		flex: 1;
	}
	.t-flex > div:last-child {
		flex: 2;
	}
	.t-flex:last-child > div {
		line-height: 80upx;
		height: 80upx;
	}
	.tt-input {
		width: 50upx;
	}
	.cai-gou {
		width: 150upx;
		text-align: center;
	}
	button::after {
		content: none;
	}
	button image {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
