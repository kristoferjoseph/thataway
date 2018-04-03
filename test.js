var inWindow = require('in-window')
var test = require('tape')
var thataway = require('./')
var display

if (inWindow) {
  display = document.getElementById('output')
}

function print (out) {
  display && (display.innerHTML += `<h4><span class='test-pass'>✔︎</span> ${out}</h4>`)
}

module.exports = (function () {
  test('thataway', function (t) {
    t.ok(thataway, 'thataway exists')
    t.end()
  })

  test('should subscribe', function (t) {
    t.ok(thataway().subscribe(function () {}), 'thataway did add listener', print('thataway did add listener'))
    t.end()
  })

  test('should unsubscribe', function (t) {
    var router = thataway()
    router.subscribe(hear)
    function hear () {
      t.fail('listener should be unsubscribed')
    }
    t.ok(
      router.unsubscribe(hear),
      'unsubscribed a listener',
      print('unsubscribed a listener')
    )
    router.navigate('/')
    t.end()
  })

  test('should call listener on url change', function (t) {
    var router = thataway()
    router.register('/a', {})
    router.subscribe(
      function (e) {
        t.ok(true, 'called listener', print('called listener'))
        t.end()
      }
    )
    router.navigate('/a')
  })

  test('should pass path to update method', function (t) {
    var router = thataway()
    router.register('/b', {})
    router.subscribe(
      function (data) {
        t.equal(data.path, '/b', 'passed path to update', print('passed path to update'))
        t.end()
      }
    )
    router.navigate('/b')
  })

  test('should have navigate method', function (t) {
    t.ok(thataway().navigate, 'navigate method exists', print('navigate method exists'))
    t.end()
  })

  test('should navigate to a path', function (t) {
    var router = thataway()
    router.register('/c', {})
    router.navigate('/c')
    t.equal(
      window.location.pathname,
      '/c',
      print('navigated to correct location')
    )
    t.end()
  })

  test('should have register method', function (t) {
    t.ok(thataway().register, 'has register method', print('has register'))
    t.end()
  })

  test('should register paths', function (t) {
    var router = thataway()
    router.register('/a', {'title': 'sup'})
    router.register('/b', {'title': 'nope'})
    t.equal(
      router.register('/c', {'title': 'yolo'}),
      3,
      'registered all paths',
      print('registered all paths')
    )
    t.end()
  })

  test('should get paramaterized route data', function (t) {
    var router = thataway()
    router.register('/thing/:comment/:id', {stuff: 'YOLO'})
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
        query: {},
        hash: {}
      },
      'got correct route data',
      print('got correct route data')
    )
    t.end()
  })

  test('should return first route match, then check for pattern match', function (t) {
    var router = thataway()
    router.register('/thing/:id', {stuff: 'NOLO'})
    router.register('/thing/', {stuff: 'YOLO'})
    t.deepEqual(
      router('/thing/'),
      {
        stuff: 'YOLO',
        path: '/thing',
        query: {},
        hash: {}
      },
      'route matched path before parameterized path',
      print('route matched path before parameterized path')
    )
    t.end()
  })

  test('should match on root path "/"', function (t) {
    t.plan(1)
    var router = thataway()
    router.register('/', {stuff: 'ROOT DOWN'})
    t.deepEqual(
      router('/'),
      {path: '/', query: {}, stuff: 'ROOT DOWN', hash: {}},
      'matched root path',
      print('matched root path')
    )
  })

  test('should work with history.back', function (t) {
    t.plan(4)
    var results = ['HOME', 'A', 'B', 'A']
    var counter = 0
    var router = thataway()
    router.register('/', {title: 'HOME'})
    router.register('/a', {title: 'A'})
    router.register('/b', {title: 'B'})
    router.subscribe(function (data) {
      var expected = results[counter]
      t.equal(
        data.title,
        expected,
        `matched path ${data.title}`,
        print(`matched path ${data.title}`)
      )
      counter++
    })
    router.navigate('/')
    router.navigate('/a')
    router.navigate('/b')
    window.history.back()
  })

  test('should get query string and hash data', function (t) {
    var router = thataway()
    router.register('/thing/:id', {stuff: 'YOLO'})
    router.subscribe(function (data) {
      t.deepEqual(
        data,
        {
          stuff: 'YOLO',
          path: '/thing/123',
          params: {
            path: '/thing/123',
            id: '123'
          },
          query: {
            maybe: 'sure'
          },
          hash: {
            create: 'thing'
          }
        },
        'got correct query and hash data',
        print('got correct query and hash data')
      )
      t.end()
    })
    // WARN: you must specify query string *BEFORE* hash
    router.navigate('/thing/123?maybe=sure#create=thing')
  })

  test('should reset url to root', function (t) {
    thataway().navigate('/')
    t.equal(
      window.location.pathname,
      '/',
      'reset url', print('reset url')
    )
    t.end()
  })
}())
