import { EventEmitter } from "events";

class Timer extends EventEmitter {
  #intervalId;

  start(seconds) {
    let counter = 0;

    this.#intervalId = setInterval(() => {
      if (counter < seconds) {
        this.emit("tick", counter + 1); // emit tick count
        counter++;
      } else {
        this.emit("done");
        this.stop(); // stop the interval
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.#intervalId);
  }
}

const timer = new Timer();

timer.on("tick", (count) => {
  console.log("Tick", count);
});

timer.on("done", () => {
  console.log("Timer Done!");
});

// Start 5 second countdown
timer.start(5);
