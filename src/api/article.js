import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'https://www.fastmock.site/mock/702b041e698b439c42284f511458500d/admin/article/list',
    method: 'get',
    params: query
  })
}

/* export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
} */

export function fetchPv(pv) {
  return request({
    url: 'https://www.fastmock.site/mock/702b041e698b439c42284f511458500d/admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: 'https://www.fastmock.site/mock/702b041e698b439c42284f511458500d/admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'https://www.fastmock.site/mock/702b041e698b439c42284f511458500d/admin/article/update',
    method: 'post',
    data
  })
}
