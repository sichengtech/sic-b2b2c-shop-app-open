import storage from './storage';
import uniRequest from 'uni-request'
import { basePath } from "./../config/config"
import pagePath from "./../config/pagePath"
import Base64 from "./plugin/base64";
import md5 from "./plugin/md5.min.js"
import { sha3_256 } from "./plugin/sha3.min.js"
import i18n from '../i18n'
const that = uni
let timer;

/**
 * 获取Token
 */
const getToken = _ => storage.getToken() || ''

/**
 * 接口签名方法
 * 对传输的数据采用签名+编码的方案来保护
 * 签名中包含当前时间、盐
 */
const signMethod = obj => {
	let data = obj
	const salt = 'tianwanggaidihu'; //盐，要与服务端保持一致，才可验签通过
	const timestamp = Date.now()  //时间戳
	
	if(typeof data === 'string') {
		data = JSON.parse(data)
	}
	data.wap_language = i18n.locale
	let dataBase64 = Base64.encode(JSON.stringify(data)); //业务数据，是Base64格式
	
	//请求接口的标准数据结构
	let standard = {
		'data': dataBase64,  //明文数据，是Base64格式
		'make': timestamp, //时间戳 (允许正负偏差各一个小时) （取这个名字是为了迷惑）
		'random': md5(sha3_256( dataBase64 + timestamp + md5(salt) ))  //签名（取这个名字是为了迷惑）
	}
	return standard; //标准数据结构
}

/**
 * 请求拦截器
 */
uniRequest.interceptors.request.use(request => {
	console.log(`请求地址：${request.baseURL + request.url}，请求参数：`,request.data)
	const token = getToken() //获取Token
	request.headers['AppToken'] = token  //是一个UUID，调用“需要登录后才能访问”的接口时，要携带AppToken
	request.headers['TerminalType'] = 'app'  //所以当TerminalType值为app时，说明终端类型是uni-app开发的(app\小程\H5)
	request.timeout = 300000  //超时时间，单位 ms， 这就是5分钟了。
	// request.url = request.url + "?language=en_US"
	request.data = signMethod( request.data || {}) //签名后的数据
	return request
})

/**
 * 响应拦截器
 */
uniRequest.interceptors.response.use(response => {
	// 接口回401就是拦截到登录页
	if(response.data.status === '401' || response.data.status === 401) {
		storage.cStore();
		uni.showToast({
			title: i18n.t('未登录请登录'),
			duration: 2000,
			icon: 'none'
		})
		clearTimeout(timer)
		timer = setTimeout(() => {
			that.navigateTo({
				url: pagePath.uLogin + '?intercepted=200'
			})
		}, 1000)
		return;
	}
	if(response.data.status === '200' || response.data.status === 200) {
		return Promise.resolve(response.data);
	} else {
		console.log('####接口返回非200、401的状态，进入失败回调####')	
		return Promise.reject(response.data);
	}
}, error => {
	console.log('返回进入拦截失败', error)	
	return Promise.reject(error);
})

/**
 * 封闭的GET请求方法
 */
export const get = (url, baseURL, params) => {
	return uniRequest({
		method: 'get',
		baseURL: `${baseURL}`,
		url: `${url}`,
		data: params,
  })
}

/**
 * 封闭的POST请求方法
 */
export const post = (url, baseURL, params) => {
	return uniRequest({
		method: 'post',
		baseURL: `${baseURL}`,
		url: `${url}`,
		data: params,
  })
}

/**
 * 封闭的上传方法
 */
export const upload = (url, baseURL, params) => {
	return uni.uploadFile({
		url: baseURL + url,
		filePath: params.filePath,
		name: params.name || 'file',
		formData: params.formData
	});
}
