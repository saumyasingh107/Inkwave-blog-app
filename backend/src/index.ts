import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono()
app.use('/*',cors())
app.route("/api/v1/user",userRouter)
app.route("/api/v1/blog",blogRouter)
app.get("/" ,(c)=>
    c.json({msg:"backend is running"})
)

export default app
