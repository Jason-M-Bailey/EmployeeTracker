const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

let rolesArray = [];
let employeesArray = [];
let departmentsArray = [];

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_tracking_db",
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  viewRawData();
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
          "View Total Utilized Budget By Department",
          "Add Department",
          "Add Employee",
          "Add Role",
          "Remove Department",
          "Remove Employee",
          "Remove Role",
          "Update Employee Role",
          "Update Employee's Manager",
          "Update Role",
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
      } else if (
        answer.select_option === "View Total Utilized Budget By Department"
      ) {
        viewTotalBudgetByDepartment();
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
      } else if (answer.select_option === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.select_option === "Update Employee's Manager") {
        updateEmployeesManager();
      } else if (answer.select_option === "Update Role") {
        updateRole();
      } else if (answer.select_option === "Exit") {
        connection.end();
      } else connection.end();
    });
};

const viewRawData = () => {
  connection.query(
    "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id; ",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

// functional
const viewEmployees = () => {
  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS Name, title AS Title, salary AS Salary, name AS Department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

// todo:
// unable to get array to function properly
const viewEmployeesByDept = () => {
  console.log("made it to employees by dept");

  var departmentsArray = [];

  // add current departments to array
  connection.query("SELECT name FROM department;", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      departmentsArray.push(res[i].name);
      console.log(res[i].name);
    }
  });

  inquirer
    .prompt([
      {
        name: "choose_department",
        type: "list",
        message: "which department do you want to view: ",
        choices: departmentsArray,
      },
    ])
    .then((answer) => {
      connection.query(
        "SELECT first_name, last_name, title, salary, name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department_id = ?;"
      ),
        answer.choose_department;
    });

  //   allOptions();
};

const viewEmployeesByManager = () => {
  console.log("made it to employees by manager");
  allOptions();
};

// functional
const viewDepartments = () => {
  connection.query(
    "SELECT name AS Name FROM department ORDER BY id;",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

// functional
const viewRoles = () => {
  connection.query(
    "SELECT title AS Title, salary AS Salary FROM role;",
    (err, res) => {
      console.table(res);
      allOptions();
    }
  );
};

const viewTotalBudgetByDepartment = () => {
  console.log("made it to view total budget by department");
  allOptions();
};

// functional
class NewDepartmentInfo {
  // inquirer prompt names
  constructor(new_department_id, new_department_name) {
    if (!(this instanceof NewDepartmentInfo)) {
      // mysql column names
      return new NewDepartmentInfo(id, name);
    }

    //this.mysql = inquirer prompt name
    this.id = new_department_id;
    this.name = new_department_name;
  }
}

// functional but improvements needed
// todo: check new id does not already exist
// todo: capitalize first letter of each word in department name
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "new_department_id",
        type: "input",
        message: "give the new department a unique id: ",

        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "department id must be a number greater than zero";
        },
      },
      {
        name: "new_department_name",
        type: "input",
        message: "what is the name of the new department: ",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
    ])

    .then(function (user) {
      var newDepartment = new NewDepartmentInfo(
        user.new_department_id,
        user.new_department_name
      );

      connection.query(
        "INSERT INTO department SET ?",
        newDepartment,
        function (err, res) {
          if (err) throw err;
          viewDepartments();
        }
      );
    });

  //   allOptions();
};

class NewEmployeeInfo {
  // inquirer prompts
  constructor(employee_first_name, employee_last_name) {
    if (!(this instanceof NewEmployeeInfo)) {
      return new NewEmployeeInfo(first_name, last_name);
    }

    this.first_name = employee_first_name;
    this.last_name = employee_last_name;
  }
}

// NOT FUNCTIONAL
// todo: how to connect role_id from employee table to title in role table
const addEmployee = () => {
  connection.query("SELECT title FROM role", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
      //   console.log(rolesArray[i]);
    }
  });

  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS Name FROM employee;",
    (err, res) => {
      for (let i = 0; i < res.length; i++) {
        employeesArray.push(res[i].Name);
        //   console.log(employeesArray[i]);
      }
    }
  );

  inquirer
    .prompt([
      {
        name: "employee_first_name",
        type: "input",
        message: "what is the employee's first name: ",
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
        message: "what is the employee's last name: ",
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
        message: "select the employee's role: ",
        choices: rolesArray,
      },
      {
        name: "employees_manager",
        type: "list",
        message: "who is the employee's manager: ",
        choices: employeesArray,
      },
    ])

    .then(function (user) {
      var newEmployee = new NewEmployeeInfo(
        user.employee_first_name,
        user.employee_last_name
      );
      connection.query(
        "INSERT INTO employee SET ?",
        newEmployee,
        function (err, res) {
          if (err) throw err;
          viewEmployees();
        }
      );
    });

  //   allOptions();
};

const addRole = () => {
  console.log("made it to add role");
  allOptions();
};

const removeDepartment = () => {
  console.log("made it to remove department");
  allOptions();
};

const removeEmployee = () => {
  console.log("made it to remove employee");
  allOptions();
};

const removeRole = () => {
  console.log("made it to remove role");
  allOptions();
};

const updateEmployeeRole = () => {
  console.log("made it to update employee roles");
  allOptions();
};

const updateEmployeesManager = () => {
  console.log("made it to update employees manager");
  allOptions();
};

const updateRole = () => {};
