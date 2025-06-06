import fs from "fs";
const note = process.argv[2];

if (!note) {
  console("Enter the note first!");
  process.exit(1);
}

if ((note === null) | (note === "")) {
  console("note is null!");
  process.exit(1);
}

let currentTime = new Date().getTime().toLocaleString();

fs.appendFileSync("./notes.txt", currentTime + note + "\n");
console.log("✅ Note saved!");

const allNotes = fs.readFileSync("./notes.txt", "utf-8");
console.log(allNotes);
