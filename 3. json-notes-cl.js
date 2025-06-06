import fs from "fs";
const note = process.argv[2];

if (!note) {
  console("Enter the note first!");
  process.exit(1);
}

if (note === null || note === "") {
  console.log("note is null!");
  process.exit(1);
}

let notes = [];
let id = 0;
let currentTime = new Date().getTime();
let readNotes = fs.readFileSync("./notes.txt", "utf-8");

if (readNotes) {
  notes = JSON.parse(readNotes);
  id = notes.length;
}
notes.push({ id: id + 1, text: note, date: currentTime });

fs.writeFileSync("./notes.txt", JSON.stringify(notes));
console.log("✅ Note saved!");

let allNotes = fs.readFileSync("./notes.txt", "utf-8");
console.log(allNotes);
