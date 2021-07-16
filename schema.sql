DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary INT(10) NOT NULL,
    manager VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employees (first_name, last_name, role, department, salary, manager)
VALUES ("Abby", "Allred", "Full Stack Developer", "Engineering", 100000, "Mary Mulligan"), ("Bob", "Benson", "Lawyer", "Legal", 125000, "Neal Notts"), ("Chris", "Corningsworth", "Sales Rep", "Sales", 70000, "Owen Orville"), ("Derek", "Dennis", "Customer Success Rep", "Customer Service", 50000, "Peggy Pepper"), ("Eric", "Evans", "Marketing Associate", "Marketing", 60000, "Quincy Quiburn");

CREATE TABLE departments (
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL
);

INSERT INTO departments (department_id, name)
VALUES (1, "Engineering"), (2, "Sales"), (3, "Legal"), (4, "Customer Service"), (5, "Marketing");

CREATE TABLE roles (
    title VARCHAR(100) NOT NULL,
    salary INT NOT NULL,
    department_id INT NOT NULL
);

INSERT INTO roles (title, salary, department_id)
VALUES ("Full Stack Developer", 100000, 1), ("Lawyer", 80000, 3), ("Paralegal", 50000, 3), ("Sales Rep", 70000, 2), ("Sales Associate", 45000, 2), ("Junior Developer", 60000, 1), ("Customer Success Rep", 50000, 4), ("Marketing Associate", 60000, 5);

SELECT * FROM employees;
SELECT * FROM roles;
SELECT * FROM departments;