DROP DATABASE IF EXISTS employee_tracking_db;
CREATE DATABASE employee_tracking_db;
USE employee_tracking_db;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Amy", "Adams", 1, 1), ("Brian", "Brown", 2, 1), ("Chris", "Corningsworth", 3, 1), ("Dede", "Dennis", 4, 1), ("Eric", "Evans", 11, 2), ("Faith", "Field", 12, 2), ("George", "Gostanza", 21, 3), ("Henry", "Hill", 22, 3), ("Ignacius", "Ignacio", 23, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Junior Developer", 60000, 1), (2, "Senior Developer", 90000, 1), (3, "CSS Maestro", 75000, 1), (11, "Lawyer", 120000, 2), (12, "Paralegal", 80000, 2), (21, "Sales Associate", 50000, 3), (22, "Sales Intern", 0, 3);

INSERT INTO department (id, name)
VALUES (1, "Engineering"), (2, "Legal"), (3, "Sales");

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;

SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;