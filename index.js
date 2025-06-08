import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import JWT from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(express.json());
app.use(cors());

const users = [];
const todos = [];

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logger);

const postRateLimiter = rateLimit({
  windowMs: 1000 * 60 * 60, // 1 hour
  limit: 20,
  message: "Too many requests!",
  statusCode: 429,
  legacyHeaders: false,
  standardHeaders: true,
});

app.use((req, res, next) => {
  if (req.method === "POST") {
    return postRateLimiter(req, res, next);
  }
  next();
});

const registerRateLimit = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 3,
  message: "Too Many Requests!",
  statusCode: 429,
  legacyHeaders: false,
  standardHeaders: true,
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Token missing" });
  }

  try {
    const decoded = JWT.verify(token, "mySecret");
    const user = users.find((u) => u.username === decoded.username);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid or expired token" });
  }
};

app.post("/register", registerRateLimit, async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user) {
    return res.status(409).send({ error: "User already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, password: hashedPassword };
  users.push(newUser);
  return res
    .status(201)
    .send({ message: "New user created!", username: username });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).send({ error: "User not found!" });
  }
  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    return res.status(409).send({ error: "Invalid credentails!" });
  }
  const token = JWT.sign({ username }, "mySecret", { expiresIn: "1hr" });
  return res.status(200).send({ message: "Login success!", token: token });
});

app.post("/todos", authMiddleware, (req, res) => {
  const { title } = req.body;
  const newTodo = {
    id: uuidv4(),
    title: title,
    done: false,
    owner: req.user.username,
  };
  todos.push(newTodo);
  return res.status(201).send({ message: "todo created ", todo: newTodo });
});

app.get("/todos", authMiddleware, (req, res) => {
  const userTodos = todos.filter((todo) => todo.owner === req.user.username);
  return res.status(200).send({
    message: userTodos.length > 0 ? "User todos found" : "No todos found",
    todos: userTodos,
  });
});

app.patch("/todos/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const { title, done } = req.body;

  const index = todos.findIndex(
    (todo) => todo.id === id && todo.owner === req.user.username
  );

  if (index === -1) {
    return res.status(404).send({ error: "todo not found" });
  }

  if (title !== undefined) todos[index].title = title;
  if (done !== undefined) todos[index].done = done;

  return res.status(200).send({ message: "todo updated", todo: todos[index] });
});

app.delete("/todos/:id", authMiddleware, (req, res) => {
  const id = req.params.id;

  const index = todos.findIndex(
    (todo) => todo.id === id && todo.owner === req.user.username
  );

  if (index === -1) {
    return res.status(404).send({ error: "todo not found" });
  }

  todos.splice(index, 1);
  return res.status(200).send({ message: "todo deleted" });
});

app.put("/todos/:id", authMiddleware, (req, res) => {
  const id = req.params.id;

  const index = todos.findIndex(
    (todo) => todo.id === id && todo.owner === req.user.username
  );
  if (index === -1) {
    return res.status(404).send({ error: "Todo not found or unauthorized" });
  }

  const newTodo = {
    ...todos[index],
    ...req.body,
  };

  todos[index] = newTodo;
  res.status(200).send({ message: "Todo Updated" });
});

app.listen(3000);
