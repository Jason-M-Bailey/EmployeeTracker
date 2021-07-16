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
          "Add an Employee",
          "Remove an Employee",
          "Update Employee Role",
          "Update Employee's Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
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
      } else if (answer.select_option === "Remove Role") {
        removeRole();
      } else if (answer.select_option === "Exit") {
        connection.end();
      } else connection.end();
    });
};

const viewAllEmployees = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    console.table(res);
    allOptions();
  });
};

const viewAllEmployeesByDept = () => {

}

function NewEmployeeInfo(
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

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employee_first_name",
        type: "input",
        message: "what is the employee's first name:",
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
        // can we turn this into a list?
        // list current employees and add a function for addNewManager()
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
          console.log("*****")
          viewAllEmployees();
        }
      );
    });
  // console.log("getting there great work bro");
  // allOptions();
};

const removeEmployee = () => {
  console.log("remove employee option chosen");
  connection.end();
};
