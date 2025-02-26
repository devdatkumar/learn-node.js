import fs from "fs";

const [method, input] = process.argv.slice(2);

if (!method | (method.trim() === "")) {
  console.log("data or method not empty or null");
  process.exit(1);
}

let items = [];
const data = fs.readFileSync("./notes.txt", "utf-8");
if (data) {
  items = JSON.parse(data);
}

if (method === "list") {
  items.map((item) => console.log(item));
  process.exit(0);
}

if (!input | (input.trim() === "")) {
  console.log("data or method not empty or null");
  process.exit(1);
}

if (method === "add") {
  items.push({ data: input });
}

if (method === "delete") {
  const newItems = items.filter((_, index) => index !== parseInt(input));
  items = newItems;
}

fs.writeFileSync("./notes.txt", JSON.stringify(items));
