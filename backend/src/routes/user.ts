import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import {signupinput,signininput} from "../../../common/src/index"
export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_KEY:string
    }
}>();


userRouter.post('/signup',async (c) => {
  const body = await c.req.json();
  const {success}=signupinput.safeParse(body);
  if(!success){
    c.status(411)
    return c.json({
      error:"inputs are not correct"
    })
  }

  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

  
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name:body.name
        }
      })
      const token = await sign({
        id: user.id
      }, c.env.JWT_KEY);
  
      return c.json({token})
    } catch(e) {
      console.log(e);
      c.status(411);
      return c.text('Invalid')
    }
  })

userRouter.post('/signin', async(c) => {
  const body=await c.req.json();
  const {success}=signininput.safeParse(body);
  if(!success){
    c.status(411)
    return c.json({
      error:"inputs are not correct"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())


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
    token
  })

})