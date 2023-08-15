import ajaxPath from './ajaxPath'
import pagePath from './pagePath'

export const basePath = {
	h5Path: '/h5/index.html',   // h5首页的路径
	
	// 英文线上环境
	// baseUrl: 'http://47.75.222.67',
	// baseImgUrl: 'http://47.75.222.67/upload/filestorage',

	// // 测试环境
	// baseUrl: 'https://test.sicheng.net',
	// baseImgUrl: 'https://test.sicheng.net/upload/filestorage',
	
	// 测试环境
	baseUrl: 'http://127.0.0.1:8080',
	baseImgUrl: 'http://127.0.0.1:8080/upload/filestorage',

	// 英文环境
	// baseUrl: 'http://k.sicheng.net',
	// baseImgUrl: 'http://k.sicheng.net/upload/filestorage',
	
	// 赵磊
	// baseUrl: 'http://192.168.2.250:8080',	
	// baseImgUrl: 'http://192.168.2.250:8080/upload/filestorage',
	
	// 加利
	// baseUrl: 'http://192.168.2.171',
	// baseImgUrl: 'http://192.168.2.171/upload/filestorage',
	
	// 东泽
	// baseUrl: 'http://192.168.2.131',
	// baseImgUrl: 'http://192.168.2.131/upload/filestorage',

	// 秀秀
	// baseUrl: 'http://192.168.2.102:8080',
	// baseImgUrl: 'http://192.168.2.102:8080/upload/filestorage',

	// 蔡龙
	// baseUrl: 'http://192.168.2.69',
	// baseImgUrl: 'http://192.168.2.69/upload/filestorage',
}

export const prefixAll = {
    ...basePath,
    ...ajaxPath,
    ...pagePath
}
export const config = {
    // 默认语言 设置后设置页面不会出现语言设置
	language: 'zh_CN', // zh_CN 或 en_US

	// 分享是否显示, 为true显示
	shareIsShow: true,

	// 英文商城，为true 页面不打标、商品详情不展示店铺认证
	englishShop: false,

	// 控制登陆注册
	// 英文商场开关配置 0邮箱号、1手机号。为true显示
	showSwitch: [true, true],

	// 没有商品图片 替代
	noProductImg: '/static/img/default_goods.png', 
}