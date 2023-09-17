import storage from './storage';
import uniRequest from 'uni-request'
import { basePath } from "./../config/config"
import pagePath from "./../config/pagePath"
import Base from "./plugin/base64";
import md5 from "./plugin/md5.min.js"
import { sha3_256 } from "./plugin/sha3.min.js"
import i18n from '../i18n'
const that = uni
let timer;

const getToken = _ => storage.getToken() || ''

const add = (a, b) =>  a + b

const signMethod = obj => {
	let data = obj
	const salt = 'tianwanggaidihu';
	const timestamp = Date.now()
	if(typeof data === 'string') {
		data = JSON.parse(data)
	}
	data.wap_language = i18n.locale
	data = Base.encode(JSON.stringify(data));
	let encrypted = {
		'data': data,
		'make': timestamp,
		// 'random': md5(sha3_256( add(data, add(timestamp, md5(add(salt, md5(basePath.baseUrl))))) ))
		'random': md5(sha3_256( add(data, add(timestamp, md5(salt))) ))
	}
	return encrypted;
}

uniRequest.interceptors.request.use(request => {
	console.log(`请求地址：${request.baseURL + request.url}，请求参数：`,request.data)
	const token = getToken()
	request.headers['AppToken'] = token
	request.headers['TerminalType'] = 'app'
	request.timeout = 300000
	// request.url = request.url + "?language=en_US"
	request.data = signMethod( request.data || {})
	return request
})

uniRequest.interceptors.response.use(response => {
	// 接口回401就是拦截到登录页
	if(response.data.status === '401' || response.data.status === 401) {
		storage.cStore();
		uni.showToast({
			title: i18n.t('未登陆请登陆'),
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
		console.log('接口返回非200、401的状态，进入失败回调')	
		return Promise.reject(response.data);
	}
}, error => {
	console.log('返回进入拦截失败', error)	
	return Promise.reject(error);
})

export const get = (url, baseURL, params) => {
	return uniRequest({
		method: 'get',
		baseURL: `${baseURL}`,
		url: `${url}`,
		data: params,
  })
}
export const post = (url, baseURL, params) => {
	return uniRequest({
		method: 'post',
		baseURL: `${baseURL}`,
		url: `${url}`,
		data: params,
  })
}
export const upload = (url, baseURL, params) => {
	return uni.uploadFile({
		url: baseURL + url,
		filePath: params.filePath,
		name: params.name || 'file',
		formData: params.formData
	});
}
