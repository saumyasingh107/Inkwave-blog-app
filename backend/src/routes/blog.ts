import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

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
    try {
        const user = await verify(authHeader, c.env.JWT_KEY);
        if (user) {
            c.set("userId", user.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    } catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});

blogRouter.post("/", async (c) => {
    const body = await c.req.json();
  
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })

    return c.json({
        id: blog.id
    })
})

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const body = await c.req.json();

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


blogRouter.get(" /:id", async (c) => {
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
