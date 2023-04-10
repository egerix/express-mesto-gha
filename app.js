const express = require('express');
const mongoose = require("mongoose");
const {routes} = require("./routes");

const {PORT = 3000} = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect(`mongodb://localhost:27017/mestodb`);

app.use((req, res, next) => {
  req.user = {
    _id: '64348d547cbe53552e3f303'
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
