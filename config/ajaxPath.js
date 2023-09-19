/**
 * 服务端接口URL
 * 这是全部的服务端接口path,如果增加了新的接口，请按分类添加在这里，并写注释。
 */
export default {
	//APP相关接口
	appVersionCheck: '/wap/api/v1/app/version/check.htm',					// 检查app是否为最新版
	appAdList: '/wap/api/v1/app/ad/list.htm',								// app引导页 欢迎页

    // 支付相关
    payUnifiedOrder: '/wap/api/v1/shop/pay/unifiedorder.htm', 				// app支付地址，unified order是统一下单的意思
	payWayList: '/wap/api/v1/shop/pay/payWayList.htm', 						// 支付方式列表

	siteHotSearchWordList: '/wap/api/v1/site/HotSearchWord/list.htm',		// 热搜词
	siteCarouselPictureList: '/wap/api/v1/site/carouselPicture/list.htm', 	// 轮播图（首页）
	siteRecommendOne: '/wap/api/v1/site/recommend/one.htm',					// 推荐位（首页专区图片、商品分类页）
	siteRegisterInfo: '/wap/api/v1/siteRegister/info.htm',					// 获取注册信息
	
	//店铺相关接口
	storeOne: '/wap/api/v1/store/one.htm',									// 店铺信息、商品详情
	storeOneAll: '/wap/api/v1/store/one/all.htm',							// 店铺；汇总接口
	storeList: '/wap/api/v1/store/list.htm',								// 店铺收藏 获取店铺信息
	storePage: '/wap/api/v1/store/page.htm',								// 店铺；列表
	storeArticlePage: '/wap/api/v1/store/article/page.htm', 				// 店铺动态文章列表
	storeArticleOne: '/wap/api/v1/store/article/one.htm', 					// 店铺动态文章详情
	storeCarouseList: '/wap/api/v1/store/carouselPicture/list.htm',			// 店铺首页轮播
	storeNavCount: '/wap/api/v1/store/nav/count.htm', 						// 店铺的头部数据，如：关注人数
	storeCategoryList: '/wap/api/v2/store/category/list.htm',				// 店铺：商品分类
	
	//店铺收藏相关接口
	userCollectionStoreSave: '/wap/api/v1/user/collectionStore/save.htm',	//店铺收藏
	userCollectionStoreCancel: '/wap/api/v1/user/collectionStore/cancel.htm',// 取消店铺收藏
	userCollectionStoreIsCollection: '/wap/api/v1/user/collectionStore/isCollection.htm',// 是否收藏店铺
	
	//商品相关接口
	productOne: '/wap/api/v1/product/one.htm',								// 商品信息，商品详情页
	productAll: '/wap/api/v1/product/all.htm',								// 商品详情汇总
	productPage: '/wap/api/v1/product/page.htm',							// 获取商品列表（有分页），依赖搜索引擎
	productList: '/wap/api/v1/product/list.htm', 							// 获取商品列表，依赖搜索引擎
	productDetail: '/wap/api/v1/product/detail.htm', 						// 商品详情
	productImageList: '/wap/api/v1/product/image/list.htm', 				// 商品轮播图
	productSectionPriceList: '/wap/api/v1/product/sectionPrice/list.htm',	// 商品价格，区间价格
	productCommentList: '/wap/api/v1/product/comment/list.htm', 			// 商品评价
	productParamList: '/wap/api/v1/product/param/list.htm',					// 商品参数
	productConsultationPage: '/wap/api/v1/product/consultation/page.htm',	// 商品咨询
	productConsultationList: '/wap/api/v1/product/consultation/list.htm',	// 商品咨询回复
	productCommentPage: '/wap/api/v1/product/comment/page.htm', 			// 商品评价页
	productGetSectionPrice: '/wap/api/v1/product/getSectionPrice.htm',		// 获取批发价
	productCommentImageList: '/wap/api/v1/product/comment/image/list.htm',	// 商品评价图片
	productSkuList: '/wap/api/v1/product/sku/list.htm',						// 购物车查询库存
	productCategoryList: '/wap/api/v1/product/productCategory/list.htm',	// 商品分类	

	//发短信、
	smsLoginGetCode: '/wap/api/v1/sms/login/getCode.htm',			// 登录发送手机验证码
	smsRegisterGetCode: '/wap/api/v1/sms/register/getCode.htm',		// 注册发送手机验证码
	smsForgetPwdGetCode: 'wap/api/v1/sms/forgetPwd/getCode.htm',	// 找回密码 获取手机验证码

	// 发邮件接口
	eamilForgetPwdGetCode: 'wap/api/v1/eamil/forgetPwd/getCode.htm',// 找回密码 发送邮箱验证码
	eamilRegisterGetCode: '/wap/api/v1/email/register/getCode.htm',	// 注册发送邮箱验证码
	
	//工具相关接口
	sysDictList: '/wap/api/v1/sys/dict/list.htm',					// 字典
	sysDictLabelList: '/wap/api/v1/sys/dict/labelList.htm',			// 我的咨询字典
	sysGetToken: '/wap/api/v1/sys/getToken.htm',					// 上传获取token
	uploaderWebUploadServer: '/upload/upload/webUploadServer.htm',	// 上传地址，用于接收上传的服务端

	//用户相关接口
	userList: '/wap/api/v1/user/list.htm', 								// 查询用户列表（商品评价页）
	userOne: '/wap/api/v1/user/one.htm', 								// 查询一个用户（会员中心）
	userMember: '/wap/api/v1/user/member.htm',							// 用户头像（用户信息页）
	userCentralCount: '/wap/api/v1/user/userCentral/count.htm', 		// 用户模块信息数量
	userInfoEdit: '/wap/api/v1/user/userInfo/edit.htm',					// 用户信息保存
	
	//用户-登录、注册、相关接口
	userLoginApp: '/wap/api/v1/user/login/app.htm', 					// 登录
	userCentralExitLogin: '/wap/api/v1/user/userCentral/exitLogin.htm', // 退出登录
	userRegisterSave: '/wap/api/v1/user/register/save.htm',				// 注册
	userForgetPwdEdit: '/wap/api/v1/user/forgetPwd/edit.htm',			// 修改密码
	userUpdatePwdEdit: '/wap/api/v1/user/updatePwd/edit.htm',			// 修改密码

	//用户-会员中心相关接口
	userMessagePage: '/wap/api/v1/user/userMessage/page.htm',					// 我的消息
	userMessageDelete: '/wap/api/v1/user/userMessage/delete.htm',				// 我的消息删除
	userMessageUnreadCount: '/wap/api/v1/user/userMessage/unreadCount.htm',		//订单列表 用户消息
	userCollectionProductList: '/wap/api/v1/user/collectionProduct/list.htm',	//我的商品收藏
	userCollectionProductInvalidCount: '/wap/api/v1/user/collectionProduct/invalidCount.htm',	// 我的商品收藏下架数量
	userCollectionProductCancel: '/wap/api/v1/user/collectionProduct/cancel.htm', 				// 商品收藏删除
	userCollectionStoreList: '/wap/api/v1/user/collectionStore/list.htm',						//我的店铺收藏
	userCollectionProductSave: '/wap/api/v1/user/collectionProduct/save.htm',					// 商品收藏
	userCollectionProductIsCollection: '/wap/api/v1/user/collectionProduct/isCollection.htm',	//商品是否收藏
	
	//用户-收货地址相关接口
	userAddressList: '/wap/api/v1/user/userAddress/list.htm',		// 收货地址
	userAddressDefault: '/wap/api/v1/user/userAddress/default.htm',	// 设置默认收货地址
	userAddressDelete: '/wap/api/v1/user/userAddress/delete.htm',	// 删除地址
	userAddressOne: '/wap/api/v1/user/userAddress/one.htm',			// 编辑收货地址
	userAddressEdit: '/wap/api/v1/user/userAddress/edit.htm',		// 编辑收货地址保存
	userAddressSave: '/wap/api/v1/user/userAddress/save.htm',		// 收货地址保存


	//用户-会员中心相关接口
	tradeCommentPage: '/wap/api/v1/trade/comment/page.htm',				// 我的评价
	tradeConsultationPage: '/wap/api/v1/trade/consultation/page.htm',	// 我的咨询
	// tradeConsultationList: '/wap/api/v1/trade/consultation/list.htm',// 我的咨询回复
	tradeConsultationSave: '/wap/api/v1/trade/consultation/save.htm',	// 商品咨询保存

	//订单相关接口
	tradeOrderSave: '/wap/api/v1/trade/order/save.htm',					// 创建订单
	tradeOrderConfimOrderValidate: '/wap/api/v1/trade/order/confimOrder/validate.htm', // 验证订单参数
	tradeOrderPage: '/wap/api/v1/trade/order/page.htm',					// 订单查询
	tradeOrderOne: '/wap/api/v1/trade/order/one.htm',					// 订单详情
	tradeOrderItemList: '/wap/api/v1/trade/orderItem/list.htm',			// 订单详情数据
	// orderItem: '/wap/api/v1/trade/orderItem/list.htm',				// 订单商品数据
	tradeOrderCancelOrder: '/wap/api/v1/trade/order/cancelOrder.htm',	// 订单取消
	tradCommentSave: '/wap/api/v1/trade/comment/save.htm',				// 商品评价，保存
	tradeLogisticsInfo: '/wap/api/v1/trade/logistics/info.htm',			// 物流信息
	tradeOrderConfirmReceipt: '/wap/api/v1/trade/order/confirmReceipt.htm',		// 确认收货
	tradeOrderConfimOrder: '/wap/api/v1/trade/order/confimOrder.htm',			// 获取确认订单页数据接口
	tradeOrderCalculateFreight: '/wap/api/v1/trade/order/calculateFreight.htm',	// 计算运费
	
	//订单发票相关接口
	tradeDeliverList: '/wap/api/v1/trade/deliver/list.htm',			// 发票信息列表
	tradeDeliverDefault: '/wap/api/v1/trade/deliver/default.htm',	// 发票信息设置默认
	tradeDeliverSave: '/wap/api/v1/trade/deliver/save.htm',			// 发票保存
	tradeDeliverOne: '/wap/api/v1/trade/deliver/one.htm',			// 发票编辑
	tradeDeliverDelete: '/wap/api/v1/trade/deliver/delete.htm',		// 发票删除
	tradeDeliverEdit: '/wap/api/v1/trade/deliver/edit.htm',			// 编辑发票保存
	
	//购物车接口
	tradeCartList: '/wap/api/v1/trade/cart/list.htm',				// 购物车
	tradeCartSave: '/wap/api/v1/trade/cart/save.htm',				// 加入购物车
	tradeCartUpdateCount: '/wap/api/v1/trade/cart/updateCount.htm',	// 更改购物车商品数量
	tradeCartDelete: '/wap/api/v1/trade/cart/delete.htm',			// 删除购物车商品

	// 获取地址
	areaSelectAll: '/wap/api/v1/sys/area/selectAll.htm'				// 获取地址数据
}