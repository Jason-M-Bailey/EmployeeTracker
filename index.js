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
  viewAllEmployees();
});

const viewAllEmployees = () => {
  connection.query("SELECT * FROM employees", (err, res) => {
    console.table(res);
    connection.end();
  });
};

// const viewAllEmployees = () => {
//     inquirer
//       .prompt([
//         {
//           name: "view_all_employees",
//           type: "input",
//           message: "how many employees would you like to view:",
//         },
//       ])

//       .then((answer) => {
//         connection.query(
//           "SELECT * FROM employees WHERE LIMIT = ?",
//           answer.view_all_employees,
//           (err, res) => {
//             console.table(res);
//             connection.end();
//           }
//         );
//       });
//   };
