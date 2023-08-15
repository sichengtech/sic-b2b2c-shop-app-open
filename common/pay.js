import api from "./api";
import i18n from '../i18n'
/**
 * @function 获取app支付的供应商 现在通过后台获取支付方法，此api暂未使用
 */
export const getPayType = () => {
	let providerList = []
	uni.getProvider({
		service: "payment",
		success: (e) => {
			e.provider.map((value) => {
				switch (value) {
					case 'alipay':
						providerList.push({
							name: i18n.t('支付宝'),
							id: value,
							payWayId: 12,
							loading: false
						})
						break
					case 'wxpay':
						providerList.push({
							name: i18n.t('微信支付'),
							id: value,
							payWayId: 11,
							loading: false
						});
						break
					default:
						break
				}
			})
		},
		fail: (e) => {
			console.log("获取登录通道失败：", e)
		}
	})
	return providerList
}

/**
 * @function 微信小程序支付
 * @param {Object} payType 支付对象
 * @param {Array} orderId 订单
 * @param {Function} fn 成功回调
 * @param {Function} fn 失败回调
 */
export const wechatXiaoChengXuPay = (payType, orderId, fn, errfn) => {
	 uni.login({
		success: (e) => {
			api.payUnifiedOrder({
				code: e.code,
				orderIds: orderId,
				payWayId: payType.id
			}).then(res => {
				if (res.data === '') {
					uni.showModal({
						content: i18n.t('下单出错请稍后重试'),
						showCancel: false
					})
					return;
				}
					let paymentData = res.data;
					uni.requestPayment({
						timeStamp: paymentData.timeStamp,
						nonceStr: paymentData.nonceStr,
						package: paymentData.package,
						signType: paymentData.signType,
						paySign: paymentData.paySign,
						success: (res) => {
							uni.showToast({
								title: i18n.t('支付成功')
							})
							fn()
						},
						fail: (res) => {
							uni.showModal({
								content: i18n.t('支付失败原因为') + err.errMsg,
								showCancel: false
							})
							errfn()
						},
						complete: () => {
							errfn()
						}
					})
			}).catch(err => {
				errfn()
				uni.showModal({
					content: i18n.t('支付失败原因为') + err.errMsg,
					showCancel: false
				})
			})
		}
	})
}

/**
 * @function 订单支付 app支付、h5支付使用
 * @param {Object} payType 支付对象
 * @param {Array} orderId 订单
 * @param {Function} fn 支付成功回调
 * @param {Function} errfn 支付失败回调 改变支付状态
 */


export const orderPay = async (payType, orderId, fn, errfn) => {
	let unifiedOrderInfo = await unifiedOrder(payType.id, orderId);
	if (unifiedOrderInfo.data === '') {
		uni.showModal({
			content: i18n.t('下单出错请稍后重试'),
			showCancel: false
		})
		return;
	}
	
	// #ifdef H5
	// ali h5 支付是一个form表单
	fn(unifiedOrderInfo)
	// #endif

	// #ifdef APP-PLUS
	uni.requestPayment({
		provider: payType.phonePayId,
		orderInfo: unifiedOrderInfo.data,
		success: (e) => {
			// 支付成功
			fn()
		},
		fail: (e) => {
			errfn(e)
		},
		complete: () => {
			console.log('支付完成')
		}
	})
	// #endif
}


/**
 * @function 统一下单 订单支付使用
 * @param {String} payTypeId 支付类型id
 * @param {Array} total orderId
 */
function unifiedOrder(payTypeId, orderId) {
	return new Promise((res) => {
		api.payUnifiedOrder({
			orderIds: orderId,
			payWayId: payTypeId,
		}).then(response => {
			res(response)
		}).catch(err => {
			res(err)
		})
	})
}

/**
 * @function 处理服务端返回的字段，适配微信
 * @param 	 {Object} data  服务端返回的数据
 * @returns  {Object} app调微信支付使用的数据
 */
function wxpayRule(data) {
	return {
		data: {
			appid: data.appid,
			partnerid: data.mch_id,
			prepayid: data.prepay_id,
			package: "Sign=WXPay",
			noncestr: data.nonce_str,
			timestamp: String(new Date().getTime()).substr(0, 10),
			sign: data.sign
		}
		
	}
}