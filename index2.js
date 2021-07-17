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
  database: "employee_tracker_db",
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
  connection.query(
    "SELECT id, first_name, last_name, employees.role_title, role_salary, department_name, manager FROM employees LEFT JOIN roles ON employees.role_title = roles.role_title LEFT JOIN departments ON roles.department_id = departments.department_id ORDER BY id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

class NewEmployeeInfo {
  constructor(employee_first_name, employee_last_name, employee_role_title) {
    if (!(this instanceof NewEmployeeInfo)) {
      return new NewEmployeeInfo(first_name, last_name, role_title);
    }
    this.first_name = employee_first_name;
    this.last_name = employee_last_name;
    this.role_title = employee_role_title;
  }
}

const addEmployee = () => {
  let rolesArray = [];

  connection.query("SELECT role_title FROM roles", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].role_title);
    }
  });

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
        name: "employee_role_title",
        type: "list",
        message: "select the employee's role:",
        choices: rolesArray,
      },
    ])
    .then(function (user) {
      var newEmployee = new NewEmployeeInfo(
        user.employee_first_name,
        user.employee_last_name,
        user.employee_role_title
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
  let employeesArray = [];

  connection.query("SELECT first_name, last_name FROM employees", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      employeesArray.push(res[i].first_name);
    }
    console.log(employeesArray);
  });

  console.log("remove employee option chosen");
  inquirer
    .prompt([
      {
        name: "select_employee",
        type: "list",
        message: "select employee to remove:",
        choices: employeesArray,
      },
    ])

    .then((answer) => {
      connection.query(
        "DELETE FROM employees WHERE first_name = ?",
        answer.select_employee,
        (err, res) => {
          console.log("employee removed");
          console.log("*****");
          viewAllEmployees();
        }
      );
    });
};
