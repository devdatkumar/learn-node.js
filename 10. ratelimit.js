import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
app.use(
  cors({
    methods: "POST",
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

const registerLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 3,
  message: "Too many requests, not more than 3",
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

const users = [];

app.post("/register", registerLimit, async (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(409).send({ error: "User already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newuser = { username, password: hashedPassword };
  users.push(newuser);
  res.status(201).send({ message: "User created!", username });
});

app.listen(3000);
