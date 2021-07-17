DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id VARCHAR(100) NOT NULL,
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


INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Amy", "Adams", 1), ("Brian", "Brown", 2), ("Chris", "Corningsworth", 1), ("Dede", "Dennis", 3), ("Eric", "Evans", 2), ("Faith", "Field", 4), ("George", "Gostanza", 5), ("Henry", "Hill", 6), ("Ignacius", "Ignacio", 7);

INSERT INTO roles (role_id, role_title, role_salary, department_id)
VALUES (1, "Engineer", 100000, 1), (2, "Junior Developer", 70000, 1), (3, "CSS Maestro", 85000, 1), (4, "Lawyer", 110000, 2), (5, "Paralegal", 50000, 2), (6, "Sales Rep", 75000, 3), (7, "Sales Associate", 45000, 3);

INSERT INTO departments (department_id, department_name, manager)
VALUES (1, "Engineering", "Ray Ramone"), (2, "Legal", "Shannie Stella"), (3, "Sales", "Tony Tiger");



-- SELECT * FROM employees;
-- SELECT * FROM roles;
-- SELECT * FROM departments;
-- SELECT * FROM managers;

SELECT id, first_name, last_name, role_title, role_salary, department_name, manager FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id ORDER BY id;