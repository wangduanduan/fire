import * as Fire from '@/lib/fire.js'

export default {
  init (config) {
    var api = {}

    config.list.forEach((item) => {
      item.path = config.prefix + item.path
      api[item.name] = item
      api[item.name].fire = Fire.fire
    })

    api.$setHeaders = Fire.setHeaders

    return api
  }
}
