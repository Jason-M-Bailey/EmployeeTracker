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

const addEmployee = () => {
  console.log("getting there great work bro");
  connection.end();
};

const removeEmployee = () => {
  console.log("remove employee option chosen");
  connection.end();
};
