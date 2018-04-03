# 👉☝️  Thataway 👇👈
Minimal url routing library.

- Written in plain ol JavaScript so **no transpile needed**🔥
- ~8k minified💥
- Simple api:
    - register
    - subscribe
    - unsubscribe
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
router.unsubscribe(update)
```

Complex urls
```
var createRouter = require('thataway')
var router = createRouter()

router.register('/things/:comment/:id', {animal:'raccoon'})
router.subscribe(update)

function update(data) {
  console.log(data)// Outputs {animal:'racoon',path:'/things', params: { comment:'123', id:'456' }, query: { can: do }, hash: { stuff: too }}
}

router.navigate('/things/123/456?can=do#stuff=too')
router.unsubscribe(update)
```

## Test
`npm it`
