var queryString  = require('query-string')
var routerParams = require('router-params')
var location
if (typeof window === 'undefined') {
  location = {
    pathname: '/',
    search: ''
  }
}
else {
  location = window.location
}

module.exports = function thataway() {
  var listeners = []
  var patterns  = []
  var routes    = {}
  if (typeof window !== 'undefined') {
    window.onpopstate = update
  }

  function addRoute(route, data) {
    route = removeTrailingSlash(route)
    var matcher
    if (route && typeof route === 'string' &&
        data && data === Object(data)) {
      matcher = routerParams(route)
      if (matcher) {
        patterns.push({
          matcher: matcher,
          data: data
        })
      }
      routes[route] = data
    }
    else {
      throw Error('addRoute requires a route of type string and data of type object to store')
    }
  }

  function addListener(listener) {
    if (typeof listener !== 'function') {
      throw Error('addListener requires a function argument')
    }
    return listeners.push(listener)
  }

  function shouldUpdate(path) {
    return path !== removeTrailingSlash(location.pathname)
  }

  function update() {
    var data = getRouteData(location.pathname)
    listeners.forEach(
      function(l) {
        l(data)
      }
    )
  }

  function navigate(path, data, title) {
    if (typeof path !== 'string') {
      throw Error('navigate requires a path of type string and can optionally be passed data and a title')
    }
    path = removeTrailingSlash(path)
    if (typeof window !== 'undefined' &&
        shouldUpdate(path)) {
      history.pushState(data, title, path)
      update()
    }
  }

  function removeTrailingSlash(path) {
    if (!path) { return }
    var hasTrailingSlash = path.length > 1 && path.slice(-1) === '/'
    if (hasTrailingSlash) {
      path = path.substring(0, path.length - 1)
    }
    return path
  }

  function getRouteData(path) {
    path = removeTrailingSlash(path)
    var params
    var data = routes[path]
    if (!data) {
      patterns.forEach(function(pattern) {
        params = pattern.matcher(path)
        if (params) {
          data = pattern.data
          data.params = params
        }
      })
    }
    if (data) {
      data.path  = path
      data.query = queryString.parse(location.search)
    }
    else {
      throw Error('Route not found')
    }
    return data
  }

  return {
    addRoute:addRoute,
    addListener:addListener,
    getRouteData:getRouteData,
    navigate:navigate
  }

}
