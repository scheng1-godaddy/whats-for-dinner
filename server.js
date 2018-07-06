const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('This works')
})

app.listen(3000, () => {
  console.log('listening');
})
