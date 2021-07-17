DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    role_id INT NOT NULL,
    role_title VARCHAR(100) NOT NULL,
    role_salary INT NOT NULL,
    department_id INT NOT NULL
);

CREATE TABLE departments (
    department_id INT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    manager VARCHAR(100) NOT NULL
);


INSERT INTO employees (first_name, last_name, role_title)
VALUES ("Amy", "Adams", "Engineer"), ("Brian", "Brown", "Junior Developer"), ("Chris", "Corningsworth", "Engineer"), ("Dede", "Dennis", "CSS Maestro"), ("Eric", "Evans", "Junior Developer"), ("Faith", "Field", "Lawyer"), ("George", "Gostanza", "Paralegal"), ("Henry", "Hill", "Sales Rep"), ("Ignacius", "Ignacio", "Sales Associate");

INSERT INTO roles (role_id, role_title, role_salary, department_id)
VALUES (1, "Engineer", 100000, 1), (2, "Junior Developer", 70000, 1), (3, "CSS Maestro", 85000, 1), (4, "Lawyer", 110000, 2), (5, "Paralegal", 50000, 2), (6, "Sales Rep", 75000, 3), (7, "Sales Associate", 45000, 3);

INSERT INTO departments (department_id, department_name, manager)
VALUES (1, "Engineering", "Ray Ramone"), (2, "Legal", "Shannie Stella"), (3, "Sales", "Tony Tiger");

SELECT * FROM employees;
SELECT * FROM roles;
SELECT * FROM departments;

SELECT id, first_name, last_name, employees.role_title, role_salary, department_name, manager FROM employees LEFT JOIN roles ON employees.role_title = roles.role_title LEFT JOIN departments ON roles.department_id = departments.department_id ORDER BY id;