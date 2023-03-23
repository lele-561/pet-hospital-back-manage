import Cookie from 'js-cookie'

export default {
    state: {
        token: '',
    },
    mutations: {
        setToken(state, val) {
            state.token = val
            Cookie.set('adminToken', val)
        },
        clearToken(state) {
            state.token = ""
            Cookie.remove('adminToken')
        },
        getToken(state) {
            state.token = state.token || Cookie.get('adminToken')
        },
    }
}