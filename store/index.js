import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '../i18n'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		orderOkAddressMsg: '',
		deliver: '',
		version: '',
		childCategoryList: [
			[
				{
					name: i18n.t('热销分类'),
					childrenList: [{bak1: ''},{bak1: ''},{bak1: ''},{bak1: ''},{bak1: ''},{bak1: ''}]
				}, {
					name: i18n.t('其他分类'),
					childrenList: [{bak1: ''},{bak1: ''},{bak1: ''},{bak1: ''},{bak1: ''},{bak1: ''}]
				}
			]
		]
	},
	mutations: {
		updateOrderOkAddressMsg(state, newAdd) {
			state.orderOkAddressMsg = newAdd
		},
		updateDeliver(state, newDeliver) {
			state.deliver = newDeliver
		},
		AppVersion(state, version) {
			state.version = version
		},
		updateChildCategoryList(state, list) {
			state.childCategoryList = JSON.parse(list)
		}
	},
	actions: {
		
	}
})

export default store
