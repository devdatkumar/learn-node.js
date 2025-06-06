import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const users = [];

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(409).send({ error: "User already exists!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newuser = { username, password: hashedPassword };
  users.push(newuser);
  res.status(201).send({ message: "User created!", newuser });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user?.username !== username) {
    return res.status(404).send({ error: "user doesn't exist!" });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).send({ error: "Invalid credentails" });
  }
  const token = jwt.sign({ username }, "mysecret", { expiresIn: "1h" });
  res.status(200).send({ message: "login success", token: token });
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, "mysecret");
    const user = users.find((u) => u.username === decoded.username);
    res.status(200).send({ message: "Profile data", user });
  } catch (err) {
    res.status(401).send({ error: "Invalid or expired token" });
  }
});
