function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}



var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};




export default {
	install(Vue, option) {
		/*
		* formatMoney(s,type)
		* 功能：金额按千位逗号分隔
		* 参数：s，需要格式化的金额数值.
		* 参数：type,判断格式化后的金额是否需要小数位.
		* 返回：返回格式化后的数值字符串.
		*/
		Vue.prototype.formatMoney = function (s, type) {
			if (/[^0-9\.]/.test(s))
				return "0.00";
			if (s == null || s == "null" || s == "")
				return "0.00";
			s = s.toString().replace(/^(\d*)$/, "$1.");
			s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
			s = s.replace(".", ",");
			var re = /(\d)(\d{3},)/;
			while (re.test(s))
				s = s.replace(re, "$1,$2");
			s = s.replace(/,(\d\d)$/, ".$1");
			if (type == 0) {
				var a = s.split(".");
				if (a[1] == "00") {
					s = a[0];
				}
			}
			return s;
		}

		// 获取状态栏高度
		Vue.prototype.barHeight = function (type) {
			let statusBarHeight = 0
            
			// #ifndef MP-WEIXIN
			if(type === 'statusBarHeight') {
				//获取手机状态栏高度+ 导航栏
				statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'] + uni.upx2px(88);
			} else {
				//获取手机状态栏高度+ 导航栏 + tab 高度 
				statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'] + uni.upx2px(88 + 92);
			}
			// #endif

			 // #ifdef MP-WEIXIN
			 if(type === 'statusBarHeight') {
				//导航栏
				statusBarHeight = uni.upx2px(88);
			} else {
				//导航栏 + tab 高度 
				statusBarHeight = uni.upx2px(88 + 92);
			}
			 // #endif
      
			return statusBarHeight
		}
		
		/**
		 * @function 图片缩略规则
		 * @param width 图片宽度
		 * @param height 图片高度
		 * @param type 缩图规则 默认1， 1为缩切、 其他数字为缩
		 */
		Vue.prototype.imgShrink = function(width, height, type = 1) {
			return `${ type === 1 ? '@!' : '@' }${ width }x${ height }`
		}
	}
}