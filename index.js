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
  viewEmployees();
});

const allOptions = () => {
  inquirer
    .prompt([
      {
        name: "select_option",
        type: "list",
        message: "what would you like to do next:",
        choices: [
          "View Employees",
          "View Employees By Department",
          "View Employees By Manager",
          "View Departments",
          "View Roles",
          "View Budget By Department",

          "Add Department",
          "Add Employee",
          "Add Role",

          "Remove Department",
          "Remove Employee",
          "Remove Role",

          "Update Employee",
          "Update Employee's Manager",
          "Exit",
        ],
      },
    ])

    .then((answer) => {
      if (answer.select_option === "View Employees") {
        viewEmployees();
      } else if (answer.select_option === "View Employees By Department") {
        viewEmployeesByDept();
      } else if (answer.select_option === "View Employees By Manager") {
        viewEmployeesByManager();
      } else if (answer.select_option === "View Departments") {
        viewDepartments();
      } else if (answer.select_option === "View Roles") {
        viewRoles();
      } else if (answer.select_option === "View Budget By Department") {
        viewBudgetByDepartment();
      } else if (answer.select_option === "Add Department") {
        addDepartment();
      } else if (answer.select_option === "Add Employee") {
        addEmployee();
      } else if (answer.select_option === "Add Role") {
        addRole();
      } else if (answer.select_option === "Remove Department") {
        removeDepartment();
      } else if (answer.select_option === "Remove Employee") {
        removeEmployee();
      } else if (answer.select_option === "Remove Role") {
        removeRole();
      } else if (answer.select_option === "Update Employee") {
        updateEmployeeRole();
      } else if (answer.select_option === "Update Employee's Manager") {
        updateEmployeesManager();
      } else if (answer.select_option === "Exit") {
        connection.end();
      } else connection.end();
    });
};

// functional
const viewEmployees = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
    console.log("*****");
    allOptions();
  });
};

// ORDER BY department_id
// todo: list option departmentArray, show only department selected
const viewEmployeesByDept = () => {
  connection.query(
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY role.department_id;",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

// functional
// todo: list option employeeArray, show only selected option 
const viewEmployeesByManager = () => {
  connection.query(
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.manager_id;",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

// functional
const viewDepartments = () => {
  connection.query("SELECT * FROM department;", (err, res) => {
    console.table(res);
    allOptions();
  });
};

// functional
const viewRoles = () => {
  connection.query("SELECT * FROM role;", (err, res) => {
    console.table(res);
    allOptions();
  });
};

// NOT FUNCTIONAL
const viewBudgetByDepartment = () => {};

// NOT FUNCTIONAL
const addDepartment = () => {};

// NOT FUNCTIONAL
const addEmployee = () => {};

// NOT FUNCTIONAL
const addRole = () => {};

// functional - remove by id
// todo: improve functionality by removing from dynamic list
const removeDepartment = () => {
  inquirer
  .prompt([
    {
      name: "remove_department",
      type: "input",
      message: "enter department id to remove: "
    }
  ])
  .then(answer => {
    connection.query("DELETE FROM department WHERE id = ?",
    answer.remove_department,
    (err, res) => {
      console.log("department removed");
      viewDepartments();
    })
  })
};

// NOT FUNCTIONAL
const removeEmployee = () => {};

// NOT FUNCTIONAL
const removeRole = () => {};

// NOT FUNCTIONAL
const updateEmployeeRole = () => {};

// NOT FUNCTIONAL
const updateEmployeesManager = () => {};
