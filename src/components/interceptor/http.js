import axios from 'axios';

axios.defaults.timeout = 5000;

axios.interceptors.request.use(config => {
  return config;
}, err => {
  this.MyMessage.error('加载超时');
  return Promise.reject(err);
});

axios.interceptors.response.use(response => {
  let data = response.data.data;
  let code = response.data.code;
  if (code == 'OK' || code == '200') {
    return data;
  } else {
    this.MyMessage.error('加载失败');
    console.log('axios 加载失败');
  }
  return response;
}, err => {
  this.MyMessage.error('加载失败');
  console.log('err');
  return Promise.reject(err)
})

export default axios