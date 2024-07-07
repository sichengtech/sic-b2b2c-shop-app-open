import ajaxPath from './ajaxPath'
import pagePath from './pagePath'

/**
 * 服务端接口的域名
 * 用于切换不同的环境，每个环境有自己的域名或IP，请开发者根据环境来自行修改
 * 每次发行前，请自行保证环境是正常的
 * baseUrl：接口的域名
 * baseImgUrl：图片接口的域名，图片使用独立的URL是为使用CDN加速做的预留
 */
export const basePath = {
	h5Path: '/h5/index.html',   // h5首页的路径
	
	// // 演示环境
	// baseUrl: 'https://demo1.sicheng.net', //访问接口时都需要它
	// baseImgUrl: 'https://demo1.sicheng.net/upload/filestorage',  //图片URL的前缀，访问图片时都需要它

	// // 测试环境
	// baseUrl: 'http://192.168.92.44',//访问接口时都需要它
	// baseImgUrl: 'http://192.168.92.44/upload/filestorage', //图片URL的前缀，访问图片时都需要它
	
	// 开发环境
	baseUrl: 'http://127.0.0.1:8081',//访问接口时都需要它
	baseImgUrl: 'http://127.0.0.1:8081/upload/filestorage', //图片URL的前缀，访问图片时都需要它
	
	// // 开发环境2
	// baseUrl: 'http://192.168.9.183:8080',//访问接口时都需要它
	// baseImgUrl: 'http://192.168.9.183:8080/upload/filestorage', //图片URL的前缀，访问图片时都需要它

	// 英文环境
	// baseUrl: 'http://k.sicheng.net',//访问接口时都需要它
	// baseImgUrl: 'http://k.sicheng.net/upload/filestorage', //图片URL的前缀，访问图片时都需要它
}

/**
 * 有用
 */
export const prefixAll = {
    ...basePath,
    ...ajaxPath,
    ...pagePath
}

/**
 * 
 */
export const config = {
    // 默认的语言，设置后设置页面不会出现语言设置
	language: 'zh_CN', // zh_CN 或 en_US

	// “分享”是否显示, 为true显示,为false不显示
	shareIsShow: true,

	// 是否是英文商城，为true表示是英文商城，页面不打标，商品详情不展示店铺认证。
	englishShop: false,

	// 英文商城的开关配置，用于控制登录注册。格式： [0邮箱号,1手机号]，为true显示，为false不显示。
	showSwitch: [true, true],

	// 默认商品图片。当没有商品图片时，则展示这个默认图片来占位。
	noProductImg: '/static/img/default_goods.png', 
}