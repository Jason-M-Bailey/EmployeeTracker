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

let rolesArray = [];
let departmentsArray = [];
let employeesArray = [];

// experiment with dynamic arrays
// todo: able to view dynamic array of roles but unsure how to connect the user's answer of role title to role_id on employee table
const dynamicRolesArray = () => {
  connection.query("SELECT title FROM role;", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      rolesArray.push(res[i].title);
      console.log("for loop running...");
      console.log(res[i].title);
    }
    console.log("*****");
    console.log("for loop finished");
    console.log(rolesArray);
    console.log("*****");
  });

  allOptions();
};

const dynamicDepartmentsArray = () => {
  connection.query("SELECT name FROM department;", (err, res) => {
    for (let i = 0; i < res.length; i++) {
      departmentsArray.push(res[i].name);
      console.log("for loop running...");
      console.log(res[i].name);
    }
    console.log("*****");
    console.log("for loop finished");
    console.log(departmentsArray);
    console.log("*****");
  });

  allOptions();
};

const dynamicEmployeesArray = () => {
  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee;",
    (err, res) => {
      for (let i = 0; i < res.length; i++) {
        employeesArray.push(res[i].name);
        console.log("for loop running...");
        console.log(res[i].name);
      }
      console.log("*****");
      console.log("for loop finished");
      console.log(employeesArray);
      console.log("*****");
    }
  );

  allOptions();
};

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

          "Update Employee Role",
          "Update Employee's Manager",

          "Dynamic Departments Array",
          "Dynamic Employees Array",
          "Dynamic Roles Array",

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
      } else if (answer.select_option === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.select_option === "Update Employee's Manager") {
        updateEmployeesManager();
      } else if (answer.select_option === "Dynamic Departments Array") {
        dynamicDepartmentsArray();
      } else if (answer.select_option === "Dynamic Employees Array") {
        dynamicEmployeesArray();
      } else if (answer.select_option === "Dynamic Roles Array") {
        dynamicRolesArray();
      } else if (answer.select_option === "Exit") {
        connection.end();
      } else connection.end();
    });
};

// functional
// todo: add Manager column with CONCAT(first_name,  ' ', last_name) AS Manager
// todo: how to add comma in the salary field
const viewEmployees = () => {
  connection.query(
    "SELECT CONCAT(first_name,  ' ', last_name) AS Name, department.name AS Department, title AS Title, salary AS Salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
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
// todo: turn this into a list of current departments which reference other functions
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

// functional
// todo: why is null null showing as first record?
// todo: newly created departments do not appear in this table, why?
const viewBudgetByDepartment = () => {
  connection.query(
    "SELECT department.name, SUM(salary) AS Budget FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id GROUP BY department_id;",
    (err, res) => {
      console.table(res);
      console.log("*****");
      allOptions();
    }
  );
};

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
// todo: dynamic list for manager - how to connect manager_id to employee name
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

class NewRoleInfo {
  // inquirer prompt spelling
  constructor(
    newRole_id,
    newRole_title,
    newRole_salary,
    newRole_department_id
  ) {
    if (!(this instanceof NewRoleInfo)) {
      // mysql schema spelling
      return new newRoleInfo(id, title, salary, department_id);
    }
    // this . [mysql spelling] = [inquirer prompt spelling]
    this.id = newRole_id;
    this.title = newRole_title;
    this.salary = newRole_salary;
    this.department_id = newRole_department_id;
  }
}

// functional
// todo: capitalize first letter of title
// todo: validate role id is not a duplicate
// todo: dynamic list for department choice rather than input id
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "newRole_id",
        type: "input",
        message: "what is the id for the role:",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return "ids must be a number greater than zero";
        },
      },

      {
        name: "newRole_title",
        type: "input",
        message: "what is the title of the role:",
        validate: (answer) => {
          if (answer !== "") {
            return true;
          }
          return "Names must have one character or more.";
        },
      },
      {
        name: "newRole_salary",
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
        name: "newRole_department_id",
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
      var newRole = new NewRoleInfo(
        // inquirer prompt names
        user.newRole_id,
        user.newRole_title,
        user.newRole_salary,
        user.newRole_department_id
      );
      connection.query("INSERT INTO role SET ?", newRole, function (err, res) {
        if (err) throw err;
        console.log("new role added");
        console.log("*****");
        viewRoles();
      });
    });
};

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

// functional
// todo: improve functionality by selecting employee from dynamic list
// todo: improve functionality by selecting new role from dynamic list
const updateEmployeeRole = () => {
  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "input",
        message: "what is the employee's id: ",
      },
      {
        name: "employee_new_role_id",
        type: "input",
        message: "what is the employee's new role id: ",
      },
    ])
    .then((answer) => {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?;",
        [answer.employee_new_role_id, answer.employee_id],
        (err, res) => {
          console.log("employee updated");
          viewEmployees();
        }
      );
    });
};

// functional
// todo: improve functionality by selecting employee from dynamic list
// todo: improve functionality by selecting new manager from dynamic list
const updateEmployeesManager = () => {
  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "input",
        message: "what is the employee's id: ",
      },
      {
        name: "employee_new_manager_id",
        type: "input",
        message: "what is the employee's new manager id: ",
      },
    ])
    .then((answer) => {
      connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?;",
        [answer.employee_new_manager_id, answer.employee_id],
        (err, res) => {
          console.log("employee updated");
          viewEmployees();
        }
      );
    });
};
