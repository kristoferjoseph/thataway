var inWindow = require('in-window')
var queryString  = require('query-string')
var routerParams = require('router-params')
var location = inWindow ? window.location : { pathname: '/', search: '' }

module.exports = function thataway (paths) {
  paths = paths || {}
  var routes = {}
  var listeners = []
  var patterns = []
  inWindow && (window.onpopstate = back)
  Object.keys(paths).map(function(p) {register(p, paths[p])})

  function register (path, data) {
    path = trim(path)
    if (path) {
      var matcher = routerParams(path)
      matcher ?
      patterns.push({
        matcher: matcher,
        data: data
      }) :
      routes[path] = data
    }
  }

  function subscribe (listener) {
    return 'function' === typeof listener &&
      listeners.push(listener), unsubscribe
  }

  function unsubscribe (l) {
    l && listeners.splice(listeners.indexOf(l), 1)
  }

  function should (path) {
    return path && path !== trim(location.pathname)
  }

  function back () {
    var data = router(location.pathname)
    data.back = true
    update(data)
  }

  function update (data) {
    data = data || router(location.pathname)
    data && listeners.forEach(
      function(l) {
        l(data)
      }
    )
  }

  function navigate (path, data, title) {
    path = trim(path)
    inWindow &&
    should(path) &&
    history.pushState(data, title, path),
    update()
  }

  function trim (path) {
    return path === '/' ? path : path && path.replace(/\/*$/, '')
  }

  function match (path) {
    var pattern
    var params
    var data
    var i = 0
    var l = patterns.length
    for (i; i<l; i++) {
      pattern = patterns[i]
      params = pattern.matcher(path)
      if (params) {
        data = pattern.data
        data.params = params
        break
      }
    }
    return data
  }

  function router (path) {
    path = trim(path)
    var data = routes[path] || match(path) || {}
    data.query = queryString.parse(location.search)
    data.hash = queryString.parse(location.hash)
    data.path = path
    return data
  }

  router.subscribe = subscribe
  router.register = register
  router.navigate = navigate
  return router
}
