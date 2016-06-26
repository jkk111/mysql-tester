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
}
