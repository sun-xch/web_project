import { constantRoutes, asyncRoutes } from '@/router'
import { getAuthMenu } from '@/api/menu'
import { Message } from 'element-ui'
import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    let menu = {}
    // 默认显示
    const hiddenFalg = false
    // 如果是1，不需要隐藏
    // if (item.type === '1') {
    //   hiddenFalg = false
    // }
    if (item.url.indexOf(':') > -1) {
      // url中带：号的这种，是编辑，path和component不一样
      const componentUrl = item.url.substring(0, item.url.lastIndexOf('/'))
      menu = {
        path: item.url === '#' ? item.url + item.uuid + '_key' : item.url, // item.menu_id + '_key':保持唯一性 否则会报错
        // component: item.url === '#' ? Layout : () => import(`@/views${componentUrl}`),
        component: item.url === '#' ? Layout : resolve => require([`@/views${componentUrl}`], resolve),
        children: [],
        hidden: hiddenFalg,
        // name: 'menu_' + item.id,
        name: item.code, // name要与页面对应的name一致
        meta: { title: item.menuName, icon: `${item.icon}` }
      }
    } else {
      menu = {
        path: item.url === '#' ? item.url + item.uuid + '_key' : item.url, // item.menu_id + '_key':保持唯一性 否则会报错
        // component: item.url === '#' ? Layout : () => import(`@/views${item.url}`),
        component: item.url === '#' ? Layout : resolve => require([`@/views${item.url}`], resolve),
        children: [],
        hidden: hiddenFalg,
        // name: 'menu_' + item.id,
        name: item.code, // name要与页面对应的name一致
        meta: { title: item.menuName, id: item.uuid, icon: `${item.icon}` }
      }
    }

    if (item.childMenu) {
      generaMenu(menu.children, item.childMenu)
    }
    routes.push(menu)
  })
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      getAuthMenu().then(response => {
        const { code } = response
        const { data } = response
        if (code !== 200) {
          Message.error({
            message: '菜单加载异常，请联系管理员'
          })
        } else {
          let accessedRoutes = []
          generaMenu(asyncRoutes, data.items)
          accessedRoutes = asyncRoutes || []
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      }).catch(error => {
        console.log(error)
        Message.error({
          message: '菜单加载异常，请联系管理员'
        })
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
