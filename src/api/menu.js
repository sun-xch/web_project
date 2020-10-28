import request from '@/utils/request'

export function getAuthMenu() {
  return request({
    url: '/menu/getAuthMenu',
    method: 'get'
  })
}

export function getAuthAllMenu() {
  return request({
    url: '/menu/getAuthAllMenu',
    method: 'get'
  })
}

export function getAllMenu(data) {
  return request({
    url: '/menu/getAllMenu',
    method: 'post',
    data
  })
}

export function saveMenu(data) {
  return request({
    url: '/menu/saveMenu',
    method: 'post',
    data
  })
}

export function getMenuAndBindRole(data) {
  return request({
    url: '/menu/getMenuAndBindRole',
    method: 'post',
    data
  })
}
