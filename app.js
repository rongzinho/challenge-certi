const orders = require("./orders");
const express = require("express");

const fromZeroToTwenty = orders.fromZeroToTwenty;
const dozens = orders.dozens;
const hundreds = orders.hundreds;
const app = express();
const port = 3000;
const message = `
<p>Add a number to the URL between -99999 and 99999.</p>
<p>e.g. localhost:3000/112 => {"id": "cento e doze"}</p>
`

app.get('/favicon.ico', (req, res) => res.status(204));
// displays a message for "/" or an empty path
app.get(/^\/$/, (req, res) => {
  res.send(message)
})
app.get("/:id([a-zA-Z]+)", (req, res) => {
  res.send(message)
})
// only accepts numbers
app.get("/:id([- 0-9]+)", (req, res) => {
  const value = parseInt(req.params.id);
  if (Math.abs(value) > 99999) {
    return res.send(`
    <p>id must be at range of [-99999, 99999]</p>
    <p><p>e.g. localhost:3000/112 => {"id": "cento e doze"}</p></p>
    `);
  }

  function toWords(number) {
    // string of the result
    let words;
    let num = parseInt(number, 10);
    words = generateWords(num)
    return res.send(`{"id": "${words}"}`);
  };
  
  function generateWords(number) {
    let remainder, word, words = arguments[1];
    if (number === 0) {
      return !words ? "zero" : words.join(" ").replace(/,$/, "");
    }
    if (!words) {
      words = [];
    }
    if (number < 0) {
      words.push("menos");
      number = Math.abs(number);
    }
    if (number < 20) {
      remainder = 0;
      word = fromZeroToTwenty[number]
    } else if (number < 100) {
      remainder = number % 10;
      word = dozens[Math.floor(number / 10)];
      if (remainder) {
        word += ` e ${fromZeroToTwenty[remainder]}`
        remainder = 0;
      }
    } else if (number <= 1000) {
      remainder = number % 100;
      word = hundreds[Math.floor(number / 100) - 1];
      if (remainder) {
        unit = remainder % 10;
        word += ` e ${generateWords(Math.floor(remainder))}`
        remainder = 0;
      }
    } else if (number < 100000) {
      remainder = number % 1000;
      word = `${generateWords(Math.floor(number / 1000))} mil`
    } 

    words.push(word)
    return generateWords(remainder, words);
  }
  
  toWords(value);
  console.log('toWords(value)', toWords(value))
});

app.listen(port, () => console.log(`You can now visit the app at http://localhost:${port}`)); 
