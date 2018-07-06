const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoUri =  process.env.MONGODB_URI || 'mongodb://localhost:27017/project2';
const mongoose = require('mongoose');

app.get('/', (req, res) => {
  res.send('This works')
})

app.listen(port, () => {
  console.log('listening');
})

mongoose.connect(mongoUri);
mongoose.connection.on('open', () => {
  console.log('Connected to mongoose');
})
