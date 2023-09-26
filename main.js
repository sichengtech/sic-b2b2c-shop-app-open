/**
 * main.js/uts是 uni-app 的入口文件。
 * main.js主要作用是初始化vue实例、定义全局组件、使用需要的插件如 i18n、vuex。
 * 首先引入了Vue库和App.vue，创建了一个vue实例，并且挂载vue实例。  
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import ajax from './common/ajax'
import * as config from './config/config'
import storage from './common/storage'
import api from './common/api'
import i18n from './i18n'
import util from "./common/util";
import Vuelidate from "./common/vuelidate";

//全局导入组件
import uniIcons from "./components/uni-icons.vue"
import fineIcon from './components/icon.vue'
import lazyImage from "./components/lazy-image.vue"
import typeTop from "./components/type-top.vue"
import uniNavBar from "./components/uni-nav-bar.vue"
import uniLoadMore from './components/uni-load-more.vue'
import uniBadge from './components/uni-badge.vue'

Vue.config.productionTip = false   //设置为 false 以阻止 vue 在启动时生成生产提示
Vue.use(util)  //使用Vue.use引用插件

// 拉平配置
let configData = {}
Object.keys(config).forEach(item => {
    Object.assign(configData, config[item])
})

//使用Vue.prototype添加全局变量
Vue.prototype.$api = api
Vue.prototype.$store = store
Vue.prototype.prefix = configData
Vue.prototype.ajax = ajax
Vue.prototype.$storage = storage
Vue.prototype.Vuelidate = Vuelidate
Vue.prototype.openErrMsg = function (errMsg, time = 3000) {
    if(errMsg === '加载错误') errMsg = i18n.t(errMsg)
    uni.showToast({
        title: errMsg.replace(/(<br\/>)|(<br \/>)/g, ', '),
        duration: time,
        icon: 'none'
    })
}
// i18n赋值到原型链，app才能正常使用
Vue.prototype._i18n = i18n

//注册全局组件
//使用Vue.component注册全局组件。
//uni-app 支持配置全局组件，需在 main.js 里进行全局注册，注册后就可在所有页面里使用该组件。
//注意
//	Vue.component 的第一个参数必须是静态的字符串。
//	nvue 页面暂不支持全局组件。
Vue.component('uni-icons', uniIcons)
Vue.component('fine-icon', fineIcon)
Vue.component('lazy-img', lazyImage)
Vue.component('type-top', typeTop)
Vue.component('uni-badge', uniBadge)
Vue.component('uni-load-more', uniLoadMore)
Vue.component('uni-nav-bar', uniNavBar)


App.mpType = 'app'
const app = new Vue({
    store,
    i18n,
    ...App,
})
app.$mount()   //挂载 Vue 实例
