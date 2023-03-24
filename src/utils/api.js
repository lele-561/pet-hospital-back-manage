import axios from "axios";
import store from "../store";

// let base = '/api';  // 开发跨域
let base = 'https://pet-hospital.azurewebsites.net';  // 云端部署跨域


export const getFormData = (url, params) => {
    store.commit('getToken')
    const token = store.state.user.token
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        },
        transformRequest: [function (data) {
            data = JSON.stringify(data);
            return data
        }],
    });
}

export const postRequestJSON = (url, data, params) => {
    store.commit('getToken')
    const token = store.state.user.token
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data,
        params: params,
        transformRequest: [function (data) {
            data = JSON.stringify(data);
            return data
        }],
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
}

export const postFormData = (url, data, params) => {
    store.commit('getToken')
    const token = store.state.user.token
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data,
        params: params,
        headers: {
            'Content-type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        },
    });
}
