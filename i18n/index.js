import zh_CN  from './zh-CN'
import en_US from './en-US'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { config } from '../config/config'
import storage from '../common/storage'
Vue.use(VueI18n)


// 使用程序配置的默认语言
// const locale = storage.getStore('language') || config.language


// 设置默认语言 存储 > 默认设置 > 系统语言，，没有默认语言就使用系统语言
const locale = storage.getStore('language') || config.language || (uni.getSystemInfoSync().language === 'zh-CN' ? 'zh_CN' : 'en_US')


// 通过选项创建 VueI18n 实例
const i18n = new VueI18n({
    locale, // 设置地区
    messages: {
        zh_CN,
        en_US
    }, // 设置地区信息
})

export default i18n