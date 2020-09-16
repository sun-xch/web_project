import request from '@/utils/request'

export function getAuthMenu() {
  return request({
    url: '/menu/getAuthMenu',
    method: 'get'
  })
}
