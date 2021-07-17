const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employeetracker_db",
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  console.log("*****");
  console.log("Lets view all employees to get started");
  console.log("*****");
  viewAllEmployees();
});

const allOptions = () => {
  inquirer
    .prompt([
      {
        name: "select_option",
        type: "list",
        message: "what would you like to do next:",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "View All Departments",
          "Add an Employee",
          "Remove an Employee",
          "Update Employee Role",
          "Update Employee's Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
          "Remove Department",
          "Exit",
        ],
      },
    ])

    .then((answer) => {
      if (answer.select_option === "View All Employees") {
        viewAllEmployees();
      } else if (answer.select_option === "View All Employees By Department") {
        viewAllEmployeesByDept();
      } else if (answer.select_option === "View All Employees By Manager") {
        viewAllEmployeesByManager();
      } else if (answer.select_option === "View All Departments") {
        viewAllDepartments();
      } else if (answer.select_option === "Add an Employee") {
        addEmployee();
      } else if (answer.select_option === "Remove an Employee") {
        removeEmployee();
      } else if (answer.select_option === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.select_option === "Update Employee's Manager") {
        updateEmployeesManager();
      } else if (answer.select_option === "View All Roles") {
        viewAllRoles();
      } else if (answer.select_option === "Add Role") {
        addRole();
      } else if (answer.select_option === "Remove Role") {
        removeRole();
      } else if (answer.select_option === "Remove Department") {
        removeDepartment();
      } else if (answer.select_option === "Exit") {
        connection.end();
      } else connection.end();
    });
};

const viewAllEmployees = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    console.table(res);
    console.log("*****");
    console.log("*****");
    console.log("*****");
    allOptions();
  });
};

const viewAllEmployeesByDept = () => {};

class NewEmployeeInfo {
  constructor(
    employee_first_name,
    employee_last_name,
    employee_role,
    employee_department,
    employee_salary,
    employees_manager
  ) {
    if (!(this instanceof NewEmployeeInfo)) {
      return new NewEmployeeInfo(
        first_name,
        last_name,
        role,
        department,
        salary,
        manager
      );
    }
    this.first_name = employee_first_name;
    this.last_name = employee_last_name;
    this.role = employee_role;
    this.department = employee_department;
    this.salary = employee_salary;
    this.manager = employees_manager;
  }
}

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employee_first_name",
        type: "input",
        message: "what is the employee's first name:",
        // splice first letter .toUpperCase then .join
        // function capitalizeFirstLetter(string) {return string.charAt(0).toUpperCase() + string.slice(1);}
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "employee_last_name",
        type: "input",
        message: "what is the employee's last name:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "employee_role",
        type: "list",
        message: "select the employee's role:",
        choices: [
          // how to pull options from existing array and add option to create new role
          "Developer",
          "Full Stack Developer",
          "Lawyer",
          "Sales Rep",
          "Sales Associate",
        ],
      },
      {
        name: "employee_department",
        type: "list",
        message: "what department does the employee work in:",
        choices: [
          // how to pull options from existing array and add option to create new department
          "Engineering",
          "Legal",
          "Sales",
          "Marketing",
          "Customer Service",
        ],
      },
      {
        name: "employee_salary",
        type: "input",
        message: "what is the employee's salary:",
        // should this value default to the role's salary?
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "salaries must be a number greater than zero";
        },
      },
      {
        name: "employees_manager",
        type: "input",
        message: "who is the employee's manager:",
        // how to pull manager list from array and add option to create new manager
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
    ])
    .then(function (user) {
      var newEmployee = new NewEmployeeInfo(
        user.employee_first_name,
        user.employee_last_name,
        user.employee_role,
        user.employee_department,
        user.employee_salary,
        user.employees_manager
      );
      connection.query(
        "INSERT INTO employees SET ?",
        newEmployee,
        function (err, res) {
          if (err) throw err;
          console.log("new employee added to database");
          console.log("*****");
          viewAllEmployees();
        }
      );
    });
};

const removeEmployee = () => {
  console.log("remove employee option chosen");
  // viewAllEmployees();
  inquirer
    .prompt([
      {
        name: "select_employee",
        type: "input",
        message: "enter employee id to remove:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "id must be a number greater than zero";
        },
      },
    ])

    .then((answer) => {
      connection.query(
        "DELETE FROM employees WHERE id = ?",
        answer.select_employee,
        (err, res) => {
          console.log("employee removed");
          console.log("*****");
          viewAllEmployees();
        }
      );
    });

  // inside the .then statement
  // allOptions();
};

const viewAllRoles = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    console.table(res);
    console.log("*****");
    console.log("*****");
    console.log("*****");
    allOptions();
  });
};

class newRoleInfo {
  constructor(role_name, role_salary, role_department) {
    if (!(this instanceof newRoleInfo)) {
      return new newRoleInfo(title, salary, department_id);
    }
    this.title = role_name;
    this.salary = role_salary;
    this.department_id = role_department;
  }
}

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "role_name",
        type: "input",
        message: "what is the name of the role:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "role_salary",
        type: "input",
        message: "what is the salary for the role:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "salaries must be a number greater than zero";
        },
      },
      {
        name: "role_department",
        type: "input",
        message: "what is the department id:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "department id must be a number greater than zero";
        },
      },
    ])
    .then(function (user) {
      var newRole = new newRoleInfo(
        user.role_name,
        user.role_salary,
        user.role_department
      );
      connection.query("INSERT INTO roles SET ?", newRole, function (err, res) {
        if (err) throw err;
        console.log("new role added");
        console.log("*****");
        viewAllEmployees();
      });
    });
};

const removeDepartment = () => {
  inquirer
    .prompt([
      {
        name: "remove_department",
        type: "input",
        message: "enter department id to remove:",
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM departments WHERE department_id = ?",
        answer.remove_department,
        (err, res) => {
          console.log("department removed");
          console.log("*****");
          viewAllDepartments();
          console.log("*****");
        }
      );
    });
};

const viewAllDepartments = () => {
  connection.query("SELECT * FROM departments", (err, res) => {
    console.table(res);
    console.log("*****");
    allOptions();
  });
};
