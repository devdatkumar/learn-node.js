import http from "http";

const app = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello from Node Server!" }));
});

app.listen(3000, () => {
  console.log("app running on port 3000");
});
