import api from "./api";
import i18n from '../i18n'
///////////////////////////////////
//
// 支付相关业务
//
///////////////////////////////////

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
 * @function 订单支付-微信小程序支付
 * @param {Object} payType 支付对象
 * @param {Array} orderId 订单id
 * @param {Function} fn 业务成功回调函数
 * @param {Function} errfn 业务失败回调函数
 */
export const wechatMpPay = (payType, orderId, fn, errfn) => {
	uni.login({
		success: (e) => {
			api.payUnifiedOrder({
				code: e.code,
				orderIds: orderId,
				payWayId: payType.id
			}).then(res => {
				console.log("统一下单接口返回结果1：")
				console.log(res)
				if (res.status != '200') {	
					errfn(res)//业务失败回调函数
					return;
				}
				let paymentData = res.data;
				
				//uni.requestPayment是一个统一各平台的客户端支付API，不管是在某家小程序还是在App中，客户端均使用本API调用支付。
				//本API运行在各端时，会自动转换为各端的原生支付调用API。
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
						fn(res)//业务成功回调函数
					},
					fail: (res) => {
						errfn(res)//业务失败回调函数
					},
					complete: () => {
						errfn(res)//业务失败回调函数
					}
				})
			}).catch(err => {
				errfn(err)//业务失败回调函数
			})
		}
	})
}

/**
 * @function 订单支付-App支付、h5支付使用
 * @param {Object} payType 支付对象
 * @param {Array} orderId 订单id
 * @param {Function} fn 业务成功回调函数
 * @param {Function} errfn 业务失败回调函数
 */
export const app_h5_Pay = async (payType, orderId, fn, errfn) => {
	let response = await unifiedOrder(payType.id, orderId);
	console.log("统一下单接口返回结果2：")
	console.log(response)
	if (response.status != '200') {
		errfn(response)//业务失败回调函数
		return;
	}
	
	// #ifdef H5
	// ali h5 支付是一个form表单
	fn(response) // 业务成功回调函数
	// #endif

	// #ifdef APP-PLUS
	//uni.requestPayment是一个统一各平台的客户端支付API，不管是在某家小程序还是在App中，客户端均使用本API调用支付。
	//本API运行在各端时，会自动转换为各端的原生支付调用API。
	uni.requestPayment({
		provider: payType.phonePayId,
		orderInfo: response.data,
		success: (e) => {
			// 支付成功
			fn() // 业务成功回调函数
		},
		fail: (e) => {
			errfn(e)//业务失败回调函数
		},
		complete: () => {
			console.log('支付完成')
		}
	})
	// #endif
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