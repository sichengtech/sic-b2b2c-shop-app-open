import * as ajax from './ajax.js'
import ajaxPath from './../config/ajaxPath'
import { basePath } from './../config/config'

module.exports = {
	/**
	 * 检测app是否更新
	 */
	appVersionCheck(data) {
		return ajax.post(ajaxPath.appVersionCheck, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * app欢迎页
	 */ 
	appAdList(data) {
		return ajax.post(ajaxPath.appAdList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 支付: 统一下单
	 */
	payUnifiedOrder(data) {
		return ajax.post(ajaxPath.payUnifiedOrder, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 查询支付方式列表
	 */
	payWayList(data) {
		return ajax.post(ajaxPath.payWayList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 热搜词
	 */ 
	siteHotSearchWordList(data) {
		return ajax.post(ajaxPath.siteHotSearchWordList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 首页：轮播、活动轮播
	 */
	siteCarouselPictureList(data) {
		return ajax.post(ajaxPath.siteCarouselPictureList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 首页：活动专区、品牌购、工程机械、工程机械商品、猜你喜欢
	 * 分类：热销品牌、热销分类、其他分类
	 */
	siteRecommendOne(data) {
		return ajax.post(ajaxPath.siteRecommendOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 注册：获取注册信息
	 */
	siteRegisterInfo(data) {
		return ajax.post(ajaxPath.siteRegisterInfo, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：获取店铺信息
	 * 店铺首页：获取店铺信息
	 */
	storeOne(data) {
		return ajax.post(ajaxPath.storeOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页汇总接口
	 */
	storeOneAll(data) {
		return ajax.post(ajaxPath.storeOneAll, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺收藏：列表详情
	 */
	storeList(data) {
		return ajax.post(ajaxPath.storeList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺列表
	 */
	storePage(data) {
		return ajax.post(ajaxPath.storePage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页：店铺动态
	 */
	storeArticlePage(data) {
		return ajax.post(ajaxPath.storeArticlePage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺文章详情：店铺文章详情
	 */
	storeArticleOne(data) {
		return ajax.post(ajaxPath.storeArticleOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页: 轮播
	 */
	storeCarouseList(data) {
		return ajax.post(ajaxPath.storeCarouseList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：店铺关注数量
	 * 店铺首页：店铺关注数量
	 */
	storeNavCount(data) {
		return ajax.post(ajaxPath.storeNavCount, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺：店铺商品分类
	 */
	storeCategoryList(data) {
		return ajax.post(ajaxPath.storeCategoryList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页: 店铺收藏
	 * 店铺收藏：取消收藏（删除）
	 */
	userCollectionStoreSave(data) {
		return ajax.post(ajaxPath.userCollectionStoreSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页：取消店铺收藏
	 */
	userCollectionStoreCancel(data) {
		return ajax.post(ajaxPath.userCollectionStoreCancel, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页：店铺是否收藏
	 */
	userCollectionStoreIsCollection(data) {
		return ajax.post(ajaxPath.userCollectionStoreIsCollection, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：商品信息
	 */
	productOne(data) {
		return ajax.post(ajaxPath.productOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情汇总接口
	 */
	productAll(data) {
		return ajax.post(ajaxPath.productAll, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品列表：列表
	 */
	productPage(data) {
		return ajax.post(ajaxPath.productPage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺首页：获取店铺商品
	 * 购物车： 获取购物车信息
	 * 确认订单：订单商品信息
	 */
	productList(data) {
		return ajax.post(ajaxPath.productList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：商品详情信息
	 */
	productDetail(data) {
		return ajax.post(ajaxPath.productDetail, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：轮播
	 */
	productImageList(data) {
		return ajax.post(ajaxPath.productImageList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：商品价格
	 */
	productSectionPriceList(data) {
		return ajax.post(ajaxPath.productSectionPriceList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：商品评价
	 */
	productCommentList(data) {
		return ajax.post(ajaxPath.productCommentList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：商品参数
	 */
	productParamList(data) {
		return ajax.post(ajaxPath.productParamList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品咨询：列表
	 */
	productConsultationPage(data) {
		return ajax.post(ajaxPath.productConsultationPage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品咨询：列表
	 */
	productConsultationList(data) {
		return ajax.post(ajaxPath.productConsultationList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品评价列表： 数据
	 */
	productCommentPage(data) {
		return ajax.post(ajaxPath.productCommentPage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：获取批发价
	 */
	productGetSectionPrice(data) {
		return ajax.post(ajaxPath.productGetSectionPrice, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：评价
	 */
	productCommentImageList(data) {
		return ajax.post(ajaxPath.productCommentImageList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情库存
	 * 购物车：查询库存
	 * 确认订单：查询库存
	 */
	productSkuList(data) {
		return ajax.post(ajaxPath.productSkuList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品分类
	 */
	productCategoryList(data) {
		return ajax.post(ajaxPath.productCategoryList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 登录：手机获取验证码
	 */
	smsLoginGetCode(data) {
		return ajax.post(ajaxPath.smsLoginGetCode, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 注册：发送手机验证码
	 */
	smsRegisterGetCode(data) {
		return ajax.post(ajaxPath.smsRegisterGetCode, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 忘记密码：发送手机验证码
	 */
	smsForgetPwdGetCode(data) {
		return ajax.post(ajaxPath.smsForgetPwdGetCode, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 忘记密码：发送邮箱验证码
	 */
	eamilForgetPwdGetCode(data) {
		return ajax.post(ajaxPath.eamilForgetPwdGetCode, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 注册：发送邮箱验证码
	 */
	eamilRegisterGetCode(data) {
		return ajax.post(ajaxPath.eamilRegisterGetCode, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 字典：商品咨询
	 * 字典：订单中心
	 * 字典：添加发票表单
	 */
	sysDictList(data) {
		return ajax.post(ajaxPath.sysDictList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 我的商品咨询：咨询字典
	 * 发票列表：字段
	 */
	sysDictLabelList(data) {
		return ajax.post(ajaxPath.sysDictLabelList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 图片上传获取token
	 */
	sysGetToken(data) {
		return ajax.post(ajaxPath.sysGetToken, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 上传图片
	 */
	uploaderWebUploadServer(data) {
		return ajax.upload(ajaxPath.uploaderWebUploadServer, basePath.baseUrl, data).then(response => {
			return response[1]
		})
	},

	/**
	 * 商品详情：评价获取用户信息
	 */
	userList(data) {
		return ajax.post(ajaxPath.userList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 用户中心：获取用户名
	 */
	userOne(data) {
		return ajax.post(ajaxPath.userOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 用户中心：获取用户头像
	 * 用户信息：获取用户信息
	 */
	userMember(data) {
		return ajax.post(ajaxPath.userMember, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 用户中心：获取模块数量
	 */
	userCentralCount(data) {
		return ajax.post(ajaxPath.userCentralCount, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 用户信息：保存
	 */
	userInfoEdit(data) {
		return ajax.post(ajaxPath.userInfoEdit, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 登录：账号登录、手机号登录
	 */
	userLoginApp(data) {
		return ajax.post(ajaxPath.userLoginApp, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 用户中心：用户退出登录
	 */
	userCentralExitLogin(data) {
		return ajax.post(ajaxPath.userCentralExitLogin, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 注册：账号注册
	 */
	userRegisterSave(data) {
		return ajax.post(ajaxPath.userRegisterSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 忘记密码：手机修改
	 */
	userForgetPwdEdit(data) {
		return ajax.post(ajaxPath.userForgetPwdEdit, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 修改密码：设置、修改密码
	 */
	userUpdatePwdEdit(data) {
		return ajax.post(ajaxPath.userUpdatePwdEdit, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 我的消息：列表
	 */
	userMessagePage(data) {
		return ajax.post(ajaxPath.userMessagePage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 我的消息：删除信息
	 */
	userMessageDelete(data) {
		return ajax.post(ajaxPath.userMessageDelete, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单中心：消息
	 * 确认订单：消息
	 */
	userMessageUnreadCount(data) {
		return ajax.post(ajaxPath.userMessageUnreadCount, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品收藏：商品列表
	 */
	userCollectionProductList(data) {
		return ajax.post(ajaxPath.userCollectionProductList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品收藏：下架数量
	 */
	userCollectionProductInvalidCount(data) {
		return ajax.post(ajaxPath.userCollectionProductInvalidCount, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情： 取消商品收藏
	 * 商品收藏： 取消商品收藏
	 */
	userCollectionProductCancel(data) {
		return ajax.post(ajaxPath.userCollectionProductCancel, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺收藏：列表信息
	 */
	userCollectionStoreList(data) {
		return ajax.post(ajaxPath.userCollectionStoreList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：收藏商品
	 */
	userCollectionProductSave(data) {
		return ajax.post(ajaxPath.userCollectionProductSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：商品是否收藏
	 */
	userCollectionProductIsCollection(data) {
		return ajax.post(ajaxPath.userCollectionProductIsCollection, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 收货地址：获取地址列表
	 */
	userAddressList(data) {
		return ajax.post(ajaxPath.userAddressList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 收货地址：设置默认收货地址
	 */
	userAddressDefault(data) {
		return ajax.post(ajaxPath.userAddressDefault, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 收货地址：删除收货地址
	 */
	userAddressDelete(data) {
		return ajax.post(ajaxPath.userAddressDelete, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 收货地址表单：获取编辑信息
	 * 确认订单：获取订单地址信息
	 */
	userAddressOne(data) {
		return ajax.post(ajaxPath.userAddressOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 收货地址表单：编辑保存
	 */
	userAddressEdit(data) {
		return ajax.post(ajaxPath.userAddressEdit, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 收货地址表单：新增保存
	 */
	userAddressSave(data) {
		return ajax.post(ajaxPath.userAddressSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 我的商品评价：
	 */
	tradeCommentPage(data) {
		return ajax.post(ajaxPath.tradeCommentPage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 我的商品咨询：咨询列表
	 */
	tradeConsultationPage(data) {
		return ajax.post(ajaxPath.tradeConsultationPage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品咨询表单：保存
	 */
	tradeConsultationSave(data) {
		return ajax.post(ajaxPath.tradeConsultationSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 
	 * 创建订单，
	 */
	tradeOrderSave(data) {
		return ajax.post(ajaxPath.tradeOrderSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品详情：验证立即购买的参数
	 */
	tradeOrderConfimOrderValidate(data) {
		return ajax.post(ajaxPath.tradeOrderConfimOrderValidate, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单中心：列表
	 */
	tradeOrderPage(data) {
		return ajax.post(ajaxPath.tradeOrderPage, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单详情：订单信息
	 */
	tradeOrderOne(data) {
		return ajax.post(ajaxPath.tradeOrderOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单中心：列表详情数据
	 */
	tradeOrderItemList(data) {
		return ajax.post(ajaxPath.tradeOrderItemList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单中心：取消订单
	 */
	tradeOrderCancelOrder(data) {
		return ajax.post(ajaxPath.tradeOrderCancelOrder, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 商品评价表单：保存
	 */
	// tradCommentSave(data) {
	// 	return ajax.post(ajaxPath.tradCommentSave + '?' + data, basePath.baseUrl).then(response => response)
	// },
	tradCommentSave(data) {
		return ajax.post(ajaxPath.tradCommentSave, basePath.baseUrl, JSON.stringify(data)).then(response => response)
	},

	/**
	 * 物流详情：物流信息
	 */
	tradeLogisticsInfo(data) {
		return ajax.post(ajaxPath.tradeLogisticsInfo, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单中心：确认收货
	 */
	tradeOrderConfirmReceipt(data) {
		return ajax.post(ajaxPath.tradeOrderConfirmReceipt, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 获取确认订单页数据接口
	 */
	tradeOrderConfimOrder(data) {
		return ajax.post(ajaxPath.tradeOrderConfimOrder, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 确认订单：计算运费
	 */
	tradeOrderCalculateFreight(data) {
		return ajax.post(ajaxPath.tradeOrderCalculateFreight, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 发票列表：列表
	 */
	tradeDeliverList(data) {
		return ajax.post(ajaxPath.tradeDeliverList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 发票列表：设置默认
	 */
	tradeDeliverDefault(data) {
		return ajax.post(ajaxPath.tradeDeliverDefault, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 发票表单：保存
	 */
	tradeDeliverSave(data) {
		return ajax.post(ajaxPath.tradeDeliverSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 发票表单：获取发票信息
	 */
	tradeDeliverOne(data) {
		return ajax.post(ajaxPath.tradeDeliverOne, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 发票列表：删除发票
	 */
	tradeDeliverDelete(data) {
		return ajax.post(ajaxPath.tradeDeliverDelete, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 发票表单：编辑保存
	 */
	tradeDeliverEdit(data) {
		return ajax.post(ajaxPath.tradeDeliverEdit, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 购物车：购物车信息
	 */
	tradeCartList(data) {
		return ajax.post(ajaxPath.tradeCartList, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 店铺详情：加入购物车
	 */
	tradeCartSave(data) {
		return ajax.post(ajaxPath.tradeCartSave, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 购物车：更改商品数量
	 */
	tradeCartUpdateCount(data) {
		return ajax.post(ajaxPath.tradeCartUpdateCount, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 购物车：更改商品数量
	 */
	tradeCartDelete(data) {
		return ajax.post(ajaxPath.tradeCartDelete, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 地址组件：获取所有地址数据
	 */
	areaSelectAll(data) {
		return ajax.post(ajaxPath.areaSelectAll, basePath.baseUrl, data).then(response => response)
	},

	/**
	 * 订单详情：商品详情
	 */
	// orderItem(data) {
	// 	return ajax.post(ajaxPath.tradeOrderItemList, basePath.baseUrl, data).then(response => {
	// 		return response
	// 	})
	// },

}