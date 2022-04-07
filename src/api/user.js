import request from '@/utils/request'

export function login(data) {
  // console.log(typeof data);
  return request({
    // url: '/vue-admin-template/user/login',
    // url: 'https://www.fastmock.site/mock/702b041e698b439c42284f511458500d/admin/user/login',
    url: 'http://localhost:8081/movie_ssm_war/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'https://www.fastmock.site/mock/702b041e698b439c42284f511458500d/admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
