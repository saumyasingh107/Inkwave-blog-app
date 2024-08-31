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
  // const {success}=
  const authheader = c.req.header("authorization") || "";

 
    const user = await verify(authheader, c.env.JWT_KEY);
    if (user) {
      c.set("userId", user.id as string);
      next();
    } else {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
  
  
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const body = await c.req.json();
  const authorId=c.get("userId")
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId:authorId,
    },
  });
  return c.json({
    id: blog.id,
  });
});
blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  const body = await c.req.json();

  const blog = await prisma.post.update({
    where: {
      id: body.id,
      authorid: userId,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.text("updated post");
});
blogRouter.get(" /", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
});
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const posts = await prisma.post.findFirst({});

  return c.json({ posts });
});
