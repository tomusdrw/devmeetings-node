const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()

// 6/ Koa dalej oparty jest o middlewares
// -- ale kod możemy pisać w nim w pełni "synchronicznie"
app.use(async (ctx, next) => {
  console.log('Before request: ', ctx.url)
  await next()
  console.log('After request:', ctx.url)
})

// 6/ Podobnie jak w express możemy stworzyć router.
const router = new Router()
router.get('/', async (ctx) => {
  ctx.body = 'Hello from main'
})
app.use(router.routes())
app.use(router.allowedMethods())

// 3/ Routy końcowe nie wywołują next
app.use(async ctx => {
  ctx.body = 'Hello World'
})

app.listen(process.env.PORT || 3000)
