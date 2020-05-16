DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Head of School"), ("Administrator"), ("Professor"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Head of School", 200000, 1), ("Dean of English", 100000, 2),
("Dean of Math", 100000, 2), ("Math Professor", 80000, 3),
("Dean of Philosophy", 100000, 2), ("English Professor", 80000, 3),
("Philosophy Teacher", 80000, 3), ("Accountant", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lao", "Tzu", 1, NULL), ("Bill", "Shakespeare", 2, 1),
("Georg", "Cantor", 3, 1), ("Kurt", "Godel", 4, 3),
("Alfred", "Whitehead", 5, 1), ("Cormac", "McCarthy", 6, 2),
("Charles", "Hartshorne", 7, 5), ("Warren", "Buffet", 8, 1);


SELECT employee.id, employee.first_name, employee.last_name,
 role.title, role.salary, department.name AS departmentName
FROM employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id;