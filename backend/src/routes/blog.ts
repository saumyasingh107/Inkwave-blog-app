import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";
import { createBlog, UpdateBlog } from "../../../common/src/index";


export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();


blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
console.log("Authorization Header:", authHeader); 

try {
    const user = await verify(authHeader, c.env.JWT_KEY);c
    console.log("Decoded JWT:", user);
    if (user) {
        console.log("User Verified:", user);
        c.set("userId", user.user as string);
        console.log("Set userId in context:", user.user);
        await next();
    } else { 
        c.status(403);
        return c.json({ message: "You are not logged in" });
    }
} catch (e) {
    console.error("JWT Verification Error:", e);
    c.status(403);
    return c.json({ message: "You are not logged in" });
}
});

blogRouter.post("/", async (c) => {
    const body = await c.req.json();
    const { success } = createBlog.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
  
    const userID = c.get("userId");

    console.log("this is the author id ",userID)
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(userID)
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
   const { success } = UpdateBlog.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");

  const blog = await prisma.post.update({
    where: {
      id: body.id,
      authorId: Number(userId),
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({id:blog.id});
});


blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL, 
  }).$extends(withAccelerate());
  const posts = await prisma.post.findMany({
    select:{
      content:true,
      title:true,
      id:true,
      author:{
        select:{
          name:true
        }
      }
    }
  });

  return c.json({ posts });
});


blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");

try{

  const blog = await prisma.post.findFirst({
    where: {
      id:Number(id)
    },
    select: {
                id: true,
                title: true,
                content: true,
                author: {
                  select: {
                    name: true
                  }
                }
              }
            });
            return c.json({
              blog
            });
          }
     catch(e) {
        c.status(411);
        return c.json({
            message: "Error while fetching blog post"
        });
    }
})
