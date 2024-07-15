const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "manualmaquinas",
  password: "wa0i4Ochu",
  port: 5432,
});

module.exports = { pool };
