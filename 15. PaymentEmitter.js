import { EventEmitter } from "events";

class PaymentProcessor extends EventEmitter {
  #processed = false;
  #counter = 0;

  processPayment() {
    if (this.#processed) {
      this.emit("payment:duplicate");
      return;
    }

    if (this.#counter >= 3) {
      this.emit("payment:blocked");
      return;
    }

    if (this.#counter > 0) {
      this.emit("payment:retry");
    } else {
      this.emit("payment:success");
      this.#processed = true;
    }

    this.#counter += 1;
  }

  reset() {
    this.#processed = false;
    this.#counter = 0;
  }
}

const payment = new PaymentProcessor();

payment.on("payment:success", () => {
  console.log("Payment received");
});

payment.on("payment:duplicate", () => {
  console.log("Payment already processed.");
});

payment.on("payment:retry", () => {
  console.log("Try again");
});

payment.on("payment:blocked", () => {
  console.log("You are blocked!");
});

console.log("Attempt 1:");
payment.processPayment(); // success

console.log("Attempt 2:");
payment.processPayment(); // duplicate

console.log("Resetting processor...");
payment.reset();

console.log("Attempt 3:");
payment.processPayment(); // success again

console.log("Attempt 4:");
payment.processPayment(); // duplicate again

console.log("Resetting processor again...");
payment.reset();

console.log("Attempt 5 (simulate retry/blocked):");
payment.processPayment(); // success
payment.processPayment(); // retry
payment.processPayment(); // retry
payment.processPayment(); // blocked
