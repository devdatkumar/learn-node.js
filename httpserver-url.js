import http from "http";

const app = http.createServer((req, res) => {
  if (req.url === "/notes") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ notes: ["Study", "Drink water", "Sleep"] }));
  } else {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

app.listen(3000, () => {
  console.log("app running on port 3000");
});
