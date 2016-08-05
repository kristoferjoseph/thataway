var test   = require('tape')
var thataway = require('./')
var display

if (typeof window !== 'undefined') {
  display = document.getElementById('output')
}

function print(out) {
  if (display) {
    display.innerHTML += out
  }
}

module.exports = function() {

  test('thataway', function(t){
    t.ok(thataway, 'thataway exists')
    t.end()
  })

  test('should add listener', function(t) {
    t.ok(thataway().addListener(function() {}), 'thataway did add listener')
    t.end()
  })

  test('should call listener on url change', function(t) {
    var  tw = thataway()
    tw.addRoute('/a', {} )
    tw.addListener(
      function(e) {
        t.ok(true, 'called listener')
        t.end()
      }
    )
    tw.navigate('/a')
  })

  test('should pass path to update method', function(t) {
    var  tw = thataway()
    tw.addRoute('/b', {})
    tw.addListener(
      function(data) {
        t.equal(data.path, '/b', 'passed path to update')
        t.end()
      }
    )
    tw.navigate('/b')
  })

  test('should have navigate method', function(t) {
    t.ok(thataway().navigate, 'navigate method does not exist')
    t.end()
  })

  test('should navigate to a path', function(t) {
    var tw = thataway()
    tw.addRoute('/c', {})
    tw.navigate('/c')
    t.equal(location.pathname, '/c')
    t.end()
  })

  test('should not navigate to same path', function(t) {
    var  tw = thataway()
    tw.addListener(
      function(data) {
        t.end('called update')
      }
    )
    tw.navigate('/c')
    t.end()
  })

  test('should have addRoute method', function(t) {
    t.ok(thataway().addRoute, 'has addRoute method')
    t.end()
  })

  test('should get route data', function(t) {
    var tw = thataway()
    tw.addRoute('/thing/:comment/:id', {stuff:'YOLO'})
    t.deepEqual(
      tw.getRouteData('/thing/123/456'),
      {
        stuff: 'YOLO',
        path: '/thing/123/456',
        params: {
          path: '/thing/123/456',
          comment: '123',
          id: '456'
        },
        query: {}
      },
      'got correct route data'
    )
    t.end()
  })

}()
