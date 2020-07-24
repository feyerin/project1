import axios from 'axios'
import { currentUser, urlProd, urlDev, apiUrl, apiDev } from '../../constants/config'

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      axios.post(apiDev +'/api/v1/poi/login',{email: payload.email, password: payload.password},{
        headers: {
          'Content-Type':'application/json',
        }
      })
        .then(
          user => {
            console.log(user)
            const item = { token: user.data.token }
            localStorage.setItem('user', JSON.stringify(item))
            console.log("token", localStorage.getItem('user', JSON.stringify(item)))
            console.log(item.user);
            commit('setUser', { user: item.user })
            console.log('val1', item.user)
          },
          err => {
            console.log(err)
            localStorage.removeItem('user')
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    
    signOut({ commit }) {
          localStorage.removeItem('user')
          commit('setLogout')
       
    }
  }
}
