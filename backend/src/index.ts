import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string
    JWT_KEY:string
  }
}>()

app.post('/api/v1/user/signup',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body=await c.req.json();
 const user=await prisma.user.create({
  data:{
    email:body.email,
    passwords:body.passwords,
  }
 })
 const token=await sign({id:user.id},c.env.JWT_KEY);
 return c.json({jwt:token})

})


app.post('/api/v1/user/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body=await c.req.json();

  const user=await prisma.user.findUnique({
    where:{
      email:body.email,
      passwords:body.passwords
    }
  })

  if(!user){
    c.status(403)
    return c.json({error:"user not found"})
  }
  const token=await sign({user:user.id},c.env.JWT_KEY)
  return c.json({
    jwt:token
  })

})
app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')

})
app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')

})
app.get(' /api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')

})
app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')

})

export default app
