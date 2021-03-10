import axios from 'axios'

const MyAxios = {}

MyAxios.install = function (Vue) {
  axios.defaults.baseURL = 'http://127.0.0.1:3000/'
  Vue.prototype.$axios = axios
}

export default MyAxios
