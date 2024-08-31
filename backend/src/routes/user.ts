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

  const body=await c.req.json();
 const user=await prisma.user.create({
  data:{
    email:body.email,
    passwords:body.passwords,
    name:body.name
  }
 })
 const token=await sign({id:user.id},c.env.JWT_KEY);
 return c.json({jwt:token})

})


userRouter.post('/signin', async(c) => {
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