window.SQL = SQL;
var thisScript = document.currentScript;
function SQL(conf) {
  conf = conf || {};
  this.path = conf.path || "/sql";
  this.database = conf.database;
}

SQL.prototype.setDB = function(database) {
  this.database = database;
}

SQL.prototype.send = function(query, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", this.path, true);
  var fd = new FormData();
  fd.append("sql", query);
  xhr.onload = function() {
    if(this.status != 200)  {
      var status = {};
      status.success = false;
      status.query = query;
      cb(status);
    }
    else {
      var status = {};
      status.query = query;
      status.response = JSON.parse(this.responseText);
      status.success = true;
      cb(status);
    }
  }
  xhr.onerror = function() {
    cb(false);
  }
  xhr.send(fd);
}

SQL.prototype.sendPreparedSelect = function(query, params, cb) {
  var fd = new FormData();
  fd.append("sql", query);
  fd.append("data", params);
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if(this.status != 200)  {
      var status = {};
      status.success = false;
      status.query = query;
      cb(status);
    }
    else {
      var status = {};
      status.query = query;
      status.response = JSON.parse(this.responseText);
      status.success = true;
      cb(status);
    }
  }
  xhr.onerror = function() {
    cb(false);
  }
  xhr.send(fd);
}

SQL.modules = {
  SELECT: "sql-client-select.js",
  LAYOUT: "sql-client-layout.js"
}

SQL.prototype.buildTable = function(table, results) {
  table.innerHTML = "";
  var template;
  if(Array.isArray(results)) template = Object.keys(results[0]);
  else template = Object.keys(results);
  var header = document.createElement("tr");
  table.appendChild(header);
  template.forEach(function(key) {
    var el = document.createElement("th");
    el.innerHTML = key;
    header.appendChild(el);
  });
  function buildRow(row) {
    var el = document.createElement("tr");
    for(key in row) {
      var dataEl = document.createElement("td");
      dataEl.innerHTML = row[key];
      el.appendChild(dataEl);
    }
    table.appendChild(el);
  }
  if(Array.isArray(results)) {
    results.forEach(buildRow);
  } else {
    buildRow(results);
  }
}

SQL.init = function() {
  var pending = Object.keys(SQL.modules);
  for(var module in SQL.modules) {
    var xhr = new XMLHttpRequest();
    var path = thisScript.src;
    path = path.substring(0, path.lastIndexOf("/") + 1);
    path += SQL.modules[module];
    xhr.open("GET", path, true);
    xhr.onload = function() {
      var script = this.responseText;
      var scriptEl = document.createElement("script");
      scriptEl.innerText = script;
      document.body.appendChild(scriptEl);
      pending.splice(pending.indexOf(module), 1);
      if(pending.length == 0) {
        var e = new Event("SQLPluginLoaded");
        document.dispatchEvent(e);
      }
    }
    xhr.send();
  }
}
var sql;
document.addEventListener("DOMContentLoaded", function() {
  console.log(document.currentScript);
  document.addEventListener("SQLPluginLoaded", function() {
    console.log("SQL Loaded");
    sql = new SQL();
    console.log(sql);
    sql.getDatabases();
  });
  SQL.init();
});
