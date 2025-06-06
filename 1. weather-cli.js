const city = process.argv[2];

if (!city) {
  console.log("❌ Enter a city name, please!");
  process.exit(1);
}

const temp = Math.floor(Math.random() * 35);

console.log(`🌡️  ${temp}°C in ${city}. It's a great day!`);
