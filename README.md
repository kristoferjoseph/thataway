# 👉Thataway👈
Minimal url routing library.

- Written in plain ol JavaScript so **no transpile needed**🔥
- ~8k minified💥
- Simple api of three methods:
    - register
    - subscribe/unsubscribe
    - navigate

## Install
`npm i thataway --save`

## Usage
Simplest working example

```
var createRouter = require('thataway')
var router = createRouter()
router.register('/things', {animal:'raccoon'})
router.subscribe(update)

function update(data) {
  console.log(data)// Outputs {animal:'racoon',path:'/things',params:{},query:{}}
}

router.navigate('/things')
```

Complex urls
```
var createRouter = require('thataway')
var router = createRouter()

router.register('/things/:comment/:id', {animal:'raccoon'})
router.subscribe(update)

function update(data) {
  console.log(data)// Outputs {animal:'racoon',path:'/things', params: {comment:'123',id:'456'}, query:{}}
}

router.navigate('/things/123/456')
```

## Test
`npm t`
