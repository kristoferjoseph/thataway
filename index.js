var queryString = require('query-string')
var routerParams = require('router-params')
var inWindow = require('in-window')
var location
inWindow ?
location = window.location :
location = {
  pathname: '/',
  search: ''
}

module.exports = function thataway () {
  var listeners = []
  var patterns = []
  var routes = {}
  inWindow && (window.onpopstate = update)

  function addRoute (path, data) {
    path = removeTrailingSlash(path)
    var matcher
    if (path && 'string' === typeof path &&
      data && data === Object(data)) {
      matcher = routerParams(path)
      if (matcher) {
        patterns.push({
          matcher: matcher,
          data: data
        })
      }
      routes[path] = data
    } else {
      console.error('addRoute requires a path of type string and data of type object to store')
    }
  }

  function addListener (listener) {
    return 'function' === typeof listener ?
           listeners.push(listener) :
           console.error('addListener requires a function argument')
  }

  function shouldUpdate (path) {
    return path !== removeTrailingSlash(location.pathname)
  }

  function update () {
    var data = getRouteData(location.pathname)
    if (data) {
      listeners.forEach(
        function (l) {
          l(data)
        }
      )
    }
  }

  function navigate (path, data, title) {
    typeof path !== 'string' &&
      console.error('navigate requires a path of type string and can optionally be passed data and a title')
    path = removeTrailingSlash(path)
    if (inWindow && shouldUpdate(path)) {
      history.pushState(data, title, path)
      update()
    }
  }

  function removeTrailingSlash (path) {
    return path && path !== '/' ?
      path.replace(/\/$/, '') :
      path
  }

  function getRouteData (path) {
    path = removeTrailingSlash(path)
    var params
    var data = routes[path]
    if (!data) {
      patterns.forEach(function (pattern) {
        params = pattern.matcher(path)
        if (params) {
          data = pattern.data
          data.params = params
        }
      })
    }
    if (data) {
      data.path = path
      data.query = queryString.parse(location.search)
    } else {
      console.error('Route for ' + path + ' not found')
      return
    }

    return data
  }

  return {
    addRoute: addRoute,
    addListener: addListener,
    getRouteData: getRouteData,
    navigate: navigate
  }

}
