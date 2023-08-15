/**
 *  @param {object}
 *  同步写
 */
function setStorage(data) {
	uni.setStorageSync(data.key, data.val)
}

/**
 *  @param {object}
 *  异步写
 */
function setStorageAsync(data) {
	uni.setStorage({
		key: data.key,
		data: data.val,
		success: data.res,
		fail: data.fail
	})
}

/**
 *  @param {string}
 *  @return string
 *  同步读
 */
function getStorage(key) {
	let data = uni.getStorageSync(key)
	return data
}

/**
 *  return object
 *  同步读取storageInfo
 */
function getStorageInfo() {
	let res = uni.getStorageInfoSync()
	return res
}

/**
 *  @param {string}
 *  同步删除key
 */
function removeStorage(key) {
	uni.removeStorageSync(key)
}

/**
 *  @param {}
 *  同步清理storage
 */
function clearStorage() {
	uni.clearStorageSync()
}

/**
 * 存储的key
 */
const keyVal = 'userInfo'

/**
 *  是否登录 验证apptoken是否为空
 */
function isLogin() {
	return getStorage(keyVal).AppToken ? true : false
}
/**
 *  获取tonken
 */
function getToken() {
	return isLogin() ? getStorage(keyVal).AppToken : ''
}

module.exports = {
	setStore: setStorage,
	setStoreAsync: setStorageAsync,
	getStore: getStorage,
	storeInfo: getStorageInfo,
	reStore: removeStorage,
	cStore: clearStorage,
	isLogin,
	getToken,
	keyVal
}