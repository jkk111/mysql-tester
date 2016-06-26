var express = require("express");
var app = express();
var multer = require("multer");
var mysql = require("mysql2");
var conn = mysql.createConnection({
  user: "root",
  password: "root"
});
conn.connect();
app.use(multer().single());
app.use(express.static("static"));

app.post("/sql", function(req, res) {
  var sql = req.body.sql.replace(/\\r\\n/, "\n");
  var params = req.body.params;
  if(!params || typeof params != "object") {
    params = {};
  }
  if(!sql) return res.status(400).send("no");
  conn.query(sql, params, function(err, results, data) {
    if(err) return res.status(500).send(err);
    res.send({data: data, results: results});
  });
});
module.exports = app;
