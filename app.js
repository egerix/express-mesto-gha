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
    _id: '6434651138b0a2491c2f3ad6' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
