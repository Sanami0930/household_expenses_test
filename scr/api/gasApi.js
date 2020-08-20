import axios from 'axios'

// 共通ヘッダーを設定した axios のインスタンスを生成
const gasApi = axios.create({
  headers: { 'content-type': 'application/x-www-form-urlencoded' }
})

// response 共通処理
// error が含まれていたら reject
gasApi.interceptors.response.use(res => {
  if(res.data.error){
    return Promise.reject(res.data.error)
  }
  return Promise.resolve(res)
}, err => {
  return Promise.reject(err)
})

/**
 * API の URL を設定
 * @param {String} url
 */
const setUrl = url => {
  gasApi.defaults.baseURL = url
}

/**
 * authToken の設定
 * @param {String} token
 */
let authToken = ''
const setAuthToken = token => {
  authToken = token
}

/**
 * 指定年月のデータを取得
 * @param {String} yearMonth
 * @returns {Promise}
 */
const fetch = yearMonth => {
  return gasApi.post('',{
    method: 'GET',
    authToken,
    params: {
      yearMonth
    }
  })
}

/**
 * データを追加
 * @param {Object} item
 * @returns {Promise}
 */
const add = item => {
  return gasApi.post('',{
    method: 'POST',
    authToken,
    params:{
      item
    }
  })
}

/**
 * 指定年月 & id のデータを削除
 * @param {String} yearMonth
 * @param {String} id
 * @returns {Promise}
 */
const $delete = (yearMonth, id) => {
  return gasApi.post('', {
    method: 'DELETE',
    authToken,
    params: {
      yearMonth,
      id
    }
  })
}

/**
 * データを更新
 * @param {String} beforeYM
 * @param {Object} item
 * @returns {Promise}
 */
const update = (beforeYM, item) => {
  return gasApi.post('', {
    method: 'PUT',
    authToken,
    params: {
      beforeYM,
      item
    }
  })
}

export default {
  setUrl,
  setAuthToken,
  fetch,
  add,
  delete: $delete,
  update
}
