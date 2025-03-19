import fs from "fs";

const readable = fs.createReadStream("./notes.txt", { encoding: "utf-8" });

const writable = fs.createWriteStream("./output.txt", { encoding: "utf-8" });

readable.on("data", (chunk) => {
  console.log("Revieved chunk", chunk.length);
});

readable.on("end", () => {
  console.log("Finished reading file");
});

readable.on("error", (err) => {
  console.error("Error:", err);
});

readable.pipe(writable);
