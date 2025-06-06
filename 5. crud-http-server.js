import http from "http";
import fs from "fs";
let notes = [];

const readAllNotes = () => {
  const data = fs.readFileSync("notes.txt", "utf-8");
  notes = data ? JSON.parse(data) : [];
  return notes;
};

const writeNotes = (notes) => {
  fs.writeFileSync("./notes.txt", JSON.stringify(notes, null, 2));
};

const app = http.createServer((req, res) => {
  const notes = readAllNotes();
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }

  const newURL = new URL(req.url, `http://${req.headers.host}`);
  const id = newURL.searchParams.get("id");

  if (req.method === "POST") {
    const note = newURL.searchParams.get("note");
    if (!note) {
      res.writeHead(400);
      res.end("Note is required");
      return;
    }
    notes.push({ id, note });
    writeNotes(notes);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }

  if (req.method === "DELETE") {
    if (!id) {
      res.writeHead(400);
      res.end("Id is required");
      return;
    }
    const newNotes = notes.filter((note) => note.id !== id);
    writeNotes(newNotes);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(notes));
    return;
  }
});

app.listen(3000, () => {
  console.log("Surver running on port 3000");
});
