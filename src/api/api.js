import axios from 'axios'

let users = JSON.parse(localStorage.getItem('COUNNAME'))

let base = '';//http://api.yifengbeauty.com
//登录
export const requestLogin = params => { return axios.post(`${base}/api/beta/counselor/login.aspx`, params, {
	transformRequest: [function (data) {
                // Do whatever you want to transform the data
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
              }],
              headers:{
              	'Content-Type': 'application/x-www-form-urlencoded'
              }
}).then(res => res.data); };
//退出
export const requestLogout = params => { return axios.get(`${base}/api/beta/counselor/logout.aspx`, {params: params,
	transformRequest: [function (data) {
                // Do whatever you want to transform the data
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
              }],
              headers:{
              	'Content-Type': 'application/x-www-form-urlencoded',
              	Authorization:`MEDCOS#${users.sessionKey}`,
              }
}).then(res => res.data)};