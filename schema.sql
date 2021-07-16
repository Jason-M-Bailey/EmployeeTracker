DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;
USE employeetracker_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary INT(10) NOT NULL,
    manager VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employees (first_name, last_name, title, department, salary, manager)
VALUES ("Abby", "Allred", "Full Stack Developer", "Engineering", 100000, "Mary Mulligan"), ("Bob", "Benson", "Lawyer", "Legal", 125000, "Neal Notts"), ("Chris", "Corningsworth", "Sales Rep", "Sales", 70000, "Owen Orville");

SELECT * FROM employees;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(100) NOT NULL,
    manager VARCHAR(100) NOT NULL,
    total_salary INT(10) NOT NULL,
    PRIMARY KEY (id)
)

