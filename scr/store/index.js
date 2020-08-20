import Vue from 'vue'
import Vuex from 'vuex'
import gasApi from '../api/gasApi'

Vue.use(Vuex)

/**
 * State
 * Vuex の状態
 */
const state = {
  // 家計簿データ
  abData: {},

  // ローディング状態
  loading: {
    fetch: false,
    add: false,
    update: false,
    delete: false
  },

  // エラーメッセージ
  errorMessage: '',

  //  設定
  settings: {
    appName: 'GAS 家計簿',
    apiUrl: '',
    authToken: '',
    strIncomeItems: '給料, ボーナス, 繰越',
    strOutgoItems: '食費, 趣味, 交通費, 買い物, 交際費, 生活費, 住宅, 通信, 車, 税金',
    strTagItems: '固定費, カード'
  }
}

/**
 * Mutations
 * Actions から State を更新する時に呼ばれる
 */
const mutations = {

// 指定年月の家計簿データをセット
setAbData (state, { yearMonth, list}) {
  state.abData[yearMonth] = list
},

// データを追加
addAbData (state, { item }){
  const yearMonth = item.date.slice(0, 7)
  const list = state.abData[yearMonth]
  if(list){
    list.push(item)
  }
},

// 指定年月のデータ更新
updateAbData(state, { yearMonth, item}){
  const list = state.abData[yearMonth]
  if(list){
    const index = list.findIndex(v => v.id === item.id)
    list.splice(index, 1, item)
  }
},

// 指定年月＆IDのデータを削除
deleteAbData(state, { yearMonth, id }){
  const list = state.abData[yearMonth]
  if(list){
    const index = list.findIndex(v => v.id === id)
    list.splice(index, 1)
  }
},

// ローディング状態をセット
setLoading (state, {type, v }){
  state.loading[type] = v
},

//エラーメッセージをセット
setErrorMessage (state, { message }){
  state.errorMessage = message
},

//  設定を保存
saveSettings (state, { settings }) {
  state.settings = { ...settings }
  const { appName, apiUrl, authToken } = state.settings
  document.title = appName
  gasApi.setUrl (apiUrl)
  gasApi.setAuthToken(authToken)

  // 家計簿データを初期化
  state.abData = {}

  localStorage.setItem('settings', JSON.stringify(settings))
},

// 設定の読み込み
loadSettings (state) {
  const settings = JSON.parse(localStorage.getItem('settings'))
    if(settings){
      state.settings = Object.assign(state.settings, settings)
    }
    const { appName, apiUrl, authToken } = state.settings
    document.title = appName
    gasApi.setUrl(apiUrl)
    gasApi.setAuthToken(authToken)
  }
}

 /**
  * Actions
  * 画面から呼ばれ、Mutation をコミット
  */
const actions = {

  // 指定年月の家計簿データを取得
  async fetchAbData({ commit }, { yearMonth }){
    const type = 'fetch'
    commit('setLoading', { type, v: true})
    try {
      const res = await gasApi.fetch(yearMonth)
      commit('setAbData', { yearMonth, list: res.data})
    } catch(e) {
      commit('setErrorMassage', { message: e})
      commit('setAbData', { yearMonth, list: [] })
    } finally {
      commit('setLoading', { type, v: false})
    }
  },

  // データを追加
  async addAbData ({ commit }, { item }){
    const type = 'add'
    commit('setLoading', {type, v: true })
    try {
      const res = await gasApi.add(item)
      commit('addAbData', { item: res.data })
    } catch(e) {
      commit('setErrorMessage', { item: re.data})
    } finally {
      commit('setLoading', { type, v: false})
    }
  },

  // データを更新
  async updateAbData ({ commit }, { beforeYM, item }) {
    const type = 'update'
    const yearMonth = item.date.slice(0, 7)
    commit('setLoading', { type, v: true })
    try {
      const res = await gasApi.update(beforeYM, item)
      if (yearMonth === beforeYM) {
        commit('updateAbData', { yearMonth, item })
        return
      }
      const id = item.id
      commit('deleteAbData', { yearMonth: beforeYM, id })
      commit('addAbData', { item: res.data })
    } catch (e) {
      commit('setErrorMessage', { message: e })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  // データを削除
  async deleteAbData ({ commit }, { item }) {
    const type = 'delete'
    const yearMonth = item.date.slice(0, 7)
    const id = item.id
    try {
      await gasApi.delete(yearMonth, id)
      commit('deleteAbData', { yearMonth, id })
    } catch (e) {
      commit('setErrorMessage', { message: e })
    } finally {
      commit('setLoading', { type, v: false })
    }
  },

  // 設定を保存
  saveSettings ({ commit }, { settings }){
    commit('saveSettings', { settings })
  },

  // 設定の読み込み
  loadSettings ({ commit }){
    commit('loadSettings')
  }
}

// カンマ区切りの文字をトリミングして配列化
const createItems = v => v.split(',').map(v => v.trim()).filter(v => v.length !== 0)

/**
 * Getters
 * 画面から取得され、State を加工して渡す
 */
const getters = {
 // 収入カテゴリ（配列）
 incomeItems (state){
  return createItems(state.settings.strIncomeItems)
  },

  // 支出カテゴリ（配列）
  outgoItems (state) {
    return createItems(state.settings.strOutgoItems)
  },

  // タグ（配列）
  tagItems (state){
    return createItems(state.settings.strTagItems)
  }
}

const store = () => {
  return new Vuex.Store({
    state,
    mutations,
    actions,
    getters
  })
}

export default store
