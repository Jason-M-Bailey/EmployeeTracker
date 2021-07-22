USE employeetracker_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Amy", "Adams", 4, 9), ("Brian", "Brown", 2, 9), ("Chris", "Corningsworth", 3, 9), ("Dede", "Dennis", 4, 1), ("Eric", "Evans", 5, 1), ("Faith", "Field", 6, 1), ("George", "Gostanza", 7, 1), ("Henry", "Hill", 5, 1), ("Ignacius", "Ignacio", 1, NULL), ("Jason", "Jeffries", 10, 1), ("Kelly", "Konway", 11, 12), ("Larry", "Lummers", 9, 9);	

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 120000, 4), ("Executive Assistant", 70000, 4), ("Admin Asst", 55000, 4), ("Project Manager", 90000, 1), ("Sr Developer II", 120000, 1), ("Senior Developer", 100000, 1), ("Jr Developer II", 65000, 1), ("Junior Developer", 50000, 1), ("Head of Legal", 140000, 2), ("CSS Maestro", 75000, 1), ("Lawyer", 120000, 2), ("Paralegal", 80000, 2), ("Sales Associate", 50000, 3), ("Sales Intern", 0, 3), ("Sales Manager", 80000, 3);

INSERT INTO department (name)
VALUES ("Engineering"), ("Legal"), ("Sales"), ("Admin");