import fs from "fs/promises";

(async () => {
  try {
    await fs.writeFile("notes.txt", "Hello World");
    await fs.appendFile("notes.txt", "\nggop universe");
    const data = await fs.readFile("notes.txt", "utf-8");
    console.log("data: ", data);
    await fs.unlink("notes.txt");
  } catch (err) {
    console.log(err);
  }
})();
