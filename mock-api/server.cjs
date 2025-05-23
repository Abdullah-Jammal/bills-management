const jsonServer = require('json-server')
const auth = require('json-server-auth')
const cors = require('cors')

const app = jsonServer.create()
const router = jsonServer.router('db.json')

app.db = router.db

app.use(cors())
app.use(jsonServer.bodyParser)
app.use(auth)
app.use(router)

app.listen(3001, () => {
  console.log('Mock API with auth running at http://localhost:3001')
})
