const express = require('express');
const app = new express();

app.post('/', (request, response) => {
  response.json({
    hello: 'world'
  });
});

app.listen(4000, () => {
  console.log(`Listening at ${4000}`);
});