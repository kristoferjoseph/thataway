var queryString = require('query-string')
var Pattern = require('url-pattern')

module.exports = function thataway() {
  var listeners   = []
  var patterns    = []
  var routes      = {}
  var currentPath = ''
  var browser     = false
  if (typeof window !== 'undefined') {
    browser = true
    currentPath = removeTrailingSlash(location.pathname)
    window.onpopstate = update
  }

  function addRoute(route, data) {
    var pattern
    if (typeof route !== 'string') {
      throw Error('addRoute requires a route of type string and data to store')
    }

    if (/:/.test(route)) {
      pattern = new Pattern(route)
      patterns.push({
        pattern: pattern,
        data: data
      })
    }

    routes[route] = data
  }

  function addListener(listener) {
    if (typeof listener !== 'function') {
      throw Error('addListener requires a function to be passed')
    }
    return listeners.push(listener)
  }

  function shouldUpdate(path) {
    var should = false
    if (currentPath !== path) {
      should = true
      currentPath = path
    }
    return should
  }

  function update() {
    //NOTE: This needs to be read from the location.pathname
    //  for when it is triggered by the onpopstate event
    var path = removeTrailingSlash(location.pathname)
    var data = getRouteData(path)
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
    if (shouldUpdate(path)) {
      if (browser) {
        history.pushState(data, title, path)
        update()
      }
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
    var query = queryString.parse(location.search)
    var data  = routes[path] || {}
    var params

    patterns.forEach(function(matcher) {
      params = matcher.pattern.match(path)
      if (matcher.data) {
        data = matcher.data
      }
    })

    data.path   = path
    data.params = params
    data.query  = query

    return data
  }

  return {
    addRoute:addRoute,
    addListener:addListener,
    navigate:navigate
  }

}
