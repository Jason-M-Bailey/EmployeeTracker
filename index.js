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

// BONUS
// NOT FUNCTIONAL
const viewBudgetByDepartment = () => {};

// functional
class NewDepartmentInfo {
  // constructor elements are based off inquirer prompts
  constructor(new_department_id, new_department_name) {
    if (!(this instanceof NewDepartmentInfo)) {
      // based on the mySQL schema
      return new NewDepartmentInfo(id, name);
    }
    // this . [mysql spelling] = [inquirer prompt spelling]
    this.id = new_department_id;
    this.name = new_department_name;
  }
}

// functional
// todo: validate department id is not a duplicate
// todo: capitalize first letter
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "new_department_id",
        type: "input",
        message: "give the new department a unique id:",
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
        message: "what is the name of the new department:",
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
          console.log("new department added to database");
          console.log("");
          viewDepartments();
        }
      );
    });
};

class NewEmployeeInfo {
  // constructor elements are based off inquirer prompts
  constructor(
    employee_first_name,
    employee_last_name,
    employee_role_id,
    employee_manager_id
  ) {
    if (!(this instanceof NewEmployeeInfo)) {
      // based on the mySQL schema
      return new NewEmployeeInfo(first_name, last_name, role_id, manager_id);
    }

    // this . [mysql spelling] = [inquirer prompt spelling]
    this.first_name = employee_first_name;
    this.last_name = employee_last_name;
    this.role_id = employee_role_id;
    this.manager_id = employee_manager_id;
  }
}

// functional
// todo: dynamic list for role
// todo: dynamic list for manager
// todo: capitalize first letter
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
        name: "employee_role_id",
        type: "input",
        message: "what is the employee's role id:",
      },
      {
        name: "employee_manager_id",
        type: "input",
        message: "enter employee id of their manager: ",
      },
    ])
    .then(function (user) {
      var newEmployee = new NewEmployeeInfo(
        // inquirer prompt names
        user.employee_first_name,
        user.employee_last_name,
        user.employee_role_id,
        user.employee_manager_id
      );
      connection.query(
        "INSERT INTO employee SET ?",
        newEmployee,
        function (err, res) {
          if (err) throw err;
          console.log("new employee added to database");
          console.log("*****");
          viewEmployees();
        }
      );
    });
};

// BASIC
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
        message: "enter department id to remove: ",
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM department WHERE id = ?",
        answer.remove_department,
        (err, res) => {
          console.log("department removed");
          viewDepartments();
        }
      );
    });
};

// functional - remove by id
// todo: improve functionality by removing from dynamic list
const removeEmployee = () => {
  inquirer
    .prompt([
      {
        name: "remove_employee",
        type: "input",
        message: "enter employee id to remove: ",
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM employee WHERE id = ?",
        answer.remove_employee,
        (err, res) => {
          console.log("employee removed");
          viewEmployees();
        }
      );
    });
};

// functional - remove by id
// todo: improve functionality by removing from dynamic list
const removeRole = () => {
  inquirer
    .prompt([
      {
        name: "remove_role",
        type: "input",
        message: "enter role id to remove: ",
      },
    ])
    .then((answer) => {
      connection.query(
        "DELETE FROM role WHERE id = ?",
        answer.remove_role,
        (err, res) => {
          console.log("role removed");
          viewRoles();
        }
      );
    });
};

// BASIC
// NOT FUNCTIONAL
const updateEmployeeRole = () => {
  // step 1: what employee do you want to update:
  // step 2: select new role
};

// BONUS
// NOT FUNCTIONAL
const updateEmployeesManager = () => {
  // step 1: what employee do you want to update?
  // step 2: set new manager for selected employee
};
