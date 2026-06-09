import * as mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "practicaalumnos",
});

connection.connect();

connection.query(
  "SELECT * FROM Alumnos ORDER BY apellido1, apellido2, nombre",
  function (error, results, fields) {
    if (error) {
      console.log(error);
    }

    console.log(results);
  },
);

connection.end();
