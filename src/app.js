import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://earncorecommunity-ge8fw6570-mdhasib01s-projects.vercel.app",
      "https://earncorecommunity.yochrisgray.com",
      "https://www.earncorecommunity.yochrisgray.com",
      "https://www.yochrisgray.com",
      "https://yochrisgray.com",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Cache-Control",
    "X-File-Name",
  ],
  exposedHeaders: ["Set-Cookie"],
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// app.options("*", cors(corsOptions));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import { seedDatabase } from "./data/seedDatabase.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import followRouter from "./routes/follow.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import scraperRouter from "./routes/scraper.routes.js";
import postsRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";
import communityRouter from "./routes/community.routes.js";

app.get("/api/v1/seed", seedDatabase);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/scraper", scraperRouter);
app.use("/api/v1/community", communityRouter);

export { app };
