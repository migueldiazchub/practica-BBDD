import * as mysql from "mysql";
import readline from "readline";
import { DateTime as dt } from "luxon";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "practicaalumnos",
});

//1 -insertar alumno, confirmar inserción
async function insertarAlumno(
  dni,
  nombre,
  apellido1,
  apellido2,
  fecha_nac,
  edad,
  especialidad,
  curso,
  pagado,
) {
  await connection.query(
    "INSERT INTO Alumnos (dni, nombre, apellido1, apellido2, fecha_nac, edad, especialidad, curso, pagado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      dni,
      nombre,
      apellido1,
      apellido2,
      fecha_nac,
      edad,
      especialidad,
      curso,
      pagado,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("ok");
      }
    },
  );
}

//2 -borrar alumno, por dni, confirmar borrado
async function borrarAlumno(dni) {
  await connection.query(
    "DELETE FROM Alumnos WHERE dni = ?",
    [dni],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("ok");
      }
    },
  );
}

//3 -editar alumno, por dni, pedir y cambiar campos o meter todos los campos, confirmar edición
async function actualizarAlumno(campo, valor, dni) {
  await connection.query(
    "UPDATE Alumnos SET ?? = ? WHERE dni = ?",
    [campo, valor, dni],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("ok");
      }
    },
  );
}

//4 -listar, ordenada por ap1 ap2 nombre
function mostrarAlumno(alumno) {
  const fecha = dt
    .fromFormat(alumno.fecha_nac.toString().substring(4, 15), "MMM dd yyyy")
    .toLocaleString();

  console.log(
    `\nDNI: ${alumno.dni}` +
      `\nNombre completo: ${alumno.apellido1} ${alumno.apellido2}, ${alumno.nombre}` +
      `\nFecha de nacimiento: ${fecha}` +
      `\nEdad: ${alumno.edad}` +
      `\nCurso: ${alumno.curso} de ${alumno.especialidad}` +
      `\nPagado: ${alumno.pagado == true ? "sí" : "no"}`,
  );
}

async function selectAllAlumnos() {
  await connection.query(
    "SELECT * FROM Alumnos ORDER BY apellido1, apellido2, nombre",
    (error, results) => {
      if (error) {
        console.log(error);
      }

      for (let alumno of results) {
        mostrarAlumno(alumno);
      }
    },
  );
}

//5 -buscar, por filtro
async function selectPorFiltro(campo, valor) {
  await connection.query(
    "SELECT * FROM Alumnos WHERE ?? = ? ORDER BY apellido1, apellido2, nombre",
    [campo, valor],
    (error, results) => {
      if (error) {
        console.log(error);
      }

      for (let alumno of results) {
        mostrarAlumno(alumno);
      }
    },
  );
}

async function menuPrincipal() {
  let run = true;
  await connection.connect();

  while (run) {
    const opcion = await input(
      "\n1. Insertar" +
        "\n2. Borrar" +
        "\n3. Editar" +
        "\n4. Listar" +
        "\n5. Buscar" +
        "\n6. Salir" +
        "\n\n Selecciona una opción: ",
    );

    switch (opcion) {
      case "1":
        // insertar alumno, confirmar inserción
        const nuevo_dni = await input("dni ");
        const nuevo_nombre = await input("nombre ");
        const nuevo_apellido1 = await input("apellido1 ");
        const nuevo_apellido2 = await input("apellido2 ");
        const nuevo_fecha_nac = await input("fecha ");
        const nuevo_especialidad = await input("especialidad ");
        const nuevo_curso = await input("curso ");
        let nuevo_pagado = await input("pagado s/n ");
        if (nuevo_pagado.toLowerCase() == "s") {
          nuevo_pagado = true;
        } else if (nuevo_pagado.toLowerCase() == "n") {
          nuevo_pagado = false;
        }

        const año_nac = dt.fromSQL(nuevo_fecha_nac);
        const año_act = dt.now();
        const nuevo_edad = Math.floor(año_act.diff(año_nac, "years").years);

        await insertarAlumno(
          nuevo_dni,
          nuevo_nombre,
          nuevo_apellido1,
          nuevo_apellido2,
          nuevo_fecha_nac,
          nuevo_edad,
          nuevo_especialidad,
          nuevo_curso,
          nuevo_pagado,
        );
        break;

      case "2":
        // borrar alumno, por dni, confirmar borrado
        const borrar_dni = await input("dni ");
        await borrarAlumno(borrar_dni);
        break;

      case "3":
        // editar alumno, por dni, pedir y cambiar campos o meter todos los campos, confirmar edición
        const editar_campo = await input("campo ");
        const editar_valor = await input("valor ");
        const editar_dni = await input("dni ");

        await actualizarAlumno(editar_campo, editar_valor, editar_dni);
        break;

      case "4":
        // listar, ordenada por ap1 ap2 nombre
        await selectAllAlumnos();
        break;

      case "5":
        // buscar, por filtro
        const filtrar_campo = await input("campo ");
        const filtrar_valor = await input("valor ");

        await selectPorFiltro(filtrar_campo, filtrar_valor);
        break;

      case "6":
        // salir
        run = false;
        break;

      default:
        break;
    }
  }

  await connection.end();
}

await menuPrincipal();
rl.close();
