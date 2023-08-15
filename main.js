/**
 * @author https://github.com/yang7021
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

import uniIcons from "./components/uni-icons.vue"
import fineIcon from './components/icon.vue'
import lazyImage from "./components/lazy-image.vue"
import typeTop from "./components/type-top.vue"
import uniNavBar from "./components/uni-nav-bar.vue"
import uniLoadMore from './components/uni-load-more.vue'
import uniBadge from './components/uni-badge.vue'

Vue.config.productionTip = false

Vue.use(util)

// 拉平配置
let configData = {}
Object.keys(config).forEach(item => {
    Object.assign(configData, config[item])
})

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

Vue.component('uni-icons', uniIcons)
Vue.component('fine-icon', fineIcon)
Vue.component('lazy-img', lazyImage)
Vue.component('type-top', typeTop)
Vue.component('uni-badge', uniBadge)
Vue.component('uni-load-more', uniLoadMore)
Vue.component('uni-nav-bar', uniNavBar)

App.mpType = 'app'


new Vue({
    store,
    i18n,
    ...App,
}).$mount()
