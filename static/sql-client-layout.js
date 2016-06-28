SQL.prototype.getDatabases = function() {
  var sql = "select distinct table_schema from information_schema.tables";
  var self = this;
  this.send(sql, function(results) {
    var databases = results.response.results;
    var databasesEl = document.getElementById("database-data");
    databasesEl.innerHTML = "";
    databases.forEach(function(database) {
      database = database.table_schema;
      var el = document.createElement("li");
      el.innerHTML = database;
      el.classList.add("layout-button");
      el.onclick = function() {
        console.log("clicked");
        self.database = database;
        self.getTables(database);
      };
      databasesEl.appendChild(el);
    });
  });
};

SQL.prototype.getTables = function(database) {
  var sql = "SHOW TABLES IN " + database;
  var self = this;
  this.send(sql, function(results) {
    var tables = results.response.results;
    var tablesEl = document.getElementById("table-data");
    tablesEl.innerHTML = "";
    tables.forEach(function(table) {
      table = table["Tables_in_"+database];
      var el = document.createElement("li");
      el.classList.add("layout-button");
      el.innerHTML = table;
      el.onclick = function() {
        self.describeTable(database, table);
      };
      tablesEl.appendChild(el);
    })
  })
};

SQL.prototype.describeTable = function(database, table) {
  var sql = `DESCRIBE ${database}.${table}`;
  var self = this;
  this.send(sql, function(results) {
    var describeEl = document.getElementById("sql-response");
    var results = results.response.results;
    self.buildTable(describeEl, results);
  });
}
