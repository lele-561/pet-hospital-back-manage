import axios from "axios";
// let base = 'http://localhost:8090';   // 跨域1
// let base = 'http://localhost:8090/api';   // 跨域1
let base = 'https://black-sea-0a013c010.2.azurestaticapps.net/api';  // 跨域2


export const getFormData = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        transformRequest: [function (data) {
            data = JSON.stringify(data);
            return data
        }],
    });
}

export const postRequestJSON = (url, data, params) => {
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
            'Content-Type': 'application/json'
        }
    });
}

export const postFormData = (url, data, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data,
        params: params,
        headers: {
            'Content-type': 'multipart/form-data'
        },
        transformRequest: [function (data) {
            data = JSON.stringify(data);
            return data
        }],
    });
}