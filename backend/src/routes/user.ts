import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_KEY:string
    }
}>();


userRouter.post('/signup',async (c) => {

  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
  
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
        }
      })
      const jwt = await sign({
        id: user.id
      }, c.env.JWT_KEY);
  
      return c.json({jwt})
    } catch(e) {
      console.log(e);
      c.status(411);
      return c.text('Invalid')
    }
  })

userRouter.post('/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body=await c.req.json();

  const user=await prisma.user.findUnique({
    where:{
      username:body.username,
      password:body.password
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