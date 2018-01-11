import * as Fire from '@/lib/fire.js'

export function init (config) {
  var api = {}

  config.list.forEach((item) => {
    item.path = config.prefix + item.path
    api[item.name] = item
    api[item.name].fire = Fire.fire
  })

  return api
}

export function setHeaders (head) {
  Fire.setHeaders(head)
}
