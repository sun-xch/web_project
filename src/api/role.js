import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/role/getRoleList',
    method: 'post',
    data
  })
}

export function saveRole(data) {
  return request({
    url: '/role/saveRole',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/role/deleteRole',
    method: 'post',
    data
  })
}