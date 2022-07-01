import axios from "axios";
let base = 'http://localhost:8081/api';
export const postRequest = (url, data, params) => {
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
export const getRequest = (url,params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
