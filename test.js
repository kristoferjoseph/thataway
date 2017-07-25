var test   = require('tape')
var thataway = require('./')
var display

'undefined' !== typeof window &&
(display = document.getElementById('output'))

function print(out) {
  display && (display.innerHTML += out)
}

module.exports = function() {

  test('thataway', function(t){
    t.ok(thataway, 'thataway exists')
    t.end()
  })

  test('should subscribe', function(t) {
    t.ok(thataway().subscribe(function() {}), 'thataway did add listener')
    t.end()
  })

  test('should call listener on url change', function(t) {
    var router = thataway()
    router.register('/a', {})
    router.subscribe(
      function(e) {
        t.ok(true, 'called listener')
        t.end()
      }
    )
    router.navigate('/a')
  })

  test('should pass path to update method', function(t) {
    var router = thataway()
    router.register('/b', {})
    router.subscribe(
      function(data) {
        t.equal(data.path, '/b', 'passed path to update')
        t.end()
      }
    )
    router.navigate('/b')
  })

  test('should have navigate method', function(t) {
    t.ok(thataway().navigate, 'navigate method does not exist')
    t.end()
  })

  test('should navigate to a path', function(t) {
    var router = thataway()
    router.register('/c', {})
    router.navigate('/c')
    t.equal(location.pathname, '/c')
    t.end()
  })

  test('should have register method', function(t) {
    t.ok(thataway().register, 'has register method')
    t.end()
  })

  test('should register paths at initialization', function(t) {
    var router = thataway({
      '/a':{'title':'sup'},
      '/b':{'title':'nope'},
      '/c':{'title':'yolo'},

    })
    t.ok(thataway().register, 'has register method')
    t.end()
  })

  test('should get paramaterized route data', function(t) {
    var router = thataway()
    router.register('/thing/:comment/:id', {stuff:'YOLO'})
    t.deepEqual(
      router('/thing/123/456'),
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

  test('should return first route match, then check for pattern match', function(t) {
    var router = thataway()
    router.register('/thing/:id', {stuff:'NOLO'})
    router.register('/thing/', {stuff:'YOLO'})
    t.deepEqual(
      router('/thing/'),
      {
        stuff: 'YOLO',
        path: '/thing',
        query: {}
      },
      'got correct route data'
    )
    t.end()
  })

  test('should match on root path "/"', function(t) {
    t.plan(1)
    var router = thataway()
    router.register('/', {stuff:'ROOT DOWN'})
    t.deepEqual(router('/'), { path: '/', query: {} ,stuff:'ROOT DOWN'})
  })

  test('should work with history.back', function(t){
    t.plan(4)
    var results = ['HOME', 'A', 'B', 'A']
    var counter = 0
    var router = thataway()
    router.register('/', {title:'HOME'})
    router.register('/a', {title:'A'})
    router.register('/b', {title:'B'})
    router.subscribe(function(data) {
      var expected = results[counter]
      t.equal(data.title, expected)
      counter++
    })
    router.navigate('/')
    router.navigate('/a')
    router.navigate('/b')
    history.back()
  })

}()
