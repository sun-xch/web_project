import request from '@/utils/request'

export function getAuthMenu() {
  return request({
    url: '/menu/getAuthMenu',
    method: 'get'
  })
}

export function getMenu(data) {
  return request({
    url: '/menu/getMenu',
    method: 'post',
    data
  })
}
