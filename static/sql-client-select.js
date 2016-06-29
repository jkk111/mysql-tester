SQL.prototype.SELECT = function(table, fields, comparisons, cb) {
  if(this.database) table = this.database + "." + table;
  fields = fields || "*";
  comparisons = comparisons || {};
  var comp = this.resolveComparisons(comparisons);
  var whereClause = "";
  if(comp != "")
    whereClause = `WHERE ${comp}`;
  if(Array.isArray(fields)) fields = fields.join(",");
  var query = `SELECT ${fields} FROM ${table} ${whereClause}`;
  if(typeof cb != "function") return query;
  return this.send(query, cb);
};

SQL.prototype.select = function(database, table) {
  var query = `SELECT * FROM ${database}.${table}`;
  var tableEl = document.getElementById("sql-response");
  var self = this;
  this.send(query, function(results) {
    results = results.response.results;
    self.buildTable(tableEl, results);
  });
};
