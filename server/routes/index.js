var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express,Very Goood' });
});

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/ajun');

//连接成功
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected success.")
});

//连接失败
mongoose.connection.on("error", () => {
  console.log("MongoDB connected fail.")
});

//连接断开
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connected disconnected.")
});

module.exports = router;