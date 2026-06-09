CREATE DATABASE IF NOT EXISTS practicaAlumnos;
USE practicaAlumnos;

CREATE TABLE IF NOT EXISTS Alumnos (
	dni VARCHAR(9) PRIMARY KEY,
    nombre TEXT,
    apellido1 TEXT,
    apellido2 TEXT,
    fecha_nac DATE,
    edad INT,
    especialidad ENUM("DAM", "DAW"),
    curso ENUM("primero", "segundo"),
    pagado BOOL
);

INSERT INTO Alumnos 
VALUES
	("81880505E", "Jose", "Ordóñez", "Andrade", "1991-12-18", 34, "DAM", "primero", true),
    ("44659068Z", "Lola", "Ruiz", "Piñón", "2006-10-29", 19, "DAW", "segundo", false),
    ("74864701T", "Pedro", "Mariano", "Collazo", "2005-01-01", 21, "DAM", "segundo", false),
    ("62616486K", "Sofía", "Sánchez", "Rodríguez", "1996-12-27", 29, "DAW", "primero", true),
    ("14340862V", "Diego", "Pinto", "Pozo", "1996-10-12", 29, "DAW", "segundo", true),
    ("36952050C", "Ana", "Montes", "Pardo", "1997-09-15", 28, "DAM", "segundo", true),
    ("75258367K", "Alfonso", "Rubio", "Navarro", "2008-03-09", 18, "DAM", "primero", false),
    ("78438133Z", "Julia", "Vera", "Sánchez", "2004-01-07", 22, "DAW", "segundo", false),
    ("90019107M", "Sofía", "Rodríguez", "López", "1999-05-21", 27, "DAM", "primero", true),
    ("28094420N", "Pedro", "Navarro", "Martínez", "2002-08-12", 23, "DAW", "primero", false);