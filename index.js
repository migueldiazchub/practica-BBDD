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

//1 insertar alumno, confirmar inserción
function comprobarFormatoDNI(dni) {
  if (dni.length != 9) {
    console.log("\n!! Formato de DNI no válido");
    return false;
  } else {
    let letra = dni[8];
    if (!isNaN(parseInt(letra))) {
      console.log("\n!! Formato de DNI no válido");
      return false;
    } else {
      return true;
    }
  }
}

async function formularioInsercion() {
  const datosInsercion = [];

  //dni
  let siguiente = false;
  while (!siguiente) {
    const nuevo_dni = await input(
      '\nIntroduce el DNI\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_dni == "cancelar") {
      return null;
    }

    if (!comprobarFormatoDNI(nuevo_dni)) {
      continue;
    } else {
      datosInsercion.push(nuevo_dni);
      siguiente = true;
    }
  }

  //nombre
  siguiente = false;
  while (!siguiente) {
    const nuevo_nombre = await input(
      '\nIntroduce el nombre\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_nombre == "cancelar") {
      return null;
    }

    if (nuevo_nombre.trim() == "") {
      console.log("\n!! El campo no puede quedar vacío");
      continue;
    } else {
      datosInsercion.push(nuevo_nombre.trim());
      siguiente = true;
    }
  }

  //apellido1
  siguiente = false;
  while (!siguiente) {
    const nuevo_apellido1 = await input(
      '\nIntroduce el primer apellido\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_apellido1 == "cancelar") {
      return null;
    }

    if (nuevo_apellido1.trim() == "") {
      console.log("\n!! El campo no puede quedar vacío");
      continue;
    } else {
      datosInsercion.push(nuevo_apellido1.trim());
      siguiente = true;
    }
  }

  //apellido2
  siguiente = false;
  while (!siguiente) {
    const nuevo_apellido2 = await input(
      '\nIntroduce el segundo apellido\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_apellido2 == "cancelar") {
      return null;
    }

    if (nuevo_apellido2.trim() == "") {
      console.log("\n!! El campo no puede quedar vacío");
      continue;
    } else {
      datosInsercion.push(nuevo_apellido2.trim());
      siguiente = true;
    }
  }

  //año nacimiento
  siguiente = false;
  let nuevo_año = "";
  while (!siguiente) {
    nuevo_año = await input(
      '\nIntroduce el año de nacimiento\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_año == "cancelar") {
      return null;
    }
    nuevo_año = nuevo_año.trim();

    if (nuevo_año.length != 4) {
      console.log("\n!! No es un año válido");
      continue;
    }
    if (isNaN(parseInt(nuevo_año))) {
      console.log("\n!! No es un año válido");
      continue;
    }
    const diferencia_años = dt.now().year - nuevo_año;
    if (diferencia_años < 18) {
      console.log("\n!! No es un año válido");
      continue;
    }

    siguiente = true;
  }

  //mes nacimiento
  siguiente = false;
  let nuevo_mes = "";
  while (!siguiente) {
    nuevo_mes = await input(
      '\nIntroduce el mes de nacimiento (1-12)\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_mes == "cancelar") {
      return null;
    }
    nuevo_mes = nuevo_mes.trim();

    if (nuevo_mes.length != 1 && nuevo_mes.length != 2) {
      console.log("\n!! No es un mes válido");
      continue;
    }
    if (isNaN(parseInt(nuevo_mes))) {
      console.log("\n!! No es un mes válido");
      continue;
    }
    if (nuevo_mes < 1 || nuevo_mes > 12) {
      console.log("\n!! No es un mes válido");
      continue;
    }

    siguiente = true;
  }

  //dia nacimiento
  siguiente = false;
  let dias_mes = dt.fromObject({
    year: nuevo_año,
    month: nuevo_mes,
  }).daysInMonth;
  let nuevo_dia = "";
  while (!siguiente) {
    nuevo_dia = await input(
      `\nIntroduce el día de nacimiento (1-${dias_mes})\n(Escribe \"cancelar\" para anular la acción)\n> `,
    );
    if (nuevo_dia == "cancelar") {
      return null;
    }
    nuevo_dia = nuevo_dia.trim();

    if (nuevo_dia.length != 1 && nuevo_dia.length != 2) {
      console.log("\n!! No es un día válido");
      continue;
    }
    if (isNaN(parseInt(nuevo_dia))) {
      console.log("\n!! No es un día válido");
      continue;
    }
    if (nuevo_dia < 1 || nuevo_dia > dias_mes) {
      console.log("\n!! No es un día válido");
      continue;
    }

    siguiente = true;
  }

  if (nuevo_mes.length == 1) {
    nuevo_mes = "0" + nuevo_mes;
  }
  if (nuevo_dia.length == 1) {
    nuevo_dia = "0" + nuevo_dia;
  }
  //fecha nacimiento final
  const nuevo_fecha_nac = `${nuevo_año}-${nuevo_mes}-${nuevo_dia}`;
  datosInsercion.push(nuevo_fecha_nac);

  //edad real
  const año_nac = dt.fromSQL(nuevo_fecha_nac);
  const año_act = dt.now();
  datosInsercion.push(Math.floor(año_act.diff(año_nac, "years").years));

  //especialidad
  siguiente = false;
  while (!siguiente) {
    let nuevo_especialidad = await input(
      '\nIntroduce la especialidad (DAM o DAW)\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_especialidad == "cancelar") {
      return null;
    }
    nuevo_especialidad = nuevo_especialidad.toUpperCase();

    if (nuevo_especialidad.trim() == "") {
      console.log("\n!! El campo no puede quedar vacío");
      continue;
    } else if (
      nuevo_especialidad.trim() != "DAM" &&
      nuevo_especialidad.trim() != "DAW"
    ) {
      console.log("\n!! Las opciones válidas son DAM o DAW");
      continue;
    } else {
      datosInsercion.push(nuevo_especialidad);
      siguiente = true;
    }
  }

  //curso
  siguiente = false;
  while (!siguiente) {
    let nuevo_curso = await input(
      '\nIntroduce la especialidad (primero o segundo)\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_curso == "cancelar") {
      return null;
    }
    if (nuevo_curso.trim() == "1") {
      nuevo_curso = "primero";
    }
    if (nuevo_curso.trim() == "2") {
      nuevo_curso = "segundo";
    }
    nuevo_curso = nuevo_curso.toLowerCase();

    if (nuevo_curso.trim() == "") {
      console.log("\n!! El campo no puede quedar vacío");
      continue;
    } else if (
      nuevo_curso.trim() != "primero" &&
      nuevo_curso.trim() != "segundo"
    ) {
      console.log("\n!! Las opciones válidas son primero o segundo");
      continue;
    } else {
      datosInsercion.push(nuevo_curso);
      siguiente = true;
    }
  }

  //pagado
  siguiente = false;
  while (!siguiente) {
    let nuevo_pagado = await input(
      '\nIntroduce si el curso está pagado (s para sí, n para no)\n(Escribe "cancelar" para anular la acción)\n> ',
    );
    if (nuevo_pagado == "cancelar") {
      return null;
    }

    if (
      nuevo_pagado == "s" ||
      nuevo_pagado == "si" ||
      nuevo_pagado == "sí" ||
      nuevo_pagado == "y" ||
      nuevo_pagado == "yes" ||
      nuevo_pagado == "true" ||
      nuevo_pagado == "1"
    ) {
      nuevo_pagado = true;
    }

    if (
      nuevo_pagado == "n" ||
      nuevo_pagado == "no" ||
      nuevo_pagado == "false" ||
      nuevo_pagado == "0"
    ) {
      nuevo_pagado = false;
    }

    if (typeof nuevo_pagado != "boolean") {
      console.log("\n!! No es una respuesta válida");
      continue;
    } else {
      datosInsercion.push(nuevo_pagado);
      siguiente = true;
    }
  }

  return datosInsercion;
}

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
        console.log("\n!! Ha ocurrido un error");
      } else {
        console.log("Los datos se han introducido con éxito");
      }
    },
  );
}

//2 borrar alumno, por dni, confirmar borrado
async function confirmarAccion(mensaje) {
  const confirmar = await input(mensaje + " (s para sí, n para no)\n> ");
  if (
    confirmar == "s" ||
    confirmar == "si" ||
    confirmar == "sí" ||
    confirmar == "y" ||
    confirmar == "yes" ||
    confirmar == "true" ||
    confirmar == "1"
  ) {
    return true;
  } else if (
    confirmar == "n" ||
    confirmar == "no" ||
    confirmar == "false" ||
    confirmar == "0"
  ) {
    return false;
  } else {
    console.log(
      "\n!! No se reconoce la opción. La acción se va a cancelar por defecto",
    );
    return false;
  }
}

async function borrarAlumno(dni) {
  await connection.query(
    "DELETE FROM Alumnos WHERE dni = ?",
    [dni],
    (error, results) => {
      if (error) {
        console.log(error);
        console.log("\n!! Ha ocurrido un error");
      } else {
        console.log("\nEl alumno ha sido borrado de la base de datos");
      }
    },
  );
}

//3 editar alumno, por dni, pedir y cambiar campos o meter todos los campos, confirmar edición
async function actualizarAlumno(campo, valor, dni) {
  await connection.query(
    "UPDATE Alumnos SET ?? = ? WHERE dni = ?",
    [campo, valor, dni],
    (error, results) => {
      if (error) {
        console.log(error);
        console.log("\n!! Ha ocurrido un error");
      } else {
        console.log(`\nEl campo de ${campo} del alumno se ha actualizado`);
      }
    },
  );
}

//4 listar, ordenada por ap1 ap2 nombre
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

function selectAllAlumnos() {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM Alumnos ORDER BY apellido1, apellido2, nombre",
      (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results);
      },
    );
  });
}

//5 buscar, por filtro
function selectPorFiltro(campo, valor) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM Alumnos WHERE ?? = ? ORDER BY apellido1, apellido2, nombre",
      [campo, valor],
      (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results);
      },
    );
  });
}

async function menuPrincipal() {
  let run = true;

  while (run) {
    const opcion = await input(
      "\n1. Insertar" +
        "\n2. Borrar" +
        "\n3. Editar" +
        "\n4. Listar" +
        "\n5. Buscar" +
        "\n6. Salir" +
        "\n\n Selecciona una opción\n> ",
    );

    switch (opcion) {
      case "1":
        // insertar alumno, confirmar inserción
        try {
          const datosInsercion = await formularioInsercion();
          if (datosInsercion == null) {
            break;
          }

          await insertarAlumno(...datosInsercion);
        } catch (error) {
          console.log(error);
          console.log("\n!! Se ha producido un error");
        } finally {
          break;
        }

      case "2":
        // borrar alumno, por dni, confirmar borrado
        try {
          const borrar_dni = await input(
            '\nIntroduce el dni del alumno a borrar\n(Escribe "cancelar" para anular la acción)\n> ',
          );
          if (!comprobarFormatoDNI(borrar_dni)) {
            break;
          }
          if (borrar_dni == "cancelar") {
            break;
          }

          const alumno_borrado = await selectPorFiltro("DNI", borrar_dni);
          console.log("\nSe van a borrar los datos del siguiente alumno: ");
          mostrarAlumno(alumno_borrado[0]);

          if (
            await confirmarAccion("\n¿Confirmar la eliminación del alumno?")
          ) {
            await borrarAlumno(borrar_dni);
          }
        } catch (error) {
          console.log(error);
          console.log("\n!! Se ha producido un error");
        } finally {
          break;
        }

      case "3":
        // editar alumno, por dni, pedir y cambiar campos o meter todos los campos, confirmar edición
        try {
          const editar_dni = await input(
            '\nIntroduce el dni del alumno a editar\n(Escribe "cancelar" para anular la acción)\n> ',
          );
          if (!comprobarFormatoDNI(editar_dni)) {
            break;
          }
          if (editar_dni == "cancelar") {
            break;
          }

          const alumno_editado = await selectPorFiltro("DNI", editar_dni);
          mostrarAlumno(alumno_editado[0]);

          const editar_campo = await input(
            '\nIntroduce el campo a editar\n(Escribe "cancelar" para anular la acción)\n> ',
          );
          if (editar_campo == "cancelar") {
            break;
          }

          const editar_valor = await input(
            '\nIntroduce el nuevo valor del campo\n(Escribe "cancelar" para anular la acción)\n> ',
          );
          if (editar_valor == "cancelar") {
            break;
          }

          if (await confirmarAccion("\n¿Confirmar la edición del alumno?")) {
            await actualizarAlumno(editar_campo, editar_valor, editar_dni);
          }
        } catch (error) {
          console.log(error);
          console.log("\n!! Se ha producido un error");
        } finally {
          break;
        }

      case "4":
        // listar, ordenada por ap1 ap2 nombre
        try {
          const lista_completa = await selectAllAlumnos();
          console.log("\nLista completa de todos los alumnos: ");
          for (let alumno of lista_completa) {
            mostrarAlumno(alumno);
          }
        } catch (error) {
          console.log(error);
          console.log("\n!! Se ha producido un error");
        } finally {
          break;
        }

      case "5":
        // buscar, por filtro
        try {
          let filtrar_campo = await input(
            "\nEscribe el número del campo por el que quieres filtrar" +
              '\n(Escribe "cancelar" para anular la acción)\n' +
              "\n1. DNI" +
              "\n2. Nombre" +
              "\n3. Primer apellido" +
              "\n4. Segundo apellido" +
              "\n5. Fecha de nacimiento" +
              "\n6. Edad" +
              "\n7. Especialidad" +
              "\n8. Curso" +
              "\n9. Estado de pago" +
              "\n> ",
          );

          switch (filtrar_campo) {
            case "1":
              filtrar_campo = "dni";
              break;

            case "2":
              filtrar_campo = "nombre";
              break;

            case "3":
              filtrar_campo = "apellido1";
              break;

            case "4":
              filtrar_campo = "apellido2";
              break;

            case "5":
              filtrar_campo = "fecha_nac";
              break;

            case "6":
              filtrar_campo = "edad";
              break;

            case "7":
              filtrar_campo = "especialidad";
              break;

            case "8":
              filtrar_campo = "curso";
              break;

            case "9":
              filtrar_campo = "pagado";
              break;

            default:
              console.log("\n!! No es una opción válida");
              break;
          }

          const filtrar_valor = await input(
            '\nEscribe el valor del campo\n(Escribe "cancelar" para anular la acción)\n> ',
          );

          const alumnos_filtrados = await selectPorFiltro(
            filtrar_campo,
            filtrar_valor,
          );
          for (let alumno of alumnos_filtrados) {
            mostrarAlumno(alumno);
          }
        } catch (error) {
          console.log(error);
          console.log("\n!! Se ha producido un error");
        } finally {
          break;
        }

      case "6":
        // salir
        run = false;
        connection.end();
        break;

      default:
        console.log("\n!! No es una opción válida");
        break;
    }
  }
}

await menuPrincipal();
rl.close();
