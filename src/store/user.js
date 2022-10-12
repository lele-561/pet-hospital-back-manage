import Cookie from 'js-cookie'

export default {
    state: {
        token: '',
        roleName: '',
        userName: ''
    },
    mutations: {
        setToken(state, val) {
            state.token = val
            Cookie.set('token', val)
        },
        clearToken(state) {
            state.token = ""
            Cookie.remove('token')
        },
        getToken(state) {
            state.token = state.token || Cookie.get('token')
        },

        setRoleName(state, val) {
            state.roleName = val
            Cookie.set('roleName', val)
        },
        clearRoleName(state) {
            state.roleName = ""
            Cookie.remove('roleName')
        },
        getRoleName(state) {
            state.roleName = state.roleName || Cookie.get('roleName')
        },

        setUserName(state, val) {
            state.userName = val
            Cookie.set('userName', val)
        },
        clearUserName(state) {
            state.userName = ""
            Cookie.remove('userName')
        },
        getUserName(state) {
            state.userName = state.userName || Cookie.get('userName')
        }
    }
}