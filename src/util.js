const templateRE = /{{([^}]+)?}}/

export function templateQuery (tpl = '', data = {}) {
  var match = ''

  while ((match = templateRE.exec(tpl))) {
    tpl = tpl.replace(match[0], data[match[1]])
  }

  return tpl
}

export function stringify (Param = {}) {
  var payload = []

  Object.keys(Param).forEach((key) => {
    payload.push(`${key}=${Param[key]}`)
  })

  return payload.join('&')
}
