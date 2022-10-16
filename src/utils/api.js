import axios from "axios";
// let base = 'http://localhost:8090';   // 跨域1
let base = 'http://59.78.194.93:8090/api';  // 跨域2

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

export const postRequestFormData = (url, data, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data,
        params: params,
        headers: {
            'Content-type': 'multipart/form-data'
        }
    });
}

export const postRequestDownloadCSV = (url, data, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: data,
        params: params,
        headers: {
            'Content-type': 'multipart/form-data'
        }
    });
}

export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}


export function downloadCSV(resp, filename) {
    let data = resp.data;  //csv数据
    filename = filename + ".csv";   //导出的文件名
    let type = "";                      //头部数据类型
    let file = new Blob(["\ufeff" + data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        // Others
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}